const CACHE_NAME='hawassaa-steel-erp-v4';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./hawassaa-steal-logo.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin) return;
  event.respondWith(
    fetch(event.request).then(r=>{
      if(r && r.ok){
        const copy=r.clone();
        caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
      }
      return r;
    }).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html')))
  );
});
