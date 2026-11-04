/* Shine Catering service worker: opens the app and menus without internet */
var C='shine-v1';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','manifest.webmanifest','images/logo.png','images/icon-192.png','images/icon-512.png'])}).catch(function(){}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin)return; /* Firebase and fonts go straight to the network */
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./')})}));
});
