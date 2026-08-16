import { mainLayout } from '../layout.js';

export function settingsView() {
    const content = `
        <div style="max-width: 850px; margin: 0 auto;">
            
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 30px;">Pengaturan Akun</h2>

            <div class="widget-card" style="margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 20px; align-items: center;">
                    <div style="font-size: 30px;">🌙</div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px;">Mode Gelap</h3>
                        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.7;">Ubah tampilan menjadi warna gelap agar nyaman di mata.</p>
                    </div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="darkModeToggle">
                    <span class="slider round"></span>
                </label>
            </div>

            <div class="widget-card" style="margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 30px;">
                    <div style="position: relative;">
                        <img src="./images/windah.png" id="settingProfileImg" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #eee;">
                        <label for="fileInput" style="position: absolute; bottom: 0; right: 0; background: #A18D6D; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white;">📷</label>
                        <input type="file" id="fileInput" accept="image/*" style="display: none;">
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px;">Foto Profil</h3>
                        <p style="margin: 5px 0 0; opacity: 0.7; font-size: 14px;">Klik ikon kamera untuk mengganti foto.</p>
                    </div>
                </div>
            </div>

            <div class="widget-card" style="margin-bottom: 30px;">
                <h3 class="widget-title" style="margin-bottom: 20px;">Informasi Pribadi</h3>
                <form id="editProfileForm">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div><label class="form-label">Nama Depan</label><input type="text" id="inputFirstName" class="form-input"></div>
                        <div><label class="form-label">Nama Akhir</label><input type="text" id="inputLastName" class="form-input"></div>
                    </div>
                    <div style="margin-bottom: 20px;"><label class="form-label">Email</label><input type="email" id="inputEmail" class="form-input"></div>
                    <div style="margin-bottom: 20px;"><label class="form-label">Nomor Telepon</label><input type="tel" id="inputPhone" class="form-input"></div>
                    <button type="submit" class="btn btn--primary">Perbarui Info</button>
                </form>
            </div>

            <div class="widget-card" style="margin-bottom: 30px;">
                <h3 class="widget-title" style="margin-bottom: 20px;">🔒 Ganti Password</h3>
                <form id="changePasswordForm">
                    <div style="margin-bottom: 20px;"><label class="form-label">Password Lama</label><input type="password" id="inputOldPass" class="form-input" required></div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div><label class="form-label">Password Baru</label><input type="password" id="inputNewPass" class="form-input" required></div>
                        <div><label class="form-label">Konfirmasi</label><input type="password" id="inputConfirmPass" class="form-input" required></div>
                    </div>
                    <button type="submit" class="btn btn--outline">Simpan Password</button>
                </form>
            </div>

            <div class="widget-card" style="margin-top: 20px;">
                <h4 style="margin-bottom:15px;">💾 Manajemen Data</h4>
                <p style="font-size:13px; color:#666; margin-bottom:15px;">Simpan data tugasmu ke file komputer atau pulihkan dari file cadangan.</p>
                
                <div style="display:flex; gap:10px;">
                    <button id="btnExport" class="btn btn--outline" style="border-color: #2979FF; color: #2979FF;">⬇ Export Data (.json)</button>
                    <button id="btnImportTrigger" class="btn btn--outline" style="border-color: #00C853; color: #00C853;">⬆ Import Data</button>
                    <input type="file" id="fileImport" accept=".json" style="display: none;">
                </div>
            </div>

            <div class="widget-card" style="border: 1px solid #FECACA; background: #FEF2F2;">
                <h3 style="color: #DC2626; margin-top:0;">⚠️ Perhatian</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p style="margin: 0; font-size: 13px; color: #DC2626;">Hapus semua tugas secara permanen.</p>
                    <button id="btnDeleteAll" class="btn" style="background: #DC2626; color: white;">🗑️ Hapus Semua Data</button>
                </div>
            </div>
        </div>
    `;
    return mainLayout(content, 'settings');
}