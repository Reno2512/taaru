-- Tests de sécurité du schéma : isolation entre ateliers et droits des apprentis.
-- Chaque vérification lève une exception en cas d'échec.
\set ON_ERROR_STOP on

-- Les droits sur le schéma public viennent de la migration elle-même (testés ici).
grant all on storage.objects to authenticated;

insert into auth.users values
  ('00000000-0000-0000-0000-00000000000a'),  -- propriétaire de l'atelier A
  ('00000000-0000-0000-0000-00000000000b'),  -- propriétaire d'un autre atelier
  ('00000000-0000-0000-0000-00000000000c');  -- apprenti de l'atelier A

create temp table ctx (a uuid, c uuid, o uuid, i uuid);
grant all on ctx to authenticated;

set role authenticated;

-- Le propriétaire A crée son atelier et une commande complète
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$
declare a uuid; c uuid; o uuid; i uuid; n1 int; n2 int; r record;
begin
  a := create_atelier('Atelier test');
  insert into customers (atelier_id, full_name, phone, gender) values (a, 'Awa Diop', '+221770000000', 'F') returning id into c;
  insert into measurements (atelier_id, customer_id, template_id, "values")
    select a, c, id, '{"poitrine": 96}' from measurement_templates where name like 'Femme%';
  insert into orders (atelier_id, customer_id, due_date) values (a, c, current_date + 7) returning id, number into o, n1;
  insert into orders (atelier_id, customer_id) values (a, c) returning number into n2;
  if n1 <> 1 or n2 <> 2 then raise exception 'numérotation des commandes incorrecte : % puis %', n1, n2; end if;

  insert into order_items (atelier_id, order_id, garment, price) values (a, o, 'Robe enfant', 10000);
  insert into order_items (atelier_id, order_id, garment, price) values (a, o, 'Taille basse', 25000) returning id into i;
  update order_items set status = 'coupe' where id = i;
  insert into payments (atelier_id, order_id, amount, kind, method) values (a, o, 15000, 'acompte', 'wave');

  select total, paid, remaining into r from order_balances where order_id = o;
  if r.total <> 35000 or r.paid <> 15000 or r.remaining <> 20000 then
    raise exception 'solde incorrect : total %, payé %, reste %', r.total, r.paid, r.remaining; end if;
  if (select count(*) from item_events where item_id = i) <> 2 then raise exception 'historique des statuts incomplet'; end if;

  insert into storage.objects (bucket_id, name) values ('photos', a || '/modele.jpg');
  insert into memberships (atelier_id, user_id, role) values (a, '00000000-0000-0000-0000-00000000000c', 'apprenti');
  insert into ctx values (a, c, o, i);
  raise notice 'OK propriétaire : atelier, commande, solde, historique, photo';
end $$;

-- Un autre atelier ne voit rien et ne peut rien écrire
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
do $$
declare a uuid := (select ctx.a from ctx);
begin
  if (select count(*) from customers) + (select count(*) from orders) + (select count(*) from order_items)
     + (select count(*) from payments) + (select count(*) from storage.objects) <> 0 then
    raise exception 'fuite : un autre atelier voit des données'; end if;
  if (select count(*) from measurement_templates) <> 3 then raise exception 'modèles de mesures communs invisibles'; end if;
  begin
    insert into customers (atelier_id, full_name) values (a, 'Intrus');
    raise exception 'fuite : écriture acceptée dans un autre atelier';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into memberships (atelier_id, user_id, role) values (a, auth.uid(), 'owner');
    raise exception 'fuite : auto-ajout comme propriétaire accepté';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK isolation entre ateliers';
end $$;

-- L'apprenti voit les commandes mais pas l'argent
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$
declare a uuid := (select ctx.a from ctx); o uuid := (select ctx.o from ctx); i uuid := (select ctx.i from ctx);
begin
  if (select count(*) from orders) <> 2 then raise exception 'apprenti : commandes invisibles'; end if;
  if (select count(*) from payments) <> 0 then raise exception 'apprenti : paiements visibles'; end if;
  update order_items set status = 'couture' where id = i;
  if not found then raise exception 'apprenti : impossible de faire avancer une tenue'; end if;
  begin
    insert into payments (atelier_id, order_id, amount) values (a, o, 1000);
    raise exception 'apprenti : enregistrement de paiement accepté';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK droits de l''apprenti';
end $$;

reset role;
\echo 'Tous les tests RLS sont passés.'
