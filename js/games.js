// Logique et écrans des 7 jeux. H = helpers fournis par app.js
import { TELE, DEV, DEVCATS, CQW, WORDS, DECKS } from './content.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickN = (n, len) => shuffle([...Array(len).keys()]).slice(0, n);
const rnd = a => a[Math.random() * a.length | 0];
export const obf = s => btoa(unescape(encodeURIComponent(s))).split('').reverse().join('');
export const deobf = s => { try { return decodeURIComponent(escape(atob(String(s).split('').reverse().join('')))); } catch (e) { return ''; } };
export const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/^(l'|le |la |les |un |une |des |du |de la |d')/, '').replace(/[^a-z0-9]/g, '').replace(/(s|x)$/, '');
export function lev(a, b) { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = [...Array(n + 1).keys()]; for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
const clone = o => o == null ? o : JSON.parse(JSON.stringify(o));
const L3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const win3 = (a, ch) => L3.some(l => l.every(i => a[i] === ch));
function p4line(b, idx, ch) { const r = idx / 7 | 0, c = idx % 7; for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) { const cells = [idx]; for (const s of [1, -1]) { let rr = r + dr * s, cc = c + dc * s; while (rr >= 0 && rr < 6 && cc >= 0 && cc < 7 && b[rr * 7 + cc] === ch) { cells.push(rr * 7 + cc); rr += dr * s; cc += dc * s; } } if (cells.length >= 4) return cells; } return null; }

