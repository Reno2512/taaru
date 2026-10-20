# Mémoire du projet

Fichier tenu à jour par l'agent après chaque étape validée.

## État actuel
- Cadrage produit : `docs/produit.md`. Design system (brouillon à valider) : `docs/design-system.md`.
- Maquette cliquable d'interview (HTML autonome, données fictives) : `docs/maquette.html`. Écrans : accueil, nouvelle commande, détail commande, onglet Clients (liste, recherche, nouveau client avec ses mesures), bloc Mesures sur chaque commande, prise de mesures (fiches femme / homme / enfant, reprise des dernières mesures, mesures personnalisées, observations, historique avec écarts).
- **Semaine 1 (socle) faite sur la branche `semaine-1-socle`** :
  - Next.js 16.3 (App Router, Turbopack, `src/`), TypeScript strict, Tailwind 4, composants shadcn/ui écrits à la main (registre shadcn inaccessible depuis l'environnement cloud) : Button, Input/Label, Toaster (sonner), ConfirmDialog, Skeleton.
  - Supabase : clients navigateur / serveur et `src/proxy.ts` (ex-middleware) qui rafraîchit la session avec `getClaims()`.
  - `src/lib/env.ts` valide les variables publiques et refuse une clé secrète. `src/lib/format.ts` : FCFA, dates, téléphones +221. 25 tests Vitest.
  - Schéma déplacé dans `supabase/migrations/20261020100000_init.sql`, avec des GRANT explicites pour `authenticated` (ne dépend pas du réglage auto_expose du projet). Tests RLS : passent en s'appuyant uniquement sur ces droits.
  - PWA : manifeste, icônes 192 / 512 / maskable / apple. En-têtes de sécurité dans `next.config.ts`.
  - Page d'accueil provisoire avec état de la base, page `/design` de démonstration des composants.
  - CI : job application (lint, typecheck, test, build) + job base de données (migrations + RLS).
- Projet Supabase de dev : `https://isjrefitnmugfaajvxni.supabase.co` (clé publishable dans `.env.local`, non commité). **Migration pas encore appliquée** : l'environnement cloud de l'agent ne peut pas joindre supabase.co.

## Décisions
- Stack : Next.js + Supabase + Vercel (voie rapide).
- Multi-atelier dès le départ : toutes les données portent `atelier_id`.
- Montants en FCFA entiers. Une commande contient une ou plusieurs tenues, chacune avec son statut.
- Les apprentis ne voient pas les paiements (policies RLS).
- Messages clients via liens `wa.me` au MVP, API WhatsApp Business plus tard.
- Versions figées et publiées depuis au moins deux semaines. Vitest 4.1 plutôt que 5.0 (bug d'installation npm 10 avec les dépendances optionnelles de Vitest 5).
- Le fichier de verrouillage est généré avec npm 10 (celui de Node 22, de la CI et de Vercel).
- Téléphones acceptés : mobiles 70 à 78 et fixes 33 (plage large volontairement).

## Prochaine étape
- Vous : appliquer la migration sur le projet Supabase de dev, importer le dépôt sur Vercel avec les deux variables, valider `docs/design-system.md` (page `/design`).
- Interviews terrain avec la maquette, en parallèle.
- Ensuite : semaine 2 (connexion par email OTP, création d'atelier, invitations), après validation de son plan.
