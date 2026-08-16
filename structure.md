# 📁 Struktur Proyek & Arsitektur - What To-Do App

Dokumen ini menjelaskan struktur direktori, arsitektur modul, dan fungsi dari setiap berkas dalam proyek **What To-Do** (Single Page Application & Progressive Web App).

---

## 🌳 Diagram Struktur Direktori

```text
my-todo-app/
│
├── .gitignore                     # Konfigurasi file yang diabaikan oleh Git
├── README.md                      # Dokumentasi umum & panduan penggunaan aplikasi
├── structure.md                   # Dokumentasi detail struktur direktori & arsitektur (file ini)
├── package.json                   # Konfigurasi dependensi, package info, dan npm scripts
├── package-lock.json              # Pengunci versi dependensi npm
├── webpack.config.js              # Konfigurasi bundling Webpack 5, loaders, dan plugins
│
├── public/                        # Aset statis (disalin langsung ke dist/ oleh Webpack)
│   ├── _redirects                 # Konfigurasi fallback routing SPA untuk platform hosting (Netlify/Vercel)
│   ├── manifest.json              # Konfigurasi PWA (Web App Manifest: nama, tema, icon, display mode)
│   ├── service-worker.js          # Script Service Worker untuk caching aset & fitur offline mode
│   └── images/                    # Aset grafis, ikon aplikasi, dan ilustrasi
│       ├── auth-pattern.png       # Pola latar belakang untuk halaman login/register
│       ├── icon-192.png           # Ikon PWA ukuran 192x192 px
│       ├── icon-512.png           # Ikon PWA ukuran 512x512 px
│       ├── login-illustration.png # Ilustrasi visual pada halaman login
│       ├── register-illustration.png # Ilustrasi visual pada halaman register
│       ├── screenshot-placeholder.png# Gambar mockup/pratinjau aplikasi untuk README & manifest
│       └── windah.png             # Avatar profil default pengguna
│
├── src/                           # Source code utama aplikasi
│   ├── index.html                 # Template HTML tunggal sebagai wadah utama SPA (#app root)
│   │
│   ├── styles/                    # Kumpulan stylesheet CSS
│   │   ├── main.css               # Variabel CSS global, reset, tipografi, dan utility classes
│   │   └── pages/                 # Stylesheet khusus halaman/komponen
│   │       ├── auth.css           # Styling form otentikasi (Login & Register)
│   │       └── dashboard.css      # Styling layout dashboard, sidebar, cards, modal, dan kalender
│   │
│   └── js/                        # Modul JavaScript (ES6 Modules)
│       ├── app.js                 # Entry point Webpack: inisialisasi CSS global & interceptor link SPA
│       ├── main.js                # Registrasi Service Worker & event listener navigasi browser
│       ├── routes.js              # Routing SPA, handler navigasi, controller logika bisnis, dan event UI
│       ├── db.js                  # Abstraksi IndexedDB (via library 'idb') untuk users & tasks
│       ├── layout.js              # Generator template shell global (Sidebar, Top Header, dan Modals)
│       │
│       └── views/                 # Modul view / komponen halaman (UI Renderer)
│           ├── login.js           # Tampilan form login akun
│           ├── register.js        # Tampilan form registrasi pengguna baru
│           ├── dashboard.js       # Halaman utama dengan ringkasan tugas, chart statistik, dan tugas terbaru
│           ├── tasks.js           # Halaman daftar seluruh tugas aktif (belum selesai)
│           ├── completed.js       # Halaman daftar riwayat tugas yang sudah selesai
│           ├── add.js             # Halaman formulir penambahan tugas baru
│           ├── calendar.js        # Tampilan kalender interaktif untuk memantau deadline tugas
│           ├── settings.js        # Halaman pengaturan profil, tema (Dark Mode), dan backup/restore JSON
│           └── help.js            # Halaman panduan penggunaan, FAQ, dan informasi aplikasi
│
└── dist/                          # Hasil kompilasi/build production (siap di-deploy)
```

---

## 🔍 Penjelasan Rinci Berkas & Modul

### 1. Root Directory (Konfigurasi & Manajemen Proyek)

