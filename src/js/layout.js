// src/js/layout.js

export function mainLayout(contentHTML, activeMenu = 'dashboard') {
    const userJson = localStorage.getItem('currentUser');
    const user = userJson ? JSON.parse(userJson) : { username: 'Guest', email: 'guest@gmail.com', profilePic: null };
    
    // Fallback gambar jika profil kosong
    const userImg = user.profilePic || './images/windah.png';
    
    const isActive = (menu) => activeMenu === menu ? 'active' : '';

    return `
    <div class="app-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="profile-box">
                    <img src="${userImg}" alt="Profile" class="profile-img sidebar-profile-img">
                    <div class="profile-info">
                        <h3 class="profile-name">${user.username}</h3>
                        <p class="profile-email">${user.email}</p>
                    </div>
                </div>
            </div>

            <nav class="nav-menu">
                <a href="/dashboard" class="nav-item ${isActive('dashboard')}" data-link>
                    <span class="icon">⊞</span> Halaman Utama
                </a>
                <a href="/tasks" class="nav-item ${isActive('tasks')}" data-link>
                    <span class="icon">☑</span> Tugas Saya
                </a>
                <a href="/completed" class="nav-item ${isActive('completed')}" data-link>
                    <span class="icon">📋</span> Tugas Selesai
                </a>
                <a href="/add" class="nav-item ${isActive('add')}" data-link>
                    <span class="icon">✎</span> Tambah Tugas
                </a>
                <a href="/settings" class="nav-item ${isActive('settings')}" data-link>
                    <span class="icon">⚙</span> Pengaturan
                </a>
                <a href="/help" class="nav-item ${isActive('help')}" data-link>
                    <span class="icon">?</span> Bantuan
                </a>
            </nav>

            <div class="sidebar-footer">
                <a href="/login" class="nav-item logout-btn" data-link>
                    <span class="icon">↪</span> Keluar
                </a>
            </div>
        </aside>

        <div class="main-wrapper">
            <header class="top-header">
                <div class="brand-logo">What <span>To-Do</span></div>
                
                <div class="header-right">
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Cari tugas Anda...">
                        <button>🔍</button>
                    </div>

                    <select id="sortSelect" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #E5E7EB; background: #F9FAFB; color: #374151; font-size: 13px; cursor: pointer; outline: none; margin-right: 10px;">
                        <option value="newest">📅 Terbaru</option>
                        <option value="priority">🔥 Prioritas Tertinggi</option>
                        <option value="date">⏳ Tenggat Terdekat</option>
                    </select>

                    <div class="header-icons">
                        <button id="btnNotif" class="icon-btn" title="Cek Notifikasi">🔔 </button>
                        <a href="/calendar" class="icon-btn" data-link>📅</a>
                    </div>
                    <div class="header-date">
                        <strong>${new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</strong>
                        <small>${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}</small>
                    </div>
                </div>
            </header>

            <main class="content-area">
                ${contentHTML}
            </main>
        </div>

        <div id="editModal" class="modal-overlay hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999; display:none; align-items:center; justify-content:center;">
            <div class="modal-box" style="background:white; padding:30px; border-radius:12px; width:450px; box-shadow:0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <h3 style="margin:0;">Edit Tugas ✏️</h3>
                    <button id="closeEditModal" style="background:none; border:none; font-size:20px; cursor:pointer;">×</button>
                </div>
                <form id="editTaskForm">
                    <input type="hidden" id="editTaskId">
                    
                    <div style="margin-bottom:15px;">
                        <label class="form-label">Judul Tugas</label>
                        <input type="text" id="editTaskTitle" class="form-input" required>
                    </div>

                    <div style="margin-bottom:15px;">
                        <label class="form-label">Deskripsi</label>
                        <textarea id="editTaskDesc" class="form-input" rows="4" style="resize: vertical;" placeholder="Tambahkan detail tugas..."></textarea>
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <label class="form-label">Prioritas</label>
                        <select id="editTaskPriority" class="form-input">
                            <option value="High">🔥 Penting</option>
                            <option value="Medium">⚡ Sedang</option>
                            <option value="Low">☕ Santai</option>
                        </select>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label class="form-label">Status</label>
                        <select id="editTaskStatus" class="form-input">
                            <option value="todo">Belum Dikerjakan</option>
                            <option value="process">Dalam Proses</option>
                            <option value="done">Selesai</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn--primary" style="width:100%;">Simpan Perubahan</button>
                </form>
            </div>
        </div>

        <div id="detailModal" class="modal-overlay hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999; display:none; align-items:center; justify-content:center;">
            <div class="modal-box" style="background:white; padding:0; border-radius:16px; width: 900px; max-width: 95%; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden; max-height: 90vh; display: flex; flex-direction: column;">
                
                <div style="padding: 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #FAFAFA;">
                    <h3 style="margin:0; font-size: 20px;">Detail Tugas 📄</h3>
                    <button id="closeDetailModal" style="background:none; border:none; font-size:28px; cursor:pointer; color: #666;">×</button>
                </div>

                <div style="padding: 40px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 40px;">
                        <div>
                            <div style="margin-bottom: 30px;">
                                <span id="detailBadge" class="badge" style="margin-bottom: 10px; font-size: 12px; padding: 6px 12px;">Priority</span>
                                <h2 id="detailTitle" style="margin: 0; font-size: 32px; color: #333; line-height: 1.2;">Judul Tugas</h2>
                                <div style="display: flex; gap: 20px; margin-top: 15px; font-size: 14px; color: #666;">
                                    <span id="detailDate" style="display:flex; align-items:center; gap:5px;">📅 -</span>
                                    <span id="detailStatus" style="font-weight: 600; display:flex; align-items:center; gap:5px;">● -</span>
                                </div>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 30px 0;">
                            <div style="margin-bottom: 25px;">
                                <label style="font-weight: 700; font-size: 14px; color: #888; display: block; margin-bottom: 12px; letter-spacing: 1px;">DESKRIPSI</label>
                                <p id="detailDesc" style="color: #444; line-height: 1.8; font-size: 16px; background: #fcfcfc; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px; margin: 0; min-height: 100px;">
                                    Tidak ada deskripsi.
                                </p>
                            </div>
                        </div>
                        <div id="detailImageContainer" style="display: none;">
                            <label style="font-weight: 700; font-size: 14px; color: #888; display: block; margin-bottom: 12px; letter-spacing: 1px;">LAMPIRAN FOTO</label>
                            <div style="border: 1px solid #eee; border-radius: 12px; padding: 10px; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                                <img id="detailImage" src="" style="width: 100%; height: auto; border-radius: 8px; display: block;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `;
}