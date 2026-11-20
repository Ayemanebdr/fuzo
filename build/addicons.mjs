import fs from 'node:fs';
const ADD = { mask: 'mask-happy', anchor: 'anchor', boat: 'sailboat', prohibit: 'prohibit', globe2: 'globe-hemisphere-east', scroll: 'scroll', feather: 'feather', listcheck: 'list-checks', crosshair: 'crosshair', drop: 'drop', bulb: 'lightbulb', sun: 'sun', waves: 'waves', ear: 'ear', aperture: 'aperture', seal: 'seal-question', skull: 'skull', pen: 'pen-nib' };
const f = '../js/sprite.js'; let s = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^export const SPRITE = /, '').replace(/;\s*$/, ''));
let add = '';
for (const [id, n] of Object.entries(ADD)) { if (s.includes(`id="i-${id}"`)) continue; const v = fs.readFileSync(`node_modules/@phosphor-icons/core/assets/duotone/${n}-duotone.svg`, 'utf8'); add += `<symbol id="i-${id}" viewBox="0 0 256 256">${v.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</symbol>`; }
s = s.replace('</svg>', add + '</svg>');
fs.writeFileSync(f, `export const SPRITE = ${JSON.stringify(s)};\n`);
console.log('ok');
