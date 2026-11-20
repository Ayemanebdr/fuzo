# Fuzo — jeux à deux, à distance

Application mobile (PWA) pour jouer à deux, même à des milliers de kilomètres :
7 jeux, un chat, des rendez-vous qui s'affichent à l'heure de chacun, des profils avec avatar ou photo.

**Jeux** : Télépathie · Devine-moi · Croquis · Mot Mystère · Morpion Ultime · Puissance 4 · Cartes à parler

## Tester tout de suite
Sans configuration, l'appli tourne en **mode démo** : deux joueurs sur le même téléphone
(bascule en haut de l'écran). Tu peux aussi forcer la démo avec `?demo` à la fin de l'adresse.

## En ligne
- Appli : https://ayemanebdr.github.io/fuzo/ (GitHub Pages, branche `main`)
- Données : Firebase / Firestore, projet `fuzo-855ba`, base `(default)` en Europe (`eur3`), formule gratuite Spark.
- Pas de compte e-mail : chaque téléphone reçoit une **clé Fuzo** secrète (Profil → Ma clé Fuzo) pour retrouver son profil ailleurs. Le duo est relié par un code de 10 caractères.
- Sécurité (`firestore.rules`) : impossible de lister les profils ou les duos ; il faut connaître la clé ou le code. Gardez-les pour vous deux.

## Utilisation
1. Chacun ouvre le lien, crée son profil (avatar illustré ou photo).
2. L'un crée le duo et partage le code ou le lien ; l'autre l'entre.
3. Installez l'appli : Safari → Partager → *Sur l'écran d'accueil* (iPhone) ou Chrome → ⋮ → *Installer l'application* (Android).
4. Notifications appli fermée : Profil → Notifications → Activer, puis abonnez-vous au code dans l'appli gratuite **ntfy**.

## Structure
- `index.html`, `css/app.css`, `js/app.js` : l'appli (écrans, chat, profils, rendez-vous)
- `js/games.js` : la logique des 7 jeux · `js/content.js` : questions et mots
- `js/worlds.js` : illustrations des univers · `js/backend.js` : Firebase ou démo
- `sw.js`, `manifest.webmanifest` : installation et hors-ligne
- `build/assets.mjs` : régénère avatars, icônes, polices, sons et le paquet Firebase (`npm i` puis `node assets.mjs`)

## Crédits
Avatars DiceBear (« Adventurer » et « Micah » CC BY 4.0, « Big Smile » CC BY 4.0, « Open Peeps » CC0) ·
icônes Phosphor (MIT) · polices Baloo 2 et Nunito (OFL) · sons Kenney (MIT) · illustrations des univers faites pour Fuzo.
