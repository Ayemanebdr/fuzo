// Fuseau — appli de jeux à deux, à distance.
import { makeBackend } from './backend.js';
import { makeGames, esc, shuffle } from './games.js';
import { WORLDS, ORDER, LOGO, HERO } from './worlds.js';
import { AVATARS } from './avatars.js';
import { SPRITE } from './sprite.js';
import { DEVCATS, DECKS } from './content.js';
const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }, del(k) { try { localStorage.removeItem(k); } catch (e) { } } };

document.body.insertAdjacentHTML('afterbegin', SPRITE);
const $ = (s, r = document) => r.querySelector(s);
const ic = (n, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const now = () => Date.now();
const rid = () => now().toString(36) + Math.random().toString(36).slice(2, 7);
const COLORS = ['#8d7bea', '#f0745f', '#3bb5a0', '#f3b94d', '#62a8e5', '#ef8fb3'];
const AV_TABS = [['adv', 'Aventuriers'], ['smile', 'Sourires'], ['micah', 'Portraits'], ['peeps', 'Croquis'], ['photo', 'Ma photo']];
const REACTS = [['heart', '#f0745f'], ['fire', '#f3b94d'], ['clap', '#8d7bea'], ['smiley_wink', '#3bb5a0'], ['smiley_x', '#62a8e5'], ['star', '#f3b94d'], ['thumb', '#ef8fb3'], ['brain', '#8d7bea']];
const myTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const cityOf = tz => tz ? String(tz).split('/').pop().replace(/_/g, ' ') : '';
const timeIn = tz => { try { return new Date().toLocaleTimeString('fr-FR', { timeZone: tz || undefined, hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const tzOff = tz => { try { const d = new Date(); return Math.round((new Date(d.toLocaleString('en-US', { timeZone: tz })) - new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }))) / 36e5 * 2) / 2; } catch (e) { return 0; } };
const fmtWhen = (ms, tz) => { try { return new Date(ms).toLocaleString('fr-FR', { timeZone: tz || undefined, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const fmtHour = (ms, tz) => { try { return new Date(ms).toLocaleTimeString('fr-FR', { timeZone: tz || undefined, hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const ago = ms => { const s = (now() - ms) / 1000; if (s < 90) return 'à l\'instant'; if (s < 3600) return `il y a ${Math.round(s / 60)} min`; if (s < 86400) return `il y a ${Math.round(s / 3600)} h`; return `il y a ${Math.round(s / 86400)} j`; };

/* ================= état ================= */
const S = { B: null, me: null, user: null, prof: null, profLoaded: false, users: {}, duo: null, code: null, games: [], gamesLoaded: false, msgs: [], results: [], g: null, gp: {}, draw: null, ui: {}, cleanup: [], done: new Set(), key: null, subs: [], gsubs: [], seenMsg: null, set: { sound: true, vib: true, notif: false }, installEvt: null };
try { Object.assign(S.set, JSON.parse(LS.get('fuseau-set') || '{}')); } catch (e) { }
const saveSet = () => { try { LS.set('fuseau-set', JSON.stringify(S.set)); } catch (e) { } };
const P = uid => S.users[uid] || {};
const partner = () => S.duo && S.duo.members ? S.duo.members.find(m => m !== S.me) : null;
const nm = uid => uid === S.me ? (S.prof && S.prof.name) || 'Toi' : P(uid).name || 'Ton duo';
const online = uid => { const s = P(uid).seen; return s && now() - s < 80000; };
const typing = uid => { const t = P(uid).typing; return t && now() - t < 6000; };
const duoPath = p => `duos/${S.code}/${p}`;
const routeName = () => (location.hash.replace(/^#\/?/, '').split('/')[0]) || 'home';
const routeArg = () => location.hash.replace(/^#\/?/, '').split('/')[1] || '';
const go = h => { if (location.hash !== h) location.hash = h; else render(); };

function avatarSrc(uid) { const p = uid === S.me ? S.prof || {} : P(uid); const a = p.avatar; if (a && a.t === 'photo' && a.d) return a.d; return `assets/avatars/${(a && a.id) || 'adv-1'}.svg`; }
function av(uid, cls = 'sm', dot = false) { const p = uid === S.me ? S.prof || {} : P(uid); return `<span class="av ${cls}" style="--rc:${esc(p.col || '#e9e2f9')}"><img src="${esc(avatarSrc(uid))}" alt="" loading="lazy">${dot ? `<i class="dot ${online(uid) || uid === S.me ? 'on' : ''}"></i>` : ''}</span>`; }

/* ================= sons, vibrations, effets ================= */
const SND = { ctx: null, buf: {} };
function initAudio() {
  if (SND.ctx) return; try { SND.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  for (const k of ['coin', 'jump', 'land', 'place', 'place2', 'toggle', 'remove', 'rotate']) fetch(`assets/sounds/${k}.mp3`).then(r => r.arrayBuffer()).then(b => SND.ctx.decodeAudioData(b)).then(d => { SND.buf[k] = d; }).catch(() => { });
}
document.addEventListener('pointerdown', () => { initAudio(); if (SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume(); }, { capture: true });
function play(k, vol = .7, rate = 1) { const c = SND.ctx, b = SND.buf[k]; if (!c || !b) return; const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; s.playbackRate.value = rate; g.gain.value = vol; s.connect(g); g.connect(c.destination); s.start(); }
function synth(seq, type = 'triangle', vol = .16) { const c = SND.ctx; if (!c) return; const t = c.currentTime; let o = 0; for (const [f, d] of seq) { const os = c.createOscillator(), g = c.createGain(); os.type = type; os.frequency.value = f; g.gain.setValueAtTime(.0001, t + o); g.gain.exponentialRampToValueAtTime(vol, t + o + .015); g.gain.exponentialRampToValueAtTime(.0001, t + o + d); os.connect(g); g.connect(c.destination); os.start(t + o); os.stop(t + o + d + .03); o += d * .85; } }
function sfx(k) {
  if (!S.set.sound) return;
  try {
    ({
      tap: () => play('toggle', .5), open: () => play('jump', .45, 1.15), back: () => play('remove', .3, 1.2), place: () => play('place', .7), land: () => play('land', .8),
      coin: () => play('coin', .6), key: () => play('toggle', .35, 1.6), send: () => play('rotate', .6, 1.1),
      msg: () => synth([[880, .09], [1320, .16]], 'sine', .12), win: () => { play('coin', .6); synth([[523, .1], [659, .1], [784, .1], [1047, .3]], 'triangle', .13); },
      fail: () => synth([[330, .12], [247, .22]], 'sine', .14), tick: () => synth([[1200, .03]], 'square', .04), wizz: () => synth([[180, .08], [140, .08], [180, .08], [140, .1]], 'sawtooth', .08),
    }[k] || (() => play('toggle', .4)))();
  } catch (e) { }
  if (S.set.vib && navigator.vibrate) { try { navigator.vibrate(k === 'wizz' ? [90, 50, 90, 50, 90] : k === 'win' ? [30, 40, 60] : k === 'fail' ? 40 : 8); } catch (e) { } }
}
function toast(html, act, data = {}) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; if (act) { t.dataset.act = act; Object.assign(t.dataset, data); } document.body.appendChild(t); setTimeout(() => t.remove(), act ? 6000 : 2800); }
function floatReact(k) { const r = REACTS.find(x => x[0] === k); if (!r) return; const s = document.createElement('div'); s.className = 'float'; s.style.color = r[1]; s.innerHTML = ic(r[0]); s.style.left = (8 + Math.random() * 75) + 'vw'; s.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg'); document.body.appendChild(s); setTimeout(() => s.remove(), 2700); }
function shakeScreen() { const a = $('#app'); a.classList.remove('wizz'); void a.offsetWidth; a.classList.add('wizz'); sfx('wizz'); }
const confetti = (() => { const cv = $('#confetti'), cx = cv.getContext('2d'); let Pp = [], run = false; const fit = () => { cv.width = innerWidth; cv.height = innerHeight; }; addEventListener('resize', fit); fit(); function loop() { cx.clearRect(0, 0, cv.width, cv.height); Pp = Pp.filter(p => p.y < cv.height + 20); Pp.forEach(p => { p.vy += .2; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; if (p.round) { cx.beginPath(); cx.arc(0, 0, p.s / 2.5, 0, 7); cx.fill(); } else cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); }); if (Pp.length) requestAnimationFrame(loop); else { run = false; cx.clearRect(0, 0, cv.width, cv.height); } } return n => { for (let i = 0; i < (n || 140); i++) Pp.push({ x: cv.width / 2 + (Math.random() - .5) * 140, y: cv.height * .42, vx: (Math.random() - .5) * 15, vy: -Math.random() * 14 - 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, s: 7 + Math.random() * 7, c: COLORS[Math.random() * COLORS.length | 0], round: Math.random() < .3 }); if (!run) { run = true; loop(); } }; })();

/* ================= jeux ================= */
const gpath = () => duoPath(`games/${S.g.id}`);
const H = {
  me: () => S.me, g: () => S.g, nm, av, ic, ui: S.ui, sfx, confetti, toast: m => toast(esc(m)), render: () => render(),
  pdoc: uid => S.gp[uid] || {}, draw: () => S.draw,
  ans: uid => { const a = (S.gp[uid] || {}).a; return a && S.g && a.r === S.g.round ? a.v : undefined; },
  mine: p => S.B.merge(`${gpath()}/p/${S.me}`, p),
  patch: p => S.B.merge(gpath(), Object.assign({ ts: now() }, p)),
  setG: g => { const c = Object.assign({}, g); delete c.id; c.ts = now(); return S.B.set(gpath(), c); },
  setDraw: b => S.B.set(`${gpath()}/x/draw`, b),
  lead: g => g.players[0] === S.me,
  once(k, d, fn) { if (S.done.has(k)) return; S.done.add(k); setTimeout(() => { try { fn(); } catch (e) { console.error(e); } }, d); },
  cleanup: f => S.cleanup.push(f),
  record(g, rec) {
    const r = Object.assign({ t: g.type, p: g.players, at: now() }, rec);
    S.B.set(duoPath(`results/${g.id}`), r);
    const W = WORLDS[g.type]; let text;
    if ('w' in rec) text = rec.w ? `${nm(rec.w)} remporte la partie de ${W.name} !` : `Égalité au ${W.name} !`;
    else text = `${W.name} : ${G[g.type].summary ? G[g.type].summary(g) : 'partie terminée'}`;
    S.B.set(duoPath(`msgs/res-${g.id}`), { t: 'sys', from: S.me, game: g.type, gid: g.id, text, at: now() });
  },
  scorebar(g, o) {
    const op = g.players.find(x => x !== S.me);
    if (o.left) return `<div class="score"><div class="side"><span class="pair">${av(S.me, 'sm')}${av(op, 'sm')}</span><div><small>${esc(nm(S.me))} & ${esc(nm(op))}</small></div></div><div class="mid">${o.center || ''}</div><div class="side r"><div><small>${esc(o.label || '')}</small></div></div></div>`;
    const sc = o.scores || {}; const bd = o.badges || {};
    const side = (u, r) => `<div class="side ${r ? 'r' : ''} ${o.turn === u ? 'turn' : ''}">${av(u, 'sm')}<div><small>${u === S.me ? 'Toi' : esc(nm(u))}</small><b>${bd[u] || ''}${sc[u] ?? ''}</b></div></div>`;
    return `<div class="score">${side(S.me)}<div class="mid">${esc(o.label || '')}</div>${side(op, 1)}</div>`;
  },
  reactBar: () => REACTS.map(([k, c]) => `<button class="rb" style="--c:${c}" data-act="react" data-e="${k}">${ic(k)}</button>`).join(''),
};
const G = makeGames(H);

async function newGame(type, opts = {}) {
  const op = partner(); if (!op) { toast("Ton duo n'a pas encore rejoint ton duo Fuseau"); return; }
  const id = rid(); const base = { type, opts, players: [S.me, op], round: 0, phase: '', data: {}, over: false, winner: null, turn: null, by: S.me, created: now(), ts: now() };
  Object.assign(base, G[type].init(base, opts));
  S.ui.sheet = null; S.ui.dev = null;
  await S.B.set(duoPath(`games/${id}`), base);
  S.B.set(duoPath(`msgs/inv-${id}`), { t: 'invite', from: S.me, game: type, gid: id, at: now() });
  sfx('open'); go(`#/partie/${id}`);
}

/* ================= abonnements ================= */
function unsubAll(list) { list.forEach(f => { try { f(); } catch (e) { } }); list.length = 0; }
function handleUser(u) {
  unsubAll(S.subs); unsubAll(S.gsubs);
  Object.assign(S, { user: u, me: u && u.uid, prof: null, profLoaded: false, users: {}, duo: null, code: null, games: [], gamesLoaded: false, msgs: [], results: [], seenMsg: null, g: null });
  if (!u) { render(); return; }
  S.subs.push(S.B.watch(`users/${u.uid}`, p => {
    const first = !S.profLoaded; S.prof = p; S.profLoaded = true;
    if (p && p.duo !== S.code) subDuo(p.duo || null);
    if (first && p && p.name) S.B.merge(`users/${S.me}`, S.B.mode === 'demo' ? { seen: now() } : { seen: now(), tz: myTz() });
    render();
  }));
}
let duoSubs = [];
function subDuo(code) {
  unsubAll(duoSubs); S.code = code; S.duo = null; S.games = []; S.msgs = []; S.results = []; S.seenMsg = null; S.gamesLoaded = false;
  if (!code) return;
  if (routeName() === 'partie') openGame(routeArg());
  let partnerSub = null, partnerId = null;
  duoSubs.push(S.B.watch(`duos/${code}`, d => {
    S.duo = d; const op = partner();
    if (op !== partnerId) { if (partnerSub) partnerSub(); partnerId = op; partnerSub = op ? S.B.watch(`users/${op}`, p => { S.users[op] = p || {}; render(); }) : null; }
    render();
  }));
  duoSubs.push(() => partnerSub && partnerSub());
  duoSubs.push(S.B.watchCol(duoPath('games'), { order: 'ts', dir: 'desc', limit: 30 }, L => { S.games = L; S.gamesLoaded = true; render(); }));
  duoSubs.push(S.B.watchCol(duoPath('results'), { order: 'at', dir: 'desc', limit: 300 }, L => { S.results = L; render(); }));
  duoSubs.push(S.B.watchCol(duoPath('msgs'), { order: 'at', dir: 'desc', limit: 150 }, L => { onMsgs(L.reverse()); }));
  let lastR = now(), lastW = now();
  duoSubs.push(S.B.watch(duoPath('live/react'), d => { if (d && d.from !== S.me && d.at > lastR) { lastR = d.at; if (now() - d.at < 15000) { floatReact(d.e); sfx('tap'); } } }));
  duoSubs.push(S.B.watch(duoPath('live/wizz'), d => { if (d && d.from !== S.me && d.at > lastW) { lastW = d.at; if (now() - d.at < 20000) { shakeScreen(); toast(`${av(d.from, 'xs')} <span>${esc(nm(d.from))} t'envoie un Wizz !</span>`); } } }));
}
function onMsgs(L) {
  const first = S.seenMsg === null; if (first) S.seenMsg = new Set();
  const fresh = [];
  for (const m of L) { if (!S.seenMsg.has(m.id)) { S.seenMsg.add(m.id); if (!first) fresh.push(m); } }
  S.msgs = L;
  for (const m of fresh) {
    if (m.from === S.me) continue;
    if (m.t === 'text' || m.t === 'rdv' || m.t === 'invite') {
      sfx('msg');
      const label = m.t === 'invite' ? `t'invite à jouer à ${WORLDS[m.game] ? WORLDS[m.game].name : 'un jeu'}` : m.t === 'rdv' ? 'te propose un rendez-vous' : m.text;
      if (routeName() !== 'chat') toast(`${av(m.from, 'xs')}<span><b>${esc(nm(m.from))}</b> ${esc(String(label).slice(0, 80))}</span>`, m.t === 'invite' ? 'goto' : 'goto', { h: m.t === 'invite' ? `#/partie/${m.gid}` : '#/chat' });
      notify(nm(m.from), m.t === 'text' ? m.text : label);
    }
  }
  markRead(); render();
}
async function notify(title, body) {
  if (!S.set.notif || !document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return;
  try { const reg = await navigator.serviceWorker.getRegistration(); if (reg) reg.showNotification(title, { body: String(body).slice(0, 120), icon: 'assets/icons/icon-192.png', badge: 'assets/icons/icon-192.png', tag: 'fuseau' }); } catch (e) { }
}
function unread() { const r = (S.prof && S.prof.readAt && S.prof.readAt[S.code]) || 0; return S.msgs.filter(m => m.from !== S.me && m.at > r && m.t !== 'sys').length; }
let readT = 0;
function markRead() { if (routeName() !== 'chat' || document.hidden || !S.msgs.length || !S.code) return; const last = S.msgs[S.msgs.length - 1].at; const r = (S.prof && S.prof.readAt && S.prof.readAt[S.code]) || 0; if (last > r && now() - readT > 1500) { readT = now(); S.B.merge(`users/${S.me}`, { readAt: { [S.code]: last } }); } }

function openGame(id) {
  unsubAll(S.gsubs); S.g = null; S.gp = {}; S.draw = null; S.ui.gLoaded = false; S.ui.mot = null; S.ui.dev = null; S.ui.cq = null;
  if (!id || !S.code) return;
  const base = duoPath(`games/${id}`);
  S.gsubs.push(S.B.watch(base, d => { S.g = d ? Object.assign({ id }, d) : null; S.ui.gLoaded = true; try { LS.set('fuseau-open-' + id, String(now())); } catch (e) { } changed(); }));
  S.gsubs.push(S.B.watchCol(`${base}/p`, {}, L => { S.gp = {}; L.forEach(d => { S.gp[d.id] = d; }); changed(); }));
  S.gsubs.push(S.B.watch(`${base}/x/draw`, d => { S.draw = d; changed(); }));
}
function changed() {
  render(); const g = S.g;
  if (g && !g.over && g.players && g.players.includes(S.me) && G[g.type] && G[g.type].auto) { try { G[g.type].auto(g); } catch (e) { console.error(e); } }
  if (g && g.over && !S.done.has('ofx:' + g.id) && S.ui.gLoaded) { S.done.add('ofx:' + g.id); if (g.winner === S.me || (!g.winner && ['tele', 'cq'].includes(g.type))) setTimeout(() => { confetti(180); sfx('win'); }, 300); }
}

/* ================= écrans ================= */
function topBar(title) {
  return `<header class="top"><div class="brand">${LOGO}<span>${title || 'Fuseau'}</span></div><div class="tacts"><button class="ib" data-act="sound" aria-label="Son">${ic(S.set.sound ? 'sound' : 'mute')}</button><button class="ib" data-act="tab" data-h="#/chat" aria-label="Messages">${ic('chat')}${unread() ? `<span class="badge">${unread()}</span>` : ''}</button></div></header>`;
}
function statusOf(uid) { if (typing(uid)) return 'écrit…'; if (online(uid)) return 'en ligne'; const s = P(uid).seen; return s ? `vu ${ago(s)}` : 'pas encore connecté·e'; }
function gameStatus(g) {
  const m = G[g.type]; let my = false;
  if (m.turn && (g.type === 'ut' || g.type === 'p4')) my = m.turn(g);
  const opened = +(LS.get('fuseau-open-' + g.id) || 0);
  if (g.by !== S.me && !opened) return ['coral', 'Nouveau'];
  if (my) return ['teal', 'À toi'];
  if (g.ts > opened + 1000) return ['mustard', 'Du nouveau'];
  if (g.type === 'ut' || g.type === 'p4') return ['grey', 'Son tour'];
  return ['grey', 'En cours'];
}
function homeView() {
  const op = partner(); const p = S.prof;
  let h = topBar();
  const diff = op && P(op).tz ? tzOff(P(op).tz) - tzOff(p.tz || myTz()) : null;
  h += `<section class="duo"><h1>Salut ${esc(p.name)} !</h1><p class="muted" style="font-weight:700;margin-top:4px">${op ? `${esc(nm(op))} est ${statusOf(op)}` : 'Ton duo n\'a pas encore rejoint Fuseau.'}</p>
  <div class="duo-row"><button class="person" data-act="sheet" data-s="me">${av(S.me, 'lg', true)}<b>Toi</b><small>${esc(p.city || cityOf(p.tz || myTz()))} · ${timeIn(p.tz || myTz())}</small></button>
  <div class="bridge"><svg viewBox="0 0 96 44"><path id="brg" d="M4 40Q48 -8 92 40" fill="none" stroke="#2a2440" stroke-width="2.2" stroke-dasharray="5 6"><animate attributeName="stroke-dashoffset" values="22;0" dur="1s" repeatCount="indefinite"/></path><g><animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto" path="M4 40Q48 -8 92 40"/><path d="M-8 0l14-3 3 3-3 3zM-1-1l-3-7h4l5 7zM-1 1l-3 7h4l5-7z" fill="#f0745f"/></g></svg>${diff !== null ? `<span class="gap">${diff === 0 ? 'même heure' : Math.abs(diff) + ' h d\'écart'}</span>` : ''}</div>
  ${op ? `<button class="person" data-act="sheet" data-s="partner">${av(op, 'lg', true)}<b>${esc(nm(op))}</b><small>${esc(P(op).city || cityOf(P(op).tz))} · ${timeIn(P(op).tz)}</small></button>` : `<button class="person" data-act="share"><span class="av lg"><img src="assets/avatars/peeps-7.svg" style="filter:grayscale(1);opacity:.5"></span><b>?</b><small>Invite ton duo</small></button>`}</div>
  ${op ? `<div class="quick"><button class="btn" data-act="wizz">${ic('vibrate')}Wizz</button><button class="btn" data-act="tab" data-h="#/chat">${ic('chat')}Écrire</button><button class="btn" data-act="sheet" data-s="rdv">${ic('calplus')}Rendez-vous</button></div>` : ''}</section>`;
  if (!op) h += `<div class="card mt"><h2 class="h2">Invite ton duo</h2><p class="muted mt" style="font-weight:600">Envoie-lui ce code (ou le lien). Elle crée son compte, entre le code, et vous êtes connectés.</p><div class="code">${esc(S.code)}</div><div class="actions"><button class="btn primary" data-act="share">${ic('share')} Partager le lien</button></div></div>`;
  const rdv = nextRdv(); if (rdv) h += `<div class="next-rdv">${ic('cal')}<div class="grow"><small class="muted" style="font-weight:800">Prochain rendez-vous</small><b>${esc(fmtWhen(rdv.when, p.tz || myTz()))}</b><small class="muted">${rdv.game && WORLDS[rdv.game] ? WORLDS[rdv.game].name + ' · ' : ''}dans ${esc(ago(2 * now() - rdv.when).replace('il y a ', ''))}</small></div></div>`;
  if (!isStandalone() && !LS.get('fuseau-noinstall')) h += `<div class="install">${ic('install')}<div class="grow"><b class="disp" style="font-size:17px">Installe Fuseau</b><small class="muted" style="display:block;font-weight:700">Sur ton écran d'accueil, comme une vraie appli.</small></div><button class="btn primary sm" data-act="sheet" data-s="install">Voir</button></div>`;
  const live = S.games.filter(g => !g.over && G[g.type]);
  h += `<div class="sect"><h2>Parties en cours</h2>${live.length ? `<button class="link" data-act="tab" data-h="#/jeux">+ Nouvelle</button>` : ''}</div>`;
  if (!S.gamesLoaded) h += `<div class="empty">Chargement…</div>`;
  else if (!live.length) h += `<div class="empty">Aucune partie en cours.<div class="actions"><button class="btn primary" data-act="tab" data-h="#/jeux">${ic('play')} Lancer un jeu</button></div></div>`;
  else h += `<div class="list">${live.slice(0, 8).map(g => { const W = WORLDS[g.type]; const [c, t] = gameStatus(g); return `<button class="item" data-act="goto" data-h="#/partie/${g.id}"><span class="thumb" style="--t:${W.tint}">${W.scene}</span><div class="grow"><b>${esc(W.name)}</b><small>${esc(G[g.type].summary ? G[g.type].summary(g) : '')} · ${ago(g.ts)}</small></div><span class="chip ${c}">${t}</span></button>`; }).join('')}</div>`;
  h += statsHTML();
  h += `<div class="sect"><h2>Envie de jouer ?</h2><button class="link" data-act="tab" data-h="#/jeux">Tous les jeux</button></div><div class="worlds">${['cq', 'tele', 'mot', 'p4'].map(k => worldCard(k)).join('')}</div>`;
  return h;
}
function nextRdv() { return S.msgs.filter(m => m.t === 'rdv' && m.st === 'ok' && m.when > now() - 3600000).sort((a, b) => a.when - b.when)[0] || null; }
function statsHTML() {
  const op = partner(); let a = 0, b = 0, n = 0, te = 0, cq = 0;
  for (const r of S.results) { n++; if (r.w === S.me) a++; else if (r.w && r.w === op) b++; if (r.t === 'tele') te = Math.max(te, r.s || 0); if (r.t === 'cq') cq = Math.max(cq, r.s || 0); }
  return `<div class="sect"><h2>Vos stats</h2><small class="muted" style="font-weight:800">${n} partie${n > 1 ? 's' : ''} jouée${n > 1 ? 's' : ''}</small></div><div class="stats"><div class="stat">${ic('trophy')}<b>${a} – ${b}</b><small>Duels gagnés</small></div><div class="stat">${ic('brain')}<b>${te}/8</b><small>Record télépathie</small></div><div class="stat">${ic('brush')}<b>${cq}</b><small>Record croquis</small></div></div>`;
}
function worldCard(k, wide) { const W = WORLDS[k]; return `<button class="wcard ${wide ? 'wide' : ''}" data-act="goto" data-h="#/monde/${k}"><div class="scene" style="background:${W.tint}">${W.scene}<span class="chip">${esc(W.tag)}</span></div><div class="wt"><h3>${esc(W.name)}</h3><p>${esc(W.pitch)}</p></div></button>`; }
function gamesView() { return topBar('Les jeux') + `<p class="muted" style="font-weight:700;margin:-4px 2px 14px">7 univers à explorer à deux. Touche un monde pour y entrer.</p><div class="worlds">${ORDER.map((k, i) => worldCard(k, i === 0)).join('')}</div>`; }
function worldView(k) {
  const W = WORLDS[k]; if (!W) return homeView(); const op = partner();
  const hist = S.results.filter(r => r.t === k).slice(0, 5);
  const live = S.games.filter(g => g.type === k && !g.over);
  let h = `<div class="whero" style="background:${W.tint}">${W.scene}<button class="ib back" data-act="back">${ic('back')}</button></div><div class="wtitle"><div class="stamp"><small>${esc(W.place)}</small><h1>${esc(W.name)}</h1></div></div>`;
  h += `<p class="center" style="font-weight:700;margin-top:14px;font-size:17px">${esc(W.pitch)}</p><div class="how">${W.how.map(([i, t]) => `<div>${ic(i)}<span>${esc(t)}</span></div>`).join('')}</div>`;
  if (live.length) h += `<div class="actions"><button class="btn world block big" data-act="goto" data-h="#/partie/${live[0].id}">${ic('play')} Reprendre la partie</button></div>`;
  h += `<div class="actions"><button class="btn ${live.length ? 'ghost' : 'world'} block big" data-act="launch" data-t="${k}" ${op ? '' : 'disabled'}>${ic(live.length ? 'plus' : 'play')} ${live.length ? 'Nouvelle partie' : `Jouer avec ${esc(nm(op))}`}</button></div>`;
  if (!op) h += `<p class="hint-txt">Invite d'abord ton duo pour jouer.</p>`;
  else h += `<p class="hint-txt">${online(op) ? `${esc(nm(op))} est en ligne et recevra l'invitation tout de suite.` : `${esc(nm(op))} recevra l'invitation dans le chat et pourra jouer quand ça lui chante.`}</p>`;
  if (hist.length) h += `<div class="sect"><h2>Dernières parties</h2></div><div class="list">${hist.map(r => `<div class="item"><span class="av sm">${r.w ? `<img src="${esc(avatarSrc(r.w))}">` : `<span style="display:grid;place-items:center;width:40px;height:40px;border-radius:14px;background:${W.tint};color:${W.dark}">${ic(W.icon)}</span>`}</span><div class="grow"><b>${r.w ? (r.w === S.me ? 'Victoire !' : `Victoire de ${esc(nm(r.w))}`) : r.s !== undefined ? `Score : ${r.s}` : 'Égalité'}</b><small>${ago(r.at)}</small></div></div>`).join('')}</div>`;
  return h;
}
function partieView(id) {
  const g = S.g;
  if (!g || g.id !== id) return { html: `<div class="spin"></div>${S.ui.gLoaded ? `<p class="center muted" style="font-weight:700">Partie introuvable.</p><div class="actions"><button class="btn" data-act="tab" data-h="#/">Retour</button></div>` : ''}` };
  const W = WORLDS[g.type], m = G[g.type];
  let body;
  if (g.over && m.over) { const o = m.over(g); body = `<div class="over card ${o.win ? 'win' : ''}" data-k="over-${g.id}"><div class="over-ic">${ic(o.icon)}</div><h2>${esc(o.t)}</h2><p class="sub">${o.raw ? o.sub : esc(o.sub)}</p>${o.board ? `<div class="mt2" style="pointer-events:none">${m.view(g)}</div>` : ''}${o.list ? `<div class="dlist">${o.list}</div>` : ''}<div class="actions"><button class="btn world" data-act="again">${ic('undo')} Revanche</button><button class="btn ghost" data-act="tab" data-h="#/">Accueil</button></div></div>`; }
  else body = m.view(g);
  const html = `<div class="gbar"><button class="ib" data-act="back">${ic('back')}</button><div class="gname">${ic(W.icon)} ${esc(W.name)}</div><div class="tacts"><button class="ib" data-act="sheet" data-s="how" aria-label="Règles">${ic('question')}</button><button class="ib" data-act="sound">${ic(S.set.sound ? 'sound' : 'mute')}</button></div></div><div class="banner">${W.scene}</div><div data-k="${g.over ? 'o' : 'p'}-${g.id}-${g.round || 0}-${g.phase}">${body}</div>`;
  const key = g.over ? `over-${g.id}` : `g-${g.id}-${m.key ? m.key(g) : ''}`;
  return { html, key, after: () => m.after && !g.over && m.after(g), update: () => m.update && !g.over && m.update(g) };
}
function chatView() {
  const op = partner(); const me = S.me; const p = S.prof;
  let h = `<div class="chat-h">${op ? av(op, 'md', true) : ''}<div class="grow"><b>${op ? esc(nm(op)) : 'Messages'}</b><small class="${online(op) ? 'on' : ''}">${op ? (typing(op) ? 'écrit…' : statusOf(op) + (P(op).tz ? ` · ${timeIn(P(op).tz)} là-bas` : '')) : 'Invite ton duo pour discuter'}</small></div><button class="ib" data-act="sheet" data-s="rdv" aria-label="Rendez-vous">${ic('calplus')}</button></div><div class="msgs" id="msgs">`;
  if (!S.msgs.length) h += `<div class="empty mt">Pas encore de message. Dis bonjour !</div>`;
  let lastDay = '';
  for (const m of S.msgs) {
    const day = new Date(m.at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (day !== lastDay) { h += `<div class="day">${esc(day)}</div>`; lastDay = day; }
    const mine = m.from === me, side = mine ? 'me' : 'them', t = fmtHour(m.at);
    if (m.t === 'text') h += `<div class="msg ${side}" data-k="m-${m.id}">${esc(m.text)}<time>${t}</time></div>`;
    else if (m.t === 'invite') { const W = WORLDS[m.game]; if (!W) continue; const g = S.games.find(x => x.id === m.gid); const done = g && g.over; h += `<div class="mcard ${side}" data-k="m-${m.id}"><div class="sc" style="background:${W.tint}">${W.scene}</div><div class="mc"><small>${mine ? 'Tu as lancé une partie' : `${esc(nm(m.from))} t'invite à jouer`} · ${t}</small><b>${esc(W.name)}</b><div class="actions"><button class="btn ${done ? 'ghost' : 'primary'} sm" data-act="goto" data-h="#/partie/${m.gid}">${done ? 'Voir le résultat' : mine ? 'Ouvrir' : ic('play') + ' Jouer'}</button></div></div></div>`; }
    else if (m.t === 'rdv') {
      const W = WORLDS[m.game]; const optz = op && P(op).tz;
      h += `<div class="mcard ${side}" data-k="m-${m.id}-${m.st}"><div class="mc"><small>${mine ? 'Tu proposes un rendez-vous' : `${esc(nm(m.from))} propose un rendez-vous`} · ${t}</small><b>${W ? esc(W.name) : 'On joue ensemble !'}</b><div class="rdv-when">${ic('cal')} ${esc(fmtWhen(m.when, p.tz || myTz()))}</div>${optz ? `<small>Soit ${esc(fmtWhen(m.when, optz))} pour ${esc(nm(op))}</small>` : ''}${m.note ? `<p style="margin-top:6px;font-weight:600">« ${esc(m.note)} »</p>` : ''}<div class="actions">`;
      if (m.st === 'ok') h += `<span class="chip teal">${ic('check')} Accepté</span><button class="btn ghost sm" data-act="ics" data-id="${m.id}">${ic('download')} Agenda</button>`;
      else if (m.st === 'no') h += `<span class="chip grey">Refusé</span>`;
      else if (mine) h += `<span class="chip mustard">En attente de réponse</span>`;
      else h += `<button class="btn teal sm" data-act="rdvans" data-id="${m.id}" data-v="ok">${ic('check')} Accepter</button><button class="btn ghost sm" data-act="rdvans" data-id="${m.id}" data-v="no">Refuser</button>`;
      h += `</div></div></div>`;
    }
    else if (m.t === 'sys') h += `<div class="sysmsg" data-k="m-${m.id}">${ic('trophy')}<span>${esc(m.text)}</span></div>`;
    else if (m.t === 'wizz') h += `<div class="sysmsg" data-k="m-${m.id}">${ic('vibrate')}<span>${mine ? 'Tu as envoyé un Wizz' : `${esc(nm(m.from))} t'a envoyé un Wizz`} · ${t}</span></div>`;
  }
  h += `</div><form class="composer" data-form="msg"><button type="button" class="btn ghost sq" data-act="sheet" data-s="plus" aria-label="Plus">${ic('plus')}</button><input class="field grow" name="t" id="msgIn" maxlength="500" autocomplete="off" placeholder="${op ? 'Écris à ' + esc(nm(op)) + '…' : 'Message…'}" ${op ? '' : 'disabled'}><button class="btn primary sq" ${op ? '' : 'disabled'} aria-label="Envoyer">${ic('send')}</button></form>`;
  return { html: h, after: () => scrollChat(true), update: () => scrollChat(false) };
}
let lastMsgCount = 0;
function scrollChat(force) { if (force || S.msgs.length !== lastMsgCount) { lastMsgCount = S.msgs.length; requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: force ? 'auto' : 'smooth' })); } }
function profileCard(uid) {
  const p = uid === S.me ? S.prof : P(uid); const tz = p.tz || (uid === S.me ? myTz() : '');
  const facts = [];
  if (p.city || tz) facts.push(`<span class="chip">${ic('globe')} ${esc(p.city || cityOf(tz))} · ${timeIn(tz)}</span>`);
  if (p.bday) { const d = new Date(p.bday + 'T12:00:00'); facts.push(`<span class="chip coral">${ic('cake')} ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>`); }
  if (p.fav && WORLDS[p.fav]) facts.push(`<span class="chip teal">${ic('heart')} ${esc(WORLDS[p.fav].name)}</span>`);
  if (uid !== S.me) facts.push(`<span class="chip grey">${esc(statusOf(uid))}</span>`);
  return `<div class="profile-card">${av(uid, 'xl', uid !== S.me)}<h2>${esc(p.name || '')}</h2>${p.bio ? `<p class="bio">« ${esc(p.bio)} »</p>` : ''}<div class="facts">${facts.join('')}</div></div>`;
}
function profilView() {
  const op = partner();
  let h = topBar('Profil') + `<div class="card">${profileCard(S.me)}<div class="actions"><button class="btn primary" data-act="editprof">${ic('pencil')} Modifier mon profil</button></div></div>`;
  h += `<div class="sect"><h2>Mon duo</h2></div><div class="card">`;
  if (op) h += `<button class="item" style="box-shadow:none;border:0;padding:0" data-act="sheet" data-s="partner">${av(op, 'md', true)}<div class="grow"><b>${esc(nm(op))}</b><small>${esc(statusOf(op))}</small></div>${ic('next')}</button>`;
  else h += `<p style="font-weight:700">Ton duo n'a pas encore rejoint.</p>`;
  h += `<div class="set"><span>Code du duo</span><b class="disp" style="letter-spacing:.12em;color:var(--pri-d)">${esc(S.code)}</b></div><div class="actions" style="justify-content:flex-start"><button class="btn ghost sm" data-act="share">${ic('share')} Partager l'invitation</button></div></div>`;
  h += `<div class="sect"><h2>Réglages</h2></div><div class="card" style="padding:4px 16px">
  <div class="set"><span class="row">${ic('sound')} Sons</span><button class="tog ${S.set.sound ? 'on' : ''}" data-act="setting" data-k="sound"></button></div>
  <div class="set"><span class="row">${ic('vibrate')} Vibrations</span><button class="tog ${S.set.vib ? 'on' : ''}" data-act="setting" data-k="vib"></button></div>
  <div class="set"><span class="row">${ic('bell')} Notifications</span><button class="tog ${S.set.notif ? 'on' : ''}" data-act="setting" data-k="notif"></button></div>
  <div class="set"><span class="row">${ic('install')} Installer l'appli</span><button class="btn ghost sm" data-act="sheet" data-s="install">Comment ?</button></div>
  <div class="set"><span class="row">${ic('info')} Crédits & licences</span><button class="btn ghost sm" data-act="sheet" data-s="credits">Voir</button></div></div>`;
  h += `<div class="actions mt2">${S.B.mode === 'demo' ? `<button class="btn ghost" data-act="resetdemo">${ic('trash')} Réinitialiser la démo</button>` : `<button class="btn ghost" data-act="logout">${ic('out')} Se déconnecter</button>`}<button class="btn ghost" data-act="leaveduo">${ic('door')} Quitter le duo</button></div>`;
  return h;
}
function authView() {
  const m = S.ui.auth || 'welcome';
  let h = `<div class="auth"><div class="auth-hero">${HERO}</div><h1>Fuseau</h1><p class="sub">Des jeux à deux, peu importe les kilomètres<br>et les fuseaux horaires.</p>`;
  if (m === 'welcome') h += `<div class="col mt2"><button class="btn primary big block" data-act="auth" data-m="signup">Créer mon compte</button><button class="btn ghost big block" data-act="auth" data-m="login">J'ai déjà un compte</button></div>`;
  else {
    const t = { signup: ['Créer mon compte', 'Choisis un mot de passe (6 caractères min.)'], login: ['Connexion', 'Mot de passe'], reset: ['Mot de passe oublié', ''] }[m];
    h += `<form class="card mt2" data-form="${m}"><h2 class="h2">${t[0]}</h2><label class="lbl">E-mail</label><input class="field" type="email" name="email" autocomplete="email" required>${m !== 'reset' ? `<label class="lbl">${t[1]}</label><input class="field" type="password" name="pw" minlength="6" autocomplete="${m === 'signup' ? 'new-password' : 'current-password'}" required>` : '<p class="muted mt" style="font-weight:600">On t\'envoie un lien pour en choisir un nouveau.</p>'}${S.ui.err ? `<div class="err">${esc(S.ui.err)}</div>` : ''}<button class="btn primary block mt2" ${S.ui.busy ? 'disabled' : ''}>${S.ui.busy ? 'Un instant…' : t[0]}</button></form>
    <div class="actions">${m === 'login' ? `<button class="link" data-act="auth" data-m="reset">Mot de passe oublié ?</button>` : ''}<button class="link" data-act="auth" data-m="${m === 'signup' ? 'login' : 'signup'}">${m === 'signup' ? "J'ai déjà un compte" : 'Créer un compte'}</button></div>`;
  }
  return h + '</div>';
}
function editProfileView(first) {
  const p = S.prof || {}; const f = S.ui.pf || (S.ui.pf = { avatar: p.avatar || { t: 'preset', id: AVATARS[Math.random() * 12 | 0] }, col: p.col || COLORS[0], tab: p.avatar && p.avatar.t === 'photo' ? 'photo' : 'adv' });
  const cur = f.avatar.t === 'photo' ? f.avatar.d : `assets/avatars/${f.avatar.id}.svg`;
  let h = `<div class="gbar">${first ? '<span></span>' : `<button class="ib" data-act="canceledit">${ic('x')}</button>`}<div class="gname" style="color:var(--ink)">${first ? 'Crée ton profil' : 'Mon profil'}</div><span style="width:42px"></span></div>`;
  h += `<form data-form="profile"><div class="center"><span class="av xl" style="--rc:${esc(f.col)}"><img src="${esc(cur)}" alt=""></span></div>`;
  h += `<div class="tabs">${AV_TABS.map(([k, l]) => `<button type="button" class="${f.tab === k ? 'on' : ''}" data-act="avtab" data-t="${k}">${l}</button>`).join('')}</div>`;
  if (f.tab === 'photo') h += `<div class="card mt center"><p style="font-weight:700">Choisis une photo de toi.</p><p class="muted small" style="font-weight:600;margin-top:4px">Elle est recadrée en carré et allégée automatiquement.</p><label class="btn primary mt" style="display:inline-flex">${ic('camera')} Choisir une photo<input type="file" accept="image/*" id="photoIn" hidden></label></div>`;
  else h += `<div class="avgrid">${AVATARS.filter(a => a.startsWith(f.tab + '-')).map(a => `<button type="button" class="${f.avatar.id === a ? 'on' : ''}" data-act="avpick" data-id="${a}"><img src="assets/avatars/${a}.svg" alt="" loading="lazy"></button>`).join('')}</div>`;
  h += `<label class="lbl">Ton prénom ou pseudo</label><input class="field" name="name" maxlength="18" required value="${esc(p.name || '')}" placeholder="Ex. Aye">`;
  h += `<label class="lbl">Ta couleur</label><div class="cols">${COLORS.map(c => `<button type="button" class="${f.col === c ? 'on' : ''}" style="--c:${c}" data-act="colpick" data-c="${c}"></button>`).join('')}</div>`;
  h += `<label class="lbl">Ta ville</label><input class="field" name="city" maxlength="30" value="${esc(p.city || cityOf(myTz()))}">`;
  h += `<label class="lbl">Ta devise <span class="muted">(facultatif)</span></label><input class="field" name="bio" maxlength="90" value="${esc(p.bio || '')}" placeholder="Une phrase qui te ressemble">`;
  h += `<label class="lbl">Ton anniversaire <span class="muted">(facultatif)</span></label><input class="field" type="date" name="bday" value="${esc(p.bday || '')}">`;
  h += `<label class="lbl">Ton jeu préféré</label><select class="field" name="fav"><option value="">—</option>${ORDER.map(k => `<option value="${k}" ${p.fav === k ? 'selected' : ''}>${esc(WORLDS[k].name)}</option>`).join('')}</select>`;
  h += `<button class="btn primary big block mt2">${first ? "C'est parti" : 'Enregistrer'}</button></form>`;
  return h;
}
function duoSetupView() {
  const code = S.ui.joinCode || new URLSearchParams(location.search).get('duo') || '';
  return `<div class="center mt2">${av(S.me, 'xl')}<h1 class="h1 mt">Bienvenue ${esc(S.prof.name)} !</h1><p class="muted mt" style="font-weight:700">Dernière étape : relier ton compte à celui de ton duo.</p></div>
  <form class="card mt2" data-form="joinduo"><h2 class="h2">${ic('link')} J'ai reçu un code</h2><input class="field mt" name="code" maxlength="6" value="${esc(code.toUpperCase())}" placeholder="EX. K7P2QX" style="text-transform:uppercase;letter-spacing:.2em;font-family:'Baloo 2';font-size:24px;text-align:center" required>${S.ui.err ? `<div class="err">${esc(S.ui.err)}</div>` : ''}<button class="btn primary block mt">Rejoindre le duo</button></form>
  <div class="card mt"><h2 class="h2">${ic('plus')} Je crée notre duo</h2><p class="muted mt" style="font-weight:600">Tu obtiens un code à envoyer à ton duo.</p><button class="btn ghost block mt" data-act="createduo">Créer un duo</button></div>`;
}
/* ---------- feuilles (bottom sheets) ---------- */
function sheetHTML() {
  const s = S.ui.sheet; if (!s) return '';
  const op = partner(); let h = '';
  if (s === 'how' && S.g) { const W = WORLDS[S.g.type]; h = `<div style="border-radius:22px;overflow:hidden;height:140px;background:${W.tint}">${W.scene}</div><h2 class="mt">${esc(W.name)}</h2><div class="how" style="--w-acc:${W.accent};--w-tint:${W.tint}">${W.how.map(([i, t]) => `<div>${ic(i)}<span>${esc(t)}</span></div>`).join('')}</div><div class="actions"><button class="btn world block" data-act="closesheet">C'est parti !</button></div>`; }
  else if (s === 'setup') { const k = S.ui.setupType; const isDev = k === 'dev'; const cats = isDev ? Object.entries(DEVCATS).map(([c, v]) => [c, v.e, v.n, v.c, v.d]) : Object.entries(DECKS).map(([c, v]) => [c, v.e, v.n, v.c, v.cards.length + ' cartes']); h = `<h2>${isDev ? 'Choisis une catégorie' : 'Choisis un paquet'}</h2><div class="catg">${cats.map(([c, e, n, col, d]) => `<button class="cat" style="--c:${col}" data-act="setupcat" data-c="${c}">${ic(e)}<b>${esc(n)}</b><small>${esc(d)}</small></button>`).join('')}</div>`; }
  else if (s === 'partner' && op) h = `${profileCard(op)}<div class="actions"><button class="btn primary" data-act="tab" data-h="#/chat">${ic('chat')} Écrire</button><button class="btn ghost" data-act="wizz">${ic('vibrate')} Wizz</button></div>`;
  else if (s === 'me') h = `${profileCard(S.me)}<div class="actions"><button class="btn primary" data-act="editprof">${ic('pencil')} Modifier</button></div>`;
  else if (s === 'rdv') {
    const t0 = new Date(); const pad = n => String(n).padStart(2, '0'); const loc = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; const d = new Date(t0.getTime() + 2 * 3600000); d.setMinutes(0, 0, 0); const ds = loc(t0), dd = loc(d), hh = `${pad(d.getHours())}:00`;
    h = `<h2>${ic('calplus')} Proposer un rendez-vous</h2><p class="muted mt" style="font-weight:600">Choisis l'heure chez toi, ${esc(op ? nm(op) : 'ton duo')} la verra à son heure.</p><form data-form="rdv"><div class="row mt"><div class="grow"><label class="lbl">Jour</label><input class="field" type="date" name="d" value="${dd}" min="${ds}" required></div><div style="width:42%"><label class="lbl">Heure (chez toi)</label><input class="field" type="time" name="h" value="${hh}" required></div></div><p class="muted small mt" id="rdvPrev" style="font-weight:700"></p><label class="lbl">Pour jouer à…</label><select class="field" name="g"><option value="">On verra sur le moment</option>${ORDER.map(k => `<option value="${k}">${esc(WORLDS[k].name)}</option>`).join('')}</select><label class="lbl">Un petit mot <span class="muted">(facultatif)</span></label><input class="field" name="n" maxlength="120" placeholder="Prépare-toi à perdre…"><button class="btn primary block big mt2" ${op ? '' : 'disabled'}>${ic('send')} Envoyer la proposition</button></form>`;
  }
  else if (s === 'plus') h = `<h2>Envoyer…</h2><div class="col mt"><button class="btn block" data-act="sheet" data-s="rdv">${ic('calplus')} Une proposition de rendez-vous</button><button class="btn block" data-act="sheet" data-s="invite">${ic('games')} Une invitation à jouer</button><button class="btn block" data-act="wizz">${ic('vibrate')} Un Wizz</button></div><div class="reacts">${H.reactBar()}</div>`;
  else if (s === 'invite') h = `<h2>Inviter à jouer</h2><div class="worlds mt">${ORDER.map(k => { const W = WORLDS[k]; return `<button class="wcard" data-act="launch" data-t="${k}"><div class="scene" style="background:${W.tint};height:80px">${W.scene}</div><div class="wt"><h3 style="font-size:16px">${esc(W.name)}</h3></div></button>`; }).join('')}</div>`;
  else if (s === 'install') { const ios = /iphone|ipad|ipod/i.test(navigator.userAgent); h = `<h2>${ic('install')} Installer Fuseau</h2>${S.installEvt ? `<div class="actions"><button class="btn primary big block" data-act="install">${ic('download')} Installer maintenant</button></div>` : ''}<div class="how" style="--w-acc:var(--pri);--w-tint:#f1edfd">${ios ? `<div>${ic('share')}<span>Dans Safari, touche le bouton <b>Partager</b> en bas.</span></div><div>${ic('plus')}<span>Choisis <b>Sur l'écran d'accueil</b>.</span></div><div>${ic('check')}<span>Touche <b>Ajouter</b> : Fuseau apparaît comme une appli.</span></div>` : `<div>${ic('dots')}<span>Dans Chrome, ouvre le menu <b>⋮</b> en haut à droite.</span></div><div>${ic('download')}<span>Choisis <b>Installer l'application</b> (ou « Ajouter à l'écran d'accueil »).</span></div><div>${ic('check')}<span>Confirme : Fuseau s'ouvre en plein écran, comme une appli.</span></div>`}</div><div class="actions"><button class="btn ghost" data-act="noinstall">Ne plus afficher</button></div>`; }
  else if (s === 'credits') h = `<h2>Crédits</h2><div class="col mt" style="font-weight:600;font-size:14.5px;line-height:1.5"><p><b>Avatars</b> : générés avec DiceBear. « Adventurer » de Lisa Wischofsky, « Big Smile » d'Ashley Seo et « Micah » de Micah Lanier (CC BY 4.0) ; « Open Peeps » de Pablo Stanley (CC0).</p><p><b>Icônes</b> : Phosphor Icons (licence MIT).</p><p><b>Polices</b> : Baloo 2 et Nunito (SIL Open Font License).</p><p><b>Sons</b> : Kenney (kenney.nl), starter kits sous licence MIT.</p><p><b>Illustrations des univers</b> : créées pour Fuseau.</p></div>`;
  else if (s === 'confirm') { const c = S.ui.confirm || {}; h = `<h2>${esc(c.t)}</h2><p class="muted mt" style="font-weight:600">${esc(c.s)}</p><div class="actions"><button class="btn coral" data-act="confirmok">${esc(c.ok || 'Confirmer')}</button><button class="btn ghost" data-act="closesheet">Annuler</button></div>`; }
  if (!h) return '';
  return `<div class="ov" data-act="ovbg"><div class="sheet" data-k="sh-${s}">${h}</div></div>`;
}

/* ================= rendu ================= */
function morph(from, to) {
  const fc = [...from.childNodes], tc = [...to.childNodes];
  for (let i = 0; i < tc.length; i++) {
    const t = tc[i], f = fc[i];
    if (!f) { from.appendChild(t); continue; }
    if (f.nodeType !== t.nodeType || f.nodeName !== t.nodeName || (f.nodeType === 1 && (f.getAttribute('data-k') || '') !== (t.getAttribute('data-k') || ''))) { from.replaceChild(t, f); continue; }
    if (f.nodeType !== 1) { if (f.nodeValue !== t.nodeValue) f.nodeValue = t.nodeValue; continue; }
    if (f.nodeName.toLowerCase() === 'svg') { if (f.outerHTML !== t.outerHTML) from.replaceChild(t, f); continue; }
    for (const a of [...f.attributes]) if (!t.hasAttribute(a.name)) f.removeAttribute(a.name);
    for (const a of [...t.attributes]) if (f.getAttribute(a.name) !== a.value) f.setAttribute(a.name, a.value);
    if (['INPUT', 'TEXTAREA', 'SELECT', 'CANVAS'].includes(f.tagName)) continue;
    morph(f, t);
  }
  for (let i = fc.length - 1; i >= tc.length; i--) from.removeChild(fc[i]);
}
function screen() {
  if (!S.B) return { html: '<div class="spin"></div>', k: 'load' };
  if (S.user === null) return { html: authView(), k: 'auth-' + (S.ui.auth || 'w') };
  if (!S.profLoaded) return { html: '<div class="spin"></div>', k: 'load' };
  if (!S.prof || !S.prof.name) return { html: editProfileView(true), k: 'pf1' };
  if (S.ui.editing) return { html: editProfileView(false), k: 'pf' };
  if (!S.prof.duo) return { html: duoSetupView(), k: 'duo' };
  const r = routeName();
  if (r === 'partie') { const v = partieView(routeArg()); return Object.assign(v, { k: 'partie-' + routeArg(), world: S.g && S.g.type, nav: false }); }
  if (r === 'monde') return { html: worldView(routeArg()), k: 'monde-' + routeArg(), world: routeArg(), nav: false };
  if (r === 'jeux') return { html: gamesView(), k: 'jeux', nav: true };
  if (r === 'chat') return Object.assign(chatView(), { k: 'chat', nav: true });
  if (r === 'profil') return { html: profilView(), k: 'profil', nav: true };
  return { html: homeView(), k: 'home', nav: true };
}
let rq = false;
function render() { if (rq) return; rq = true; requestAnimationFrame(() => { rq = false; try { doRender(); } catch (e) { console.error(e); } }); }
function doRender() {
  const sc = screen(); const view = $('#view');
  const W = sc.world && WORLDS[sc.world];
  document.body.classList.toggle('inworld', !!W);
  if (W) { const b = document.body.style; b.setProperty('--w-tint', W.tint); b.setProperty('--w-acc', W.accent); b.setProperty('--w-dark', W.dark); }
  const wrap = document.createElement('div'); wrap.innerHTML = `<div class="screen" data-k="${esc(sc.k)}">${sc.html}</div>`;
  const key = sc.k + '|' + (sc.key || '');
  if (key !== S.key) { S.cleanup.forEach(f => f()); S.cleanup = []; }
  const changedKey = key !== S.key; S.key = key;
  morph(view, wrap);
  if (changedKey) { if (sc.after) sc.after(); window.scrollTo(0, routeName() === 'chat' ? document.body.scrollHeight : 0); }
  else if (sc.update) sc.update();
  const r = routeName();
  const nav = sc.nav ? `<nav class="nav">${[['home', '#/', 'Accueil'], ['games', '#/jeux', 'Jeux'], ['chat', '#/chat', 'Chat'], ['user', '#/profil', 'Profil']].map(([i, h, l]) => { const on = (h === '#/' && r === 'home') || h === '#/' + r; const b = i === 'chat' && unread() ? `<span class="badge">${unread()}</span>` : ''; return `<button class="${on ? 'on' : ''}" data-act="tab" data-h="${h}">${ic(i)}${l}${b}</button>`; }).join('')}</nav>` : '';
  const nv = $('#nav'); if (nv.innerHTML !== nav) nv.innerHTML = nav;
  const ov = $('#ov'), oh = sheetHTML(); if (ov.innerHTML !== oh) { if (!oh) ov.innerHTML = ''; else { const t = document.createElement('div'); t.innerHTML = oh; morph(ov, t); } }
  const demo = $('#demo');
  if (S.B && S.B.mode === 'demo') { document.body.classList.add('has-demo'); const dh = `<span>Mode démo</span><button class="${S.me === 'demo-1' ? 'on' : ''}" data-act="demoas" data-u="demo-1">${esc(P('demo-1').name || (S.me === 'demo-1' && S.prof ? S.prof.name : 'Joueur 1'))}</button><button class="${S.me === 'demo-2' ? 'on' : ''}" data-act="demoas" data-u="demo-2">${esc(P('demo-2').name || (S.me === 'demo-2' && S.prof ? S.prof.name : 'Joueur 2'))}</button>`; if (demo.innerHTML !== dh) demo.innerHTML = dh; demo.hidden = false; }
}

/* ================= actions ================= */
const ACT = {
  tab: d => { S.ui.sheet = null; sfx('tap'); go(d.h); },
  goto: d => { S.ui.sheet = null; sfx('open'); go(d.h); },
  back: () => { sfx('back'); if (history.length > 1 && S.navCount > 1) history.back(); else go('#/'); },
  sound: () => { S.set.sound = !S.set.sound; saveSet(); sfx('tap'); render(); },
  setting: async d => { const k = d.k; if (k === 'notif' && !S.set.notif) { if (!('Notification' in window)) { toast("Ton téléphone ne permet pas les notifications ici. Installe d'abord l'appli."); return; } const p = await Notification.requestPermission(); if (p !== 'granted') { toast('Notifications refusées dans les réglages du téléphone'); return; } } S.set[k] = !S.set[k]; saveSet(); sfx('tap'); render(); },
  sheet: d => { S.ui.sheet = d.s; sfx('tap'); render(); if (d.s === 'rdv') setTimeout(rdvPreview, 50); },
  closesheet: () => { S.ui.sheet = null; render(); },
  ovbg: (d, t, e) => { if (e.target === t) { S.ui.sheet = null; render(); } },
  launch: d => { const W = G[d.t]; if (W.setup) { S.ui.setupType = d.t; S.ui.sheet = 'setup'; sfx('tap'); render(); } else newGame(d.t); },
  setupcat: d => newGame(S.ui.setupType, { cat: d.c }),
  again: () => { const g = S.g; newGame(g.type, g.opts || {}); },
  next: () => { const g = S.g; G[g.type].next(g); sfx('tap'); },
  teleok: () => G.tele.ok(S.g),
  devs: d => { const g = S.g; S.ui.dev = { k: g.id + g.round, s: +d.i }; sfx('tap'); render(); },
  devg: d => { const g = S.g, u = S.ui.dev; if (!u) return; H.mine({ a: { r: g.round, v: { s: u.s, g: +d.i } } }); sfx('send'); },
  devback: () => { S.ui.dev = null; render(); },
  cqpick: d => G.cq.pick(S.g, +d.w),
  cqcol: d => { S.ui.cqc = d.c; sfx('tap'); render(); }, cqw: d => { S.ui.cqw = +d.w; sfx('tap'); render(); },
  cqundo: () => { const c = S.ui.cq; if (c && c.mine) { c.mine.pop(); c.redraw(); c.flush(); sfx('back'); } },
  cqclear: () => { const c = S.ui.cq; if (c && c.mine) { c.mine.length = 0; c.redraw(); c.flush(); sfx('back'); } },
  cqskip: () => G.cq.end(S.g, false),
  mk: d => G.mot.key(S.g, d.k),
  ut: d => G.ut.play(S.g, +d.k),
  p4: d => G.p4.play(S.g, +d.c),
  canext: () => { H.patch({ data: { i: S.g.data.i + 1 } }); sfx('place'); },
  caprev: () => { if (S.g.data.i > 0) H.patch({ data: { i: S.g.data.i - 1 } }); sfx('back'); },
  cashuffle: () => H.patch({ data: { order: shuffle(S.g.data.order), i: 0 } }),
  cadeck: () => { S.ui.cadeck = true; S.ui.setupType = 'cartes'; S.ui.sheet = 'setup'; render(); },
  react: d => { floatReact(d.e); sfx('tap'); S.B.set(duoPath('live/react'), { from: S.me, e: d.e, at: now() }); if (S.ui.sheet === 'plus') { S.ui.sheet = null; render(); } },
  wizz: () => { if (!partner()) return; shakeScreen(); S.B.set(duoPath('live/wizz'), { from: S.me, at: now() }); S.B.add(duoPath('msgs'), { t: 'wizz', from: S.me, at: now() }); S.ui.sheet = null; render(); },
  rdvans: d => { S.B.merge(duoPath(`msgs/${d.id}`), { st: d.v }); sfx(d.v === 'ok' ? 'coin' : 'tap'); if (d.v === 'ok') confetti(60); },
  ics: d => { const m = S.msgs.find(x => x.id === d.id); if (!m) return; const f = t => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); const W = WORLDS[m.game]; const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fuseau//FR', 'BEGIN:VEVENT', `UID:${m.id}@fuseau`, `DTSTAMP:${f(now())}`, `DTSTART:${f(m.when)}`, `DTEND:${f(m.when + 3600000)}`, `SUMMARY:Fuseau avec ${nm(partner())}${W ? ' · ' + W.name : ''}`, 'BEGIN:VALARM', 'TRIGGER:-PT10M', 'ACTION:DISPLAY', 'DESCRIPTION:Fuseau', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'fuseau-rdv.ics'; a.click(); },
  share: async () => { const url = location.origin + location.pathname + '?duo=' + S.code; const text = `Rejoins-moi sur Fuseau pour jouer ensemble ! Code du duo : ${S.code}`; try { if (navigator.share) { await navigator.share({ title: 'Fuseau', text, url }); return; } } catch (e) { return; } try { await navigator.clipboard.writeText(text + '\n' + url); toast('Lien copié !'); } catch (e) { toast('Code : ' + S.code); } },
  install: async () => { const e = S.installEvt; if (!e) return; e.prompt(); try { await e.userChoice; } catch (x) { } S.installEvt = null; S.ui.sheet = null; render(); },
  noinstall: () => { try { LS.set('fuseau-noinstall', '1'); } catch (e) { } S.ui.sheet = null; render(); },
  auth: d => { S.ui.auth = d.m; S.ui.err = ''; sfx('tap'); render(); },
  editprof: () => { S.ui.sheet = null; S.ui.pf = null; S.ui.editing = true; render(); },
  canceledit: () => { S.ui.editing = false; S.ui.pf = null; render(); },
  avtab: d => { S.ui.pf.tab = d.t; sfx('tap'); render(); },
  avpick: d => { S.ui.pf.avatar = { t: 'preset', id: d.id }; sfx('pop'); render(); },
  colpick: d => { S.ui.pf.col = d.c; sfx('tap'); render(); },
  createduo: async () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const code = Array.from({ length: 6 }, () => A[Math.random() * A.length | 0]).join(''); try { await S.B.set(`duos/${code}`, { members: [S.me], at: now() }); await S.B.merge(`users/${S.me}`, { duo: code }); sfx('coin'); } catch (e) { S.ui.err = 'Impossible de créer le duo : ' + (e.code || e.message); render(); } },
  leaveduo: () => { S.ui.confirm = { t: 'Quitter le duo ?', s: 'Tu ne verras plus vos parties ni vos messages. Tu pourras rejoindre un duo avec un code.', ok: 'Quitter', a: 'doleave' }; S.ui.sheet = 'confirm'; render(); },
  doleave: async () => { const d = S.duo; if (d && d.members) await S.B.merge(`duos/${S.code}`, { members: d.members.filter(m => m !== S.me) }).catch(() => { }); await S.B.merge(`users/${S.me}`, { duo: null }); go('#/'); },
  logout: () => { S.ui.confirm = { t: 'Se déconnecter ?', s: 'Tu pourras te reconnecter avec ton e-mail et ton mot de passe.', ok: 'Déconnexion', a: 'dologout' }; S.ui.sheet = 'confirm'; render(); },
  dologout: () => S.B.signOut(),
  confirmok: () => { const a = S.ui.confirm && S.ui.confirm.a; S.ui.sheet = null; S.ui.confirm = null; render(); a && ACT[a](); },
  demoas: d => { S.B.switchUser(d.u); S.ui.sheet = null; S.done = new Set(); if (routeName() === 'partie') openGame(routeArg()); },
  resetdemo: () => { S.B.resetDemo(); LS.del('fuseau-demo-seeded'); location.reload(); },
};
const FORMS = {
  tele: f => { const v = f.v.value.trim(); if (v) G.tele.submit(S.g, v); },
  cq: f => { const v = f.v.value.trim(); if (!v) return; f.v.value = ''; G.cq.guess(S.g, v); },
  msg: f => { const v = f.t.value.trim(); if (!v) return; f.t.value = ''; S.B.add(duoPath('msgs'), { t: 'text', from: S.me, text: v.slice(0, 500), at: now() }); sfx('send'); },
  rdv: f => { const when = new Date(`${f.d.value}T${f.h.value}`).getTime(); if (!when || when < now() - 60000) { toast('Choisis une date à venir'); return; } S.B.add(duoPath('msgs'), { t: 'rdv', from: S.me, when, game: f.g.value || null, note: f.n.value.trim().slice(0, 120), st: 'open', at: now() }); S.ui.sheet = null; sfx('send'); toast('Proposition envoyée'); go('#/chat'); },
  signup: f => authDo(() => S.B.signUp(f.email.value.trim(), f.pw.value)),
  login: f => authDo(() => S.B.signIn(f.email.value.trim(), f.pw.value)),
  reset: f => authDo(async () => { await S.B.reset(f.email.value.trim()); S.ui.auth = 'login'; toast('E-mail envoyé ! Regarde ta boîte (et les spams).'); }),
  profile: async f => {
    const name = f.name.value.trim().slice(0, 18); if (!name) return; const pf = S.ui.pf;
    const rec = { name, avatar: pf.avatar, col: pf.col, city: f.city.value.trim().slice(0, 30), bio: f.bio.value.trim().slice(0, 90), bday: f.bday.value || '', fav: f.fav.value || '', tz: S.B.mode === 'demo' && S.prof && S.prof.tz ? S.prof.tz : myTz(), seen: now() };
    S.prof = Object.assign({}, S.prof, rec); S.ui.editing = false; S.ui.pf = null; sfx('coin'); render();
    try { await S.B.merge(`users/${S.me}`, rec); } catch (e) { toast("Échec de l'enregistrement : " + (e.code || e.message)); }
  },
  joinduo: async f => {
    const code = f.code.value.trim().toUpperCase(); S.ui.err = '';
    try {
      const d = await S.B.get(`duos/${code}`);
      if (!d) { S.ui.err = 'Ce code ne correspond à aucun duo.'; render(); return; }
      const mem = d.members || [];
      if (!mem.includes(S.me)) { if (mem.length >= 2) { S.ui.err = 'Ce duo est déjà complet.'; render(); return; } await S.B.merge(`duos/${code}`, { members: [...mem, S.me] }); }
      await S.B.merge(`users/${S.me}`, { duo: code }); sfx('win'); confetti(150);
      history.replaceState(null, '', location.pathname + '#/');
    } catch (e) { S.ui.err = 'Impossible de rejoindre : ' + (e.code || e.message); render(); }
  },
};
const AUTH_ERR = { 'auth/email-already-in-use': 'Cette adresse a déjà un compte. Connecte-toi plutôt.', 'auth/invalid-credential': 'E-mail ou mot de passe incorrect.', 'auth/wrong-password': 'Mot de passe incorrect.', 'auth/user-not-found': 'Aucun compte avec cette adresse.', 'auth/weak-password': 'Mot de passe trop court (6 caractères minimum).', 'auth/invalid-email': 'Adresse e-mail invalide.', 'auth/network-request-failed': 'Pas de connexion internet.', 'auth/too-many-requests': 'Trop d\'essais. Patiente un peu.' };
async function authDo(fn) { S.ui.busy = true; S.ui.err = ''; render(); try { await fn(); } catch (e) { S.ui.err = AUTH_ERR[e.code] || ('Erreur : ' + (e.code || e.message)); } S.ui.busy = false; render(); }
function rdvPreview() { const f = document.querySelector('form[data-form="rdv"]'); const el = $('#rdvPrev'); const op = partner(); if (!f || !el || !op || !P(op).tz) return; const w = new Date(`${f.d.value}T${f.h.value}`).getTime(); el.textContent = w ? `Pour ${nm(op)}, ce sera ${fmtWhen(w, P(op).tz)}.` : ''; }

document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t) return; if (t.dataset.act === 'ovbg' && e.target !== t) return; const a = ACT[t.dataset.act]; if (a) { if (t.tagName !== 'LABEL') e.preventDefault(); a(t.dataset, t, e); if (t.classList.contains('toast')) t.remove(); } });
document.addEventListener('submit', e => { const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); FORMS[f.dataset.form] && FORMS[f.dataset.form](f); });
document.addEventListener('input', e => { if (e.target.closest('form[data-form="rdv"]')) rdvPreview(); if (e.target.id === 'msgIn' && S.code && now() - (S.lastTyping || 0) > 3000) { S.lastTyping = now(); S.B.merge(`users/${S.me}`, { typing: now() }); } });
document.addEventListener('change', e => {
  if (e.target.id !== 'photoIn' || !e.target.files[0]) return;
  const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); const sz = 320; c.width = c.height = sz; const s = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, sz, sz); S.ui.pf.avatar = { t: 'photo', d: c.toDataURL('image/jpeg', .82) }; URL.revokeObjectURL(img.src); sfx('coin'); render(); };
  img.onerror = () => toast('Image illisible'); img.src = URL.createObjectURL(e.target.files[0]);
});
document.addEventListener('keydown', e => { const g = S.g; if (routeName() !== 'partie' || !g || g.type !== 'mot' || g.over) return; if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; if (e.key === 'Enter') G.mot.key(g, 'ENTER'); else if (e.key === 'Backspace') G.mot.key(g, 'DEL'); else if (/^[a-zA-Z]$/.test(e.key)) G.mot.key(g, e.key.toUpperCase()); });
S.navCount = 0;
addEventListener('hashchange', () => { S.navCount++; S.ui.sheet = null; const r = routeName(); if (r === 'partie') { if (!S.g || S.g.id !== routeArg()) { S.ui.gLoaded = false; openGame(routeArg()); maybeIntro(); } } else if (S.gsubs.length) { unsubAll(S.gsubs); S.g = null; } markRead(); render(); });
function maybeIntro() { setTimeout(() => { const g = S.g; if (!g) return; const k = 'fuseau-intro-' + g.type; if (!LS.get(k)) { try { LS.set(k, '1'); } catch (e) { } S.ui.sheet = 'how'; render(); } }, 600); }
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); S.installEvt = e; render(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { heartbeat(); markRead(); render(); } });
function heartbeat() { if (S.me && S.prof && S.prof.name && !document.hidden) S.B.merge(`users/${S.me}`, { seen: now() }).catch(() => { }); }
setInterval(heartbeat, 45000);
setInterval(() => { if (!document.hidden && ['home', 'chat', 'profil'].includes(routeName())) render(); }, 15000);

/* ================= démarrage ================= */
async function seedDemo(B) {
  if (LS.get('fuseau-demo-seeded')) return;
  await B.set('users/demo-1', { name: 'Aye', avatar: { t: 'preset', id: 'adv-1' }, col: '#8d7bea', city: 'Lyon', tz: 'Europe/Paris', bio: 'Toujours partant pour une revanche', fav: 'p4', duo: 'DEMO42', seen: now() });
  await B.set('users/demo-2', { name: 'Nala', avatar: { t: 'preset', id: 'adv-2' }, col: '#f0745f', city: 'Montréal', tz: 'America/Toronto', bio: 'Reine du Croquis', fav: 'cq', duo: 'DEMO42', seen: now() });
  await B.set('duos/DEMO42', { members: ['demo-1', 'demo-2'], at: now() });
  await B.add('duos/DEMO42/msgs', { t: 'text', from: 'demo-2', text: 'Coucou ! On teste Fuseau ce soir ?', at: now() - 3600000 });
  LS.set('fuseau-demo-seeded', '1');
}
async function boot() {
  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
  const forceDemo = new URLSearchParams(location.search).has('demo');
  S.B = await makeBackend(forceDemo);
  if (S.B.mode === 'demo') await seedDemo(S.B);
  S.B.onUser(u => { S.done = new Set(); handleUser(u); if (routeName() === 'partie') openGame(routeArg()); });
}
if (location.search.includes("debug")) window.S = S;
boot();
