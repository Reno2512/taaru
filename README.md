# Taaru (nom provisoire)

Application de gestion pour les ateliers de couture au Sénégal : clients, mesures, commandes, suivi des tenues, acomptes et soldes, messages WhatsApp aux clients.

> Statut : validation terrain. La maquette d'interview et la base de données sont prêtes ; le code de l'application démarre en semaine 1 du plan.

## Contenu du dépôt

| Chemin | Rôle |
|---|---|
| `CLAUDE.md` | Règles pour Claude Code et les autres agents IA |
| `docs/produit.md` | Problème, personas, MVP, écrans, tarifs, risques |
| `docs/interviews.md` | Script d'interview et critères pour continuer |
| `docs/plan.md` | Construction du MVP en 8 semaines |
| `docs/memory.md` | État du projet, tenu à jour à chaque étape |
| `docs/maquette.html` | Maquette cliquable pour les interviews (s'ouvre dans un navigateur, même hors ligne) |
| `docs/dossier.html` | Synthèse du projet sur une page |
| `supabase/schema.sql` | Tables, Row Level Security, stockage des photos, modèles de mesures |
| `supabase/tests/` | Tests d'isolation entre ateliers et de droits des apprentis |
| `scripts/creer-tickets.sh` | Crée les étiquettes et les tickets de la feuille de route |

## Tester la base de données en local

Avec un PostgreSQL 16 vide :

```bash
psql -v ON_ERROR_STOP=1 -f supabase/tests/supabase_stub.sql
psql -v ON_ERROR_STOP=1 -f supabase/schema.sql
psql -v ON_ERROR_STOP=1 -f supabase/tests/rls_test.sql
```

La CI GitHub lance les mêmes étapes à chaque push et pull request. Elle échoue si un autre atelier peut lire ou écrire des données, ou si un apprenti voit les paiements.

## Appliquer le schéma sur Supabase

Dans un projet Supabase **de développement**, ouvrez l'éditeur SQL et exécutez `supabase/schema.sql`. N'exécutez pas `supabase/tests/supabase_stub.sql` sur Supabase : il ne sert qu'à la CI.

## Feuille de route

Les tickets se créent avec `./scripts/creer-tickets.sh` (GitHub CLI connecté requis).

- [ ] Semaine 0 : 15 interviews avec la maquette
- [ ] Semaine 1 : socle Next.js, Supabase, CI, Vercel, design system
- [ ] Semaine 2 : connexion et création d'atelier
- [ ] Semaine 3 : clients et mesures
- [ ] Semaine 4 : nouvelle commande
- [ ] Semaine 5 : suivi des tenues et paiements
- [ ] Semaine 6 : WhatsApp, reçu PDF, tableau de bord
- [ ] Semaine 7 : rôles, tests E2E, Sentry
- [ ] Semaine 8 : landing, pages légales, pilote avec 10 ateliers

## Stack prévue

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL, Auth, Storage), Vercel, Sentry, PostHog.
