#!/usr/bin/env bash
# Crée les étiquettes et la feuille de route du MVP sous forme de tickets GitHub.
# Prérequis : GitHub CLI connecté (gh auth login). Usage : ./scripts/creer-tickets.sh
set -euo pipefail

label() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null; }
label "fonctionnalité" "2C3A8C" "Une chose que le tailleur doit pouvoir faire"
label "bug" "B4541A" "Quelque chose ne marche pas"
label "retour-terrain" "F2C230" "Retour d'interview ou de pilote"
label "sécurité" "7A1F4D" "Données, droits, RLS"
label "mvp" "1D8754" "Indispensable avant le lancement"

ticket() { gh issue create --title "$1" --label "$2" --body "$3" >/dev/null && echo "Créé : $1"; }

ticket "Semaine 0 · 15 interviews d'ateliers avec la maquette" "mvp,retour-terrain" \
"Suivre docs/interviews.md. Continuer si : 10/15 citent le problème, 8 pilotes, 5 précommandes."
ticket "Semaine 1 · Socle Next.js, Supabase, CI et mise en ligne Vercel" "mvp" \
"Next.js + TypeScript strict, Tailwind, shadcn/ui, projet Supabase de dev avec supabase/schema.sql, lint + typecheck dans la CI, déploiement Vercel. Terminé quand la page vide est en ligne et la CI passe."
ticket "Semaine 1 · Design system extrait de l'écran d'accueil" "mvp" \
"Valider l'accueil à 360 px, puis écrire docs/design-system.md (couleurs, typo, espacements, composants)."
ticket "Semaine 2 · Connexion et création d'atelier" "mvp,sécurité" \
"Connexion par email (OTP) ou téléphone, create_atelier(), invitation de membres avec rôle. Terminé quand deux ateliers ne voient pas les données l'un de l'autre."
ticket "Semaine 3 · Clients et fiches de mesures" "mvp,fonctionnalité" \
"Liste et recherche, fiche client, prise de mesures selon le modèle (femme, homme, enfant), historique daté. Créer un client et ses mesures en moins de 60 s."
ticket "Semaine 4 · Nouvelle commande" "mvp,fonctionnalité" \
"Client, tenues avec photos compressées (< 300 Ko), prix, date, acompte. Une commande de 3 tenues en moins de 2 minutes."
ticket "Semaine 5 · Suivi des tenues et paiements" "mvp,fonctionnalité" \
"Statuts en un geste, liste et détail des commandes, acomptes et soldes, reste à payer juste."
ticket "Semaine 6 · WhatsApp, reçu PDF et tableau de bord" "mvp,fonctionnalité" \
"Messages wa.me pré-remplis (récap, tenue prête, rappel), reçu PDF, chiffres du jour et du mois."
ticket "Semaine 7 · Rôles, tests E2E et suivi des erreurs" "mvp,sécurité" \
"Apprenti sans accès à l'argent, réglages, Playwright sur les 4 parcours de docs/plan.md, Sentry, PostHog."
ticket "Semaine 8 · Landing page, pages légales et pilote" "mvp" \
"Landing, CGU et confidentialité, abonnement (lien de paiement manuel au début), pilote avec 10 ateliers."
