# Taaru (nom provisoire)

Application de gestion pour les ateliers de couture au Sénégal : clients, mesures, commandes, suivi des tenues, acomptes et soldes, messages WhatsApp aux clients.

> Statut : semaine 1 (socle technique). Les écrans métier arrivent à partir de la semaine 2.

## Démarrer en local

Prérequis : Node.js 20.9 ou plus récent.

```bash
npm ci
cp .env.example .env.local   # puis renseigner l'URL et la clé publique Supabase
npm run dev                  # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |
| `npx supabase db push` | Applique les migrations sur le projet Supabase lié (**projet de dev uniquement**) |

La page d'accueil affiche l'état de la connexion à la base. La page `/design` présente les composants de l'interface.

## Stack

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS 4, composants shadcn/ui, Supabase (PostgreSQL, Auth, Storage) via `@supabase/ssr`, Zod, Vitest. Déploiement prévu sur Vercel.

Next.js 16 change plusieurs conventions (par exemple `middleware.ts` devient `src/proxy.ts`). Avant de modifier du code Next.js, lire `AGENTS.md` et la documentation fournie dans `node_modules/next/dist/docs/`.

## Organisation

| Chemin | Rôle |
|---|---|
| `src/app/` | Pages (App Router), layout, manifeste PWA, icônes |
| `src/components/ui/` | Composants de base : bouton, champ, Toast, ConfirmDialog, Skeleton |
| `src/lib/format.ts` | Formats FCFA, dates, téléphones sénégalais (testés) |
| `src/lib/env.ts` | Vérification des variables d'environnement au démarrage |
| `src/lib/supabase/` | Clients Supabase navigateur, serveur et rafraîchissement de session |
| `src/proxy.ts` | Rafraîchit la session Supabase à chaque navigation |
| `supabase/migrations/` | Schéma de la base, RLS et droits d'accès |
| `supabase/tests/` | Tests d'isolation entre ateliers et de droits des apprentis |
| `docs/` | Cadrage produit, design system, plan, mémoire du projet, maquette |
| `CLAUDE.md` | Règles pour les agents IA |

## Base de données

### Appliquer le schéma sur Supabase (projet de dev)

Au choix :

- **Sans installation** : dans le tableau de bord Supabase, ouvrir **SQL Editor**, coller le contenu de `supabase/migrations/20261020100000_init.sql` et l'exécuter.
- **Avec le CLI** : `npx supabase login`, `npx supabase link --project-ref <référence du projet>`, puis `npx supabase db push`.

Ne jamais exécuter `supabase/tests/supabase_stub.sql` sur Supabase : il ne sert qu'à la CI.

### Tester la sécurité en local

Avec un PostgreSQL 16 vide :

```bash
psql -v ON_ERROR_STOP=1 -f supabase/tests/supabase_stub.sql
for f in supabase/migrations/*.sql; do psql -v ON_ERROR_STOP=1 -f "$f"; done
psql -v ON_ERROR_STOP=1 -f supabase/tests/rls_test.sql
```

## Intégration continue

À chaque pull request et sur `main`, GitHub Actions lance :

- **Application** : lint, typecheck, tests unitaires, build ;
- **Base de données** : migrations puis tests RLS. Échoue si un atelier peut lire ou écrire chez un autre, ou si un apprenti voit les paiements.

## Feuille de route

Les tickets se créent avec `./scripts/creer-tickets.sh` (GitHub CLI connecté requis).

- [ ] Semaine 0 : 15 interviews avec la maquette
- [x] Semaine 1 : socle Next.js, Supabase, CI, design system (à valider)
- [ ] Semaine 2 : connexion et création d'atelier
- [ ] Semaine 3 : clients et mesures
- [ ] Semaine 4 : nouvelle commande
- [ ] Semaine 5 : suivi des tenues et paiements
- [ ] Semaine 6 : WhatsApp, reçu PDF, tableau de bord
- [ ] Semaine 7 : rôles, tests E2E, Sentry
- [ ] Semaine 8 : landing, pages légales, pilote avec 10 ateliers
