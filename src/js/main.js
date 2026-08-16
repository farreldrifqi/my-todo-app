import { router, navigateTo } from './routes.js';

// Tombol Back
window.addEventListener('popstate', router);

// 2. navigasi klik link
document.addEventListener('DOMContentLoaded', () => {
    
    document.body.addEventListener('click', e => {
        // Cek apakah elemen yang diklik punya atribut 'data-link'
        const linkElement = e.target.closest('[data-link]');
        
        if (linkElement) {
            e.preventDefault();
            navigateTo(linkElement.href); // Pindah halaman secara SPA
        }
    });

    // load halaman pertama kali
    router();
});

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Pakai tanda slash '/' di depan
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker terdaftar:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Gagal daftar Service Worker:', error);
            });
    });
}