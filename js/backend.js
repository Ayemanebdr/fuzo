// Accès aux données : Firebase (vrai mode) ou stockage local (mode démo).
import { firebaseConfig } from '../firebase-config.js';
const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }, del(k) { try { localStorage.removeItem(k); } catch (e) { } } };

const clean = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
export function deepMerge(t, s) {
  t = clean(t) || {};
  for (const k in s) {
    const v = s[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && t[k] && typeof t[k] === 'object' && !Array.isArray(t[k])) t[k] = deepMerge(t[k], v);
    else t[k] = clean(v);
  }
  return t;
}

/* ================= Mode démo ================= */
function demoBackend() {
  const KEY = 'fuzo-demo-v2';
  let docs = {};
  try { docs = JSON.parse(LS.get(KEY) || '{}'); } catch (e) {}
  const subs = new Set();
  let q = false, sv = null;
  const notify = () => {
    if (!q) { q = true; setTimeout(() => { q = false; subs.forEach(s => s()); }, 0); }
    clearTimeout(sv); sv = setTimeout(() => { try { LS.set(KEY, JSON.stringify(docs)); } catch (e) {} }, 300);
  };
  const depth = p => p.split('/').length;
  const colDocs = p => Object.keys(docs).filter(k => k.startsWith(p + '/') && depth(k) === depth(p) + 1).map(k => Object.assign({ id: k.split('/').pop() }, clean(docs[k])));
  let me = LS.get('fuseau-demo-me') || 'demo-1';
  const userCbs = new Set();
  const B = {
    mode: 'demo',
    uid: () => me,
    onUser(cb) { userCbs.add(cb); setTimeout(() => cb({ uid: me, email: me + '@demo' }), 0); return () => userCbs.delete(cb); },
    switchUser(u) { me = u; LS.set('fuseau-demo-me', u); userCbs.forEach(cb => cb({ uid: me, email: me + '@demo' })); },
    async signUp() {}, async signIn() {}, async reset() {}, async signOut() {},
    async get(p) { return clean(docs[p]) ?? null; },
    async set(p, d) { docs[p] = clean(d); notify(); },
    async merge(p, d) { docs[p] = deepMerge(docs[p] || {}, d); notify(); },
    async del(p) { delete docs[p]; notify(); },
    async add(p, d) { const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); docs[p + '/' + id] = clean(d); notify(); return id; },
    watch(p, cb) { let last; const s = () => { const v = JSON.stringify(docs[p] ?? null); if (v !== last) { last = v; cb(clean(docs[p]) ?? null); } }; subs.add(s); setTimeout(s, 0); return () => subs.delete(s); },
    watchCol(p, o = {}, cb) {
      let last;
      const s = () => {
        let L = colDocs(p);
        if (o.where) L = L.filter(d => d[o.where[0]] === o.where[2]);
        if (o.order) L.sort((a, b) => ((a[o.order] ?? 0) - (b[o.order] ?? 0)) * (o.dir === 'desc' ? -1 : 1));
        if (o.limit) L = L.slice(0, o.limit);
        const v = JSON.stringify(L); if (v !== last) { last = v; cb(L); }
      };
      subs.add(s); setTimeout(s, 0); return () => subs.delete(s);
    },
    resetDemo() { docs = {}; LS.del(KEY); },
  };
  return B;
}

/* ================= Firebase ================= */
async function firebaseBackend() {
  const F = await import('./vendor/firebase.js');
  const app = F.initializeApp(firebaseConfig);
  let db;
  try { db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); }
  catch (e) { db = F.initializeFirestore(app, {}); }
  // Identité de l'appareil : une clé secrète longue, gardée sur le téléphone (récupérable via la clé de profil)
  const A = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let uid = LS.get('fuzo-uid');
  if (!uid) { uid = Array.from(crypto.getRandomValues(new Uint8Array(22)), x => A[x % A.length]).join(''); LS.set('fuzo-uid', uid); }
  const B = {
    mode: 'firebase',
    uid: () => uid,
    onUser(cb) { setTimeout(() => cb({ uid }), 0); return () => { }; },
    useKey(k) { LS.set('fuzo-uid', k); location.href = location.pathname; },
    async signOut() { },
    async get(p) { const s = await F.getDoc(F.doc(db, p)); return s.exists() ? s.data() : null; },
    set: (p, d) => F.setDoc(F.doc(db, p), clean(d)),
    merge: (p, d) => F.setDoc(F.doc(db, p), clean(d), { merge: true }),
    del: p => F.deleteDoc(F.doc(db, p)),
    async add(p, d) { const r = await F.addDoc(F.collection(db, p), clean(d)); return r.id; },
    watch(p, cb, err) { return F.onSnapshot(F.doc(db, p), s => cb(s.exists() ? s.data() : null), e => { console.warn('watch', p, e); err && err(e); }); },
    watchCol(p, o = {}, cb, err) {
      const parts = [];
      if (o.where) parts.push(F.where(...o.where));
      if (o.order) parts.push(F.orderBy(o.order, o.dir || 'asc'));
      if (o.limit) parts.push(F.limit(o.limit));
      return F.onSnapshot(F.query(F.collection(db, p), ...parts), s => cb(s.docs.map(d => Object.assign({ id: d.id }, d.data()))), e => { console.warn('watchCol', p, e); err && err(e); });
    },
  };
  return B;
}

export async function makeBackend(forceDemo) {
  if (!forceDemo && firebaseConfig && firebaseConfig.apiKey) {
    try { return await firebaseBackend(); } catch (e) { console.error('Firebase indisponible', e); }
  }
  return demoBackend();
}
