# Atelier de couture : règles du projet

Application web (PWA) de gestion pour les ateliers de couture au Sénégal : clients, mesures, commandes, suivi des tenues, acomptes et soldes, messages WhatsApp.

Avant toute tâche, lis `docs/produit.md` (périmètre et écrans) et `docs/memory.md` (état actuel du projet).

## Stack

- Next.js 16 (App Router) + TypeScript strict. Cette version change des conventions (`middleware` devient `src/proxy.ts`, API de requête asynchrones) : lis `AGENTS.md` et la doc de `node_modules/next/dist/docs/` avant d'écrire du code Next.js
- Tailwind CSS + shadcn/ui
- Supabase : PostgreSQL, Auth, Storage. Le schéma de référence est la suite des migrations de `supabase/migrations/`
- React Hook Form + Zod (le même schéma Zod valide côté client et côté serveur)
- Déploiement Vercel. Erreurs : Sentry. Analytics : PostHog

N'ajoute aucune autre dépendance sans me demander. Avant d'installer un paquet, vérifie qu'il existe sur npmjs, qu'il est maintenu et largement utilisé.

## Utilisateurs et contexte

- Maîtres tailleurs et apprentis, sur Android d'entrée de gamme, réseau 3G, souvent à l'aise avec WhatsApp plus qu'avec les formulaires.
- Interface en français simple. Phrases courtes, pas de jargon (« Reste à payer », pas « Solde débiteur »).

## Règles d'interface

- Mobile first : tout doit fonctionner sur un écran de 360 px avant d'être adapté au desktop.
- Zones tactiles d'au moins 44 px, texte de base 16 px minimum.
- Photos compressées côté client avant envoi (moins de 300 Ko, 1280 px max).
- Montants en FCFA, entiers, affichés `25 000 FCFA` (espace comme séparateur de milliers).
- Dates affichées `jj/mm/aaaa`. Téléphones stockés au format `+221XXXXXXXXX`.
- Chaque liste a un état vide, un état de chargement (skeleton) et un état d'erreur.
- Jamais `alert()`, `confirm()` ni `prompt()` : utilise les composants Toast et ConfirmDialog du projet.
- Les messages WhatsApp passent par des liens `https://wa.me/<numéro>?text=<message encodé>`.
- Respecte le design system décrit dans `docs/design-system.md` dès qu'il existe.

## Règles de données et de sécurité

- Toute table métier porte `atelier_id`. Toute requête passe par le client Supabase de l'utilisateur connecté, pour que la RLS s'applique.
- La clé `service_role` ne sert que dans les route handlers serveur (webhooks de paiement). Jamais dans un composant client ni derrière `NEXT_PUBLIC_`.
- Toute modification du schéma passe par une migration dans `supabase/migrations/`, avec RLS activée et policies écrites dans la même migration.
- Les identifiants sont générés par la base (`gen_random_uuid()`), jamais par `Math.random()`.
- Les boutons d'envoi sont désactivés pendant l'envoi, pour éviter les doublons.
- Chaque Server Action et chaque route vérifie la session et le rôle (les apprentis n'accèdent pas aux paiements).
- Rate limiting sur la connexion et les routes publiques.

## Méthode de travail

1. Pour toute fonctionnalité de plus d'un fichier : propose d'abord un plan, attends ma validation.
2. Construis un écran à la fois. Ne commence pas l'écran suivant tant que je n'ai pas validé le précédent.
3. Après chaque modification, lance `npm run lint` et `npm run typecheck`, puis vérifie l'écran dans le navigateur à 360 px avant de dire que c'est terminé.
4. Quand une étape est validée, mets à jour `docs/memory.md` (ce qui est fait, décisions, prochaines étapes) et propose un message de commit.
5. Ne pousse jamais sur `main` et ne touche jamais à la base de production sans me demander.

## Commandes

- `npm run dev` : serveur local
- `npm run lint` / `npm run typecheck` / `npm test`
- `npx supabase db push` : appliquer les migrations (projet de dev uniquement)
