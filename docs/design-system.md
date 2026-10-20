# Design system Taaru

Référence visuelle de l'application. Extrait de la maquette validée (`docs/maquette.html`) et implémenté dans `src/app/globals.css` et `src/components/ui/`. Page de démonstration : `/design`.

> Statut : **brouillon à valider**. Une fois validé, toute nouvelle page le respecte (règle de `CLAUDE.md`).

## Principes

1. **Le téléphone d'abord.** Chaque écran est conçu à 360 px de large, puis adapté au grand écran.
2. **Gros doigts, mauvais réseau.** Zones tactiles de 44 px minimum, pages légères, pas d'animation inutile.
3. **Les chiffres se lisent d'un coup d'œil.** Montants et statuts en gros, avec une couleur qui dit l'urgence.
4. **Peu de texte, des mots du métier.** « Reste à payer », « Tenue prête », « Acompte ». Jamais de jargon technique.

## Couleurs

Toutes les couleurs passent par des jetons (variables CSS). Ne jamais écrire une couleur en dur dans un composant.

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `background` | `#F5F6FA` | `#0E1122` | Fond de page |
| `card` | `#FFFFFF` | `#171B33` | Cartes, champs, feuilles |
| `foreground` | `#161B33` | `#E9EBF5` | Texte principal |
| `muted-foreground` | `#5A6080` | `#A0A6C4` | Texte secondaire, libellés |
| `border` | `#DCDFEA` | `#2A3052` | Bordures |
| `brand` | `#2C3A8C` | `#1C2350` | En-têtes d'écran (indigo) |
| `primary` | `#2C3A8C` | `#7F8FF0` | Action d'avancement (« Passer à : Couture »), liens, focus |
| `primary-soft` | `#E5E8F6` | `#222A55` | Statut « en cours », sélection |
| `secondary` | `#161B33` | `#E9EBF5` | Bouton principal de l'écran (« Nouvelle commande ») |
| `accent` | `#F2C230` | `#E8B923` | Jaune mètre ruban : avatar, détails de marque. Jamais pour du texte sur fond clair |
| `success` / `success-soft` | `#1D8754` / `#DFF2E8` | `#52C98E` / `#133224` | Tenue prête, soldé, livrée |
| `warning` / `warning-soft` | `#B4541A` / `#FBE9DD` | `#F0965A` / `#3A2414` | Retard, reste à payer |
| `destructive` | `#B42318` | `#F97066` | Suppression |
| `whatsapp` | `#1E9E57` | `#3CC57A` | Boutons d'envoi WhatsApp uniquement |

Les couleurs de statut (succès, retard, en cours) ne servent qu'à signaler un état. Elles ne remplacent pas l'indigo de la marque.

## Typographie

| Rôle | Police | Utilisation |
|---|---|---|
| Titres (`font-display`) | **Syne** 700 / 800 | Titres d'écran, nom de l'atelier, gros montants |
| Texte (`font-sans`) | **Work Sans** 400 à 700 | Tout le reste |
| Données (`font-mono`) | **JetBrains Mono** 500 | Libellés en capitales, statuts, mesures en cm |

- Texte de base : **16 px** minimum, y compris dans les champs (sinon le téléphone zoome).
- Libellés de section : mono, 12 px, capitales, espacement de lettres large.
- Chiffres alignés : `tabular-nums` sur tous les montants et mesures.

## Formats

| Donnée | Affichage | Fonction |
|---|---|---|
| Montant | `25 000 FCFA` (entier, espace entre les milliers) | `formatFCFA` |
| Saisie de montant | Accepte `25 000`, `25.000`, `25000f` | `parseFCFA` |
| Date | `20/10/2026` | `formatDate` |
| Téléphone stocké | `+221771234567` | `normalizePhoneSN` |
| Téléphone affiché | `77 123 45 67` | `formatPhoneSN` |
| Mesure | `82,5 cm` (virgule décimale) | à venir (semaine 3) |

Toutes ces fonctions sont dans `src/lib/format.ts` et testées dans `src/lib/format.test.ts`.

## Espacements et formes

- Marge latérale de page : 16 px, augmentée par les zones de sécurité du téléphone (encoche).
- Espacement entre blocs : 24 px. Entre éléments d'un bloc : 8 à 12 px.
- Rayons : 12 px pour cartes et boutons, 16 px pour les feuilles du bas, pilule pour les statuts.
- Bordure fine plutôt qu'ombre. L'ombre est réservée aux éléments flottants (bouton d'action fixe, feuille du bas).

## Composants

| Composant | Fichier | Règles |
|---|---|---|
| Bouton | `components/ui/button.tsx` | Hauteur 48 px (44 px en `sm`). Un seul bouton `default` (foncé) par écran : l'action principale. `primary` pour faire avancer une tenue, `success` pour « Marquer livrée », `whatsapp` pour envoyer, `dashed` pour ajouter un élément |
| Champ et libellé | `components/ui/input.tsx` | Hauteur 48 px, libellé au-dessus, `inputMode="numeric"` pour les montants, `inputMode="decimal"` pour les mesures |
| Toast | `components/ui/sonner.tsx` | En haut de l'écran. Phrase courte au passé : « Commande C-0146 enregistrée » |
| Confirmation | `components/ui/confirm-dialog.tsx` | Feuille du bas sur téléphone, fenêtre centrée sur grand écran. Bouton désactivé pendant l'action. Remplace `confirm()` |
| Chargement | `components/ui/skeleton.tsx` | Même forme que le contenu attendu. Obligatoire sur chaque liste |
| Statut de tenue | à extraire (semaine 5) | Pilule mono : `prête` (succès), `en retard` (alerte), `coupe` / `couture` / `finition` (en cours), `livrée` (neutre) |

## Mode sombre

Il suit le réglage du téléphone. Chaque jeton a une valeur sombre ; un composant n'a jamais besoin de code spécifique au mode sombre.

## Accessibilité

- Contraste suffisant pour le texte dans les deux modes.
- Focus visible au clavier (anneau indigo).
- Chaque champ a un libellé lié (`htmlFor` / `id`).
- Les messages d'état utilisent `role="status"`.

## À valider avec vous

- Les noms de couleurs et leur usage (notamment le bouton principal foncé plutôt qu'indigo).
- Le jaune mètre ruban comme seul accent de marque.
- La police Syne pour les titres, assez marquée.
