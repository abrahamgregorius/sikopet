if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: '/' })
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.log('Service Worker registration failed:', err));
}