// 셀린영어 앱 껍데기 + 알림(Firebase 클라우드 메시징) 서비스 워커 (학생 기록은 저장하지 않아요)
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyAx5iIGJQEh5hlQld-1lNnp6oH6Fak08JM",authDomain:"celine-english.firebaseapp.com",projectId:"celine-english",storageBucket:"celine-english.firebasestorage.app",messagingSenderId:"15227783892",appId:"1:15227783892:web:dffb28462e79d54f594941"});
const messaging = firebase.messaging(); // 알림은 Firebase가 자동으로 띄워요

const CACHE = 'celine-shell-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // 앱 화면(구글)은 늘 새로 받아요
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.startsWith(self.registration.scope)) return w.focus();
    return self.clients.openWindow('./');
  }));
});