export function makeGames(H) {
  const op = g => g.players.find(x => x !== H.me());
  const waitFor = (uid, txt) => `<div class="status">${esc(txt || H.nm(uid) + ' réfléchit')}<span class="typing"><i></i><i></i><i></i></span></div>`;
  const verdict = (cls, icon, txt) => `<div class="verdict ${cls}">${H.ic(icon)}<span>${txt}</span></div>`;
  const G = {};
  const turnMsg = (g, over, name) => H.notify(over ? `vient de finir la partie de ${name}` : `a joué. À toi de jouer au ${name} !`);

  /* ---------- Télépathie ---------- */
  G.tele = {
    N: 8,
    init: () => ({ phase: 'answer', data: { q: pickN(8, TELE.length), hist: {}, ok: {} } }),
    hits(g) { let n = 0; for (const r in g.data.hist) { const h = g.data.hist[r]; const v = g.players.map(p => h[p]); if ((g.data.ok && g.data.ok[r]) || (norm(v[0]) === norm(v[1]) && norm(v[0]))) n++; } return n; },
    turn(g) { return g.phase === 'answer' ? H.ans(H.me()) === undefined : g.phase === 'reveal'; },
    view(g) {
      const o = op(g), r = g.round, pr = TELE[g.data.q[r]];
      let h = H.scorebar(g, { left: [H.me(), o], label: `Manche ${r + 1}/${this.N}`, center: `<b>${this.hits(g)}</b><small>connexions</small>` });
      h += `<div class="prompt" data-k="tp-${r}"><div class="lab">Pensez à…</div><h2>${esc(pr)}</h2></div>`;
      if (g.phase === 'answer') {
        const my = H.ans(H.me()), th = H.ans(o);
        if (my === undefined) h += `<form data-form="tele" class="col mt"><input class="field" name="v" maxlength="30" autocomplete="off" placeholder="Ton mot…" required><button class="btn primary block">${H.ic('bolt')} Valider</button></form>${th !== undefined ? `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a déjà répondu</div>` : ''}<p class="hint-txt">Le but : écrire exactement le même mot que ${esc(H.nm(o))}.</p>`;
        else h += `<div class="waitcard">${H.av(H.me(), 'md')}<div><small>Ta réponse</small><b>${esc(my)}</b></div></div>${th === undefined ? waitFor(o) : '<div class="status">Révélation…</div>'}`;
      } else {
        const hh = g.data.hist[r] || {}, a = hh[H.me()], b = hh[o]; const m = (g.data.ok && g.data.ok[r]) || (norm(a) === norm(b) && norm(a));
        h += `<div class="reveal"><div class="rcard">${H.av(H.me(), 'sm')}<small>Toi</small><b>${esc(a)}</b></div><div class="rcard">${H.av(o, 'sm')}<small>${esc(H.nm(o))}</small><b>${esc(b)}</b></div></div>`;
        h += m ? verdict('ok', 'brain', 'Connexion parfaite !') : verdict('ko', 'smiley_x', "Pas sur la même longueur d'onde…");
        h += `<div class="actions">${!m ? `<button class="btn ghost sm" data-act="teleok">${H.ic('handshake')} On compte quand même</button>` : ''}<button class="btn primary" data-act="next">${r + 1 >= this.N ? 'Voir le résultat' : 'Manche suivante'} ${H.ic('next')}</button></div>`;
      }
      return h;
    },
    submit(g, v) { H.mine({ a: { r: g.round, v: v.slice(0, 30) } }); H.sfx('send'); if (H.ans(op(g)) === undefined) H.notify(`a répondu à la manche ${g.round + 1}. À toi !`); },
    auto(g) {
      const o = op(g), r = g.round;
      if (g.phase === 'answer' && H.ans(H.me()) !== undefined && H.ans(o) !== undefined) H.once(`tr:${g.id}:${r}`, H.lead(g) ? 0 : 2500, () => { const n = H.g(); if (n && n.id === g.id && n.round === r && n.phase === 'answer') H.patch({ phase: 'reveal', data: { hist: { [r]: { [H.me()]: H.ans(H.me()), [o]: H.ans(o) } } } }); });
      if (g.phase === 'reveal') { const hh = g.data.hist[r] || {}; H.once(`tfx:${g.id}:${r}`, 350, () => { const v = g.players.map(p => hh[p]); if (norm(v[0]) === norm(v[1])) { H.confetti(90); H.sfx('win'); } else H.sfx('fail'); }); }
    },
    ok(g) { H.patch({ data: { ok: { [g.round]: true } } }); H.confetti(60); H.sfx('coin'); },
    next(g) { if (g.round + 1 >= this.N) { const s = this.hits(g); H.patch({ over: true, phase: 'over' }); H.record(g, { s }); } else H.patch({ round: g.round + 1, phase: 'answer' }); },
    over(g) { const s = this.hits(g); const m = s >= 7 ? ['brain', 'Télépathes certifiés !'] : s >= 5 ? ['bolt', 'Super connexion !'] : s >= 3 ? ['planet', 'Le signal passe…'] : ['moon', 'Réglez vos antennes !']; return { icon: m[0], t: m[1], sub: `${s} connexion${s > 1 ? 's' : ''} sur ${this.N}`, coop: true, list: Object.keys(g.data.hist).map(r => { const hh = g.data.hist[r]; return `<div class="dl"><b>${esc(TELE[g.data.q[r]])}</b><span>${g.players.map(p => esc(hh[p])).join(' · ')}</span></div>`; }).join('') }; },
    summary(g) { return `${this.hits(g)}/8 connexions`; },
  };

  /* ---------- Devine-moi ---------- */
  G.dev = {
    N: 8, setup: 'dev',
    init: (b, o) => { const pool = DEV.map((q, i) => i).filter(i => o.cat === 'mix' || DEV[i].c === o.cat); return { phase: 'answer', data: { cat: o.cat, q: shuffle(pool).slice(0, 8), hist: {} } }; },
    pts(g) { const s = {}; g.players.forEach(p => s[p] = 0); for (const r in g.data.hist) { const h = g.data.hist[r]; const [a, b] = g.players; if (h[a] && h[b]) { if (h[a].g === h[b].s) s[a]++; if (h[b].g === h[a].s) s[b]++; } } return s; },
    turn(g) { return g.phase === 'answer' ? H.ans(H.me()) === undefined : g.phase === 'reveal'; },
    view(g) {
      const o = op(g), r = g.round, N = Math.min(this.N, g.data.q.length), Q = DEV[g.data.q[r]], cat = DEVCATS[Q.c]; const s = this.pts(g);
      let h = H.scorebar(g, { scores: s, label: `Question ${r + 1}/${N}` });
      h += `<div class="prompt" data-k="dq-${r}"><div class="lab">${H.ic(cat.e)} ${esc(cat.n)}</div><h2>${esc(Q.q)}</h2></div>`;
      const two = Q.o.length === 2 ? ' two' : '';
      if (g.phase === 'answer') {
        const my = H.ans(H.me()); const u = H.ui.dev && H.ui.dev.k === g.id + r ? H.ui.dev : null;
        if (my === undefined) {
          if (!u) h += `<div class="step"><span>1</span> Ta réponse à toi</div><div class="opts${two}" data-k="o1">${Q.o.map((x, i) => `<button class="opt" data-act="devs" data-i="${i}">${esc(x)}</button>`).join('')}</div>`;
          else h += `<div class="step"><span>2</span> Et ${esc(H.nm(o))}, qu'a-t-il/elle répondu ?</div><div class="opts${two}" data-k="o2">${Q.o.map((x, i) => `<button class="opt" data-act="devg" data-i="${i}">${esc(x)}</button>`).join('')}</div><div class="center mt"><button class="btn ghost sm" data-act="devback">${H.ic('back')} Changer ma réponse (${esc(Q.o[u.s])})</button></div>`;
          if (H.ans(o) !== undefined) h += `<div class="status ok">${H.ic('check')} ${esc(H.nm(o))} a répondu</div>`;
        } else h += `<div class="waitcard">${H.av(H.me(), 'md')}<div><small>Toi : ${esc(Q.o[my.s])}</small><b>Ton pari : ${esc(Q.o[my.g])}</b></div></div>${H.ans(o) === undefined ? waitFor(o) : '<div class="status">Révélation…</div>'}`;
      } else {
        const hh = g.data.hist[r] || {}, a = hh[H.me()] || {}, b = hh[o] || {}; const okMe = a.g === b.s, okOp = b.g === a.s;
        h += `<div class="reveal"><div class="rcard">${H.av(o, 'sm')}<small>${esc(H.nm(o))} a répondu</small><b>${esc(Q.o[b.s])}</b><em class="${okMe ? 'good' : 'bad'}">Ton pari : ${esc(Q.o[a.g])} ${okMe ? '+1' : ''}</em></div><div class="rcard">${H.av(H.me(), 'sm')}<small>Tu as répondu</small><b>${esc(Q.o[a.s])}</b><em class="${okOp ? 'good' : 'bad'}">Son pari : ${esc(Q.o[b.g])} ${okOp ? '+1' : ''}</em></div></div>`;
        h += okMe && okOp ? verdict('ok', 'target', 'Vous vous connaissez par cœur !') : okMe ? verdict('mid', 'eye', "Tu l'as bien cerné·e !") : okOp ? verdict('mid', 'eye', `${esc(H.nm(o))} te connaît bien !`) : verdict('ko', 'smiley_x', 'Raté des deux côtés…');
        h += `<div class="actions"><button class="btn primary" data-act="next">${r + 1 >= N ? 'Voir le résultat' : 'Question suivante'} ${H.ic('next')}</button></div>`;
      }
      return h;
    },
    auto(g) {
      const o = op(g), r = g.round;
      if (g.phase === 'answer' && H.ans(H.me()) !== undefined && H.ans(o) !== undefined) H.once(`dr:${g.id}:${r}`, H.lead(g) ? 0 : 2500, () => { const n = H.g(); if (n && n.id === g.id && n.round === r && n.phase === 'answer') H.patch({ phase: 'reveal', data: { hist: { [r]: { [H.me()]: H.ans(H.me()), [o]: H.ans(o) } } } }); });
      if (g.phase === 'reveal') { const hh = g.data.hist[r] || {}; H.once(`dfx:${g.id}:${r}`, 350, () => { const a = hh[H.me()] || {}, b = hh[o] || {}; if (a.g === b.s) { H.sfx('coin'); H.confetti(50); } else H.sfx('fail'); }); }
    },
    next(g) { const N = Math.min(this.N, g.data.q.length); if (g.round + 1 >= N) { const s = this.pts(g), [a, b] = g.players; const w = s[a] > s[b] ? a : s[b] > s[a] ? b : null; H.patch({ over: true, phase: 'over', winner: w }); H.record(g, { w, sc: s }); } else H.patch({ round: g.round + 1, phase: 'answer' }); },
    over(g) { const s = this.pts(g), o = op(g), w = g.winner; return { icon: w === H.me() ? 'trophy' : w ? 'medal' : 'handshake', t: w === H.me() ? 'Tu as gagné !' : w ? `${H.nm(o)} gagne !` : 'Égalité parfaite !', sub: `${s[H.me()]} – ${s[o]}`, win: w === H.me() }; },
    summary(g) { const s = this.pts(g); return `${s[H.me()]} – ${s[op(g)]}`; },
  };

  /* ---------- Croquis ---------- */
  G.cq = {
    N: 6, T: 80,
    init: () => ({ phase: 'pick', data: { sets: pickN(18, CQW.length), hist: {} } }),
    drawer: g => g.players[g.round % 2],
    pts: t => t < 25 ? 3 : t < 50 ? 2 : 1,
    total(g) { let s = 0; for (const r in g.data.hist) { const h = g.data.hist[r]; if (h.f) s += this.pts(h.t); } return s; },
    turn(g) { const d = this.drawer(g) === H.me(); return g.phase === 'pick' ? d : g.phase === 'draw' ? true : true; },
    key(g) { return `cq-${g.id}-${g.round}-${g.phase}-${this.drawer(g) === H.me() ? 'd' : 'g'}`; },
    view(g) {
      const r = g.round, dr = this.drawer(g), me = dr === H.me(), o = op(g);
      let h = H.scorebar(g, { left: [H.me(), o], label: `Manche ${r + 1}/${this.N}`, center: `<b>${this.total(g)}</b><small>score duo</small>` });
      if (g.phase === 'pick') {
        if (me) h += `<div class="prompt"><div class="lab">À toi de dessiner</div><h2>Choisis ton mot</h2></div><div class="picks">${g.data.sets.slice(r * 3, r * 3 + 3).map(i => `<button class="btn block big" data-act="cqpick" data-w="${i}">${H.ic('brush')} ${esc(CQW[i])}</button>`).join('')}</div><p class="hint-txt">Pas de lettres, pas de chiffres : que du dessin !</p>`;
        else h += `<div class="waitcard">${H.av(dr, 'md')}<div><small>${esc(H.nm(dr))} choisit un mot…</small><b>Prépare-toi à deviner</b></div></div>${waitFor(dr, 'Ça arrive')}`;
      } else if (g.phase === 'draw') {
        const w = deobf(g.data.w);
        h += `<div class="cq-head"><div>${me ? `<small>Dessine :</small><div class="word">${esc(w)}</div>` : `<small>${esc(H.nm(dr))} dessine…</small><div class="hintw">${esc(w.replace(/[^ '\-]/g, '_'))}</div>`}</div><div class="pill" id="cqSec">${H.ic('timer')} <span>${this.T}</span>s</div></div><div class="tbar" id="cqBar"><i style="width:100%"></i></div><div class="cvw"><canvas id="cqCv" width="1000" height="1000"></canvas></div>`;
        if (me) { const cs = H.ui.cqc || '#2a2440', ws = H.ui.cqw || 8; h += `<div class="tools">${['#2a2440', '#f0745f', '#f3b94d', '#3bb5a0', '#62a8e5', '#8d7bea', '#ef8fb3', '#8a5a2b'].map(c => `<button class="sw ${c === cs ? 'on' : ''}" style="--c:${c}" data-act="cqcol" data-c="${c}"></button>`).join('')}</div><div class="tools"><div class="seg">${[[5, 'Fin'], [8, 'Moyen'], [18, 'Gros']].map(([v, l]) => `<button class="${ws === v ? 'on' : ''}" data-act="cqw" data-w="${v}">${l}</button>`).join('')}</div><button class="btn ghost sm" data-act="cqundo">${H.ic('undo')}</button><button class="btn ghost sm" data-act="cqclear">${H.ic('trash')}</button><button class="btn ghost sm" data-act="cqskip">Passer</button></div>`; }
        else h += `<form data-form="cq" class="row mt"><input class="field" name="v" maxlength="40" autocomplete="off" placeholder="Ta proposition…"><button class="btn primary sq">${H.ic('send')}</button></form>`;
        h += `<div class="guesses" id="cqG">${this.glist(g)}</div>`;
      } else {
        const hh = g.data.hist[r] || {};
        h += hh.f ? verdict('ok', 'confetti', `Trouvé en ${hh.t}s ! +${this.pts(hh.t)}`) : verdict('ko', 'hourglass', 'Pas trouvé à temps…');
        h += `<div class="center mt"><small class="muted">Le mot était</small><div class="word">${esc(hh.w || '')}</div></div><div class="cvw mt"><canvas id="cqCv" width="1000" height="1000"></canvas></div><div class="actions"><button class="btn primary" data-act="next">${r + 1 >= this.N ? 'Voir le résultat' : 'Manche suivante'} ${H.ic('next')}</button></div>`;
      }
      return h;
    },
    glist(g) { const gu = g.players.find(p => p !== this.drawer(g)); const L = H.pdoc(gu).gs; if (!L || L.r !== g.round) return ''; const w = norm(deobf(g.data.w)); return L.l.slice(-14).map(x => { const d = lev(norm(x), w); const c = d <= 2 && d > 0; return `<span class="guess ${c ? 'close' : ''}">${esc(x)}${c ? ' · presque !' : ''}</span>`; }).join(''); },
    strokes(g) { const d = H.draw(); return d && d.r === g.round ? d.s || [] : []; },
    after(g) {
      const cv = document.getElementById('cqCv'); if (!cv) return;
      const cx = cv.getContext('2d'); const me = this.drawer(g) === H.me() && g.phase === 'draw';
      const st = H.ui.cq = { id: g.id, r: g.round, mine: me ? clone(this.strokes(g)) : null, cur: null };
      const redraw = () => {
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, 1000, 1000);
        const L = me ? [...st.mine, ...(st.cur ? [st.cur] : [])] : this.strokes(g);
        for (const s of L) { const p = s.p; if (!p || p.length < 2) continue; cx.strokeStyle = s.c; cx.lineWidth = s.w * 2.2; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); cx.moveTo(p[0], p[1]); if (p.length === 2) cx.lineTo(p[0] + .1, p[1]); for (let i = 2; i < p.length; i += 2) cx.lineTo(p[i], p[i + 1]); cx.stroke(); }
      };
      st.redraw = () => { if (!me) g = H.g() || g; redraw(); };
      redraw();
      if (me) {
        let writing = false, dirty = false;
        const flush = async () => {
          if (writing) { dirty = true; return; } writing = true;
          do { dirty = false; const s = [...st.mine, ...(st.cur ? [st.cur] : [])]; const body = { r: g.round, s }; if (JSON.stringify(body).length > 700000) { H.toast('Toile pleine ! Efface un peu.'); break; } try { await H.setDraw(clone(body)); } catch (e) { } } while (dirty);
          writing = false;
        };
        st.flush = flush;
        const pt = e => { const b = cv.getBoundingClientRect(); return [Math.round((e.clientX - b.left) / b.width * 1000), Math.round((e.clientY - b.top) / b.height * 1000)]; };
        let lastF = 0;
        cv.onpointerdown = e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { } const [x, y] = pt(e); st.cur = { c: H.ui.cqc || '#2a2440', w: H.ui.cqw || 8, p: [x, y] }; redraw(); };
        cv.onpointermove = e => { if (!st.cur) return; const [x, y] = pt(e); const p = st.cur.p; if (Math.hypot(x - p[p.length - 2], y - p[p.length - 1]) < 5) return; p.push(x, y); redraw(); if (Date.now() - lastF > 700) { lastF = Date.now(); flush(); } };
        const up = () => { if (!st.cur) return; st.mine.push(st.cur); st.cur = null; redraw(); flush(); };
        cv.onpointerup = up; cv.onpointercancel = up;
      }
      if (g.phase === 'draw') {
        const tick = () => {
          const left = Math.max(0, Math.ceil(((g.data.end || 0) - Date.now()) / 1000));
          const b = document.getElementById('cqBar'), s = document.querySelector('#cqSec span');
          if (b) { b.querySelector('i').style.width = (left / this.T * 100) + '%'; b.classList.toggle('low', left <= 10); }
          if (s && s.textContent !== String(left)) { s.textContent = left; if (left <= 5 && left > 0) H.sfx('tick'); }
          const n = H.g(); if (!n || n.id !== g.id || n.round !== g.round || n.phase !== 'draw') return;
          const guesser = this.drawer(n) !== H.me();
          if (left <= 0 && guesser) H.once(`cqto:${g.id}:${g.round}`, 0, () => this.end(n, false));
          if (Date.now() > (g.data.end || 0) + 4000 && !guesser) H.once(`cqto2:${g.id}:${g.round}`, 0, () => this.end(n, false));
        };
        tick(); const iv = setInterval(tick, 250); H.cleanup(() => clearInterval(iv));
      }
    },
    update(g) { const el = document.getElementById('cqG'); if (el) { const nh = this.glist(g); if (el.innerHTML !== nh) el.innerHTML = nh; } if (H.ui.cq && H.ui.cq.redraw && (this.drawer(g) !== H.me() || g.phase !== 'draw')) H.ui.cq.redraw(); },
    pick(g, i) { H.notify('dessine pour toi : viens deviner !'); const w = CQW[i]; H.setDraw({ r: g.round, s: [] }); H.patch({ phase: 'draw', data: { w: obf(w), end: Date.now() + this.T * 1000 } }); H.sfx('coin'); },
    guess(g, v) {
      const L = H.pdoc(H.me()).gs; const l = L && L.r === g.round ? [...L.l] : []; l.push(v.slice(0, 40)); H.mine({ gs: { r: g.round, l: l.slice(-40) } });
      const w = deobf(g.data.w), a = norm(v), b = norm(w);
      if (a === b || (b.length > 4 && lev(a, b) <= 1)) { const t = Math.max(1, Math.round(this.T - ((g.data.end - Date.now()) / 1000))); this.end(g, true, Math.min(t, this.T)); } else H.sfx('tick');
    },
    end(g, found, t) { H.patch({ phase: 'reveal', data: { hist: { [g.round]: { f: found ? 1 : 0, t: t || 0, w: deobf(g.data.w) } } } }); },
    auto(g) { if (g.phase === 'reveal') { const hh = g.data.hist[g.round] || {}; H.once(`cqfx:${g.id}:${g.round}`, 200, () => { if (hh.f) { H.confetti(110); H.sfx('win'); } else H.sfx('fail'); }); } },
    next(g) { if (g.round + 1 >= this.N) { H.patch({ over: true, phase: 'over' }); H.record(g, { s: this.total(g) }); } else H.patch({ round: g.round + 1, phase: 'pick' }); },
    over(g) { const s = this.total(g); const m = s >= 14 ? ['crown', 'Duo de génies !'] : s >= 9 ? ['palette', 'Beaux artistes !'] : s >= 4 ? ['brush', 'Pas mal du tout !'] : ['smiley_x', 'Picasso est déçu…']; return { icon: m[0], t: m[1], sub: `Score duo : ${s} / ${this.N * 3}`, coop: true, list: Object.keys(g.data.hist).map(r => { const h = g.data.hist[r]; return `<div class="dl"><b>${esc(h.w)}</b><span>${h.f ? `trouvé en ${h.t}s · dessin de ${esc(H.nm(g.players[r % 2]))}` : 'pas trouvé'}</span></div>`; }).join('') }; },
    summary(g) { return `${this.total(g)} pts en duo`; },
  };

  /* ---------- Mot mystère ---------- */
  G.mot = {
    init: () => ({ phase: 'play', data: { w: obf(rnd(WORDS)) } }),
    st(uid) { return H.pdoc(uid).w || { rows: [], done: false, ok: false }; },
    turn(g) { return !this.st(H.me()).done; },
    marks(gs, w) { const m = Array(5).fill('b'), c = {}; for (let i = 0; i < 5; i++) { if (gs[i] === w[i]) m[i] = 'g'; else c[w[i]] = (c[w[i]] || 0) + 1; } for (let i = 0; i < 5; i++) if (m[i] !== 'g' && c[gs[i]] > 0) { m[i] = 'y'; c[gs[i]]--; } return m.join(''); },
    view(g) {
      const o = op(g), my = this.st(H.me()), th = this.st(o);
      const u = H.ui.mot && H.ui.mot.id === g.id ? H.ui.mot : (H.ui.mot = { id: g.id, cur: '', seen: my.rows.length });
      let h = `<div class="opp">${H.av(o, 'sm')}<div class="mini">${[...Array(6)].map((_, i) => { const r = th.rows[i]; return [...Array(5)].map((_, j) => `<i class="${r ? r.m[j] : ''}"></i>`).join(''); }).join('')}</div><div><b>${esc(H.nm(o))}</b><small>${th.done ? (th.ok ? `a trouvé en ${th.rows.length}` : 'a séché') : `${th.rows.length}/6 essais`}</small></div></div>`;
      h += `<div class="wgrid">`;
      for (let i = 0; i < 6; i++) {
        const r = my.rows[i]; const anim = r && i === my.rows.length - 1 && u.seen < my.rows.length;
        h += `<div class="wrow ${anim ? 'anim' : ''} ${i === my.rows.length && u.bad ? 'shake' : ''}" data-k="wr${i}${r ? 'f' : ''}">`;
        for (let j = 0; j < 5; j++) { if (r) h += `<div class="wc ${r.m[j]}">${esc(r.g[j])}</div>`; else if (i === my.rows.length && !my.done) h += `<div class="wc ${u.cur[j] ? 'f' : ''}">${esc(u.cur[j] || '')}</div>`; else h += `<div class="wc"></div>`; }
        h += '</div>';
      }
      h += '</div>';
      if (u.seen < my.rows.length) setTimeout(() => { u.seen = my.rows.length; }, 800);
      if (my.done) h += (my.ok ? verdict('ok', 'confetti', `Trouvé en ${my.rows.length} essai${my.rows.length > 1 ? 's' : ''} !`) : verdict('ko', 'smiley_x', "Plus d'essais…")) + (th.done ? '' : waitFor(o, `En attente de ${H.nm(o)}`)) + '<p class="hint-txt">Le mot sera révélé à la fin.</p>';
      else {
        const ks = {}; my.rows.forEach(r => [...r.g].forEach((c, i) => { const m = r.m[i]; if (ks[c] === 'g') return; if (m === 'g') ks[c] = 'g'; else if (m === 'y') ks[c] = 'y'; else if (!ks[c]) ks[c] = 'b'; }));
        const row = s => [...s].map(c => `<button class="k ${ks[c] || ''}" data-act="mk" data-k="${c}">${c}</button>`).join('');
        h += `<div class="kb"><div class="kr">${row('AZERTYUIOP')}</div><div class="kr">${row('QSDFGHJKLM')}</div><div class="kr"><button class="k w" data-act="mk" data-k="ENTER">OK</button>${row('WXCVBN')}<button class="k w" data-act="mk" data-k="DEL">${H.ic('back')}</button></div></div>`;
      }
      return h;
    },
    key(g, c) {
      const my = this.st(H.me()); if (my.done || g.over) return; const u = H.ui.mot; if (!u || u.id !== g.id) return; u.bad = false;
      if (c === 'DEL') u.cur = u.cur.slice(0, -1);
      else if (c === 'ENTER') {
        if (u.cur.length < 5) { u.bad = true; H.sfx('fail'); H.render(); return; }
        const w = deobf(g.data.w); const m = this.marks(u.cur, w); const rows = [...my.rows, { g: u.cur, m }]; const ok = m === 'ggggg';
        u.cur = ''; u.seen = rows.length - 1; H.mine({ w: { rows, done: ok || rows.length >= 6, ok } }); if (ok || rows.length >= 6) H.notify(ok ? `a trouvé le mot en ${rows.length} essai${rows.length > 1 ? 's' : ''}. À toi !` : 'a terminé le Mot Mystère. À toi !'); H.sfx(ok ? 'win' : 'place'); if (ok) H.confetti(120);
      } else if (/^[A-Z]$/.test(c) && u.cur.length < 5) { u.cur += c; H.sfx('key'); }
      H.render();
    },
    auto(g) {
      const o = op(g); const a = this.st(H.me()), b = this.st(o);
      if (a.done && b.done) H.once(`mo:${g.id}`, H.lead(g) ? 0 : 2500, () => { const n = H.g(); if (!n || n.id !== g.id || n.over) return; const A = this.st(n.players[0]), B = this.st(n.players[1]); let w = null; if (A.ok && B.ok) w = A.rows.length < B.rows.length ? n.players[0] : B.rows.length < A.rows.length ? n.players[1] : null; else if (A.ok) w = n.players[0]; else if (B.ok) w = n.players[1]; H.patch({ over: true, phase: 'over', winner: w }); H.record(n, { w }); });
    },
    over(g) { const o = op(g), w = g.winner, a = this.st(H.me()), b = this.st(o); return { icon: w === H.me() ? 'trophy' : w ? 'medal' : 'handshake', t: w === H.me() ? 'Tu gagnes le duel !' : w ? `${H.nm(o)} gagne !` : 'Égalité !', sub: `Le mot était <b>${esc(deobf(g.data.w))}</b><br>Toi : ${a.ok ? a.rows.length + ' essais' : 'raté'} · ${esc(H.nm(o))} : ${b.ok ? b.rows.length + ' essais' : 'raté'}`, raw: true, win: w === H.me() }; },
    summary(g) { const a = this.st(H.me()); return a.done ? 'en attente' : `${a.rows.length}/6 essais`; },
  };

  /* ---------- Morpion ultime ---------- */
  G.ut = {
    init: b => { const f = rnd(b.players); return { phase: 'play', turn: f, data: { c: '.'.repeat(81), m: '.'.repeat(9), n: -1, X: f, last: -1 } }; },
    sym: (g, u) => g.data.X === u ? 'X' : 'O',
    turn(g) { return g.turn === H.me(); },
    view(g) {
      const o = op(g), d = g.data, my = g.turn === H.me() && !g.over; const cnt = ch => [...d.m].filter(x => x === ch).length;
      const sym = u => `<i class="sym ${this.sym(g, u)}"></i>`;
      let h = H.scorebar(g, { scores: { [H.me()]: cnt(this.sym(g, H.me())), [o]: cnt(this.sym(g, o)) }, turn: g.turn, label: 'Carrés gagnés', badges: { [H.me()]: sym(H.me()), [o]: sym(o) } });
      if (!g.over) h += `<div class="turnmsg ${my ? 'me' : ''}">${my ? (d.n < 0 ? 'À toi ! Joue où tu veux' : 'À toi ! Joue dans le carré en surbrillance') : `Au tour de ${esc(H.nm(o))}…`}</div>`;
      h += `<div class="ub">`;
      for (let b = 0; b < 9; b++) {
        const act = !g.over && d.m[b] === '.' && (d.n < 0 || d.n === b);
        h += `<div class="mb ${act ? 'act' : ''} ${!act && d.m[b] === '.' ? 'dim' : ''}">`;
        for (let i = 0; i < 9; i++) { const k = b * 9 + i, v = d.c[k]; h += `<button class="uc ${k === d.last ? 'last' : ''}" data-act="ut" data-k="${k}">${v !== '.' ? `<i class="sym ${v}"></i>` : ''}</button>`; }
        if (d.m[b] !== '.') h += `<div class="mbw ${d.m[b] === '=' ? 'D' : d.m[b]}">${d.m[b] === '=' ? '=' : `<i class="sym big ${d.m[b]}"></i>`}</div>`;
        h += '</div>';
      }
      return h + `</div>`;
    },
    play(g, k) {
      const d = clone(g.data), b = k / 9 | 0, i = k % 9;
      if (g.turn !== H.me() || g.over || d.c[k] !== '.' || d.m[b] !== '.' || (d.n >= 0 && d.n !== b)) return H.sfx('fail');
      const s = this.sym(g, H.me()); const c = [...d.c]; c[k] = s; d.c = c.join(''); const mini = c.slice(b * 9, b * 9 + 9); const m = [...d.m];
      let wonMini = false; if (win3(mini, s)) { m[b] = s; wonMini = true; } else if (!mini.includes('.')) m[b] = '=';
      d.m = m.join(''); d.n = m[i] === '.' ? i : -1; d.last = k;
      const o = op(g); let over = false, winner = null;
      if (win3(m, s)) { over = true; winner = H.me(); }
      else if (!m.includes('.')) { over = true; const cx = m.filter(x => x === 'X').length, co = m.filter(x => x === 'O').length, ox = d.X, oo = g.players.find(p => p !== ox); winner = cx > co ? ox : co > cx ? oo : null; }
      H.setG(Object.assign({}, g, { data: d, turn: over ? null : o, over, winner, phase: over ? 'over' : 'play' }));
      H.sfx(wonMini ? 'coin' : 'place'); if (wonMini && !over) H.confetti(40);
      if (over) H.record(g, { w: winner }); turnMsg(g, over, 'Morpion Ultime');
    },
    over(g) { const o = op(g), w = g.winner; return { icon: w === H.me() ? 'trophy' : w ? 'medal' : 'handshake', t: w === H.me() ? 'Victoire stratégique !' : w ? `${H.nm(o)} gagne !` : 'Match nul !', sub: 'Morpion Ultime', win: w === H.me(), board: true }; },
    summary(g) { return g.turn === H.me() ? 'À toi de jouer' : `Au tour de ${H.nm(op(g))}`; },
  };

  /* ---------- Puissance 4 ---------- */
  G.p4 = {
    init: b => { const f = rnd(b.players); return { phase: 'play', turn: f, data: { b: '.'.repeat(42), R: f, last: -1, line: [] } }; },
    sym: (g, u) => g.data.R === u ? 'R' : 'J',
    turn(g) { return g.turn === H.me(); },
    view(g) {
      const o = op(g), d = g.data, my = g.turn === H.me() && !g.over;
      const tok = u => `<i class="tok ${this.sym(g, u)}"></i>`;
      const k = g.id + ':' + d.last; const anim = H.ui.p4 !== k; if (anim) setTimeout(() => { H.ui.p4 = k; }, 700);
      let h = H.scorebar(g, { turn: g.turn, label: 'Puissance 4', badges: { [H.me()]: tok(H.me()), [o]: tok(o) }, scores: { [H.me()]: '', [o]: '' } });
      if (!g.over) h += `<div class="turnmsg ${my ? 'me' : ''}">${my ? 'À toi ! Touche une colonne' : `Au tour de ${esc(H.nm(o))}…`}</div>`;
      h += `<div class="p4">`;
      for (let c = 0; c < 7; c++) { h += `<div class="p4c" data-act="p4" data-c="${c}">`; for (let r = 0; r < 6; r++) { const i = r * 7 + c, v = d.b[i]; h += `<div class="hole">${v !== '.' ? `<div class="piece ${v} ${i === d.last && anim ? 'drop' : ''} ${(d.line || []).includes(i) ? 'win' : ''}" style="--d:${r + 1}"></div>` : ''}</div>`; } h += '</div>'; }
      return h + '</div>';
    },
    play(g, c) {
      const d = clone(g.data); if (g.turn !== H.me() || g.over) return H.sfx('fail');
      let idx = -1; for (let r = 5; r >= 0; r--) if (d.b[r * 7 + c] === '.') { idx = r * 7 + c; break; } if (idx < 0) return H.sfx('fail');
      const s = this.sym(g, H.me()), b = [...d.b]; b[idx] = s; d.b = b.join(''); d.last = idx;
      const line = p4line(d.b, idx, s); const o = op(g); let over = false, winner = null;
      if (line) { over = true; winner = H.me(); d.line = line; } else if (!d.b.includes('.')) over = true;
      H.setG(Object.assign({}, g, { data: d, turn: over ? null : o, over, winner, phase: over ? 'over' : 'play' })); setTimeout(() => H.sfx('land'), 380);
      if (over) H.record(g, { w: winner }); turnMsg(g, over, 'Puissance 4');
    },
    over(g) { const o = op(g), w = g.winner; return { icon: w === H.me() ? 'trophy' : w ? 'medal' : 'handshake', t: w === H.me() ? 'Puissance… TOI !' : w ? `${H.nm(o)} aligne 4 !` : 'Grille pleine, égalité !', sub: 'Puissance 4', win: w === H.me(), board: true }; },
    summary(g) { return g.turn === H.me() ? 'À toi de jouer' : `Au tour de ${H.nm(op(g))}`; },
  };

  /* ---------- Cartes à parler ---------- */
  G.cartes = {
    setup: 'cartes',
    init: (b, o) => ({ phase: 'card', data: { deck: o.cat, order: shuffle([...DECKS[o.cat].cards.keys()]), i: 0 } }),
    turn: () => false,
    view(g) {
      const d = g.data, D = DECKS[d.deck], n = d.order.length, i = Math.min(d.i, n); const first = g.players[i % 2];
      if (i >= n) return `<div class="over card"><div class="over-ic">${H.ic(D.e)}</div><h2>Paquet terminé !</h2><p class="muted mt">Vous avez fait le tour des ${n} cartes « ${esc(D.n)} ».</p><div class="actions"><button class="btn primary" data-act="cashuffle">${H.ic('shuffle')} Rebattre</button><button class="btn ghost" data-act="cadeck">Changer de paquet</button></div></div>`;
      return `<div class="stack"><div class="tcard" data-k="cc-${i}-${d.deck}" style="--c:${D.c}"><div class="meta"><span>${H.ic(D.e)} ${esc(D.n)}</span><span>${i + 1} / ${n}</span></div><h2>${esc(D.cards[d.order[i]])}</h2><div class="meta"><span class="row">${H.av(first, 'xs')} ${first === H.me() ? 'Tu réponds en premier' : esc(H.nm(first)) + ' répond en premier'}</span></div></div></div>
      <div class="reacts">${H.reactBar()}</div>
      <div class="actions"><button class="btn ghost sm" data-act="caprev" ${i === 0 ? 'disabled' : ''}>${H.ic('back')}</button><button class="btn primary" data-act="canext">Carte suivante ${H.ic('next')}</button></div><div class="center mt"><button class="btn ghost sm" data-act="cadeck">${H.ic('cards')} Changer de paquet</button></div>`;
    },
    summary(g) { const D = DECKS[g.data.deck]; return `${D.n} · carte ${Math.min(g.data.i + 1, g.data.order.length)}/${g.data.order.length}`; },
  };
  return G;
}
