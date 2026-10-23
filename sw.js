/* IDF2026 影展手册 · offline cache */
const C='idf26-v1';
const CORE=['./','./index.html','./map-campus.jpg','./map-hangzhou.jpg','./qr-booking.jpg','./qr-tickets.jpg','./qr-tickets-code.jpg','./icon-512.png','./apple-touch-icon.png','./favicon-32.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin){
    if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{c.put(r,res.clone());return res;}))));}
    return; // ratings, counters: always live
  }
  if(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html')){
    // network first, so updates show up; fall back to cache offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;})));
});
