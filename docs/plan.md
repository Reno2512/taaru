# Plan de construction du MVP (8 semaines)

Chaque étape se termine par une démo sur téléphone à 360 px et un commit.

| Semaine | Livrable | Fini quand |
|---|---|---|
| 1 | Socle : Next.js, Tailwind, shadcn/ui, Supabase (projet dev), schéma appliqué, CI lint + typecheck, déploiement Vercel | La page d'accueil vide est en ligne et la CI passe |
| 1 | Maquette de l'écran d'accueil validée, design system extrait dans `docs/design-system.md` | Le design system est écrit et approuvé |
| 2 | Connexion par email (OTP) ou téléphone, création d'atelier (`create_atelier`), invitation de membres | Deux comptes de deux ateliers ne voient pas les données l'un de l'autre |
| 3 | Clients et fiches de mesures (modèles femme, homme, enfant, historique) | Créer un client et ses mesures en moins de 60 secondes |
| 4 | Nouvelle commande : client, tenues avec photos compressées, prix, date, acompte | Une commande à 3 tenues se saisit en moins de 2 minutes |
| 5 | Suivi des tenues (statuts en un geste), liste et détail des commandes, paiements, reste à payer | Le reste à payer est juste après acompte et solde |
| 6 | Messages WhatsApp pré-remplis, reçu PDF, tableau de bord (livraisons, retards, encaissements) | Le message « tenue prête » part en 2 clics |
| 7 | Rôles (apprenti sans accès à l'argent), réglages, tests E2E Playwright des parcours clés, Sentry, PostHog | Les tests E2E passent dans la CI |
| 8 | Landing page, pages légales, abonnement (lien de paiement manuel au début), pilote avec 10 ateliers | 10 ateliers ont créé au moins 10 commandes |

## Parcours testés en E2E

1. Inscription → création d'atelier → premier client → mesures.
2. Nouvelle commande avec 2 tenues et acompte Wave → passage en « prête » → message WhatsApp → solde → « livrée ».
3. Un apprenti se connecte et ne voit aucun montant.
4. Un utilisateur d'un autre atelier ne voit rien.
