-- Migration initiale : schéma de l'atelier de couture (Supabase / PostgreSQL)
-- Multi-atelier : chaque donnée métier porte atelier_id, et la RLS limite
-- chaque utilisateur aux ateliers dont il est membre.
-- Montants en FCFA, stockés en entiers (pas de centimes).

create extension if not exists pgcrypto;

-- ─── Types ───────────────────────────────────────────────────────────────
create type member_role    as enum ('owner', 'tailleur', 'apprenti');
create type item_status    as enum ('recu', 'coupe', 'couture', 'finition', 'pret', 'livre', 'annule');
create type payment_method as enum ('wave', 'orange_money', 'free_money', 'especes', 'autre');
create type payment_kind   as enum ('acompte', 'solde', 'autre');
create type fabric_source  as enum ('client', 'atelier');

-- ─── Ateliers et membres ─────────────────────────────────────────────────
create table ateliers (
  id                uuid primary key default gen_random_uuid(),
  name              text not null check (length(name) between 2 and 80),
  phone             text,
  city              text not null default 'Dakar',
  next_order_number integer not null default 1,
  created_at        timestamptz not null default now()
);

create table memberships (
  atelier_id   uuid not null references ateliers (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         member_role not null default 'tailleur',
  display_name text,
  created_at   timestamptz not null default now(),
  primary key (atelier_id, user_id)
);
create index memberships_user_idx on memberships (user_id);

-- ─── Clients et mesures ──────────────────────────────────────────────────
create table customers (
  id         uuid primary key default gen_random_uuid(),
  atelier_id uuid not null references ateliers (id) on delete cascade,
  full_name  text not null check (length(full_name) between 1 and 120),
  phone      text,                       -- format +221XXXXXXXXX
  gender     text check (gender in ('F', 'H', 'E')),  -- E = enfant
  notes      text,
  created_at timestamptz not null default now()
);
create index customers_atelier_idx on customers (atelier_id, full_name);

-- Modèles de fiches de mesures. atelier_id null = modèle fourni par l'app.
create table measurement_templates (
  id         uuid primary key default gen_random_uuid(),
  atelier_id uuid references ateliers (id) on delete cascade,
  name       text not null,
  fields     jsonb not null,             -- [{ "key": "poitrine", "label": "Tour de poitrine", "unit": "cm" }]
  created_at timestamptz not null default now()
);

-- Une prise de mesures datée : on garde l'historique, la plus récente fait foi.
create table measurements (
  id          uuid primary key default gen_random_uuid(),
  atelier_id  uuid not null references ateliers (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete cascade,
  template_id uuid references measurement_templates (id) on delete set null,
  "values"    jsonb not null default '{}',  -- { "poitrine": 96, "taille": 80 }
  taken_at    timestamptz not null default now(),
  taken_by    uuid references auth.users (id) on delete set null
);
create index measurements_customer_idx on measurements (customer_id, taken_at desc);

-- ─── Commandes ───────────────────────────────────────────────────────────
-- Une commande = un client, une date de livraison, des paiements.
-- Elle contient une ou plusieurs tenues (order_items) qui avancent chacune à leur rythme.
create table orders (
  id          uuid primary key default gen_random_uuid(),
  atelier_id  uuid not null references ateliers (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete restrict,
  number      integer not null,          -- numéro lisible par atelier : C-0042
  due_date    date,
  notes       text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (atelier_id, number)
);
create index orders_due_idx on orders (atelier_id, due_date);

create table order_items (
  id                uuid primary key default gen_random_uuid(),
  atelier_id        uuid not null references ateliers (id) on delete cascade,
  order_id          uuid not null references orders (id) on delete cascade,
  garment           text not null,       -- « Grand boubou », « Taille basse »…
  model_photo_path  text,                -- chemin dans le bucket « photos »
  fabric_photo_path text,
  fabric_source     fabric_source not null default 'client',
  measurement_id    uuid references measurements (id) on delete set null,
  price             integer not null default 0 check (price >= 0),
  status            item_status not null default 'recu',
  assigned_to       uuid references auth.users (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index order_items_order_idx on order_items (order_id);
create index order_items_status_idx on order_items (atelier_id, status);

-- Historique des changements de statut (qui a fait quoi, quand).
create table item_events (
  id         uuid primary key default gen_random_uuid(),
  atelier_id uuid not null references ateliers (id) on delete cascade,
  item_id    uuid not null references order_items (id) on delete cascade,
  status     item_status not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table payments (
  id           uuid primary key default gen_random_uuid(),
  atelier_id   uuid not null references ateliers (id) on delete cascade,
  order_id     uuid not null references orders (id) on delete cascade,
  amount       integer not null check (amount > 0),
  kind         payment_kind not null default 'acompte',
  method       payment_method not null default 'especes',
  provider_ref text,                     -- référence Wave / agrégateur, unique si présente
  paid_at      timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null
);
create index payments_order_idx on payments (order_id);
create unique index payments_provider_ref_uniq on payments (provider_ref) where provider_ref is not null;

-- Abonnement de l'atelier à l'application (écrit uniquement par le serveur).
create table subscriptions (
  atelier_id         uuid primary key references ateliers (id) on delete cascade,
  plan               text not null default 'gratuit' check (plan in ('gratuit', 'atelier', 'pro')),
  status             text not null default 'active' check (status in ('active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  provider           text,
  updated_at         timestamptz not null default now()
);

-- ─── Vue : solde de chaque commande ──────────────────────────────────────
create view order_balances with (security_invoker = true) as
select o.id as order_id,
       o.atelier_id,
       coalesce((select sum(i.price) from order_items i where i.order_id = o.id and i.status <> 'annule'), 0) as total,
       coalesce((select sum(p.amount) from payments p where p.order_id = o.id), 0) as paid,
       coalesce((select sum(i.price) from order_items i where i.order_id = o.id and i.status <> 'annule'), 0)
     - coalesce((select sum(p.amount) from payments p where p.order_id = o.id), 0) as remaining
from orders o;

-- ─── Fonctions d'accès ───────────────────────────────────────────────────
create function is_member(a uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships m where m.atelier_id = a and m.user_id = auth.uid());
$$;

create function has_role(a uuid, roles member_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships m
                 where m.atelier_id = a and m.user_id = auth.uid() and m.role = any (roles));
$$;

-- Création d'un atelier : l'utilisateur connecté en devient propriétaire.
create function create_atelier(p_name text, p_phone text default null, p_city text default 'Dakar')
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'non authentifié'; end if;
  insert into ateliers (name, phone, city) values (p_name, p_phone, p_city) returning id into new_id;
  insert into memberships (atelier_id, user_id, role) values (new_id, auth.uid(), 'owner');
  insert into subscriptions (atelier_id) values (new_id);
  return new_id;
end $$;

-- Numéro de commande séquentiel par atelier, attribué à l'insertion.
create function assign_order_number() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update ateliers set next_order_number = next_order_number + 1
   where id = new.atelier_id
   returning next_order_number - 1 into new.number;
  return new;
end $$;
create trigger orders_number before insert on orders
  for each row execute function assign_order_number();

-- Historise chaque changement de statut d'une tenue.
create function log_item_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into item_events (atelier_id, item_id, status, created_by)
    values (new.atelier_id, new.id, new.status, auth.uid());
  end if;
  return new;
end $$;
create trigger order_items_status_log after insert or update of status on order_items
  for each row execute function log_item_status();

create function touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger orders_touch before update on orders
  for each row execute function touch_updated_at();
create trigger order_items_touch before update on order_items
  for each row execute function touch_updated_at();

-- ─── Row Level Security ──────────────────────────────────────────────────
alter table ateliers              enable row level security;
alter table memberships           enable row level security;
alter table customers             enable row level security;
alter table measurement_templates enable row level security;
alter table measurements          enable row level security;
alter table orders                enable row level security;
alter table order_items           enable row level security;
alter table item_events           enable row level security;
alter table payments              enable row level security;
alter table subscriptions         enable row level security;

-- Ateliers : lecture par les membres, modification par le propriétaire.
-- La création passe par create_atelier().
create policy ateliers_select on ateliers for select using (is_member(id));
create policy ateliers_update on ateliers for update using (has_role(id, '{owner}')) with check (has_role(id, '{owner}'));

-- Membres : chacun voit l'équipe de ses ateliers, seul le propriétaire gère l'équipe.
create policy memberships_select on memberships for select using (is_member(atelier_id));
create policy memberships_write  on memberships for all
  using (has_role(atelier_id, '{owner}')) with check (has_role(atelier_id, '{owner}'));

-- Données métier : tout membre lit et écrit dans son atelier.
create policy customers_all    on customers    for all using (is_member(atelier_id)) with check (is_member(atelier_id));
create policy measurements_all on measurements for all using (is_member(atelier_id)) with check (is_member(atelier_id));
create policy orders_all       on orders       for all using (is_member(atelier_id)) with check (is_member(atelier_id));
create policy order_items_all  on order_items  for all using (is_member(atelier_id)) with check (is_member(atelier_id));
create policy item_events_select on item_events for select using (is_member(atelier_id));

-- Modèles de mesures : ceux de l'app (atelier_id null) sont lisibles par tous les connectés.
create policy templates_select on measurement_templates for select
  using (atelier_id is null and auth.uid() is not null or is_member(atelier_id));
create policy templates_write on measurement_templates for all
  using (atelier_id is not null and has_role(atelier_id, '{owner,tailleur}'))
  with check (atelier_id is not null and has_role(atelier_id, '{owner,tailleur}'));

-- Paiements : les apprentis ne voient pas l'argent. Suppression réservée au propriétaire.
create policy payments_select on payments for select using (has_role(atelier_id, '{owner,tailleur}'));
create policy payments_insert on payments for insert with check (has_role(atelier_id, '{owner,tailleur}'));
create policy payments_delete on payments for delete using (has_role(atelier_id, '{owner}'));

-- Abonnement : lecture seule côté client, écriture par le serveur (service role) via les webhooks.
create policy subscriptions_select on subscriptions for select using (is_member(atelier_id));

-- ─── Stockage des photos ─────────────────────────────────────────────────
-- Bucket privé « photos », chemins de la forme {atelier_id}/{uuid}.jpg
insert into storage.buckets (id, name, public) values ('photos', 'photos', false)
  on conflict (id) do nothing;

create policy photos_member_all on storage.objects for all
  using (bucket_id = 'photos' and is_member(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'photos' and is_member(((storage.foldername(name))[1])::uuid));

-- ─── Modèles de mesures fournis par l'app (à valider avec des tailleurs) ─
insert into measurement_templates (atelier_id, name, fields) values
(null, 'Femme — robe, taille basse, ensemble', '[
  {"key":"poitrine","label":"Tour de poitrine","unit":"cm"},
  {"key":"taille","label":"Tour de taille","unit":"cm"},
  {"key":"bassin","label":"Tour de bassin","unit":"cm"},
  {"key":"epaule","label":"Largeur d''épaules","unit":"cm"},
  {"key":"carrure_dos","label":"Carrure dos","unit":"cm"},
  {"key":"hauteur_poitrine","label":"Hauteur de poitrine","unit":"cm"},
  {"key":"longueur_buste","label":"Longueur du buste","unit":"cm"},
  {"key":"longueur_manche","label":"Longueur de manche","unit":"cm"},
  {"key":"tour_bras","label":"Tour de bras","unit":"cm"},
  {"key":"longueur_robe","label":"Longueur de robe","unit":"cm"},
  {"key":"longueur_jupe","label":"Longueur de jupe / pagne","unit":"cm"}
]'),
(null, 'Homme — grand boubou, caftan, pantalon', '[
  {"key":"cou","label":"Tour de cou","unit":"cm"},
  {"key":"epaule","label":"Largeur d''épaules","unit":"cm"},
  {"key":"poitrine","label":"Tour de poitrine","unit":"cm"},
  {"key":"ventre","label":"Tour de ventre","unit":"cm"},
  {"key":"longueur_manche","label":"Longueur de manche","unit":"cm"},
  {"key":"tour_bras","label":"Tour de bras","unit":"cm"},
  {"key":"longueur_haut","label":"Longueur caftan / boubou","unit":"cm"},
  {"key":"tour_taille","label":"Tour de taille (pantalon)","unit":"cm"},
  {"key":"cuisse","label":"Tour de cuisse","unit":"cm"},
  {"key":"longueur_pantalon","label":"Longueur de pantalon","unit":"cm"},
  {"key":"bas_pantalon","label":"Bas de pantalon","unit":"cm"}
]'),
(null, 'Enfant', '[
  {"key":"poitrine","label":"Tour de poitrine","unit":"cm"},
  {"key":"taille","label":"Tour de taille","unit":"cm"},
  {"key":"epaule","label":"Largeur d''épaules","unit":"cm"},
  {"key":"longueur_manche","label":"Longueur de manche","unit":"cm"},
  {"key":"longueur_haut","label":"Longueur du haut","unit":"cm"},
  {"key":"longueur_bas","label":"Longueur du bas","unit":"cm"}
]');

-- ─── Droits d'accès via l'API Supabase ───────────────────────────────────
-- Explicites pour ne pas dépendre du réglage « auto_expose_new_tables » du projet.
-- Seuls les utilisateurs connectés reçoivent des droits ; la RLS filtre ensuite ligne par ligne.
grant usage on schema public to authenticated;
grant usage on type member_role, item_status, payment_method, payment_kind, fabric_source to authenticated;
grant select, insert, update, delete on
  ateliers, memberships, customers, measurement_templates, measurements,
  orders, order_items, payments
to authenticated;
grant select on item_events, subscriptions, order_balances to authenticated;
grant execute on function create_atelier(text, text, text) to authenticated;
revoke execute on function create_atelier(text, text, text) from public, anon;
