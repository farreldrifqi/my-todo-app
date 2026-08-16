# PRD: What To-Do — Personal Task Management PWA

**Status:** Retrospective (ditulis berdasarkan produk yang sudah dibangun)
**Dokumen ini menjelaskan produk seolah-olah spek awal sebelum development**, untuk keperluan portfolio & wawancara.

---

## 1. Problem Statement

Pengguna individu (mahasiswa, pekerja lepas, karyawan) sering kehilangan jejak tugas harian karena tersebar di banyak media — catatan fisik, chat, memori. Akibatnya deadline terlewat dan prioritas tidak jelas. Tanpa alat yang ringan, cepat diakses, dan bisa dipakai offline, pengguna kehilangan produktivitas dan mengalami stres akibat tugas yang menumpuk tanpa visibilitas.

**Siapa yang terdampak:** individu yang mengelola tugas pribadi/akademik/pekerjaan sehari-hari, terutama yang butuh akses cepat dari HP tanpa install aplikasi berat atau bergantung koneksi internet stabil.

**Dampak jika tidak diselesaikan:** tugas terlewat, prioritas tidak terkelola, tidak ada gambaran progres, dan pengguna beralih ke tools kompetitor yang lebih berat/berbayar untuk kebutuhan sederhana.

---

## 2. Goals

1. Pengguna dapat mencatat, mengelola, dan menyelesaikan tugas dalam < 3 langkah dari halaman manapun
2. Pengguna mendapat gambaran progres tugas secara visual (persentase Todo/Process/Done) tanpa perlu menghitung manual
3. Aplikasi tetap dapat diakses & digunakan tanpa koneksi internet (offline-first)
4. Pengguna tidak kehilangan data saat pindah perangkat, lewat fitur backup/restore mandiri
5. Pengguna mendapat pengingat otomatis untuk tugas yang jatuh tempo hari ini

---

## 3. Non-Goals

- **Kolaborasi multi-user / sharing tugas antar akun** — di luar scope; aplikasi ini murni personal task manager, bukan tools tim
- **Sinkronisasi cloud/multi-device real-time** — data disimpan lokal (IndexedDB) per perangkat; sinkronisasi lintas device butuh backend terpisah yang belum dibangun
- **Notifikasi push saat aplikasi tertutup** — sistem notifikasi saat ini hanya aktif ketika aplikasi dibuka (bukan background push notification via server)
- **Kategori/label/tag kustom untuk tugas selain prioritas** — sengaja disederhanakan jadi 3 level prioritas untuk menjaga UI tetap ringan
- **Native mobile app (iOS/Android)** — pendekatan yang dipilih adalah PWA agar cross-platform tanpa perlu maintain codebase terpisah

---

## 4. User Stories

### Autentikasi & Profil
- Sebagai pengguna baru, saya ingin mendaftar dengan email & password agar data tugas saya tersimpan dan bersifat privat
- Sebagai pengguna, saya ingin login agar bisa mengakses tugas-tugas saya
- Sebagai pengguna, saya ingin mengubah foto profil dan info pribadi agar aplikasi terasa personal
- Sebagai pengguna, saya ingin mengganti password agar akun saya tetap aman

### Manajemen Tugas Inti
- Sebagai pengguna, saya ingin menambah tugas baru dengan judul, tanggal deadline, prioritas, deskripsi, dan foto lampiran agar informasi tugas lengkap
- Sebagai pengguna, saya ingin melihat daftar semua tugas aktif saya agar tahu apa yang harus dikerjakan
- Sebagai pengguna, saya ingin mengedit tugas yang sudah dibuat agar bisa memperbarui info saat ada perubahan
- Sebagai pengguna, saya ingin menandai tugas sebagai selesai agar progres saya tercatat
- Sebagai pengguna, saya ingin menghapus tugas yang tidak relevan lagi
- Sebagai pengguna, saya ingin memulihkan (restore) tugas yang sudah selesai kembali ke status aktif jika saya salah tandai

### Visibilitas & Navigasi
- Sebagai pengguna, saya ingin melihat ringkasan progres (dashboard) berupa grafik agar saya paham beban kerja saya sekilas
- Sebagai pengguna, saya ingin mencari tugas berdasarkan kata kunci agar cepat menemukan tugas tertentu
- Sebagai pengguna, saya ingin mengurutkan tugas berdasarkan prioritas atau tenggat waktu agar bisa fokus ke yang paling penting
- Sebagai pengguna, saya ingin melihat tugas dalam tampilan kalender agar paham sebaran deadline saya dalam sebulan

### Pengingat
- Sebagai pengguna, saya ingin menerima notifikasi otomatis saat membuka aplikasi jika ada tugas jatuh tempo hari ini agar tidak lupa
- Sebagai pengguna, saya ingin bisa mengecek manual lewat tombol notifikasi kapan saja saya mau

### Data & Portabilitas
- Sebagai pengguna, saya ingin mengekspor semua data tugas saya ke file JSON agar punya backup pribadi
- Sebagai pengguna, saya ingin mengimpor file backup agar bisa memulihkan data di perangkat lain
- Sebagai pengguna, saya ingin opsi menghapus semua data sekaligus jika saya ingin mulai dari nol

