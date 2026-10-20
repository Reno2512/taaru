# Mémoire du projet

Fichier tenu à jour par l'agent après chaque étape validée.

## État actuel
- Cadrage produit : `docs/produit.md`
- Schéma de base de données testé (RLS, numéros de commande, historique des statuts) : `supabase/schema.sql`
- Maquette cliquable d'interview (HTML autonome, données fictives) : `docs/maquette.html`. Écrans : accueil, nouvelle commande, détail commande, onglet Clients (liste, recherche, nouveau client avec ses mesures), bloc Mesures sur chaque commande, prise de mesures (fiches femme / homme / enfant, reprise des dernières mesures, mesures personnalisées, observations, historique avec écarts).
- Aucun code applicatif pour l'instant.

## Décisions
- Stack : Next.js + Supabase + Vercel (voie rapide).
- Multi-atelier dès le départ : toutes les données portent `atelier_id`.
- Montants en FCFA entiers. Une commande contient une ou plusieurs tenues, chacune avec son statut.
- Les apprentis ne voient pas les paiements (policies RLS).
- Messages clients via liens `wa.me` au MVP, API WhatsApp Business plus tard.

## Prochaine étape
- Interviews terrain avec la maquette (`docs/interviews.md`), puis semaine 1 du plan (`docs/plan.md`).