| Berkas / Direktori | Deskripsi |
| :--- | :--- |
| [`package.json`](file:///D:/TPT%20Project/my-todo-app/package.json) | Menyimpan metadata proyek, daftar dependensi (`date-fns`, `idb`, `uuid`), devDependencies Webpack/Babel, serta skrip `npm run start` dan `npm run build`. |
| [`webpack.config.js`](file:///D:/TPT%20Project/my-todo-app/webpack.config.js) | Konfigurasi bundling Webpack 5. Mengatur entry point ([`src/js/app.js`](file:///D:/TPT%20Project/my-todo-app/src/js/app.js)), output hash caching ke [`dist/`](file:///D:/TPT%20Project/my-todo-app/dist), `babel-loader`, `css-loader`, `HtmlWebpackPlugin`, serta `CopyWebpackPlugin` untuk menyalin folder [`public/`](file:///D:/TPT%20Project/my-todo-app/public). |
| [`README.md`](file:///D:/TPT%20Project/my-todo-app/README.md) | Panduan komprehensif mengenai fitur, teknologi, dan cara menjalankan aplikasi di lingkungan lokal maupun deployment. |
| [`structure.md`](file:///D:/TPT%20Project/my-todo-app/structure.md) | Dokumentasi arsitektur dan peta struktur direktori proyek. |

---

### 2. Direktori [`public/`](file:///D:/TPT%20Project/my-todo-app/public) (Aset Statis & PWA)

Direktori ini memuat seluruh aset yang tidak melalui proses transformasi webpack, melainkan disalin utuh ke folder distribusi:

- [`manifest.json`](file:///D:/TPT%20Project/my-todo-app/public/manifest.json): Berkas manifest PWA yang mendefinisikan nama aplikasi, warna tema, orientasi, serta konfigurasi ikon agar aplikasi dapat diinstal di perangkat pengguna (Desktop/Mobile).
- [`service-worker.js`](file:///D:/TPT%20Project/my-todo-app/public/service-worker.js): Menangani caching aset statis dan rute aplikasi agar aplikasi dapat diakses secara offline (*Offline-First*).
- [`_redirects`](file:///D:/TPT%20Project/my-todo-app/public/_redirects): Aturan routing SPA (`/* /index.html 200`) untuk platform seperti Netlify/Cloudflare Pages agar tidak terjadi error 404 saat pengguna me-refresh URL custom.
- [`images/`](file:///D:/TPT%20Project/my-todo-app/public/images): Folder penyimpan aset gambar aplikasi (ikon PWA, ilustrasi login/register, screenshot panduan, dan foto profil default).

---

### 3. Direktori [`src/`](file:///D:/TPT%20Project/my-todo-app/src) (Kode Sumber Aplikasi)

#### A. Entry Point & Template Utama
- [`src/index.html`](file:///D:/TPT%20Project/my-todo-app/src/index.html): Template dasar HTML. Berisi tag `<div id="app"></div>` tempat konten halaman di-render secara dinamis oleh router JavaScript.
- [`src/js/app.js`](file:///D:/TPT%20Project/my-todo-app/src/js/app.js): Titik masuk utama aplikasi (Webpack entry). Mengimpor CSS global, menginisialisasi router SPA saat `DOMContentLoaded`, dan menangkap klik pada elemen dengan atribut `data-link`.
- [`src/js/main.js`](file:///D:/TPT%20Project/my-todo-app/src/js/main.js): Mendaftarkan Service Worker ([`service-worker.js`](file:///D:/TPT%20Project/my-todo-app/public/service-worker.js)) ke browser dan mendengarkan event navigasi history (`popstate`).

#### B. Basis Data & Model ([`src/js/db.js`](file:///D:/TPT%20Project/my-todo-app/src/js/db.js))
Menggunakan IndexedDB browser melalui *wrapper* library `idb` untuk penyimpanan data klien yang persisten dan berkapasitas besar:
- **Object Store `users`**: Menyimpan kredensial dan profil user (Primary Key: `email`).
- **Object Store `tasks`**: Menyimpan daftar tugas (Primary Key: `id` auto-increment, Index: `userEmail`).
- **Fungsi Kunci**:
  - Autentikasi: `registerUser`, `loginUser`, `getUser`, `updateUser`.
  - Manajemen Tugas: `addTask`, `getTasksByUser`, `getTaskById`, `updateTask`, `deleteTask`.
  - Pemeliharaan: `clearDatabase`, `deleteDatabase`, `exportDatabase`, `importDatabase`.

#### C. Navigasi, Router & Logika Bisnis ([`src/js/routes.js`](file:///D:/TPT%20Project/my-todo-app/src/js/routes.js))
Pusat kontrol navigasi dan orkestrasi fungsionalitas aplikasi:
- **Router SPA**: Memetakan path URL (`/dashboard`, `/tasks`, `/completed`, `/add`, `/calendar`, `/settings`, `/help`, `/login`, `/register`) ke fungsi render view masing-masing.
- **Route Guard**: Memastikan pengguna telah login sebelum mengakses halaman privat (redirection ke `/login` jika session kosong).
- **Interactive Controllers**:
  - Filter pencarian dan sorting tugas (Terbaru, Prioritas Tertinggi, Tenggat Terdekat).
  - Kalkulasi persentase status tugas untuk diagram donat di Dashboard.
  - Event handler CRUD tugas (Tambah, Edit modal, Hapus, Toggle Status Selesai).
  - Tampilan modal detail tugas & lampiran gambar.
  - Kalender interaktif dan penandaan tanggal tenggat waktu.
  - Fitur Notifikasi cerdas (cek tugas jatuh tempo hari ini).
  - Ekspor dan impor data format JSON serta pergantian Dark Mode.

#### D. Shell Layout & Komponen Global ([`src/js/layout.js`](file:///D:/TPT%20Project/my-todo-app/src/js/layout.js))
- Menghasilkan struktur antarmuka global (`mainLayout`) yang membungkus setiap halaman privat.
- Terdiri atas:
  - **Sidebar**: Navigasi menu utama, avatar & info pengguna aktif, dan tombol keluar.
  - **Top Header**: Logo aplikasi, bilah pencarian instan, filter sort, lonceng notifikasi, shortcut kalender, dan widget tanggal hari ini.
  - **Global Modals**: Modal edit tugas (`#editModal`) dan modal pratinjau detail tugas (`#detailModal`).

#### E. Tampilan Halaman ([`src/js/views/`](file:///D:/TPT%20Project/my-todo-app/src/js/views))
- [`login.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/login.js): Halaman masuk dengan input email dan kata sandi.
- [`register.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/register.js): Halaman pendaftaran akun baru lengkap dengan validasi.
- [`dashboard.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/dashboard.js): Halaman dashboard berisi daftar tugas aktif, grafik donat status (*Todo*, *Process*, *Done*), dan log aktivitas tugas terakhir diselesaikan.
- [`tasks.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/tasks.js): Tampilan fokus daftar semua tugas yang sedang berjalan.
- [`completed.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/completed.js): Tampilan arsip tugas-tugas yang telah selesai dikerjakan.
- [`add.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/add.js): Form penambahan tugas dengan dukungan judul, deskripsi, level prioritas, tanggal deadline, dan unggah lampiran gambar (Base64).
- [`calendar.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/calendar.js): Tampilan kalender grid bulanan dengan navigasi bulan dan indikator deadline tugas.
- [`settings.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/settings.js): Pengaturan profil akun, switch Dark/Light mode, serta aksi *Backup/Restore* data JSON dan reset database.
- [`help.js`](file:///D:/TPT%20Project/my-todo-app/src/js/views/help.js): Halaman panduan penggunaan, FAQ interaktif, dan panduan fitur PWA.

---

### 4. Direktori [`src/styles/`](file:///D:/TPT%20Project/my-todo-app/src/styles) (Gaya & Desain Visual)

- [`src/styles/main.css`](file:///D:/TPT%20Project/my-todo-app/src/styles/main.css): Desain dasar, variabel warna tema (Light/Dark mode), reset box-sizing, tipografi, utility button, badge, dan animasi transisi.
- [`src/styles/pages/auth.css`](file:///D:/TPT%20Project/my-todo-app/src/styles/pages/auth.css): Tata letak split-screen responsif, form input, dan kartu otentikasi.
- [`src/styles/pages/dashboard.css`](file:///D:/TPT%20Project/my-todo-app/src/styles/pages/dashboard.css): Tata letak grid dashboard, sidebar navigasi, header bar, task card item, chart ring donat, grid kalender, dan styling modal dialog.

---

## ⚡ Alur Kerja & Arsitektur Aplikasi

```text
[ Browser Event / URL Change ]
             │
             ▼
      [ src/js/app.js ] ── (Cegat <a> click / popstate)
             │
             ▼
     [ src/js/routes.js ] ─── Cek Session (localStorage)
      (Router & Controller)
             │
      ┌──────┴───────────────────────────┐
      ▼                                  ▼
[ Belum Login ]                     [ Terautentikasi ]
  loginView / registerView            layout.js + views/*.js
                                         │
                                         ├─── Interaksi Data ───► [ src/js/db.js ] (IndexedDB)
                                         │
                                         └─── Render Output  ───► <div id="app"></div> (DOM)
```