### Aksesibilitas & Preferensi
- Sebagai pengguna, saya ingin mengaktifkan dark mode agar nyaman digunakan malam hari
- Sebagai pengguna, saya ingin aplikasi tetap berjalan saat offline agar tidak bergantung koneksi internet
- Sebagai pengguna, saya ingin aplikasi bisa di-install ke home screen seperti aplikasi native

---

## 5. Requirements

### Must-Have (P0)
| Requirement | Acceptance Criteria |
|---|---|
| Autentikasi (register/login) | - [ ] User bisa register dengan email unik + password<br>- [ ] Login gagal menampilkan pesan error yang jelas<br>- [ ] Session tersimpan sehingga user tidak perlu login ulang tiap buka app |
| CRUD Tugas | - [ ] User bisa create tugas dengan judul, tanggal, prioritas, deskripsi, gambar opsional<br>- [ ] User bisa edit semua field tugas yang sudah ada<br>- [ ] User bisa delete tugas dengan konfirmasi<br>- [ ] Tugas tersimpan per akun (tidak tercampur antar user) |
| Status tugas | - [ ] Tugas punya 3 status: Todo, Process, Done<br>- [ ] User bisa tandai selesai dan restore kembali |
| Dashboard ringkasan | - [ ] Persentase status tugas ditampilkan dalam bentuk chart<br>- [ ] Data chart update otomatis saat status tugas berubah |
| Penyimpanan lokal | - [ ] Semua data tersimpan di IndexedDB, tidak hilang saat refresh/tutup browser |
| Offline mode | - [ ] Aplikasi tetap bisa dibuka & CRUD tugas tanpa koneksi internet |

### Nice-to-Have (P1)
| Requirement | Acceptance Criteria |
|---|---|
| Search & Sort | - [ ] Pencarian real-time berdasarkan judul tugas<br>- [ ] Sort by prioritas/tenggat/terbaru |
| Kalender view | - [ ] Kalender bulanan menampilkan indikator tugas per tanggal, warna sesuai prioritas |
| Notifikasi deadline | - [ ] Notifikasi browser muncul otomatis untuk tugas due hari ini<br>- [ ] User bisa cek manual lewat tombol lonceng |
| Export/Import data | - [ ] Export menghasilkan file `.json` yang valid<br>- [ ] Import memvalidasi format sebelum menimpa data |
| Dark mode | - [ ] Preferensi tema tersimpan dan konsisten di seluruh halaman |
| Upload gambar profil & lampiran tugas | - [ ] Validasi ukuran file maksimal (2MB untuk foto profil) |

### Future Considerations (P2)
- Sinkronisasi cloud lintas perangkat (butuh backend/API)
- Push notification background (butuh service worker + push API + server)
- Kolaborasi/shared task list antar user
- Kategori/label kustom di luar prioritas
- Reminder terjadwal (bukan hanya saat app dibuka)

---

## 6. Success Metrics

> Karena ini personal project (bukan produk dengan basis user riil), metrik berikut bersifat hipotetis — cara berpikir yang akan dipakai jika produk ini dirilis ke publik.

**Leading Indicators**
- Task completion rate: % tugas yang ditandai selesai dari total tugas dibuat — target 60% dalam 30 hari
- Time to add task: rata-rata waktu dari klik "Tambah Tugas" sampai submit — target < 30 detik
- Adoption fitur kalender: % user aktif yang membuka halaman kalender minimal 1x/minggu — target 40%

**Lagging Indicators**
- Retention: % user yang kembali membuka app setelah 7 hari — target 35%
- Export/Import usage: % user yang pernah melakukan backup data — indikator trust terhadap penyimpanan lokal

**Metode pengukuran:** karena belum ada analytics terpasang, metrik ini akan membutuhkan instrumentasi tambahan (event tracking) sebagai langkah lanjutan sebelum bisa diukur nyata.

---

## 7. Open Questions

- Apakah perlu menambahkan analytics (mis. Plausible/PostHog) untuk mengukur metrik di atas? *(engineering)*
- Apakah notifikasi push background layak diprioritaskan mengingat kompleksitas implementasi service worker + push API? *(engineering/product)*
- Apakah data lokal (IndexedDB) cukup aman untuk kebutuhan privasi, atau perlu enkripsi tambahan pada password yang disimpan? *(security — catatan: saat ini password disimpan plaintext di IndexedDB, ini perlu diperbaiki sebelum produksi nyata)*
- Apakah target user butuh versi multi-device sync, atau personal-only device storage sudah cukup untuk use case yang dituju? *(product)*

---

## 8. Timeline Considerations

*(Ditulis retrospektif — bukan estimasi asli, hanya ilustrasi cara phasing jika direncanakan ulang)*

- **Fase 1 (MVP):** Auth, CRUD tugas, dashboard chart, penyimpanan lokal
- **Fase 2:** Search/sort, kalender, notifikasi, dark mode
- **Fase 3:** Export/import, pengaturan profil lengkap, PWA/offline hardening
- **Fase 4 (belum dikerjakan):** Cloud sync, push notification, kolaborasi

---

## 9. Technical Notes (ringkas, untuk konteks reviewer teknis)

- **Arsitektur:** SPA client-side routing (History API), tanpa framework — Vanilla JS ES6+
- **Build tool:** Webpack 5 + Babel
- **Storage:** IndexedDB via library `idb`, tidak ada backend/API server
- **PWA:** Service Worker untuk caching + offline fallback, Web App Manifest untuk installability
