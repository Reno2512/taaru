# Atelier de couture : cadrage produit

> Nom provisoire. Pistes à vérifier (domaine, marque, réseaux) : **Taaru**, **Mesuro**, **Atelyé**.

## Le problème

Au Sénégal, la plupart des ateliers de couture gèrent tout dans un cahier, sur des photos WhatsApp et de mémoire :

- mesures perdues ou illisibles, client à reprendre ;
- commandes oubliées ou en retard, surtout avant la Korité, la Tabaski, les mariages et la rentrée ;
- acomptes non notés, disputes sur ce qui reste à payer ;
- aucune vue sur la charge de travail ni sur ce que l'atelier gagne.

## Pour qui

| Persona | Profil | Ce qu'il veut |
|---|---|---|
| **Le maître tailleur** (cible n° 1) | Gère un atelier de 2 à 10 personnes, smartphone Android, vit sur WhatsApp, paie et encaisse avec Wave | Ne plus rien oublier, savoir qui doit combien, tenir les délais du rush |
| **Le tailleur seul** | Travaille seul, petit budget | Un carnet de mesures fiable et des rappels clients |
| **Le créateur / styliste** | Marque, Instagram et TikTok, clientèle aussi dans la diaspora | Image professionnelle, suivi des commandes à distance |
| **Le client** | N'installe rien | Être prévenu quand sa tenue est prête et payer le solde facilement |

## Les principes du produit

1. **Mobile d'abord** : écran de 360 px, Android d'entrée de gamme, réseau 3G.
2. **Moins de texte, plus de visuel** : photos du modèle et du tissu, icônes, gros boutons, chiffres en grand.
3. **WhatsApp est le canal client** : l'app prépare les messages, le tailleur les envoie.
4. **Le client n'a pas besoin de compte.**
5. **Une saisie en moins de 60 secondes** pour une nouvelle commande.

## Le MVP

### Indispensable
- **Clients** : nom, téléphone, notes, recherche instantanée.
- **Mesures** : fiches par type (femme, homme, enfant) avec historique daté et modèles personnalisables.
- **Commandes** : un client, une date de livraison, une ou plusieurs tenues, chacune avec photo du modèle, photo du tissu (fourni par le client ou l'atelier) et prix.
- **Suivi des tenues** : reçu → coupe → couture → finition → prête → livrée, en un geste.
- **Acomptes et soldes** : espèces, Wave, Orange Money. Reste à payer toujours visible.
- **Messages WhatsApp prêts à envoyer** : confirmation de commande avec récapitulatif, « tenue prête », rappel de solde (lien `wa.me` pré-rempli, sans coût d'API).
- **Tableau de bord** : livraisons du jour et de la semaine, retards, argent encaissé et à encaisser.
- **Reçu PDF** à partager sur WhatsApp.
- **Équipe** : propriétaire, tailleurs, apprentis. Les apprentis ne voient pas l'argent.

### Après le lancement
- Mode hors ligne complet (saisie sans réseau, synchronisation ensuite).
- Lien de paiement Wave / Orange Money par commande, via un agrégateur (PayDunya, PayTech, CinetPay).
- Messages WhatsApp automatiques (API WhatsApp Business).
- Planning du rush : capacité de l'atelier par jour, alerte de surcharge.
- Catalogue de modèles de l'atelier, partageable.
- Stock de tissus et fournitures.
- Interface en wolof.

## Écrans du MVP

1. Accueil : livraisons du jour, retards, encaissé ce mois, bouton « Nouvelle commande ».
2. Nouvelle commande : client (recherche ou création), tenues (photo, type, prix), date, acompte.
3. Liste des commandes : filtres par statut et par date, recherche.
4. Détail commande : tenues et statuts, paiements, bouton WhatsApp, reçu PDF.
5. Clients : liste et recherche.
6. Fiche client : coordonnées, mesures (historique), commandes passées.
7. Prise de mesures : formulaire du modèle choisi, clavier numérique.
8. Équipe et réglages : membres, rôles, modèles de mesures, abonnement.

## Tarifs (à valider en interview)

| Offre | Prix | Contenu |
|---|---|---|
| **Gratuit** | 0 FCFA | 1 utilisateur, 30 clients, 10 commandes en cours |
| **Atelier** | 5 000 FCFA / mois | Clients et commandes illimités, reçus PDF, 3 utilisateurs |
| **Pro** | 12 000 FCFA / mois | Équipe illimitée, planning du rush, statistiques, lien de paiement |

Paiement annuel : 2 mois offerts. Paiement de l'abonnement par Wave et Orange Money via un agrégateur.

## Aller chercher les premiers ateliers

- **Terrain avant tout** : visites d'ateliers avec démo sur téléphone. Saisir pour eux leurs 20 premiers clients pour lever la barrière de départ.
- **Partenariats** : vendeurs de tissus et merceries, qui voient passer tous les tailleurs.
- **Contenu** : vidéos TikTok et Instagram « avant / après le cahier » pendant le rush.
- **Bouche-à-oreille** : chaque reçu et chaque message client porte « Géré avec [nom] ».
- **Parrainage** : un mois offert par atelier parrainé.

## Calendrier

Dates religieuses approximatives, à confirmer selon le calendrier lunaire.

| Période | Objectif |
|---|---|
| Fin octobre → mi-novembre 2026 | 15 interviews, maquette cliquable, 5 précommandes |
| Mi-novembre 2026 → mi-janvier 2027 | Construction du MVP (8 semaines) |
| Mi-janvier → février 2027 | Pilote avec 10 ateliers, corrections |
| Korité (début mars 2027) | Premier test en conditions de rush |
| Tabaski (mi-mai 2027) | Lancement public, objectif 100 ateliers actifs |

## Indicateurs à suivre

- **Activation** : atelier qui a créé 10 commandes dans ses 7 premiers jours.
- **Rétention** : ateliers encore actifs après 30 et 90 jours.
- **Conversion** : passage du gratuit au payant.
- **North Star** : nombre de tenues livrées par mois via l'app.

## Risques et parades

| Risque | Parade |
|---|---|
| L'habitude du cahier | Saisie ultra rapide, onboarding fait avec l'atelier, valeur visible dès le premier rappel de solde |
| Faible capacité à payer | Offre gratuite utile, prix bas, paiement Wave, annuel |
| Téléphone partagé ou perdu | Connexion par numéro de téléphone, données dans le cloud |
| Réseau instable | Pages légères, photos compressées, hors ligne dans la V2 |
| Lecture difficile du français | Icônes, photos, chiffres, puis wolof |
