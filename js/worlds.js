// Univers illustrés des jeux (SVG faits main, style cartoon sobre)
const K = '#2a2440';
const st = `stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const twinkle = (x, y, r, d) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values="1;.25;1" dur="${d}s" repeatCount="indefinite"/></circle>`;
const spark = (x, y, s, c = '#fff', d = 2) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}"><animateTransform attributeName="transform" type="scale" values="1;.6;1" dur="${d}s" additive="sum" repeatCount="indefinite" /></path>`;

export const WORLDS = {
  tele: {
    name: 'Télépathie', place: "L'Observatoire", icon: 'brain', tint: '#ece8ff', accent: '#8d7bea', dark: '#5b4bb5', tag: 'Coop',
    pitch: 'Pensez au même mot, au même moment.',
    how: [['bolt', 'Un thème apparaît, par exemple « Un fruit ».'], ['pencil', 'Chacun écrit un mot, en secret.'], ['brain', 'Même mot = connexion ! 8 manches pour battre votre record.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3274"/><stop offset="1" stop-color="#7a69d6"/></linearGradient></defs><rect width="400" height="220" fill="url(#tg)"/>
      ${twinkle(40, 30, 2, 2)}${twinkle(90, 60, 1.6, 3)}${twinkle(150, 22, 2.2, 2.4)}${twinkle(330, 40, 2, 2.8)}${twinkle(370, 90, 1.5, 2)}${twinkle(260, 18, 1.8, 3.2)}${twinkle(210, 70, 1.4, 2.2)}
      <circle cx="335" cy="52" r="24" fill="#f6e7b0" ${st}/><circle cx="327" cy="45" r="5" fill="#e8d48f"/><circle cx="342" cy="60" r="3.5" fill="#e8d48f"/>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="4s" repeatCount="indefinite"/><circle cx="110" cy="105" r="30" fill="#f0745f" ${st}/><ellipse cx="110" cy="105" rx="48" ry="11" fill="none" ${st}/><path d="M85 95q10-8 20-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;0 6;0 0" dur="4s" repeatCount="indefinite"/><circle cx="290" cy="112" r="26" fill="#3bb5a0" ${st}/><ellipse cx="290" cy="112" rx="42" ry="10" fill="none" ${st} transform="rotate(-15 290 112)"/></g>
      <g fill="none" stroke="#f3b94d" stroke-width="4" stroke-linecap="round"><path d="M172 100q8 10 0 20"><animate attributeName="opacity" values="1;.2;1" dur="1.5s" repeatCount="indefinite"/></path><path d="M200 92q12 18 0 36"><animate attributeName="opacity" values=".2;1;.2" dur="1.5s" repeatCount="indefinite"/></path><path d="M228 100q-8 10 0 20"><animate attributeName="opacity" values="1;.2;1" dur="1.5s" repeatCount="indefinite"/></path></g>
      <path d="M0 220V180Q100 150 200 172T400 168V220Z" fill="#2f2660"/><path d="M0 220V196Q120 178 240 196T400 190V220Z" fill="#241d4d"/>
      <g transform="translate(40 150) rotate(-25)"><rect x="0" y="0" width="54" height="16" rx="6" fill="#f3b94d" ${st}/><rect x="52" y="-3" width="10" height="22" rx="3" fill="#ef8fb3" ${st}/></g><path d="M62 172l-10 22M62 172l12 20" ${st} fill="none"/></svg>`,
  },
  dev: {
    name: 'Devine-moi', place: 'La Tente de la voyante', icon: 'crystal', tint: '#ffe9f1', accent: '#ef8fb3', dark: '#b8557c', tag: 'Duel',
    pitch: 'Réponds pour toi… et devine sa réponse.',
    how: [['user', 'Une question sur vous : choisis TA réponse.'], ['eye', 'Puis parie sur la réponse de ton duo.'], ['trophy', '+1 point par pari réussi. Qui connaît le mieux l\'autre ?']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#5a3a63"/>
      <g opacity=".9">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${i * 40}" y="0" width="20" height="220" fill="#6b4775"/>`).join('')}</g>
      <path d="M0 0H130Q100 90 120 220H0Z" fill="#c8577f" ${st}/><path d="M400 0H270Q300 90 280 220H400Z" fill="#c8577f" ${st}/><path d="M30 0q10 110-10 220M70 0q20 110 0 220M330 0q-20 110 0 220M370 0q-10 110 10 220" stroke="#a9446a" stroke-width="3" fill="none"/>
      <path d="M0 0H400V22Q200 44 0 22Z" fill="#f3b94d" ${st}/>${[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map(x => `<circle cx="${x}" cy="${30 + Math.sin(x) * 2}" r="5" fill="#f3b94d" ${st}/>`).join('')}
      <ellipse cx="200" cy="205" rx="110" ry="16" fill="#3c2643"/><path d="M110 200h180l-12-28H122z" fill="#8d7bea" ${st}/><rect x="150" y="164" width="100" height="10" rx="4" fill="#f3b94d" ${st}/>
      <circle cx="200" cy="122" r="44" fill="#cfc6ff" ${st}/><circle cx="200" cy="122" r="44" fill="#fff" opacity=".2"><animate attributeName="opacity" values=".1;.45;.1" dur="2.4s" repeatCount="indefinite"/></circle><ellipse cx="184" cy="104" rx="12" ry="8" fill="#fff" opacity=".8"/>
      <text x="200" y="136" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="34" fill="#5b4bb5">?</text>
      ${spark(145, 80, 8, '#f3b94d', 1.8)}${spark(258, 70, 10, '#fff', 2.2)}${spark(270, 140, 6, '#f3b94d', 1.6)}
      <g transform="translate(300 150) rotate(12)"><rect width="34" height="48" rx="5" fill="#fff" ${st}/><circle cx="17" cy="24" r="8" fill="#ef8fb3" ${st}/></g><g transform="translate(70 158) rotate(-14)"><rect width="34" height="48" rx="5" fill="#fff" ${st}/><path d="M17 14l5 10h-10z" fill="#3bb5a0" ${st}/></g></svg>`,
  },
  cq: {
    name: 'Croquis', place: "L'Atelier", icon: 'brush', tint: '#fff0e3', accent: '#f0745f', dark: '#b8473a', tag: 'Coop',
    pitch: "L'un dessine, l'autre devine. Chrono lancé !",
    how: [['palette', 'Le dessinateur choisit un mot parmi 3.'], ['brush', 'Il dessine au doigt, ça s\'affiche en direct chez l\'autre.'], ['timer', 'Plus vous trouvez vite, plus vous marquez. Les rôles alternent.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#ffe2cc"/><rect y="150" width="400" height="70" fill="#e9b892"/><path d="M0 150h400" ${st}/>
      <rect x="250" y="20" width="110" height="80" rx="8" fill="#fff8ef" ${st}/><path d="M305 20v80M250 60h110" ${st}/><circle cx="335" cy="40" r="9" fill="#f3b94d"/>
      <path d="M150 196l50-160 50 160M200 36v170" ${st} fill="none"/><rect x="128" y="50" width="144" height="104" rx="6" fill="#fff" ${st}/>
      <path d="M150 128c14-40 30-40 40-14s28 24 38-18 22-12 26 6" fill="none" stroke="#f0745f" stroke-width="6" stroke-linecap="round" stroke-dasharray="230" stroke-dashoffset="230"><animate attributeName="stroke-dashoffset" values="230;0;0;230" keyTimes="0;.45;.85;1" dur="5s" repeatCount="indefinite"/></path>
      <circle cx="232" cy="80" r="10" fill="#f3b94d" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.4;.5;.85;1" dur="5s" repeatCount="indefinite"/></circle>
      <g transform="translate(40 150)"><path d="M0 22c0-26 66-30 74-6 4 12-10 12-12 20-3 12-24 16-44 10C6 42 0 34 0 22z" fill="#f6dcb9" ${st}/><circle cx="20" cy="18" r="6" fill="#f0745f"/><circle cx="38" cy="12" r="6" fill="#3bb5a0"/><circle cx="56" cy="18" r="6" fill="#8d7bea"/><circle cx="26" cy="34" r="6" fill="#f3b94d"/></g>
      <g transform="translate(320 120)"><rect x="0" y="20" width="36" height="42" rx="6" fill="#62a8e5" ${st}/><path d="M8 20l-6-34M18 20V-20M28 20l8-30" ${st}/><circle cx="2" cy="-14" r="5" fill="#f0745f" ${st}/><circle cx="18" cy="-22" r="5" fill="#f3b94d" ${st}/><circle cx="36" cy="-10" r="5" fill="#3bb5a0" ${st}/></g>
      <circle cx="96" cy="40" r="8" fill="#ef8fb3"/><circle cx="80" cy="60" r="5" fill="#8d7bea"/><circle cx="380" cy="160" r="6" fill="#3bb5a0"/></svg>`,
  },
  mot: {
    name: 'Mot Mystère', place: 'La Bibliothèque secrète', icon: 'book', tint: '#e4f6f1', accent: '#3bb5a0', dark: '#23806f', tag: 'Duel',
    pitch: 'Même mot secret, 6 essais, le plus rapide gagne.',
    how: [['keyboard', 'Tape un mot de 5 lettres.'], ['check', 'Vert : bonne place. Jaune : mauvaise place. Gris : absente.'], ['users', "Tu vois sa progression en couleurs, mais jamais ses lettres."]],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#cdeee6"/>
      ${[0, 1, 2].map(r => `<rect x="10" y="${16 + r * 64}" width="380" height="8" fill="#9a6b4b" ${st}/>` + Array.from({ length: 22 }, (_, i) => { const h = 34 + ((i * 7 + r * 3) % 14); const c = ['#f0745f', '#8d7bea', '#f3b94d', '#62a8e5', '#3bb5a0', '#ef8fb3'][(i + r) % 6]; return `<rect x="${16 + i * 17}" y="${16 + r * 64 - h}" width="15" height="${h}" rx="2" fill="${c}" stroke="${K}" stroke-width="2"/>`; }).join('')).join('')}
      <g transform="translate(90 120)">${['M', 'O', 'T', '?', 'S'].map((l, i) => `<g transform="translate(${i * 46} 0)"><rect width="40" height="40" rx="9" fill="${['#3bb5a0', '#f3b94d', '#3bb5a0', '#fff', '#3bb5a0'][i]}" ${st}/><text x="20" y="29" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="24" fill="${i === 1 || i === 3 ? K : '#fff'}">${l}</text><animateTransform attributeName="transform" type="translate" values="${i * 46} 0;${i * 46} -8;${i * 46} 0" dur="2s" begin="${i * .15}s" repeatCount="indefinite"/></g>`).join('')}</g>
      <g transform="translate(250 92)"><animateTransform attributeName="transform" type="translate" values="250 92;262 98;250 92" dur="3s" repeatCount="indefinite"/><circle cx="0" cy="0" r="26" fill="#fff" fill-opacity=".45" ${st}/><path d="M18 18l26 26" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M18 18l26 26" stroke="#9a6b4b" stroke-width="5" stroke-linecap="round"/></g></svg>`,
  },
  ut: {
    name: 'Morpion Ultime', place: "L'Arène", icon: 'grid', tint: '#e6f1fc', accent: '#62a8e5', dark: '#2f6fa8', tag: 'Stratégie',
    pitch: '9 morpions dans un morpion. Chaque coup envoie l\'autre ailleurs.',
    how: [['grid', 'Gagne 3 petits morpions alignés pour remporter la partie.'], ['target', 'La case où tu joues décide du grand carré où joue ton duo.'], ['flag', "Si ce carré est déjà fini, il joue où il veut."]],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#cfe6fb"/>
      <path d="M0 120Q200 40 400 120V220H0Z" fill="#b6d4f0" ${st}/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${20 + i * 28}" cy="${112 - Math.sin(i / 13 * Math.PI) * 50}" r="7" fill="${['#f0745f', '#f3b94d', '#3bb5a0', '#8d7bea'][i % 4]}" stroke="${K}" stroke-width="2"><animate attributeName="cy" values="${112 - Math.sin(i / 13 * Math.PI) * 50};${106 - Math.sin(i / 13 * Math.PI) * 50};${112 - Math.sin(i / 13 * Math.PI) * 50}" dur="1.2s" begin="${i * .08}s" repeatCount="indefinite"/></circle>`).join('')}
      <path d="M0 220V170Q200 150 400 170V220Z" fill="#9cc48a" ${st}/>
      <g transform="translate(140 108)"><rect width="120" height="100" rx="12" fill="#fff" ${st}/><path d="M40 10v80M80 10v80M10 40h100M10 70h100" ${st}/><path d="M16 16l16 16M32 16l-16 16M88 76l14 14M102 76l-14 14" stroke="#f0745f" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="55" r="9" fill="none" stroke="#62a8e5" stroke-width="5"/><circle cx="96" cy="24" r="8" fill="none" stroke="#62a8e5" stroke-width="5"/></g>
      <g transform="translate(60 40)"><path d="M0 0v70" ${st}/><path d="M0 2h40l-10 12 10 12H0" fill="#f0745f" ${st}><animate attributeName="d" values="M0 2h40l-10 12 10 12H0;M0 2h36l-6 12 12 12H0;M0 2h40l-10 12 10 12H0" dur="1.4s" repeatCount="indefinite"/></path></g>
      <g transform="translate(340 40)"><path d="M0 0v70" ${st}/><path d="M0 2h-40l10 12-10 12H0" fill="#62a8e5" ${st}><animate attributeName="d" values="M0 2h-40l10 12-10 12H0;M0 2h-36l6 12-12 12H0;M0 2h-40l10 12-10 12H0" dur="1.4s" repeatCount="indefinite"/></path></g></svg>`,
  },
  p4: {
    name: 'Puissance 4', place: 'La Fête foraine', icon: 'circle', tint: '#fff5dc', accent: '#f3b94d', dark: '#b07f16', tag: 'Duel',
    pitch: 'Aligne 4 jetons avant ton duo. Simple, redoutable.',
    how: [['circle', 'Touche une colonne pour lâcher ton jeton.'], ['target', 'Aligne-en 4 : ligne, colonne ou diagonale.'], ['swords', 'Bloque ses alignements… sans te faire piéger.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#ffe9b0"/>
      <g transform="translate(320 92)"><g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="24s" repeatCount="indefinite"/><circle r="62" fill="none" ${st}/>${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M0 0L${Math.cos(a) * 62} ${Math.sin(a) * 62}" ${st}/><circle cx="${Math.cos(a) * 62}" cy="${Math.sin(a) * 62}" r="9" fill="${['#f0745f', '#62a8e5', '#3bb5a0', '#ef8fb3'][i % 4]}" ${st}/>`; }).join('')}</g><path d="M-30 120L0 0 30 120" ${st} fill="none"/></g>
      <path d="M0 30Q100 60 200 30T400 30" fill="none" ${st}/>${Array.from({ length: 9 }, (_, i) => { const x = 20 + i * 45, y = 30 + Math.sin((x / 400) * Math.PI * 2) * -2 + (i % 2 ? 10 : 6); return `<path d="M${x} ${y}l10 22 10-22z" fill="${['#f0745f', '#3bb5a0', '#8d7bea', '#62a8e5'][i % 4]}" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/>`; }).join('')}
      <rect y="175" width="400" height="45" fill="#e3c27a"/><path d="M0 175h400" ${st}/>
      <g transform="translate(40 70)"><rect width="190" height="140" rx="16" fill="#8d7bea" ${st}/>${Array.from({ length: 20 }, (_, i) => { const c = i % 5, r = i / 5 | 0; const f = { '0,3': '#f0745f', '1,3': '#f3b94d', '1,2': '#f0745f', '2,3': '#f0745f', '2,2': '#f3b94d', '3,3': '#f3b94d', '2,1': '#f0745f' }[c + ',' + r] || '#fff8e6'; return `<circle cx="${24 + c * 36}" cy="${24 + r * 31}" r="12" fill="${f}" stroke="${K}" stroke-width="2.5"/>`; }).join('')}</g>
      <circle cx="168" cy="0" r="12" fill="#f3b94d" ${st}><animate attributeName="cy" values="-20;62;54;62" keyTimes="0;.5;.6;.7" dur="2.4s" repeatCount="indefinite"/></circle></svg>`,
  },
  cartes: {
    name: 'Cartes à parler', place: 'Le Café des confidences', icon: 'coffee', tint: '#fdeee8', accent: '#e58a6a', dark: '#a8553a', tag: 'Discussion',
    pitch: 'Des questions pour vraiment se parler pendant vos appels.',
    how: [['cards', 'Choisis un paquet : fun, profond, souvenirs…'], ['chat', 'Lisez la carte, le premier désigné répond.'], ['heart', 'Réagissez, puis carte suivante. Pas de score, juste vous.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#f6d9cb"/>
      <rect x="40" y="20" width="140" height="100" rx="10" fill="#bfe0f5" ${st}/><path d="M110 20v100M40 70h140" ${st}/><circle cx="150" cy="44" r="10" fill="#fff6d6"/><path d="M40 120h140" stroke="${K}" stroke-width="6"/>
      <path d="M220 36q30-20 60 0t60 0" fill="none" stroke="#e58a6a" stroke-width="4"/>${[230, 260, 290, 320, 350].map((x, i) => `<circle cx="${x}" cy="${46 + (i % 2) * 6}" r="7" fill="#f3b94d" ${st}><animate attributeName="opacity" values="1;.4;1" dur="${1.4 + i * .2}s" repeatCount="indefinite"/></circle>`).join('')}
      <rect y="160" width="400" height="60" fill="#a8553a"/><path d="M0 160h400" ${st}/>
      <g transform="translate(120 112)"><path d="M0 0h50v34a14 14 0 01-14 14H14A14 14 0 010 34z" fill="#fff" ${st}/><path d="M50 10h8a10 10 0 010 20h-8" fill="none" ${st}/><path d="M14 -8q-6-10 0-18M28 -8q-6-10 0-18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"><animate attributeName="opacity" values=".2;1;.2" dur="2s" repeatCount="indefinite"/></path></g>
      <g transform="translate(236 112)"><path d="M0 0h50v34a14 14 0 01-14 14H14A14 14 0 010 34z" fill="#ef8fb3" ${st}/><path d="M50 10h8a10 10 0 010 20h-8" fill="none" ${st}/><path d="M18 -8q-6-10 0-18M32 -8q-6-10 0-18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/></path></g>
      <g transform="translate(176 150) rotate(-8)"><rect width="46" height="62" rx="7" fill="#fff" ${st}/><path d="M10 18h26M10 28h18" ${st}/></g>
      <g transform="translate(298 64)"><animateTransform attributeName="transform" type="translate" values="298 64;298 58;298 64" dur="3s" repeatCount="indefinite"/><path d="M0 0h70a10 10 0 0110 10v24a10 10 0 01-10 10H26l-12 10v-10H10A10 10 0 010 34V10A10 10 0 0110 0z" fill="#fff" ${st}/><circle cx="26" cy="22" r="4" fill="${K}"/><circle cx="40" cy="22" r="4" fill="${K}"/><circle cx="54" cy="22" r="4" fill="${K}"/></g></svg>`,
  },
  quiz: {
    name: 'Quiz Afrique & Canada', place: 'Le Grand Plateau', icon: 'globe2', tint: '#e5edfb', accent: '#3d6fc4', dark: '#26498a', tag: 'Quiz',
    pitch: "Capitales, musique, sport, expressions québécoises : qui en sait le plus ?",
    how: [['globe2', 'Choisis un thème : Afrique, Canada, Monde ou mélange.'], ['timer', '10 questions, 20 secondes chacune. Répondez chacun de votre côté.'], ['trophy', '10 pts par bonne réponse, plus un bonus de rapidité.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#2f4f8f"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M200 230L${-40 + i * 80} -10" stroke="#3d62a8" stroke-width="26" opacity=".55"/>`).join('')}
      <g fill="#f3b94d">${[30, 70, 110, 150, 250, 290, 330, 370].map((x, i) => `<circle cx="${x}" cy="16" r="5"><animate attributeName="opacity" values="1;.3;1" dur="1.2s" begin="${i * .15}s" repeatCount="indefinite"/></circle>`).join('')}</g>
      <path d="M0 220V172H400V220Z" fill="#1f3766"/><path d="M0 172h400" ${st}/>
      <g transform="translate(150 70)"><rect x="-6" y="70" width="112" height="40" rx="8" fill="#f0745f" ${st}/><rect x="10" y="62" width="80" height="14" rx="5" fill="#f3b94d" ${st}/>
      <g><animateTransform attributeName="transform" type="rotate" values="0 50 30;360 50 30" dur="14s" repeatCount="indefinite"/><circle cx="50" cy="30" r="34" fill="#62a8e5" ${st}/>
      <path d="M30 10q8 4 6 12t8 12-2 14M58 2q-6 10 4 16t14 6M68 42q-8 6-4 14" fill="none" stroke="#3bb5a0" stroke-width="7" stroke-linecap="round"/></g></g>
      <g transform="translate(40 96)"><rect width="70" height="44" rx="10" fill="#fff" ${st}/><text x="35" y="31" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="24" fill="#3d6fc4">A ?</text></g>
      <g transform="translate(292 96)"><rect width="70" height="44" rx="10" fill="#fff" ${st}/><text x="35" y="31" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="24" fill="#d65a5a">B ?</text></g>
      ${spark(120, 50, 8, '#f3b94d', 1.8)}${spark(285, 56, 7, '#fff', 2.3)}</svg>`,
  },
  mens: {
    name: 'Le Mensonge', place: 'Le Cabaret des menteurs', icon: 'mask', tint: '#f6e9f3', accent: '#a0548f', dark: '#6e3462', tag: 'Bluff',
    pitch: '2 vérités, 1 mensonge. Saura-t-il/elle te démasquer ?',
    how: [['pencil', 'Un thème apparaît : écris 2 vérités et 1 mensonge sur toi.'], ['mask', 'Ton duo cherche le mensonge parmi tes 3 phrases, et toi parmi les siennes.'], ['trophy', "Démasquer = 1 point. Tromper l'autre = 1 point."]],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#4a2343"/>
      <path d="M0 0H140Q120 100 135 220H0Z" fill="#a0548f" ${st}/><path d="M400 0H260Q280 100 265 220H400Z" fill="#a0548f" ${st}/>
      <path d="M40 0q8 110-6 220M90 0q14 110 4 220M310 0q-14 110-4 220M360 0q-8 110 6 220" stroke="#7d3f70" stroke-width="3" fill="none"/>
      <ellipse cx="200" cy="40" rx="70" ry="120" fill="#f3b94d" opacity=".14"><animate attributeName="opacity" values=".1;.22;.1" dur="3s" repeatCount="indefinite"/></ellipse>
      <rect y="176" width="400" height="44" fill="#2e1529"/><path d="M0 176h400" ${st}/>
      <g transform="translate(200 112)"><g><animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="3s" repeatCount="indefinite"/>
      <path d="M-74 -26q36-22 72-4v34q-4 34-36 34t-36-34z" fill="#fff" ${st}/><path d="M-60 -6q8-6 16 0M-30 -6q8-6 16 0" ${st} fill="none"/><path d="M-56 18q18 16 36 0" ${st} fill="#f0745f"/>
      <path d="M2 -22q36-18 72 4v34q0 34-36 34t-36-34z" fill="#3a2a4f" ${st}/><path d="M16 -2q8 6 16 0M46 -2q8 6 16 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M20 32q18-14 36 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path d="M-2 0v70" ${st}/></g>
      ${spark(100, 60, 8, '#f3b94d', 1.7)}${spark(305, 70, 9, '#fff', 2.1)}${spark(285, 150, 5, '#f3b94d', 1.5)}</svg>`,
  },
  nav: {
    name: 'Bataille navale', place: 'La Baie des corsaires', icon: 'boat', tint: '#e2f3f6', accent: '#2e8fa3', dark: '#1d6676', tag: 'Stratégie',
    pitch: 'Cache ta flotte, traque la sienne. Touché… coulé !',
    how: [['shuffle', 'Place ta flotte au hasard (5 bateaux), mélange autant que tu veux.'], ['crosshair', "Chacun son tour, vise une case de sa mer. Touché = tu rejoues."], ['anchor', 'Le premier qui coule toute la flotte adverse gagne.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#bfe6ee"/>
      <circle cx="330" cy="46" r="22" fill="#f3b94d" ${st}/>
      <path d="M0 110Q50 100 100 110T200 110T300 110T400 110V220H0Z" fill="#62a8e5" ${st}><animate attributeName="d" values="M0 110Q50 100 100 110T200 110T300 110T400 110V220H0Z;M0 110Q50 120 100 110T200 110T300 110T400 110V220H0Z;M0 110Q50 100 100 110T200 110T300 110T400 110V220H0Z" dur="4s" repeatCount="indefinite"/></path>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" dur="3s" repeatCount="indefinite"/><g transform="translate(70 70)"><path d="M0 40h120l-16 26H16z" fill="#9a6b4b" ${st}/><path d="M58 40V-24" ${st}/><path d="M60 -20q40 20 0 56z" fill="#fff" ${st}/><path d="M56 -16q-36 22 0 52z" fill="#fdf0d3" ${st}/><path d="M58 -24l18-6-2 10z" fill="#d65a5a" ${st}/></g></g>
      <g transform="translate(270 120)"><path d="M0 8q30-14 60 0l-6 14H6z" fill="#3a3550" ${st}/><rect x="22" y="-6" width="16" height="14" rx="3" fill="#3a3550" ${st}/></g>
      <path d="M0 160Q50 150 100 160T200 160T300 160T400 160V220H0Z" fill="#2e8fa3" ${st}/>
      <g transform="translate(250 112)"><circle r="16" fill="none" stroke="#d65a5a" stroke-width="4"><animate attributeName="r" values="10;20;10" dur="1.6s" repeatCount="indefinite"/></circle><path d="M-26 0h52M0 -26v52" stroke="#d65a5a" stroke-width="3"/></g>
      <g fill="#fff">${[[40, 182], [180, 196], [330, 186]].map(([x, y], i) => `<path d="M${x} ${y}q8-8 16 0q8-8 16 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"><animate attributeName="opacity" values="1;.3;1" dur="2s" begin="${i * .5}s" repeatCount="indefinite"/></path>`).join('')}</g></svg>`,
  },
  interdit: {
    name: 'Le Mot Interdit', place: 'Le Studio radio', icon: 'prohibit', tint: '#fde9e6', accent: '#d65a5a', dark: '#9c3434', tag: 'En appel',
    pitch: "Fais deviner un max de mots en 60 s… sans dire les mots interdits !",
    how: [['chat', 'Lancez un appel : ce jeu se joue à voix haute.'], ['prohibit', "L'un fait deviner le mot affiché sans dire les 4 mots interdits."], ['timer', "60 secondes par manche, les rôles alternent. Battez votre record !"]],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#f7cfc7"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${i * 52}" y="0" width="44" height="44" rx="6" fill="#efb8ad"/>`).join('')}
      <rect x="250" y="40" width="120" height="44" rx="10" fill="#3a3550" ${st}/><circle cx="270" cy="62" r="7" fill="#d65a5a"><animate attributeName="opacity" values="1;.2;1" dur="1s" repeatCount="indefinite"/></circle><text x="320" y="70" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="20" fill="#fff">ON AIR</text>
      <rect y="170" width="400" height="50" fill="#9c3434"/><path d="M0 170h400" ${st}/>
      <g transform="translate(120 60)"><rect x="-26" y="0" width="52" height="80" rx="26" fill="#3a3550" ${st}/>${[16, 28, 40, 52].map(y => `<path d="M-16 ${y}h32" stroke="#6b6585" stroke-width="3"/>`).join('')}<path d="M-38 44q0 40 38 40t38-40" fill="none" ${st}/><path d="M0 84v26M-24 110h48" ${st}/></g>
      <g transform="translate(250 130)"><circle r="30" fill="#fff" ${st}/><circle r="22" fill="none" stroke="#d65a5a" stroke-width="7"/><path d="M-15 15L15 -15" stroke="#d65a5a" stroke-width="7" stroke-linecap="round"/></g>
      <g fill="none" stroke="#2a2440" stroke-width="4" stroke-linecap="round">${[0, 1, 2].map(i => `<path d="M${170 + i * 14} ${80 - i * 4}q10 20 0 40"><animate attributeName="opacity" values="1;.15;1" dur="1.2s" begin="${i * .2}s" repeatCount="indefinite"/></path>`).join('')}</g></svg>`,
  },
  bac: {
    name: 'Petit Bac express', place: 'La Salle de classe', icon: 'listcheck', tint: '#fdf0e1', accent: '#d98c3a', dark: '#9a5c1c', tag: 'Rapidité',
    pitch: 'Une lettre, 6 catégories, 90 secondes. Plume en main !',
    how: [['listcheck', 'Une lettre est tirée : trouve un mot par catégorie.'], ['timer', '90 secondes par lettre, 3 lettres par partie.'], ['check', 'Mot unique = 2 pts, même mot = 1 pt. Touche un mot douteux pour le refuser.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#f6dcb7"/>
      <rect x="60" y="22" width="280" height="120" rx="10" fill="#3f6b4f" ${st}/><rect x="60" y="22" width="280" height="120" rx="10" fill="none" stroke="#9a6b4b" stroke-width="8"/>
      <text x="200" y="104" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="76" fill="#fff" opacity=".92">M<animate attributeName="opacity" values=".92;.5;.92" dur="2.5s" repeatCount="indefinite"/></text>
      <path d="M86 48h60M86 60h40M260 50h50M270 62h34" stroke="#e8f1ea" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      <rect y="166" width="400" height="54" fill="#c98f52"/><path d="M0 166h400" ${st}/>
      <g transform="translate(70 150) rotate(-6)"><rect width="110" height="56" rx="4" fill="#fff" ${st}/><path d="M10 14h60M10 26h80M10 38h50" stroke="#62a8e5" stroke-width="3"/><path d="M76 34l8 8 14-18" stroke="#3bb5a0" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(250 136) rotate(30)"><rect width="14" height="80" rx="3" fill="#f3b94d" ${st}/><path d="M0 80l7 16 7-16" fill="#f6dcb9" ${st}/><animateTransform attributeName="transform" type="rotate" values="30;22;30" dur="1s" additive="sum" repeatCount="indefinite"/></g>
      <g transform="translate(320 150)"><circle r="22" fill="#fff" ${st}/><path d="M0 0v-14M0 0l10 6" ${st}><animateTransform attributeName="transform" type="rotate" values="0;360" dur="6s" repeatCount="indefinite"/></path></g></svg>`,
  },
  hist: {
    name: 'Histoire à deux', place: 'La Forêt des contes', icon: 'feather', tint: '#eef6e3', accent: '#6a9f3f', dark: '#4a7a24', tag: 'Créatif',
    pitch: 'Écrivez une histoire, une phrase chacun, avec des mots imposés.',
    how: [['book', "Un début d'histoire est tiré au sort."], ['feather', 'Chacun son tour, ajoute une phrase avec le mot imposé (2 jokers pour en changer).'], ['sparkle', 'Après 10 phrases, relisez votre conte et partagez-le !']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#d6ecc2"/>
      ${[[30, 120, 46], [92, 104, 56], [320, 112, 52], [372, 126, 40]].map(([x, y, r]) => `<path d="M${x} 220V${y + 20}" stroke="#7a5236" stroke-width="12"/><circle cx="${x}" cy="${y}" r="${r}" fill="#7cae4f" ${st}/>`).join('')}
      <path d="M0 220V180Q200 160 400 180V220Z" fill="#9cc48a" ${st}/>
      <g transform="translate(200 132)"><path d="M-90 -6q45-18 90 0v58q-45-18-90 0z" fill="#fff" ${st}/><path d="M90 -6q-45-18-90 0v58q45-18 90 0z" fill="#fff8ec" ${st}/>
      <path d="M-74 8q30-8 60 0M-74 20q30-8 60 0M-74 32q24-6 48 0M14 8q30-8 60 0M14 20q30-8 60 0" stroke="#c9b9a0" stroke-width="3" fill="none"/></g>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;8 -10;0 0" dur="3.4s" repeatCount="indefinite"/><g transform="translate(250 50) rotate(30)"><path d="M0 0q30 20 10 80q-30-30-10-80z" fill="#fff" ${st}/><path d="M6 10q6 30 4 66" ${st} fill="none"/></g></g>
      ${spark(160, 70, 8, '#f3b94d', 1.8)}${spark(120, 40, 6, '#fff', 2.2)}${spark(300, 160, 6, '#f3b94d', 1.6)}
      <g transform="translate(60 168)"><circle r="6" fill="#ef8fb3"/><circle cx="16" cy="6" r="5" fill="#f3b94d"/><circle cx="300" cy="-4" r="6" fill="#8d7bea"/></g></svg>`,
  },
  photo: {
    name: 'Défi photo', place: 'Le Studio photo', icon: 'camera', tint: '#fde8ee', accent: '#e2557a', dark: '#a63355', tag: 'Défi',
    pitch: "Un thème, une photo chacun, révélées en même temps.",
    how: [['camera', 'Un thème est tiré : « quelque chose de bleu », « ton petit-déj »…'], ['eye', "Ta photo reste cachée jusqu'à ce que ton duo poste la sienne."], ['heart', 'Découvrez-les ensemble et réagissez à celle de l\'autre.']],
    scene: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><rect width="400" height="220" fill="#f9d3dd"/>
      <path d="M0 40h400" stroke="#2a2440" stroke-width="2"/>${[[50, -6], [130, 5], [270, -4], [350, 6]].map(([x, r], i) => `<g transform="translate(${x} 36) rotate(${r})"><rect x="-6" y="-4" width="12" height="12" fill="#f3b94d" ${st}/><rect x="-28" y="6" width="56" height="62" rx="3" fill="#fff" ${st}/><rect x="-22" y="12" width="44" height="40" fill="${['#62a8e5', '#f3b94d', '#3bb5a0', '#8d7bea'][i]}"/></g>`).join('')}
      <rect y="176" width="400" height="44" fill="#e2a0b2"/><path d="M0 176h400" ${st}/>
      <g transform="translate(200 132)"><rect x="-62" y="-36" width="124" height="80" rx="16" fill="#3a3550" ${st}/><rect x="-30" y="-48" width="40" height="16" rx="5" fill="#3a3550" ${st}/><circle r="28" fill="#62a8e5" ${st}/><circle r="16" fill="#2a2440"/><circle cx="-6" cy="-6" r="5" fill="#fff"/><circle cx="44" cy="-22" r="6" fill="#f3b94d" ${st}/></g>
      <circle cx="200" cy="132" r="80" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;0;.8;0" keyTimes="0;.85;.9;1" dur="3s" repeatCount="indefinite"/></circle>
      ${spark(100, 120, 8, '#fff', 1.8)}${spark(310, 120, 9, '#f3b94d', 2.2)}</svg>`,
  },
};
export const ORDER = ['tele', 'dev', 'cq', 'mot', 'ut', 'p4', 'cartes', 'quiz', 'mens', 'nav', 'interdit', 'bac', 'hist', 'photo'];
export const GROUPS = [['Se défier', ['quiz', 'dev', 'mot', 'bac', 'mens']], ['Faire équipe', ['tele', 'cq', 'interdit', 'hist', 'photo']], ['Stratégie', ['nav', 'ut', 'p4']], ['Pour parler', ['cartes']]];

export const LOGO = `<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="30" fill="#8d7bea"/><circle cx="60" cy="60" r="38" fill="#fbf7f0" stroke="${K}" stroke-width="5"/><path d="M60 22a38 38 0 010 76z" fill="#f0745f" stroke="${K}" stroke-width="5"/><circle cx="44" cy="56" r="5" fill="${K}"/><circle cx="76" cy="56" r="5" fill="#fff"/><path d="M46 72q14 12 28 0" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/></svg>`;

export const HERO = `<svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid meet"><circle cx="200" cy="120" r="92" fill="#e9e4ff" stroke="${K}" stroke-width="3"/><path d="M122 92q30 6 46-12t40 6 34-10 36 18M118 140q36-10 60 6t52-4 44 8" fill="none" stroke="#c6bcf6" stroke-width="10" stroke-linecap="round"/>
<path d="M90 150Q200 0 310 150" fill="none" stroke="${K}" stroke-width="3" stroke-dasharray="7 8"><animate attributeName="stroke-dashoffset" values="30;0" dur="1.2s" repeatCount="indefinite"/></path>
<g><animateMotion dur="5s" repeatCount="indefinite" path="M90 150Q200 0 310 150" rotate="auto"/><path d="M-12 0l22-4 4 4-4 4zM-2 -2l-4-10h5l7 10zM-2 2l-4 10h5l7-10z" fill="#f0745f" stroke="${K}" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(62 150)"><circle r="26" fill="#f0745f" stroke="${K}" stroke-width="3"/><text y="7" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" fill="#fff">LYON</text></g>
<g transform="translate(338 150)"><circle r="26" fill="#3bb5a0" stroke="${K}" stroke-width="3"/><text y="5" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="11" fill="#fff">OTTAWA</text></g>
${spark(200, 40, 9, '#f3b94d', 2)}${spark(250, 200, 7, '#ef8fb3', 1.6)}${spark(140, 196, 6, '#8d7bea', 2.4)}</svg>`;
