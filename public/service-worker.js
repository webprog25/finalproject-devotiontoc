const CACHE='ironlog-v1';
const CORE=['/','/index.html','/styles.css','/main.js','/manifest.webmanifest'];

self.addEventListener('install',e=>{

  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',()=>self.clients.claim());
self.addEventListener('fetch',e=>{

  if(e.request.method!=='GET') 
    return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
