// Avatars par genre : personnages noirs, coiffures variées
import fs from 'node:fs';
import { createAvatar } from '@dicebear/core';
import * as col from '@dicebear/collection';
const BG = ['ffd8c9', 'ffe9b0', 'cdeee6', 'dcd5ff', 'cfe6fb', 'ffd6e6'];
const pick = (a, i) => [a[i % a.length]];
const SK = { adv: ['763900', '9e5622'], smile: ['643d19', '8c5a2b', 'a47539'], micah: ['77311d', 'ac6651'], peeps: ['694d3d', 'ae5d29'] };
const SETS = {
  m: {
    adv: i => ({ skinColor: pick(SK.adv, i), hair: pick(['short01', 'short03', 'short04', 'short05', 'short07', 'short09', 'short10', 'short11', 'short12', 'short13', 'short15', 'short16'], i), hairColor: pick(['0e0e0e', '562306'], i), featuresProbability: 0, earringsProbability: 0, glassesProbability: i % 4 === 3 ? 100 : 0 }),
    smile: i => ({ skinColor: pick(SK.smile, i), hair: pick(['curlyShortHair', 'shortHair', 'shavedHead', 'mohawk', 'halfShavedHead', 'curlyShortHair', 'shortHair', 'shavedHead'], i), hairColor: pick(['220f00', '3a1a00'], i), accessoriesProbability: i % 3 === 1 ? 100 : 0, accessories: ['glasses', 'sunglasses', 'mustache'].slice(i % 3, i % 3 + 1) }),
    micah: i => ({ baseColor: pick(SK.micah, i), hair: pick(['fonze', 'mrT', 'dougFunny', 'mrClean', 'dannyPhantom', 'fonze'], i), hairColor: pick(['000000', '77311d'], i), facialHairProbability: i % 2 ? 100 : 0, facialHair: pick(['beard', 'scruff'], i), earringsProbability: 0, mouth: pick(['smile', 'laughing', 'smirk'], i), eyebrows: ['up'] }),
    peeps: i => ({ skinColor: pick(SK.peeps, i), head: pick(['afro', 'flatTop', 'short1', 'dreads1', 'twists', 'shaved2', 'cornrows', 'short3', 'noHair2', 'short4', 'flatTopLong', 'shaved1'], i), facialHairProbability: i % 3 ? 100 : 0, facialHair: pick(['chin', 'full', 'goatee1', 'moustache1', 'full3'], i), face: pick(['smile', 'smileBig', 'cheeky', 'calm', 'smileTeethGap', 'lovingGrin1'], i), maskProbability: 0, accessoriesProbability: 0 }),
  },
  f: {
    adv: i => ({ skinColor: pick(SK.adv, i), hair: pick(['long03', 'long12', 'long19', 'long22', 'long08', 'long25', 'long01', 'long05', 'long14', 'long16', 'long20', 'long26'], i), hairColor: pick(['0e0e0e', '562306', '6a4e35'], i), earringsProbability: 60 }),
    smile: i => ({ skinColor: pick(SK.smile, i), hair: pick(['braids', 'froBun', 'curlyBob', 'bunHair', 'wavyBob', 'braids', 'froBun', 'bangs'], i), hairColor: pick(['220f00', '3a1a00'], i), accessoriesProbability: i % 4 === 2 ? 100 : 0, accessories: ['glasses'] }),
    micah: i => ({ baseColor: pick(SK.micah, i), hair: pick(['full', 'pixie', 'turban', 'full', 'pixie'], i), hairColor: pick(['000000', '77311d'], i), facialHairProbability: 0, earringsProbability: 100, earrings: pick(['hoop', 'stud'], i), mouth: pick(['smile', 'laughing'], i), eyebrows: ['eyelashesUp'] }),
    peeps: i => ({ skinColor: pick(SK.peeps, i), head: pick(['bantuKnots', 'longAfro', 'bun', 'twists2', 'dreads2', 'cornrows2', 'buns', 'hijab', 'longCurly', 'afro', 'bun2', 'medium1'], i), facialHairProbability: 0, face: pick(['smile', 'cute', 'smileBig', 'lovingGrin2', 'cheeky', 'smileLOL'], i), maskProbability: 0, accessoriesProbability: 0 }),
  },
};
const STY = { adv: col.adventurer, smile: col.bigSmile, micah: col.micah, peeps: col.openPeeps };
const list = [];
for (const sex of ['m', 'f']) for (const k of Object.keys(STY)) for (let i = 0; i < 12; i++) {
  const id = `${sex}-${k}-${i + 1}`;
  fs.writeFileSync(`../assets/avatars/${id}.svg`, createAvatar(STY[k], Object.assign({ seed: id, backgroundColor: [BG[i % BG.length]], radius: 0 }, SETS[sex][k](i))).toString());
  list.push(id);
}
fs.writeFileSync('../js/avatars.js', `export const AVATARS = ${JSON.stringify(list)};\n`);
console.log(list.length);
