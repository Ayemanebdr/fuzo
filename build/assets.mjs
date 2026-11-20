// Génère les ressources statiques de Fuseau : avatars, icônes, polices, sons, Firebase.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createAvatar } from '@dicebear/core';
import * as col from '@dicebear/collection';
import * as esbuild from 'esbuild';

const ROOT = path.resolve('..');
const A = p => path.join(ROOT, 'assets', p);
fs.mkdirSync(A('avatars'), { recursive: true });

/* ---------- Avatars (DiceBear) ---------- */
const BG = ['ffd8c9', 'ffe9b0', 'cdeee6', 'dcd5ff', 'cfe6fb', 'ffd6e6'];
const STYLES = {
  adv: { s: col.adventurer, seeds: ['Aye', 'Nala', 'Kofi', 'Maya', 'Zoe', 'Ilan', 'Sena', 'Tobi', 'Lina', 'Rio', 'Ama', 'Noe'] },
  smile: { s: col.bigSmile, seeds: ['Sun', 'Moon', 'Star', 'Sky', 'Rain', 'Leaf', 'Wave', 'Fire', 'Snow', 'Wind', 'Sand', 'Rock'] },
  micah: { s: col.micah, seeds: ['Abla', 'Yao', 'Fifi', 'Jojo', 'Kemi', 'Bola', 'Dede', 'Lulu', 'Momo', 'Nana', 'Pipo', 'Titi'] },
  peeps: { s: col.openPeeps, seeds: ['Lyon', 'Cotonou', 'Montreal', 'Toronto', 'Dakar', 'Paris', 'Abidjan', 'Lome', 'Quebec', 'Accra', 'Lagos', 'Ottawa'] },
};
const list = [];
for (const [k, { s, seeds }] of Object.entries(STYLES)) {
  seeds.forEach((seed, i) => {
    const svg = createAvatar(s, { seed, backgroundColor: [BG[i % BG.length]], radius: 0, scale: k === 'peeps' ? 90 : 100 }).toString();
    const id = `${k}-${i + 1}`;
    fs.writeFileSync(A(`avatars/${id}.svg`), svg);
    list.push(id);
  });
}
fs.writeFileSync(path.join(ROOT, 'js', 'avatars.js'), `export const AVATARS = ${JSON.stringify(list)};\n`);

/* ---------- Icônes (Phosphor, MIT) ---------- */
const ICONS = {
  home: 'house', games: 'game-controller', chat: 'chat-circle-dots', user: 'user-circle', gear: 'gear-six',
  sound: 'speaker-high', mute: 'speaker-slash', send: 'paper-plane-tilt', cal: 'calendar-heart', calplus: 'calendar-plus',
  bell: 'bell-ringing', sparkle: 'sparkle', trophy: 'trophy', crown: 'crown-simple', heart: 'heart', bolt: 'lightning',
  brain: 'brain', eye: 'eye', brush: 'paint-brush-broad', puzzle: 'puzzle-piece', cards: 'cards', back: 'arrow-left',
  next: 'arrow-right', x: 'x', check: 'check', camera: 'camera', pencil: 'pencil-simple', out: 'sign-out', copy: 'copy',
  share: 'share-network', clock: 'clock', globe: 'globe-hemisphere-west', wave: 'hand-waving', smile: 'smiley',
  timer: 'timer', eraser: 'eraser', undo: 'arrow-counter-clockwise', trash: 'trash', question: 'question', play: 'play',
  users: 'users-three', link: 'link', mail: 'envelope-simple', lock: 'lock-simple', star: 'star', fire: 'fire',
  info: 'info', download: 'download-simple', plus: 'plus', hourglass: 'hourglass-medium', confetti: 'confetti',
  crystal: 'sparkle', grid: 'grid-nine', circle: 'circle', vibrate: 'vibrate', magic: 'magic-wand', moon: 'moon-stars',
  book: 'book-open-text', coffee: 'coffee', tent: 'tent', palette: 'palette', target: 'target', medal: 'medal',
  dots: 'dots-three', door: 'door-open', image: 'image', smiley_wink: 'smiley-wink', rocket: 'rocket-launch', planet: 'planet',
  swords: 'sword', flag: 'flag-checkered', shuffle: 'shuffle', handshake: 'handshake', install: 'device-mobile-camera',
  keyboard: 'keyboard', cake: 'cake', music: 'music-notes', smiley_x: 'smiley-x-eyes', thumb: 'thumbs-up', clap: 'hands-clapping',
};
const ph = n => fs.readFileSync(`node_modules/@phosphor-icons/core/assets/duotone/${n}-duotone.svg`, 'utf8');
let sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
for (const [id, n] of Object.entries(ICONS)) {
  const s = ph(n);
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  sprite += `<symbol id="i-${id}" viewBox="0 0 256 256">${inner}</symbol>`;
}
sprite += '</svg>';
fs.writeFileSync(path.join(ROOT, 'js', 'sprite.js'), `export const SPRITE = ${JSON.stringify(sprite)};\n`);

/* ---------- Polices (OFL) ---------- */
fs.mkdirSync(A('fonts'), { recursive: true });
for (const w of [600, 700, 800]) fs.copyFileSync(`node_modules/@fontsource/baloo-2/files/baloo-2-latin-${w}-normal.woff2`, A(`fonts/baloo2-${w}.woff2`));
for (const w of [400, 600, 700, 800]) fs.copyFileSync(`node_modules/@fontsource/nunito/files/nunito-latin-${w}-normal.woff2`, A(`fonts/nunito-${w}.woff2`));

/* ---------- Sons (Kenney) ---------- */
const SND = {
  coin: '/tmp/kp/sounds/coin.ogg', jump: '/tmp/kp/sounds/jump.ogg', land: '/tmp/kp/sounds/land.ogg',
  place: '/tmp/k_Starter-Kit-City-Builder/sounds/placement-a.ogg', place2: '/tmp/k_Starter-Kit-City-Builder/sounds/placement-c.ogg',
  toggle: '/tmp/k_Starter-Kit-City-Builder/sounds/toggle.ogg', remove: '/tmp/k_Starter-Kit-City-Builder/sounds/removal-a.ogg',
  rotate: '/tmp/k_Starter-Kit-City-Builder/sounds/rotate.ogg',
};
for (const [k, f] of Object.entries(SND)) execSync(`ffmpeg -y -loglevel error -i ${f} -ac 1 -b:a 64k ${A(`sounds/${k}.mp3`)}`);

/* ---------- Firebase (bundle local) ---------- */
fs.writeFileSync('fb-entry.js', `
export { initializeApp } from 'firebase/app';
export { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, setPersistence, indexedDBLocalPersistence } from 'firebase/auth';
export { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, collection, getDoc, setDoc, deleteDoc, addDoc, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
`);
await esbuild.build({ entryPoints: ['fb-entry.js'], bundle: true, format: 'esm', minify: true, outfile: path.join(ROOT, 'js', 'vendor', 'firebase.js'), target: 'es2020', legalComments: 'none' });
console.log('ok', list.length, 'avatars', Object.keys(ICONS).length, 'icons');
