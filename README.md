# Fuseau — jeux à deux, à distance

Application mobile (PWA) pour jouer à deux, même à des milliers de kilomètres :
7 jeux, un chat, des rendez-vous qui s'affichent à l'heure de chacun, des profils avec avatar ou photo.

**Jeux** : Télépathie · Devine-moi · Croquis · Mot Mystère · Morpion Ultime · Puissance 4 · Cartes à parler

## Tester tout de suite
Sans configuration, l'appli tourne en **mode démo** : deux joueurs sur le même téléphone
(bascule en haut de l'écran). Tu peux aussi forcer la démo avec `?demo` à la fin de l'adresse.

## Brancher Firebase (≈ 5 minutes, gratuit)
1. Va sur https://console.firebase.google.com → **Ajouter un projet** (nom : `fuseau`, Google Analytics inutile).
2. **Authentication** → Commencer → **E-mail/Mot de passe** → Activer → Enregistrer.
3. **Firestore Database** → Créer une base → mode **production** → région `eur3 (europe-west)`.
4. Onglet **Règles** de Firestore → colle le contenu de `firestore.rules` → **Publier**.
5. ⚙️ Paramètres du projet → **Vos applications** → icône `</>` (Web) → nom `fuseau` → **Enregistrer**.
   Copie l'objet `firebaseConfig` affiché et colle-le dans `firebase-config.js` :
   ```js
   export const firebaseConfig = { apiKey: "…", authDomain: "…", projectId: "…", storageBucket: "…", messagingSenderId: "…", appId: "…" };
   ```
6. Authentication → **Paramètres** → **Domaines autorisés** → ajoute `ayemanebdr.github.io`.

Ces clés ne sont pas secrètes : c'est normal qu'elles soient dans le code. La sécurité vient des règles Firestore.

## Utilisation
1. Chacun crée son compte, puis son profil (avatar illustré ou photo).
2. L'un crée le duo et partage le code (ou le lien). L'autre l'entre : vous êtes reliés.
3. Installez l'appli : Safari → Partager → *Sur l'écran d'accueil* (iPhone) ou Chrome → ⋮ → *Installer l'application* (Android).

## Structure
- `index.html`, `css/app.css`, `js/app.js` : l'appli (écrans, chat, profils, rendez-vous)
- `js/games.js` : la logique des 7 jeux · `js/content.js` : questions et mots
- `js/worlds.js` : illustrations des univers · `js/backend.js` : Firebase ou démo
- `sw.js`, `manifest.webmanifest` : installation et hors-ligne
- `build/assets.mjs` : régénère avatars, icônes, polices, sons et le paquet Firebase (`npm i` puis `node assets.mjs`)

## Crédits
Avatars DiceBear (« Adventurer » et « Micah » CC BY 4.0, « Big Smile » CC BY 4.0, « Open Peeps » CC0) ·
icônes Phosphor (MIT) · polices Baloo 2 et Nunito (OFL) · sons Kenney (MIT) · illustrations des univers faites pour Fuseau.
