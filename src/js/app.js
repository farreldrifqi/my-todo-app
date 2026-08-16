// import style global
import './main.js';
import '../styles/main.css';
import '../styles/pages/auth.css'; 

// import router
import { router, navigateTo } from '../js/routes.js';

// Logika Utama Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    
    // Intercept (Cegat) semua klik pada link navigasi SPA
    document.body.addEventListener('click', e => {
        
        // Cari apakah yang diklik adalah link dengan atribut 'data-link' 
        const targetLink = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');

        if (targetLink) {
            e.preventDefault(); // STOP browser melakukan refresh halaman
            navigateTo(targetLink.href); // Pindah halaman secara SPA
        }
    });

    // Jalankan router untuk pertama kali (cek URL saat ini & render halaman)
    router();
});
// kalau user klik tombol Back di browser, halaman tetap berubah tanpa reload
window.addEventListener('popstate', router);