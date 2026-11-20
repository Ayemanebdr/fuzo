// Kobi, le robot de Fuzo : un adversaire pour s'entraîner quand le duo n'est pas dispo.
import { TELE, DEV, WORDS } from './content.js';
import { win3, p4line, deobf } from './games.js';

export const BOT_ID = 'bot';
export const BOT_GAMES = ['tele', 'dev', 'mot', 'ut', 'p4'];
export const BOT_PROFILE = { name: 'Kobi', avatar: { t: 'preset', id: 'bot-1' }, col: '#62a8e5', city: 'Le Cloud', bio: 'Robot joueur, jamais fatigué', seen: 0 };

const rnd = a => a[Math.random() * a.length | 0];

export function makeBot(api) {
  // api : { G, pdoc(uid), writeMine(patch) pour Kobi, g(), once(key, delay, fn) }
  const done = new Set();
  const later = (key, ms, fn) => { if (done.has(key)) return; done.add(key); setTimeout(() => { try { fn(); } catch (e) { console.error(e); } }, ms); };
  const think = (a, b) => a + Math.random() * (b - a);

  /* --- Télépathie : Kobi choisit souvent la réponse la plus évidente --- */
  function tele(g) {
    if (g.phase !== 'answer') return;
    const a = api.pdoc(BOT_ID).a; if (a && a.r === g.round) return;
    later(`t${g.id}${g.round}`, think(1500, 3500), () => {
      const n = api.g(); if (!n || n.id !== g.id || n.round !== g.round || n.phase !== 'answer') return;
      const it = TELE[n.data.q[n.round]]; const L = it.a.length ? it.a : ['?'];
      const v = Math.random() < .5 ? L[0] : rnd(L);
      api.write({ a: { r: n.round, v } });
    });
  }
  /* --- Devine-moi : réponse + pari --- */
  function dev(g) {
    if (g.phase !== 'answer') return;
    const a = api.pdoc(BOT_ID).a; if (a && a.r === g.round) return;
    later(`d${g.id}${g.round}`, think(1500, 3000), () => {
      const n = api.g(); if (!n || n.id !== g.id || n.round !== g.round || n.phase !== 'answer') return;
      const Q = DEV[n.data.q[n.round]]; const k = Q.o.length;
      api.write({ a: { r: n.round, v: { s: Math.random() * k | 0, g: Math.random() * k | 0 } } });
    });
  }
  /* --- Mot mystère : déduction avec un peu de hasard --- */
  function mot(g) {
    const st = api.pdoc(BOT_ID).w || { rows: [] }; if (st.done) return;
    later(`m${g.id}${st.rows.length}`, think(3500, 7000), () => {
      const n = api.g(); if (!n || n.id !== g.id || n.over) return;
      const cur = api.pdoc(BOT_ID).w || { rows: [] }; if (cur.done || cur.rows.length !== st.rows.length) return;
      const ans = deobf(n.data.w); const marks = api.G.mot.marks.bind(api.G.mot);
      const cands = WORDS.filter(w => cur.rows.every(r => marks(r.g, w) === r.m));
      const guess = cur.rows.length === 0 || Math.random() < .2 || !cands.length ? rnd(WORDS) : rnd(cands);
      const m = marks(guess, ans); const rows = [...cur.rows, { g: guess, m }]; const ok = m === 'ggggg';
      api.write({ w: { rows, done: ok || rows.length >= 6, ok } });
    });
  }
  /* --- Morpion ultime : gagne, bloque, évite d'offrir des cadeaux --- */
  function utMove(g) {
    const U = api.G.ut, d = g.data, s = U.sym(g, BOT_ID), o = s === 'X' ? 'O' : 'X';
    let best = null, bs = -1e9;
    for (const k of U.legal(g)) {
      const b = k / 9 | 0, i = k % 9; let sc = Math.random() * .6;
      const mini = [...d.c.slice(b * 9, b * 9 + 9)]; mini[i] = s;
      if (win3(mini, s)) { sc += 10; const m = [...d.m]; m[b] = s; if (win3(m, s)) sc += 100; }
      const block = [...d.c.slice(b * 9, b * 9 + 9)]; block[i] = o; if (win3(block, o)) sc += 6;
      const after = [...d.m]; if (win3(mini, s)) after[b] = s;
      if (after[i] !== '.') sc -= 3; // l'adversaire jouerait où il veut
      else {
        const t = [...d.c.slice(i * 9, i * 9 + 9)]; if (i === b) t[i] = s;
        for (let j = 0; j < 9; j++) if (t[j] === '.') { const t2 = [...t]; t2[j] = o; if (win3(t2, o)) { sc -= 5; break; } }
      }
      if (i === 4) sc += .6; else if ([0, 2, 6, 8].includes(i)) sc += .3;
      if (sc > bs) { bs = sc; best = k; }
    }
    return best;
  }
  function ut(g) {
    if (g.turn !== BOT_ID) return;
    later(`u${g.id}${g.data.last}`, think(900, 1800), () => { const n = api.g(); if (!n || n.id !== g.id || n.turn !== BOT_ID || n.over) return; const k = utMove(n); if (k != null) api.G.ut.play(n, k, BOT_ID); });
  }
  /* --- Puissance 4 : minimax (profondeur 4) --- */
  function p4Move(g) {
    const s = api.G.p4.sym(g, BOT_ID), o = s === 'R' ? 'J' : 'R'; const B = [...g.data.b];
    const drop = (b, c) => { for (let r = 5; r >= 0; r--) if (b[r * 7 + c] === '.') return r * 7 + c; return -1; };
    const W = [0, 1, 4, 30];
    const evalB = b => { let sc = 0; for (let r = 0; r < 6; r++) if (b[r * 7 + 3] === s) sc += 2; else if (b[r * 7 + 3] === o) sc -= 2;
      for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
        let a = 0, z = 0, ok = true; for (let k = 0; k < 4; k++) { const rr = r + dr * k, cc = c + dc * k; if (rr < 0 || rr > 5 || cc < 0 || cc > 6) { ok = false; break; } const v = b[rr * 7 + cc]; if (v === s) a++; else if (v === o) z++; }
        if (!ok) continue; if (a && !z) sc += W[a] || 0; else if (z && !a) sc -= (W[z] || 0) * 1.2; }
      return sc; };
    const order = [3, 2, 4, 1, 5, 0, 6];
    function mm(b, depth, al, be, max) {
      let any = false, best = max ? -1e9 : 1e9;
      for (const c of order) { const i = drop(b, c); if (i < 0) continue; any = true; const ch = max ? s : o; b[i] = ch;
        let v; if (p4line(b, i, ch)) v = max ? 1e6 + depth : -1e6 - depth; else if (depth === 0) v = evalB(b); else v = mm(b, depth - 1, al, be, !max);
        b[i] = '.';
        if (max) { best = Math.max(best, v); al = Math.max(al, v); } else { best = Math.min(best, v); be = Math.min(be, v); }
        if (be <= al) break; }
      return any ? best : 0;
    }
    let bc = 3, bv = -1e18;
    for (const c of order) { const i = drop(B, c); if (i < 0) continue; B[i] = s; const v = p4line(B, i, s) ? 1e7 : mm(B, 3, -1e18, 1e18, false) + Math.random() * 2; B[i] = '.'; if (v > bv) { bv = v; bc = c; } }
    return bc;
  }
  function p4(g) {
    if (g.turn !== BOT_ID) return;
    later(`p${g.id}${g.data.last}`, think(800, 1600), () => { const n = api.g(); if (!n || n.id !== g.id || n.turn !== BOT_ID || n.over) return; api.G.p4.play(n, p4Move(n), BOT_ID); });
  }
  return { tick(g) { if (!g || g.over || !g.players.includes(BOT_ID)) return; ({ tele, dev, mot, ut, p4 }[g.type] || (() => { }))(g); } };
}
