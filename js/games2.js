// Les 7 nouveaux jeux : Quiz, Le Mensonge, Bataille navale, Mot Interdit, Petit Bac, Histoire à deux, Défi photo.
import { QUIZ, QUIZCATS, TABOU, MENS, BACCATS, BACLETTERS, HSTARTS, HWORDS, HTWISTS, PHOTOS } from './content-new.js';
import { esc, fresh, obf, deobf, shuffle } from './games.js';

export const SZ = 8, FLEET = [4, 3, 3, 2, 2], SHIPN = ['Cuirassé', 'Croiseur', 'Sous-marin', 'Torpilleur', 'Pirogue'];
const rnd = a => a[Math.random() * a.length | 0];
export const fold = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").trim();
const near = k => { const r = k / SZ | 0, c = k % SZ, out = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < SZ && cc >= 0 && cc < SZ) out.push(rr * SZ + cc); } return out; };
export function placeFleet() {
  for (let n = 0; n < 500; n++) {
    const occ = new Set(), ships = []; let ok = true;
    for (const L of FLEET) {
      let placed = false;
      for (let t = 0; t < 200 && !placed; t++) {
        const hz = Math.random() < .5, r = Math.random() * (hz ? SZ : SZ - L + 1) | 0, c = Math.random() * (hz ? SZ - L + 1 : SZ) | 0;
        const cells = [...Array(L)].map((_, i) => hz ? r * SZ + c + i : (r + i) * SZ + c);
        if (cells.some(k => near(k).some(x => occ.has(x)))) continue;
        cells.forEach(k => occ.add(k)); ships.push(cells); placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    if (ok) return ships;
  }
  return null;
}
const PREACTS = [['heart', '#f0745f'], ['fire', '#f3b94d'], ['clap', '#8d7bea'], ['star', '#e0a32e'], ['smiley_wink', '#3bb5a0'], ['crown', '#d98c3a']];

export function addGames(G, H) {
  const op = g => g.players.find(x => x !== H.me());
  const waitFor = (uid, txt) => `<div class="status">${esc(txt || H.nm(uid) + ' réfléchit')}<span class="typing"><i></i><i></i><i></i></span></div>`;
  const verdict = (cls, icon, txt) => `<div class="verdict ${cls}">${H.ic(icon)}<span>${txt}</span></div>`;
  const nextBtn = (last, lbl) => `<div class="actions"><button class="btn primary" data-act="next">${last ? 'Voir le résultat' : lbl} ${H.ic('next')}</button></div>`;
  const duel = (g, s) => { const o = op(g), w = g.winner; return { icon: w === H.me() ? 'trophy' : w ? 'medal' : 'handshake', t: w === H.me() ? 'Tu as gagné !' : w ? `${H.nm(o)} gagne !` : 'Égalité parfaite !', sub: `${s[H.me()]} – ${s[o]}`, win: w === H.me() }; };
  const finish = (g, s) => { const [a, b] = g.players; const w = s[a] > s[b] ? a : s[b] > s[a] ? b : null; H.patch({ over: true, phase: 'over', winner: w }); H.record(g, { w, sc: s }); };
  const bothThen = (g, key, ready, fn) => { if (ready) H.once(`${key}:${g.id}:${g.round}`, H.lead(g) ? 0 : 2500, () => { const n = H.g(); if (n && n.id === g.id && n.round === g.round && n.phase === g.phase && !n.over) fn(n); }); };

  // Chrono personnel (démarre quand le joueur voit la question, survit au rechargement)
  const tKey = id => 'fuzo-t-' + id;
  const tStart = id => { let s = +localStorage.getItem(tKey(id)); if (!s) { s = Date.now(); try { localStorage.setItem(tKey(id), String(s)); } catch (e) { } } return s; };
  const tLeft = (id, T) => { const s = +localStorage.getItem(tKey(id)) || Date.now(); return Math.max(0, Math.ceil((s + T * 1000 - Date.now()) / 1000)); };
  const timerHTML = (T, left) => `<div class="tline"><div class="tbar ${left <= Math.min(10, T / 4) ? 'low' : ''}" id="tBar"><i style="width:${left / T * 100}%"></i></div><div class="pill" id="tSec">${H.ic('timer')} <span>${left}</span>s</div></div>`;
  function runTimer(T, endAt, onEnd) {
    let fired = false;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt() - Date.now()) / 1000));
      const b = document.getElementById('tBar'), s = document.querySelector('#tSec span');
      if (b) { b.querySelector('i').style.width = (left / T * 100) + '%'; b.classList.toggle('low', left <= Math.min(10, T / 4)); }
      if (s && s.textContent !== String(left)) { s.textContent = left; if (left <= 5 && left > 0) H.sfx('tick'); }
      if (left <= 0 && !fired) { fired = true; onEnd(); }
    };
    tick(); const iv = setInterval(tick, 250); H.cleanup(() => clearInterval(iv));
  }

  G.tele.coop = G.cq.coop = true; G.ut.turnBased = G.p4.turnBased = true;

  /* ================= Quiz Afrique & Canada ================= */
  G.quiz = {
    N: 10, T: 20, setup: 'quiz',
    cats: () => Object.entries(QUIZCATS).map(([c, v]) => [c, v.e, v.n, v.c, v.d]),
    catTitle: 'Choisis un thème',
    init: (b, o) => { const cat = o.cat || 'mix'; const qs = fresh('quiz', QUIZ.length, 10, i => cat === 'mix' || QUIZ[i].c === cat); return { phase: 'answer', data: { cat, q: qs, pm: qs.map(() => shuffle([0, 1, 2, 3]).join('')), hist: {} } }; },
    n(g) { return Math.min(this.N, g.data.q.length); },
    gain(v) { return v && v.i === 0 ? 10 + Math.round(Math.max(0, this.T - v.t) / this.T * 10) : 0; },
    pts(g) { const s = {}; g.players.forEach(p => s[p] = 0); for (const r in g.data.hist) for (const p of g.players) s[p] += this.gain((g.data.hist[r] || {})[p]); return s; },
    turn(g) { return g.phase === 'answer' ? H.ans(H.me()) === undefined : g.phase === 'reveal'; },
    key(g) { return `${g.round}-${g.phase}-${H.ans(H.me()) === undefined ? 'a' : 'w'}`; },
    tid: g => `q${g.id}-${g.round}`,
    view(g) {
      const o = op(g), r = g.round, N = this.n(g), Q = QUIZ[g.data.q[r]], P = [...g.data.pm[r]].map(Number), C = QUIZCATS[Q.c], s = this.pts(g);
      let h = H.scorebar(g, { scores: s, label: `Question ${r + 1}/${N}` });
      h += `<div class="prompt" data-k="qq-${r}"><div class="lab">${H.ic(C.e)} ${esc(C.n)}</div><h2 class="qh">${esc(Q.q)}</h2></div>`;
      if (g.phase === 'answer') {
        const my = H.ans(H.me());
        if (my === undefined) {
          h += timerHTML(this.T, tLeft(this.tid(g), this.T));
          h += `<div class="opts one">${P.map((oi, j) => `<button class="opt qo" data-act="quiza" data-i="${oi}"><span class="ql">${'ABCD'[j]}</span><span>${esc(Q.o[oi])}</span></button>`).join('')}</div>`;
          h += `<div class="slot">${H.ans(o) !== undefined ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a répondu</div>` : ''}</div><p class="hint-txt">Bonne réponse = 10 pts, plus un bonus jusqu'à 10 pts si tu es rapide.</p>`;
        } else h += `<div class="waitcard">${H.av(H.me(), 'md')}<div><small>Ta réponse</small><b>${my.i < 0 ? 'Temps écoulé' : esc(Q.o[my.i])}</b></div></div>${H.ans(o) === undefined ? waitFor(o) : '<div class="status">Révélation…</div>'}`;
      } else {
        const hh = g.data.hist[r] || {}, a = hh[H.me()] || { i: -1, t: 0 }, b = hh[o] || { i: -1, t: 0 };
        h += `<div class="opts one">${P.map((oi, j) => { const cls = oi === 0 ? 'good' : (a.i === oi || b.i === oi) ? 'bad' : 'dim'; return `<div class="opt qo res ${cls}"><span class="ql">${oi === 0 ? H.ic('check') : 'ABCD'[j]}</span><span class="grow">${esc(Q.o[oi])}</span><span class="who">${a.i === oi ? H.av(H.me(), 'xs') : ''}${b.i === oi ? H.av(o, 'xs') : ''}</span></div>`; }).join('')}</div>`;
        const ga = this.gain(a), gb = this.gain(b); const tx = (v, gg) => v.i < 0 ? 'Pas répondu' : gg ? `en ${Math.round(v.t)} s` : 'Raté';
        h += `<div class="reveal"><div class="rcard">${H.av(H.me(), 'sm')}<small>Toi</small><b>+${ga}</b><em class="${ga ? 'good' : 'bad'}">${tx(a, ga)}</em></div><div class="rcard">${H.av(o, 'sm')}<small>${esc(H.nm(o))}</small><b>+${gb}</b><em class="${gb ? 'good' : 'bad'}">${tx(b, gb)}</em></div></div>`;
        h += nextBtn(r + 1 >= N, 'Question suivante');
      }
      return h;
    },
    after(g) { if (g.phase === 'answer' && H.ans(H.me()) === undefined) { const id = this.tid(g), st = tStart(id); runTimer(this.T, () => st + this.T * 1000, () => this.answer(H.g() || g, -1)); } },
    answer(g, i) {
      if (g.phase !== 'answer' || H.ans(H.me()) !== undefined) return;
      const st = +localStorage.getItem(tKey(this.tid(g))) || Date.now(); const t = Math.min(this.T, Math.round((Date.now() - st) / 100) / 10);
      H.mine({ a: { r: g.round, v: { i, t } } }); H.sfx(i < 0 ? 'fail' : 'send');
      if (H.ans(op(g)) === undefined) H.notify(`a répondu à la question ${g.round + 1} du quiz. À toi !`);
    },
    auto(g) {
      const o = op(g), r = g.round;
      if (g.phase === 'answer') bothThen(g, 'qr', H.ans(H.me()) !== undefined && H.ans(o) !== undefined, n => H.patch({ phase: 'reveal', data: { hist: { [r]: { [H.me()]: H.ans(H.me()), [o]: H.ans(o) } } } }));
      if (g.phase === 'reveal') H.once(`qfx:${g.id}:${r}`, 300, () => { const a = (g.data.hist[r] || {})[H.me()]; if (a && a.i === 0) { H.sfx('coin'); H.confetti(50); } else H.sfx('fail'); });
    },
    next(g) { if (g.round + 1 >= this.n(g)) finish(g, this.pts(g)); else H.patch({ round: g.round + 1, phase: 'answer' }); },
    over(g) { return duel(g, this.pts(g)); },
    summary(g) { const s = this.pts(g); return `${s[H.me()]} – ${s[op(g)]}`; },
  };

  /* ================= Le Mensonge ================= */
  G.mens = {
    N: 3,
    init: () => ({ phase: 'write', data: { th: fresh('mens', MENS.length, 3), hist: {} } }),
    m(uid, g) { const m = H.pdoc(uid).m; return m && m.r === g.round ? m : null; },
    gu(uid, g) { const x = H.pdoc(uid).gu; return x && x.r === g.round ? x.v : undefined; },
    lie: e => +deobf(e.l),
    pts(g) { const s = {}; g.players.forEach(p => s[p] = 0); for (const r in g.data.hist) { const h = g.data.hist[r]; if (!h.g || !h.s) continue; for (const p of g.players) { const o = g.players.find(x => x !== p); if (h.g[p] === undefined || !h.s[o]) continue; if (h.g[p] === this.lie(h.s[o])) s[p]++; else s[o]++; } } return s; },
    turn(g) { return g.phase === 'write' ? !this.m(H.me(), g) : g.phase === 'guess' ? this.gu(H.me(), g) === undefined : g.phase === 'reveal'; },
    view(g) {
      const o = op(g), r = g.round, T = MENS[g.data.th[r]], s = this.pts(g);
      let h = H.scorebar(g, { scores: s, label: `Manche ${r + 1}/${this.N}` });
      h += `<div class="prompt" data-k="mp-${r}"><div class="lab">${H.ic('mask')} Thème</div><h2>${esc(T[0])}</h2><p class="psub">${esc(T[1])}</p></div>`;
      if (g.phase === 'write') {
        if (!this.m(H.me(), g)) h += `<form data-form="mens" class="col mt"><p class="hint-txt" style="margin:0">Écris <b>2 vérités</b> et <b>1 mensonge</b> sur toi, puis coche le mensonge. L'ordre sera mélangé.</p>${[0, 1, 2].map(i => `<div class="lie-row"><input class="field" name="s${i}" maxlength="110" autocomplete="off" placeholder="Affirmation ${i + 1}…" required><label class="liechk"><input type="radio" name="l" value="${i}" required><span>${H.ic('mask')}<b>Mensonge</b></span></label></div>`).join('')}<button class="btn primary block">${H.ic('send')} Envoyer</button></form>`;
        else h += `<div class="waitcard">${H.av(H.me(), 'md')}<div><small>C'est envoyé</small><b>Tes 3 affirmations sont prêtes</b></div></div>`;
        h += `<div class="slot">${this.m(o, g) ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a écrit les siennes</div>` : this.m(H.me(), g) ? waitFor(o, `${H.nm(o)} écrit`) : ''}</div>`;
      } else if (g.phase === 'guess') {
        const th = ((g.data.hist[r] || {}).s || {})[o]; if (!th) return h + waitFor(o, 'Préparation');
        const my = this.gu(H.me(), g);
        h += `<div class="step"><span>?</span> Laquelle est le mensonge de ${esc(H.nm(o))} ?</div><div class="opts one">${th.s.map((x, i) => `<button class="opt lie-opt ${my === i ? 'sel' : ''}" ${my !== undefined ? 'disabled' : ''} data-act="mensg" data-i="${i}">${esc(x)}</button>`).join('')}</div>`;
        if (my !== undefined) h += this.gu(o, g) === undefined ? waitFor(o, `${H.nm(o)} cherche ton mensonge`) : '<div class="status">Révélation…</div>';
        else h += `<div class="slot">${this.gu(o, g) !== undefined ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a fait son choix</div>` : ''}</div>`;
      } else {
        const hh = g.data.hist[r] || {}, S = hh.s || {}, Gu = hh.g || {};
        const block = (au, gu, lbl) => { const e = S[au]; if (!e) return ''; const l = this.lie(e); return `<div class="lie-res"><div class="lie-h">${H.av(au, 'xs')} <b>${lbl}</b></div>${e.s.map((x, i) => `<div class="lie-line ${i === l ? 'lie' : 'true'}"><span class="tag">${i === l ? H.ic('mask') + ' Mensonge' : H.ic('check') + ' Vrai'}</span><span class="grow">${esc(x)}</span>${Gu[gu] === i ? `<span class="who">${H.av(gu, 'xs')}</span>` : ''}</div>`).join('')}</div>`; };
        const okMe = Gu[H.me()] === (S[o] ? this.lie(S[o]) : -9), okOp = Gu[o] === (S[H.me()] ? this.lie(S[H.me()]) : -9);
        h += block(o, H.me(), `Les affirmations de ${esc(H.nm(o))}`) + block(H.me(), o, 'Les tiennes');
        h += okMe && okOp ? verdict('mid', 'eye', 'Personne ne s\'est fait avoir !') : okMe ? verdict('ok', 'eye', `Démasqué·e ! +1 pour toi`) : okOp ? verdict('ko', 'mask', `${esc(H.nm(o))} t'a démasqué·e… +1 pour elle/lui`) : verdict('mid', 'mask', 'Vous vous êtes bien eus tous les deux !');
        h += nextBtn(r + 1 >= this.N, 'Manche suivante');
      }
      return h;
    },
    submit(g, f) {
      const s = [0, 1, 2].map(i => f['s' + i].value.trim().slice(0, 110)); const l = +((f.querySelector('input[name="l"]:checked') || {}).value ?? -1);
      if (s.some(x => !x)) { H.toast('Remplis les 3 affirmations'); return; } if (l < 0) { H.toast('Coche celle qui est le mensonge'); return; }
      const idx = shuffle([0, 1, 2]);
      H.mine({ m: { r: g.round, s: idx.map(i => s[i]), l: obf(String(idx.indexOf(l))) } }); H.sfx('send');
      if (!this.m(op(g), g)) H.notify('a écrit ses 2 vérités et 1 mensonge. À toi !');
    },
    guess(g, i) { if (this.gu(H.me(), g) !== undefined) return; H.mine({ gu: { r: g.round, v: i } }); H.sfx('send'); if (this.gu(op(g), g) === undefined) H.notify('a choisi. Trouveras-tu son mensonge ?'); },
    auto(g) {
      const o = op(g), r = g.round, me = H.me();
      if (g.phase === 'write') bothThen(g, 'mw', this.m(me, g) && this.m(o, g), () => { const a = this.m(me, g), b = this.m(o, g); H.patch({ phase: 'guess', data: { hist: { [r]: { s: { [me]: { s: a.s, l: a.l }, [o]: { s: b.s, l: b.l } } } } } }); });
      if (g.phase === 'guess') bothThen(g, 'mg', this.gu(me, g) !== undefined && this.gu(o, g) !== undefined, () => H.patch({ phase: 'reveal', data: { hist: { [r]: { g: { [me]: this.gu(me, g), [o]: this.gu(o, g) } } } } }));
      if (g.phase === 'reveal') H.once(`mfx:${g.id}:${r}`, 350, () => { const hh = g.data.hist[r] || {}; if (hh.s && hh.s[o] && hh.g && hh.g[me] === this.lie(hh.s[o])) { H.sfx('coin'); H.confetti(60); } else H.sfx('fail'); });
    },
    next(g) { if (g.round + 1 >= this.N) finish(g, this.pts(g)); else H.patch({ round: g.round + 1, phase: 'write' }); },
    over(g) { return duel(g, this.pts(g)); },
    summary(g) { const s = this.pts(g); return `${s[H.me()]} – ${s[op(g)]}`; },
  };

  /* ================= Bataille navale ================= */
  G.nav = {
    turnBased: true,
    init: b => ({ phase: 'place', data: { sh: { [b.players[0]]: '.'.repeat(64), [b.players[1]]: '.'.repeat(64) }, first: rnd(b.players), last: null } }),
    fleet(uid) { const f = H.pdoc(uid).fl; if (!f) return null; try { return JSON.parse(deobf(f)); } catch (e) { return null; } },
    ready(uid) { return !!H.pdoc(uid).ready; },
    turn(g) { return g.phase === 'place' ? !this.ready(H.me()) : g.turn === H.me(); },
    key(g) { return g.phase; },
    afloat(g, uid) { const f = this.fleet(uid), b = g.data.sh[uid] || ''; return f ? f.filter(s => !s.every(i => b[i] === 's')).length : FLEET.length; },
    grid(b, ships, opts = {}) {
      const own = new Set((ships || []).flat()); const last = opts.last;
      let h = `<div class="sea ${opts.small ? 'small' : ''} ${opts.click ? 'aim' : ''}">`;
      for (let k = 0; k < 64; k++) {
        const v = b ? b[k] : '.'; const cls = v === 'o' ? 'm' : v === 'x' ? 'h' : v === 's' ? 's' : ''; const sh = own.has(k) && (opts.showShips || v === 's');
        const inner = v === 'o' ? '<i class="dot"></i>' : v === 'x' ? H.ic('fire') : v === 's' ? H.ic('x') : '';
        h += opts.click && v === '.' ? `<button class="cell" data-act="navshot" data-k="${k}"></button>` : `<div class="cell ${cls} ${sh ? 'ship' : ''} ${last === k ? 'last' : ''}">${inner}</div>`;
      }
      return h + '</div>';
    },
    view(g) {
      const o = op(g), d = g.data, me = H.me();
      if (g.phase === 'place') {
        let h = `<div class="prompt" data-k="np"><div class="lab">${H.ic('anchor')} Avant la bataille</div><h2>Place ta flotte</h2><p class="psub">5 bateaux sur une mer de 8 × 8. Mélange jusqu'à ce que la position te plaise.</p></div>`;
        const rd = this.ready(me);
        const fl = rd ? this.fleet(me) : (H.ui.nav && H.ui.nav.id === g.id ? H.ui.nav.fl : (H.ui.nav = { id: g.id, fl: placeFleet() }).fl);
        h += `<div class="seawrap mt">${this.grid('.'.repeat(64), fl, { showShips: true })}</div>`;
        h += `<div class="fleetl">${FLEET.map((L, i) => `<span class="chip">${'■'.repeat(L)} ${SHIPN[i]}</span>`).join('')}</div>`;
        if (!rd) h += `<div class="actions"><button class="btn ghost" data-act="navshuf">${H.ic('shuffle')} Mélanger</button><button class="btn primary" data-act="navready">${H.ic('check')} Je suis prêt·e</button></div>`;
        h += `<div class="slot">${this.ready(o) ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a placé sa flotte</div>` : rd ? waitFor(o, `${H.nm(o)} place sa flotte`) : ''}</div>`;
        return h;
      }
      const my = g.turn === me && !g.over; const L = d.last || {};
      let h = H.scorebar(g, { turn: g.turn, label: 'Bateaux à flot', scores: { [me]: this.afloat(g, me), [o]: this.afloat(g, o) } });
      if (!g.over) h += `<div class="turnmsg ${my ? 'me' : ''}">${my ? (L.u === me && L.res !== 'm' ? 'Touché ! Tu rejoues' : 'À toi ! Vise une case de sa mer') : `Au tour de ${esc(H.nm(o))}…`}</div>`;
      const ofl = this.fleet(o) || [];
      h += `<div class="seah">${H.av(o, 'xs')} <b>La mer de ${esc(H.nm(o))}</b>${L.u === me ? `<span class="chip ${L.res === 'm' ? '' : 'coral'}">${L.res === 'm' ? "À l'eau" : L.res === 's' ? 'Coulé !' : 'Touché !'}</span>` : ''}</div>`;
      h += `<div class="seawrap">${this.grid(d.sh[o], ofl, { click: my, last: L.u === me ? L.k : -1, showShips: g.over })}</div>`;
      h += `<div class="fleetl">${ofl.length ? ofl.map((s, i) => `<span class="chip ${s.every(k => d.sh[o][k] === 's') ? 'sunk' : ''}">${SHIPN[i]}</span>`).join('') : ''}</div>`;
      h += `<div class="seah mt">${H.av(me, 'xs')} <b>Ta flotte</b>${L.u === o ? `<span class="chip ${L.res === 'm' ? '' : 'coral'}">${L.res === 'm' ? 'Raté pour elle/lui' : L.res === 's' ? 'Un bateau coulé…' : 'Touché…'}</span>` : ''}</div>`;
      h += `<div class="seawrap small">${this.grid(d.sh[me], this.fleet(me), { showShips: true, small: true, last: L.u === o ? L.k : -1 })}</div>`;
      return h;
    },
    shuffle() { H.ui.nav = { id: H.g().id, fl: placeFleet() }; H.sfx('place'); H.render(); },
    setReady(g) { const fl = H.ui.nav && H.ui.nav.id === g.id ? H.ui.nav.fl : placeFleet(); H.mine({ fl: obf(JSON.stringify(fl)), ready: true }); H.sfx('coin'); if (!this.ready(op(g))) H.notify('a placé sa flotte. À toi de placer la tienne !'); },
    shoot(g, k, who = H.me()) {
      if (g.over || g.phase !== 'play' || g.turn !== who) return H.sfx('fail');
      const tgt = g.players.find(x => x !== who); const b = g.data.sh[tgt]; if (!b || b[k] !== '.') return;
      const fl = this.fleet(tgt); if (!fl) return H.toast('Flotte introuvable');
      const ship = fl.find(s => s.includes(k)); const a = [...b]; let res = 'm';
      if (ship) { a[k] = 'x'; if (ship.every(i => a[i] === 'x' || a[i] === 's')) { ship.forEach(i => a[i] = 's'); res = 's'; } else res = 'h'; } else a[k] = 'o';
      const nb = a.join(''); const over = fl.every(s => s.every(i => nb[i] === 's'));
      H.patch({ data: { sh: { [tgt]: nb }, last: { u: who, k, res } }, turn: over ? null : ship ? who : tgt, over, winner: over ? who : null, phase: over ? 'over' : 'play' });
      if (who === H.me()) { if (res === 'm') H.sfx('land'); else if (res === 'h') { H.sfx('coin'); H.confetti(25); } else { H.sfx('win'); H.confetti(80); } }
      if (over) { H.record(g, { w: who }); H.notify('a coulé toute ta flotte… Bataille navale terminée !'); }
      else if (!ship && who === H.me()) H.notify('a tiré. À toi de jouer à la Bataille navale !');
    },
    auto(g) {
      const o = op(g);
      if (g.phase === 'place') bothThen(g, 'np', this.ready(H.me()) && this.ready(o), n => H.patch({ phase: 'play', turn: n.data.first }));
      const L = g.data.last; if (L && L.u === o) H.once(`nl:${g.id}:${L.k}`, 150, () => H.sfx(L.res === 'm' ? 'land' : 'fail'));
    },
    over(g) { const o = op(g), w = g.winner; return { icon: w === H.me() ? 'trophy' : 'anchor', t: w === H.me() ? 'Amiral victorieux !' : `${H.nm(o)} a coulé ta flotte !`, sub: 'Bataille navale', win: w === H.me(), board: true }; },
    summary(g) { return g.phase === 'place' ? 'Placement des bateaux' : g.turn === H.me() ? 'À toi de tirer' : `Au tour de ${H.nm(op(g))}`; },
  };

  /* ================= Le Mot Interdit ================= */
  G.interdit = {
    N: 6, T: 60, coop: true,
    init: () => ({ phase: 'ready', data: { cards: fresh('tabou', TABOU.length, 90), ci: 0, ok: [], ko: [], hist: {} } }),
    sp: g => g.players[g.round % 2],
    total(g) { let s = 0; for (const r in g.data.hist) s += (g.data.hist[r].ok || []).length; return s; },
    turn(g) { return g.phase === 'reveal' || this.sp(g) === H.me(); },
    key(g) { return `${g.round}-${g.phase}`; },
    card(g) { const d = g.data; return TABOU[d.cards[d.ci % d.cards.length]]; },
    view(g) {
      const sp = this.sp(g), me = sp === H.me(), o = op(g), r = g.round, d = g.data;
      let h = H.scorebar(g, { left: [H.me(), o], label: `Manche ${r + 1}/${this.N}`, center: `<b>${this.total(g) + (g.phase === 'play' ? (d.ok || []).length : 0)}</b><small>mots trouvés</small>` });
      if (g.phase === 'ready') {
        if (me) h += `<div class="prompt" data-k="ir-${r}"><div class="lab">${H.ic('prohibit')} À toi de faire deviner</div><h2>60 secondes, un max de mots !</h2><p class="psub">Fais deviner le mot à ${esc(H.nm(o))} sans jamais dire les mots interdits. Lancez un appel avant de commencer.</p></div><div class="actions"><button class="btn world big block" data-act="tabgo">${H.ic('play')} C'est parti !</button></div>`;
        else h += `<div class="waitcard">${H.av(sp, 'md')}<div><small>${esc(H.nm(sp))} va te faire deviner</small><b>Appelez-vous et prépare-toi !</b></div></div>${waitFor(sp, `${H.nm(sp)} se prépare`)}<p class="hint-txt">Tu devines à voix haute pendant l'appel. ${esc(H.nm(sp))} valide sur son écran.</p>`;
      } else if (g.phase === 'play') {
        h += timerHTML(this.T, Math.max(0, Math.ceil(((d.end || 0) - Date.now()) / 1000)));
        if (me) { const c = this.card(g); h += `<div class="tabou" data-k="tc-${d.ci}"><div class="tw">${esc(c.w)}</div><div class="tf"><small>${H.ic('prohibit')} Interdit</small>${c.f.map(x => `<span>${esc(x)}</span>`).join('')}</div></div><div class="tabbtns"><button class="btn ghost" data-act="tabpass">Passer</button><button class="btn coral" data-act="tabko">${H.ic('prohibit')} Dit !</button><button class="btn teal" data-act="tabok">${H.ic('check')} Trouvé</button></div>`; }
        else h += `<div class="prompt" data-k="ig"><div class="lab">${H.ic('ear')} Écoute bien</div><h2>Devine à voix haute !</h2><p class="psub">${esc(H.nm(sp))} te fait deviner un mot.</p></div><div class="foundl">${(d.ok || []).map(i => `<span class="chip teal">${H.ic('check')} ${esc(TABOU[i].w)}</span>`).join('')}</div>`;
      } else {
        const hh = d.hist[r] || {}, ok = hh.ok || [], ko = hh.ko || [];
        h += ok.length ? verdict(ok.length >= 6 ? 'ok' : 'mid', 'confetti', `${ok.length} mot${ok.length > 1 ? 's' : ''} trouvé${ok.length > 1 ? 's' : ''} !`) : verdict('ko', 'hourglass', 'Aucun mot cette fois…');
        h += `<div class="foundl mt">${ok.map(i => `<span class="chip teal">${H.ic('check')} ${esc(TABOU[i].w)}</span>`).join('')}${ko.map(i => `<span class="chip">${esc(TABOU[i].w)}</span>`).join('')}</div>`;
        h += nextBtn(r + 1 >= this.N, 'Manche suivante');
      }
      return h;
    },
    after(g) { if (g.phase !== 'play') return; const me = this.sp(g) === H.me(); runTimer(this.T, () => (g.data.end || 0) + (me ? 0 : 4000), () => H.once(`ie:${g.id}:${g.round}`, 0, () => this.end(H.g() || g))); },
    go(g) { if (g.phase !== 'ready') return; H.patch({ phase: 'play', data: { end: Date.now() + this.T * 1000, ok: [], ko: [] } }); H.sfx('open'); H.notify('lance le chrono du Mot Interdit : viens deviner !'); },
    mark(ok) { const n = H.g(); if (!n || n.phase !== 'play' || Date.now() > (n.data.end || 0)) return; const d = n.data; const c = d.cards[d.ci % d.cards.length]; H.patch({ data: { ci: d.ci + 1, ok: ok ? [...(d.ok || []), c] : d.ok || [], ko: ok ? d.ko || [] : [...(d.ko || []), c] } }); H.sfx(ok ? 'coin' : 'back'); },
    end(g) { if (g.phase !== 'play' || g.over) return; H.patch({ phase: 'reveal', data: { hist: { [g.round]: { ok: g.data.ok || [], ko: g.data.ko || [] } } } }); },
    auto(g) { if (g.phase === 'reveal') H.once(`ifx:${g.id}:${g.round}`, 300, () => { const n = ((g.data.hist[g.round] || {}).ok || []).length; if (n) { H.sfx('win'); H.confetti(40 + n * 10); } else H.sfx('fail'); }); },
    next(g) { if (g.round + 1 >= this.N) { H.patch({ over: true, phase: 'over' }); H.record(g, { s: this.total(g) }); } else H.patch({ round: g.round + 1, phase: 'ready' }); },
    over(g) { const s = this.total(g); const m = s >= 36 ? ['crown', 'Duo de légende !'] : s >= 24 ? ['fire', 'Quelle complicité !'] : s >= 12 ? ['clap', 'Bien joué !'] : ['ear', 'Échauffement terminé !']; return { icon: m[0], t: m[1], sub: `${s} mots trouvés en ${this.N} manches`, coop: true, list: Object.keys(g.data.hist).map(r => `<div class="dl"><b>Manche ${+r + 1} · ${esc(H.nm(g.players[r % 2]))}</b><span>${(g.data.hist[r].ok || []).length} trouvés</span></div>`).join('') }; },
    summary(g) { return `${this.total(g)} mots trouvés`; },
  };

  /* ================= Petit Bac express ================= */
  G.bac = {
    N: 3, T: 90,
    init: () => ({ phase: 'play', data: { L: shuffle([...BACLETTERS]).slice(0, 3).join(''), cats: fresh('bac', BACCATS.length, 18), hist: {}, rej: {} } }),
    cs(g, r = g.round) { return g.data.cats.slice(r * 6, r * 6 + 6); },
    tid: g => `b${g.id}-${g.round}`,
    ok(g, r, uid, i, w) { if ((g.data.rej || {})[`${r}-${uid}-${i}`]) return false; const f = fold(w).replace(/^(l'|d')/, '').replace(/^[^a-z]+/, ''); return f.length >= 2 && f[0] === g.data.L[r].toLowerCase(); },
    rs(g, r) { const h = g.data.hist[r] || {}, [a, b] = g.players, s = { [a]: [], [b]: [] }; for (let i = 0; i < 6; i++) { const wa = (h[a] || [])[i] || '', wb = (h[b] || [])[i] || ''; const va = this.ok(g, r, a, i, wa), vb = this.ok(g, r, b, i, wb), same = va && vb && fold(wa) === fold(wb); s[a].push(va ? (same ? 1 : 2) : 0); s[b].push(vb ? (same ? 1 : 2) : 0); } return s; },
    pts(g) { const s = {}; g.players.forEach(p => s[p] = 0); for (const r in g.data.hist) { const x = this.rs(g, r); for (const p of g.players) s[p] += x[p].reduce((u, v) => u + v, 0); } return s; },
    turn(g) { return g.phase === 'play' ? H.ans(H.me()) === undefined : g.phase === 'reveal'; },
    key(g) { return `${g.round}-${g.phase}-${H.ans(H.me()) === undefined ? 'a' : 'w'}`; },
    view(g) {
      const o = op(g), r = g.round, L = g.data.L[r], C = this.cs(g), s = this.pts(g);
      let h = H.scorebar(g, { scores: s, label: `Manche ${r + 1}/${this.N}` });
      h += `<div class="bacl" data-k="bl-${r}"><small>La lettre</small><b>${L}</b></div>`;
      if (g.phase === 'play') {
        if (H.ans(H.me()) === undefined) {
          h += timerHTML(this.T, tLeft(this.tid(g), this.T));
          h += `<form data-form="bac" class="bacf">${C.map((c, i) => `<label class="bacrow"><span>${esc(BACCATS[c])}</span><input class="field" name="w${i}" maxlength="30" autocomplete="off" autocapitalize="sentences" placeholder="${L}…"></label>`).join('')}<button class="btn primary block mt">${H.ic('check')} J'ai fini !</button></form>`;
          h += `<div class="slot">${H.ans(o) !== undefined ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a fini</div>` : ''}</div>`;
        } else h += `<div class="waitcard">${H.av(H.me(), 'md')}<div><small>C'est envoyé</small><b>${H.ans(H.me()).filter(x => x).length} réponse(s) sur 6</b></div></div>${H.ans(o) === undefined ? waitFor(o, `${H.nm(o)} cherche ses mots`) : '<div class="status">Correction…</div>'}`;
      } else {
        const hh = g.data.hist[r] || {}, x = this.rs(g, r), me = H.me();
        const cell = (uid, i) => { const w = (hh[uid] || [])[i] || ''; const p = x[uid][i]; const rj = (g.data.rej || {})[`${r}-${uid}-${i}`]; return w ? `<button class="bw ${p ? 'v' : 'nv'} ${rj ? 'rj' : ''}" data-act="bacrej" data-k="${r}-${uid}-${i}"><span>${esc(w)}</span><em>${p ? '+' + p : '0'}</em></button>` : `<span class="bw empty">—</span>`; };
        h += `<div class="bact"><div class="bach"><span></span><span>${H.av(me, 'xs')} Toi</span><span>${H.av(o, 'xs')} ${esc(H.nm(o))}</span></div>${C.map((c, i) => `<div class="bacr"><span class="bc">${esc(BACCATS[c])}</span>${cell(me, i)}${cell(o, i)}</div>`).join('')}</div>`;
        const sm = x[me].reduce((u, v) => u + v, 0), so = x[o].reduce((u, v) => u + v, 0);
        h += `<p class="hint-txt">Mot unique = 2 pts, même mot = 1 pt. Touche un mot pour le refuser (ou le réaccepter).</p>`;
        h += sm > so ? verdict('ok', 'trophy', `Manche pour toi : ${sm} à ${so}`) : so > sm ? verdict('ko', 'medal', `Manche pour ${esc(H.nm(o))} : ${so} à ${sm}`) : verdict('mid', 'handshake', `Égalité : ${sm} partout`);
        h += nextBtn(r + 1 >= this.N, 'Manche suivante');
      }
      return h;
    },
    after(g) { if (g.phase === 'play' && H.ans(H.me()) === undefined) { const st = tStart(this.tid(g)); runTimer(this.T, () => st + this.T * 1000, () => this.submit(H.g() || g, document.querySelector('form[data-form="bac"]'))); } },
    submit(g, f) { if (g.phase !== 'play' || H.ans(H.me()) !== undefined) return; const v = [0, 1, 2, 3, 4, 5].map(i => f && f['w' + i] ? f['w' + i].value.trim().slice(0, 30) : ''); H.mine({ a: { r: g.round, v } }); H.sfx('send'); if (H.ans(op(g)) === undefined) H.notify(`a fini la lettre ${g.data.L[g.round]} au Petit Bac. À toi !`); },
    rej(k) { const g = H.g(); if (!g || g.phase !== 'reveal') return; H.patch({ data: { rej: { [k]: !(g.data.rej || {})[k] } } }); H.sfx('tap'); },
    auto(g) {
      const o = op(g), r = g.round;
      if (g.phase === 'play') bothThen(g, 'br', H.ans(H.me()) !== undefined && H.ans(o) !== undefined, () => H.patch({ phase: 'reveal', data: { hist: { [r]: { [H.me()]: H.ans(H.me()), [o]: H.ans(o) } } } }));
      if (g.phase === 'reveal') H.once(`bfx:${g.id}:${r}`, 300, () => { H.sfx('coin'); });
    },
    next(g) { if (g.round + 1 >= this.N) finish(g, this.pts(g)); else H.patch({ round: g.round + 1, phase: 'play' }); },
    over(g) { return duel(g, this.pts(g)); },
    summary(g) { const s = this.pts(g); return `${s[H.me()]} – ${s[op(g)]}`; },
  };

  /* ================= Histoire à deux ================= */
  G.hist = {
    N: 10, coop: true, turnBased: true,
    init: b => ({ phase: 'play', turn: rnd(b.players), data: { st: fresh('hst', HSTARTS.length, 1)[0], w: fresh('hw', HWORDS.length, 10), tw: fresh('htw', HTWISTS.length, 10), lines: [], jk: { [b.players[0]]: 2, [b.players[1]]: 2 } } }),
    turn(g) { return g.turn === H.me(); },
    key(g) { return `${(g.data.lines || []).length}-${g.turn === H.me()}`; },
    has(text, w) { const a = fold(text), b = fold(w); return a.includes(b.length > 4 ? b.slice(0, -1) : b); },
    book(g) {
      const S = HSTARTS[g.data.st], L = g.data.lines || [];
      return `<div class="book"><div class="btitle">${H.ic('feather')} ${esc(S[0])}</div><p class="bl open">${esc(S[1])}</p>${L.map(l => `<p class="bl" style="--c:${esc(H.col ? H.col(l.u) : '#8d7bea')}"><span class="bav">${H.av(l.u, 'xs')}</span>${esc(l.t)}</p>`).join('')}</div>`;
    },
    view(g) {
      const o = op(g), L = g.data.lines || [], i = L.length, my = g.turn === H.me() && !g.over;
      let h = `<div class="hprog"><span>Phrase ${Math.min(i + 1, this.N)} / ${this.N}</span><div class="tbar"><i style="width:${i / this.N * 100}%"></i></div></div>`;
      h += this.book(g);
      if (g.over) return h;
      if (my) {
        const w = HWORDS[g.data.w[i]], tw = i % 2 === 1 ? HTWISTS[g.data.tw[i]] : null, jk = (g.data.jk || {})[H.me()] ?? 0, last = i === this.N - 1;
        h += `<div class="hcons" data-k="hc-${i}-${g.data.w[i]}"><div><small>Place le mot</small><b>${esc(w)}</b></div>${tw ? `<div class="tw2">${H.ic('sparkle')} <span>Bonus : ${esc(tw)}</span></div>` : ''}${last ? `<div class="tw2">${H.ic('flag')} <span>Dernière phrase : écris la fin de l'histoire !</span></div>` : ''}</div>`;
        h += `<form data-form="hist" class="col mt"><textarea class="field" name="t" rows="3" maxlength="240" placeholder="Ta phrase…" required></textarea><div class="row"><button type="button" class="btn ghost sm" data-act="histjk" ${jk ? '' : 'disabled'}>${H.ic('shuffle')} Autre mot (${jk})</button><span class="grow"></span><button class="btn primary">${H.ic('pen')} Ajouter</button></div></form>`;
      } else h += waitFor(o, `${H.nm(o)} écrit la suite`);
      return h;
    },
    add(g, text) {
      const L = g.data.lines || [], i = L.length; if (g.turn !== H.me() || g.over) return;
      const w = HWORDS[g.data.w[i]]; if (!this.has(text, w)) { H.toast(`Il faut placer le mot « ${w} » dans ta phrase`); H.sfx('fail'); return false; }
      const lines = [...L, { u: H.me(), t: text.slice(0, 240) }], over = lines.length >= this.N;
      H.patch({ data: { lines }, turn: over ? null : op(g), over, phase: over ? 'over' : 'play' }); H.sfx('send');
      if (over) { H.record(g, { s: this.N }); H.confetti(120); H.notify('a écrit la fin de votre histoire. Viens la lire !'); } else H.notify('a écrit la suite de votre histoire. À toi !');
      return true;
    },
    joker(g) { const i = (g.data.lines || []).length, jk = (g.data.jk || {})[H.me()] ?? 0; if (!jk) return; let n = g.data.w[i], t = 0; while ((n === g.data.w[i] || g.data.w.includes(n)) && t++ < 50) n = Math.random() * HWORDS.length | 0; const w = [...g.data.w]; w[i] = n; H.patch({ data: { w, jk: { [H.me()]: jk - 1 } } }); H.sfx('tap'); },
    over(g) { const S = HSTARTS[g.data.st]; return { icon: 'feather', t: S[0], sub: 'Votre histoire est terminée !', coop: true, list: this.book(g) + `<div class="actions"><button class="btn ghost sm" data-act="histshare">${H.ic('share')} Partager l'histoire</button></div>` }; },
    text(g) { const S = HSTARTS[g.data.st]; return `${S[0]}\n\n${S[1]} ${(g.data.lines || []).map(l => l.t).join(' ')}\n\n— Écrit à deux sur Fuzo`; },
    summary(g) { return g.over ? 'Histoire terminée' : g.turn === H.me() ? 'À toi d\'écrire' : `Au tour de ${H.nm(op(g))}`; },
  };

  /* ================= Défi photo ================= */
  G.photo = {
    coop: true,
    init: () => ({ phase: 'shoot', data: { th: fresh('photo', PHOTOS.length, 1)[0] } }),
    ph(uid) { return H.pdoc(uid).ph || null; }, re(uid) { return H.pdoc(uid).re || null; },
    turn(g) { return g.phase === 'shoot' ? !this.ph(H.me()) : !this.re(H.me()); },
    key(g) { return g.phase + (this.ph(H.me()) ? '1' : '0'); },
    pol(uid, p, extra = '') { return `<figure class="pol"><img src="${esc(p.d)}" alt=""><figcaption>${H.av(uid, 'xs')}<span>${esc(p.c || (uid === H.me() ? 'Ta photo' : H.nm(uid)))}</span>${extra}</figcaption></figure>`; },
    view(g) {
      const o = op(g), me = H.me(), mp = this.ph(me), tp = this.ph(o);
      let h = `<div class="prompt" data-k="pp-${g.data.th}"><div class="lab">${H.ic('camera')} Défi photo</div><h2>${esc(PHOTOS[g.data.th])}</h2></div>`;
      if (g.phase === 'shoot') {
        if (!mp) {
          const pv = H.ui.ph && H.ui.ph.id === g.id ? H.ui.ph.d : null;
          if (pv) h += `<div class="pol prev mt"><img src="${esc(pv)}" alt=""></div><form data-form="photo" class="col mt"><input class="field" name="c" maxlength="60" autocomplete="off" placeholder="Une légende (facultatif)"><div class="row"><label class="btn ghost sm">${H.ic('camera')} Reprendre<input type="file" id="photoGame" accept="image/*" hidden></label><span class="grow"></span><button class="btn primary">${H.ic('send')} Envoyer</button></div></form>`;
          else h += `<label class="shoot mt">${H.ic('camera')}<b>Prendre ou choisir une photo</b><small>Elle restera cachée jusqu'à ce que ${esc(H.nm(o))} poste la sienne.</small><input type="file" id="photoGame" accept="image/*" hidden></label>${!tp ? `<div class="center mt"><button class="btn ghost sm" data-act="photoalt">${H.ic('shuffle')} Autre défi</button></div>` : ''}`;
        } else h += `<div class="mt">${this.pol(me, mp)}</div>`;
        h += `<div class="slot">${tp ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a posté sa photo… surprise !</div>` : mp ? waitFor(o, `En attente de la photo de ${H.nm(o)}`) : ''}</div>`;
      } else {
        const rm = this.re(me), ro = this.re(o); const ricon = r => r ? `<span class="preact" style="--c:${(PREACTS.find(x => x[0] === r.e) || PREACTS[0])[1]}">${H.ic(r.e)}</span>` : '';
        h += `<div class="pols">${tp ? this.pol(o, tp, ricon(rm)) : ''}${mp ? this.pol(me, mp, ricon(ro)) : ''}</div>`;
        if (!rm && !g.over) h += `<p class="center mt" style="font-weight:800">Ta réaction à la photo de ${esc(H.nm(o))} ?</p><div class="reacts">${PREACTS.map(([k, c]) => `<button class="rb" style="--c:${c}" data-act="photore" data-e="${k}">${H.ic(k)}</button>`).join('')}</div>`;
        else if (!g.over) h += waitFor(o, `${H.nm(o)} regarde ta photo`);
      }
      return h;
    },
    post(g, d, c) { if (this.ph(H.me())) return; H.mine({ ph: { d, c: (c || '').slice(0, 60), at: Date.now() } }); H.ui.ph = null; H.sfx('send'); H.notify(this.ph(op(g)) ? 'a posté sa photo : venez comparer !' : `a relevé le défi photo « ${PHOTOS[g.data.th]} ». À toi !`); },
    alt(g) { if (this.ph(H.me()) || this.ph(op(g))) return; H.patch({ data: { th: fresh('photo', PHOTOS.length, 1)[0] } }); H.sfx('tap'); },
    react(g, e) { if (this.re(H.me())) return; H.mine({ re: { e } }); H.sfx('coin'); H.confetti(40); },
    auto(g) {
      const o = op(g);
      if (g.phase === 'shoot') bothThen(g, 'ps', this.ph(H.me()) && this.ph(o), () => H.patch({ phase: 'reveal' }));
      if (g.phase === 'reveal') { H.once(`pfx:${g.id}`, 300, () => H.sfx('win')); bothThen(g, 'pr', this.re(H.me()) && this.re(o), n => { H.patch({ over: true, phase: 'over' }); H.record(n, { s: 1 }); }); }
    },
    over(g) { const o = op(g), mp = this.ph(H.me()), tp = this.ph(o); const ricon = r => r ? `<span class="preact" style="--c:${(PREACTS.find(x => x[0] === r.e) || PREACTS[0])[1]}">${H.ic(r.e)}</span>` : ''; return { icon: 'camera', t: 'Défi relevé !', sub: PHOTOS[g.data.th], coop: true, list: `<div class="pols">${tp ? this.pol(o, tp, ricon(this.re(H.me()))) : ''}${mp ? this.pol(H.me(), mp, ricon(this.re(o))) : ''}</div><p class="hint-txt">Appuie longuement sur une photo pour l'enregistrer.</p>` }; },
    summary(g) { return `Défi : ${PHOTOS[g.data.th]}`; },
  };
}
