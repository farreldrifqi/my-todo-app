import { exportDatabase, importDatabase } from './db.js';
import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { dashboardView } from './views/dashboard.js';
import { completedView } from './views/completed.js';
import { tasksView } from './views/tasks.js';
import { addView } from './views/add.js';
import { settingsView } from './views/settings.js';
import { helpView } from './views/help.js';
import { calendarView } from './views/calendar.js';
import { registerUser, loginUser, addTask, getTasksByUser, updateTask, deleteTask, getTaskById, getUser, updateUser } from './db.js';

const routes = {
    '/': loginView,
    '/login': loginView,
    '/register': registerView,
    '/dashboard': dashboardView,
    '/completed': completedView,
    '/tasks': tasksView,
    '/add': addView,
    '/settings': settingsView,
    '/calendar': calendarView,
    '/help': helpView
};

export const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    router();
};

// helper untuk sorting tasks
function sortTasks(tasks, criteria) {
    return tasks.sort((a, b) => {
        if (criteria === 'priority') {
            const map = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return map[b.priority] - map[a.priority]; // dari High dulu
        } else if (criteria === 'date') {
            // Kalau tidak ada tanggal, taruh paling bawah
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate); // Terdekat dulu
        } else {
            // Default: Terbaru (Created At Descending)
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
}

// render task list di dashboard
async function renderTaskList(userEmail) {
    const container = document.getElementById('taskListContainer');
    if (!container) return;
    
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';
    const sortCriteria = sortSelect ? sortSelect.value : 'newest';

    try {
        const tasks = await getTasksByUser(userEmail);

        // update chart dan widget di dashboard
        const total = tasks.length;
        let countDone = 0, countProcess = 0, countTodo = 0;
        tasks.forEach(t => {
            if (t.status === 'done') countDone++;
            else if (t.status === 'process') countProcess++;
            else countTodo++;
        });

        if (total > 0) {
            const pctDone = Math.round((countDone / total) * 100);
            const pctProcess = Math.round((countProcess / total) * 100);
            const pctTodo = Math.round((countTodo / total) * 100);

            const txtDone = document.getElementById('textDone'); const txtProcess = document.getElementById('textProcess'); const txtTodo = document.getElementById('textTodo');
            if (txtDone) txtDone.innerText = `${pctDone}%`; if (txtProcess) txtProcess.innerText = `${pctProcess}%`; if (txtTodo) txtTodo.innerText = `${pctTodo}%`;

            const elDone = document.getElementById('chartDone'); const elProcess = document.getElementById('chartProcess'); const elTodo = document.getElementById('chartTodo');
            if (elDone) elDone.style.background = `conic-gradient(#00C853 ${pctDone}%, #E0E0E0 0)`;
            if (elProcess) elProcess.style.background = `conic-gradient(#0046FF ${pctProcess}%, #E0E0E0 0)`;
            if (elTodo) elTodo.style.background = `conic-gradient(#FF1744 ${pctTodo}%, #E0E0E0 0)`;
        }

        // update mini list tugas selesai di dashboard
        const miniList = document.getElementById('miniDoneList');
        if (miniList) {
            // Ambil semua tugas selesai, lalu urutkan dari yang paling baru
            const lastDoneTask = tasks
                .filter(t => t.status === 'done' && t.completedAt) // Pastikan punya waktu selesai
                .sort((a, b) => b.completedAt - a.completedAt)[0]; // Urutkan dari waktu selesai terbaru

            if (lastDoneTask) {
                miniList.innerHTML = `
                    <div class="task-item" style="border: none; padding: 15px; background: #F9FAFB; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h4 style="font-size: 14px; text-decoration:line-through; color:#888; margin:0 0 5px 0;">${lastDoneTask.title}</h4>
                            <small style="color:#aaa;">Selesai: ${new Date().toLocaleDateString()}</small>
                        </div>
                        <span class="badge" style="color: #00C853; background: #E8F5E9; font-size: 10px;">✔ Selesai</span>
                    </div>`;
            } else {
                miniList.innerHTML = '<p style="font-size:12px; color:#aaa; margin-top: 10px;">Belum ada tugas selesai.</p>';
            }
        }

        // 3. Render tugas aktif (Preview Dashboard)
        let activeTasks = tasks.filter(t => t.status !== 'done');
        
        if (keyword) activeTasks = activeTasks.filter(t => t.title.toLowerCase().includes(keyword));
        
        activeTasks = sortTasks(activeTasks, sortCriteria); // Pakai fungsi sortHelper yang sudah ada
        activeTasks = activeTasks.slice(0, 3); // Ambil 3 teratas saja

        if (activeTasks.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 30px; color: #888;"><p>✨ Tidak ada tugas aktif.</p></div>`;
            return;
        }

        let listHTML = '';
        activeTasks.forEach(task => {
            let badgeClass = task.priority === 'High' ? 'badge-priority-high' : 'badge';
            let statusColor = task.status === 'process' ? '#0046FF' : '#FF1744';
            let statusText = task.status === 'process' ? 'Dalam Proses' : 'Belum Dikerjakan';

            listHTML += `
                <div class="task-item">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p class="task-desc">${new Date(task.createdAt).toLocaleDateString()}</p>
                        <div class="task-meta">
                            <span class="badge ${badgeClass}">${task.priority}</span>
                            <span style="color: ${statusColor}; font-weight:600; font-size:12px;">● ${statusText}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon btn-view" data-id="${task.id}" title="Lihat">👁️</button>
                        <button class="btn-icon btn-edit" data-id="${task.id}" title="Edit">✏️</button>
                        <button class="btn-icon btn-done" data-id="${task.id}" title="Selesai">✅</button>
                        <button class="btn-icon btn-delete" data-id="${task.id}" title="Hapus">🗑️</button>
                    </div>
                </div>`;
        });
        container.innerHTML = listHTML;

        // Fitur Notifikasi Tugas Deadline Hari Ini
        // Ambil Tanggal LOKAL Indonesia
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        // Filter Tugas Deadline Hari Ini
        const dueToday = tasks.filter(t => t.dueDate === today && t.status !== 'done');

        if (dueToday.length > 0 && Notification.permission === 'granted') {
            
            // Cek "Waktu Terakhir Notif" (bukan sekadar "sudah pernah")
            const lastNotifTime = sessionStorage.getItem('lastNotifTime');
            const now = Date.now();
            
            // Kalau belum pernah notif ATAU sudah lebih dari 5 detik yang lalu
            // (Angka 5000 ms ini mencegah spam saat refresh cepat, tapi tetap muncul kalau dibuka ulang)
            if (!lastNotifTime || (now - lastNotifTime > 5000)) {
                
                new Notification("📅 Pengingat Tugas", {
                    body: `Halo! Kamu punya ${dueToday.length} tugas deadline hari ini. KERJAIN WOI!`,
                    icon: '/images/icon-192.png',
                    tag: 'daily-reminder'
                });

                // Simpan waktu notifikasi terakhir
                sessionStorage.setItem('lastNotifTime', now);
            }
        }
    } catch (error) { 
        console.error(error); 
    }
}

// Render di page Tugas saya (Full List + Sorting)
async function renderMyTasksPage(userEmail) {
    const container = document.getElementById('myTasksListContainer');
    if (!container) return;

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';
    const sortCriteria = sortSelect ? sortSelect.value : 'newest';

    try {
        const tasks = await getTasksByUser(userEmail);
        let activeTasks = tasks.filter(t => t.status !== 'done');

        // Filter Search
        if (keyword) {
            activeTasks = activeTasks.filter(t => t.title.toLowerCase().includes(keyword));
        }

        // Sorting
        activeTasks = sortTasks(activeTasks, sortCriteria);

        if (activeTasks.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #888;"><p>Tidak ada tugas yang cocok.</p></div>`;
            return;
        }

        let listHTML = '';
        activeTasks.forEach(task => {
            let badgeClass = task.priority === 'High' ? 'badge-priority-high' : 'badge';
            let statusColor = task.status === 'process' ? '#0046FF' : '#FF1744';
            let statusText = task.status === 'process' ? 'Dalam Proses' : 'Belum Dikerjakan';
            let dateText = task.dueDate ? `📅 Deadline: ${task.dueDate}` : `📅 Dibuat: ${new Date(task.createdAt).toLocaleDateString()}`;

            const imgHTML = task.image 
                ? `<div style="flex-shrink: 0; margin-left: 20px;">
                     <img src="${task.image}" style="width: 130px; height: 95px; object-fit: cover; border-radius: 10px; border: 1px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                   </div>` 
                : '';

            listHTML += `
                <div class="task-item" style="display: flex; align-items: center; justify-content: space-between; padding: 25px; min-height: 140px;">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #111;">${task.title}</h3>
                        <div class="task-meta" style="margin-bottom: 20px;">
                            <span class="badge ${badgeClass}" style="padding: 5px 10px; font-size: 11px;">${task.priority}</span>
                            <span style="color: ${statusColor}; font-weight:700; font-size:13px; margin-left: 8px;">● ${statusText}</span>
                            <span style="color: #888; font-size: 13px; margin-left: 12px;">${dateText}</span>
                        </div>
                        <div class="task-actions" style="justify-content: flex-start; gap: 12px;">
                            <button class="btn-icon btn-view" data-id="${task.id}" title="Lihat" style="background:#FFF3E0; color:#F57C00; width: 40px; height: 40px; font-size: 18px;">👁️</button>
                            <button class="btn-icon btn-edit" data-id="${task.id}" title="Edit" style="background:#E3F2FD; color:#1565C0; width: 40px; height: 40px; font-size: 18px;">✏️</button>
                            <button class="btn-icon btn-done" data-id="${task.id}" title="Selesai" style="background:#E8F5E9; color:green; width: 40px; height: 40px; font-size: 18px;">✅</button>
                            <button class="btn-icon btn-delete" data-id="${task.id}" title="Hapus" style="background:#FFEBEE; color:red; width: 40px; height: 40px; font-size: 18px;">🗑️</button>
                        </div>
                    </div>
                    ${imgHTML}
                </div>`;
        });
        container.innerHTML = listHTML;
    } catch (error) { console.error(error); }
}

// Render page di Tugas Selesai (Full List + Sorting)
async function renderCompletedPage(userEmail) {
    const container = document.getElementById('completedListContainer');
    if (!container) return;

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';
    const sortCriteria = sortSelect ? sortSelect.value : 'newest';

    try {
        const tasks = await getTasksByUser(userEmail);
        let completedTasks = tasks.filter(t => t.status === 'done');

        if (keyword) {
            completedTasks = completedTasks.filter(t => t.title.toLowerCase().includes(keyword));
        }
        
        // Sorting
        completedTasks = sortTasks(completedTasks, sortCriteria);

        if (completedTasks.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">Tidak ada riwayat.</div>';
            return;
        }

        let listHTML = '';
        completedTasks.forEach(task => {
            const imgHTML = task.image 
                ? `<div style="flex-shrink: 0; margin-left: 20px;">
                     <img src="${task.image}" style="width: 130px; height: 95px; object-fit: cover; border-radius: 10px; border: 1px solid #eee; opacity: 0.8;">
                   </div>` 
                : '';

            listHTML += `
                <div class="task-item task-done" style="background: #fafafa; opacity: 0.9; display: flex; align-items: center; justify-content: space-between; padding: 25px; min-height: 140px;">
                    <div style="flex: 1;">
                        <h4 style="text-decoration: line-through; color: #888; font-size: 18px; margin: 0 0 10px 0;">${task.title}</h4>
                        <p class="task-desc" style="font-size: 14px; margin-bottom: 20px;">Selesai pada ${new Date().toLocaleDateString()}</p> 
                        <div class="task-actions" style="justify-content: flex-start; gap: 12px;">
                            <button class="btn-icon btn-view" data-id="${task.id}" title="Lihat" style="background:#FFF3E0; color:#F57C00; width: 40px; height: 40px;">👁️</button>
                            <button class="btn-icon btn-restore" data-id="${task.id}" title="Restore" style="width: 40px; height: 40px;">↩️</button>
                            <button class="btn-icon btn-delete" data-id="${task.id}" title="Hapus" style="width: 40px; height: 40px;">🗑️</button>
                        </div>
                    </div>
                    ${imgHTML}
                </div>`;
        });
        container.innerHTML = listHTML;
    } catch (error) { console.error(error); }
}

// Route handler utama
export const router = async () => {
    // Logic untuk dark mode 🌙
    // Cek apakah user pernah simpan pilihan 'dark'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    const path = window.location.pathname;
    const view = routes[path] || loginView;
    document.getElementById('app').innerHTML = await view();

    const publicPaths = ['/login', '/register', '/'];
    const userJson = localStorage.getItem('currentUser');
    
    if (!publicPaths.includes(path) && !userJson) {
        alert('Login dulu!'); navigateTo('/login'); return;
    }

    // Logika tombol notifikasi (Manual Check)
    const btnNotif = document.getElementById('btnNotif');
    
    if (btnNotif) {
        btnNotif.addEventListener('click', async (e) => {
            e.preventDefault(); // Mencegah reload kalau pakai tag <a>

            // Cek & Minta Izin Notifikasi
            let permission = Notification.permission;
            
            if (permission === 'default' || permission === 'denied') {
                // Ini trigger browser popup "Allow Notifications?"
                permission = await Notification.requestPermission();
            }

            // Jika Diizinkan, Langsung Cek Tugas
            if (permission === 'granted') {
                
                // Ambil data user & tugas terbaru
                const userLocal = JSON.parse(localStorage.getItem('currentUser'));
                if (userLocal) {
                    try {
                        const tasks = await getTasksByUser(userLocal.email);
                        
                        // Filter Tugas Deadline Hari Ini
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const today = `${year}-${month}-${day}`;

                        const dueToday = tasks.filter(t => t.dueDate === today && t.status !== 'done');

                        // Munculkan Notifikasi Sesuai Kondisi
                        if (dueToday.length > 0) {
                            new Notification("🔔 Cek Tugas", {
                                body: `WOI! Ada ${dueToday.length} tugas deadline hari ini. KERJAIN WOI!`,
                                icon: '/images/icon-192.png'
                            });
                        } else {
                            new Notification("✅ Aman Terkendali", {
                                body: "Gak ada tugas deadline hari ini. aman azzaa!",
                                icon: '/images/icon-192.png'    
                            });
                        }
                        
                    } catch (err) { console.error("Gagal cek notif:", err); }
                }
                
            } else {
                // Jika user menolak (Block)
                alert("⚠️ Notifikasi diblokir oleh browser. Mohon izinkan lewat pengaturan ikon gembok di URL.");
            }
        });
    }

    if (userJson) {
        const currentUser = JSON.parse(userJson);
        const userEmail = currentUser.email;

        if (currentUser.profilePic) {
            document.querySelectorAll('.profile-img').forEach(img => img.src = currentUser.profilePic);
        }

        // Logika untuk Pencarian & Sorting Tugas
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect'); // [BARU]

        const reloadPage = () => {
            if (path === '/dashboard') renderTaskList(userEmail);
            if (path === '/tasks') renderMyTasksPage(userEmail);
            if (path === '/completed') renderCompletedPage(userEmail);
        };

        if (searchInput) searchInput.addEventListener('input', reloadPage);
        if (sortSelect) sortSelect.addEventListener('change', reloadPage); // [BARU]

        // Setup Buttons
        const activeContainer = document.getElementById('taskListContainer') || 
                                document.getElementById('myTasksListContainer') || 
                                document.getElementById('completedListContainer');
        
        if (activeContainer) {
            setupActionListeners(activeContainer, userEmail, reloadPage);
        }
    }

    // Logika per halaman/page
    if (path === '/register') {
        const form = document.getElementById('registerForm');
        if (form) form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;
            if (password !== confirm) { alert('Password tidak cocok!'); return; }
            try {
                await registerUser({ username, email, password });
                alert('Registrasi Berhasil!'); navigateTo('/login');
            } catch (err) { alert(err.message); }
        });
    }

    if (path === '/login' || path === '/') {
         const form = document.getElementById('loginForm');
         if (form) form.addEventListener('submit', async (e) => {
             e.preventDefault();
             try {
                const user = await loginUser(document.getElementById('email').value, document.getElementById('password').value);
                localStorage.setItem('currentUser', JSON.stringify(user));
                navigateTo('/dashboard');
             } catch(err) { alert(err.message); }
         });
    }

    if (path === '/dashboard') {
        const user = JSON.parse(userJson);
        document.querySelector('.profile-name').textContent = user.username;
        document.querySelector('.profile-email').textContent = user.email;
        renderTaskList(user.email);
    }

    // Kalender Page
    if (path === '/calendar') {
        const user = JSON.parse(userJson);
        const tasks = await getTasksByUser(user.email);
        
        let currentDate = new Date(); // Tanggal yang sedang dilihat
        
        const renderCalendar = () => {
            const monthYear = document.getElementById('monthYear');
            const daysContainer = document.getElementById('calendarDays');
            daysContainer.innerHTML = ''; // Bersihkan isi lama

            // Set Judul Bulan & Tahun
            const options = { month: 'long', year: 'numeric' };
            monthYear.innerText = currentDate.toLocaleDateString('id-ID', options);

            // Logika Matematika Kalender
            const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            // Buat kotak kosong untuk hari sebelum tanggal 1
            for (let x = 0; x < firstDayIndex; x++) {
                daysContainer.innerHTML += `<div></div>`;
            }

            // Buat kotak tanggal 1 s/d 30/31
            for (let i = 1; i <= lastDay; i++) {
                // Cek apakah ada tugas di tanggal ini?
                // Format tanggal di input date biasanya: YYYY-MM-DD
                const currentMonthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
                const currentDayStr = String(i).padStart(2, '0');
                const fullDateStr = `${currentDate.getFullYear()}-${currentMonthStr}-${currentDayStr}`;
                
                // Cari tugas di tanggal ini
                const tasksToday = tasks.filter(t => t.dueDate === fullDateStr && t.status !== 'done');
                
                // Buat Dot Warna (Merah/Biru)
                let dotsHTML = '';
                tasksToday.forEach(t => {
                    let color = t.priority === 'High' ? '#FF1744' : '#00E676';
                    dotsHTML += `<span class="task-dot" style="background:${color}" title="${t.title}"></span>`;
                });

                // Cek hari ini
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
                const todayClass = isToday ? 'today' : '';

                daysContainer.innerHTML += `
                    <div class="calendar-day ${todayClass}">
                        <div>${i}</div>
                        <div style="margin-top:5px;">${dotsHTML}</div>
                    </div>`;
            }
        };

        renderCalendar();

        // Tombol Ganti Bulan
        document.getElementById('prevMonth').onclick = () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        };
        document.getElementById('nextMonth').onclick = () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        };
    }

    if (path === '/tasks') {
        const user = JSON.parse(userJson);
        document.querySelector('.profile-name').textContent = user.username;
        document.querySelector('.profile-email').textContent = user.email;
        renderMyTasksPage(user.email);
    }

    if (path === '/completed') {
        const user = JSON.parse(userJson);
        document.querySelector('.profile-name').textContent = user.username;
        document.querySelector('.profile-email').textContent = user.email;
        renderCompletedPage(user.email);
    }

    if (path === '/add') {
        const user = JSON.parse(userJson);
        
        const dateInput = document.getElementById('pageTaskDate');
        if (dateInput) {
            dateInput.addEventListener('click', () => {
                if ('showPicker' in HTMLInputElement.prototype) dateInput.showPicker();
            });
        }

        const fileInput = document.getElementById('taskFileInput');
        const previewImg = document.getElementById('previewTaskImg');
        const placeholder = document.getElementById('uploadPlaceholder');
        let taskImageBase64 = null; 

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        taskImageBase64 = evt.target.result; 
                        previewImg.src = taskImageBase64;
                        previewImg.style.display = 'block'; 
                        placeholder.style.display = 'none'; 
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        const form = document.getElementById('addPageForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const priorityEl = document.querySelector('input[name="priority"]:checked');
                const priority = priorityEl ? priorityEl.value : 'Medium';
                
                try {
                    await addTask({
                        userEmail: user.email,
                        title: document.getElementById('pageTaskTitle').value,
                        priority: priority,
                        status: 'todo',
                        dueDate: document.getElementById('pageTaskDate').value,
                        description: document.getElementById('pageTaskDesc').value,
                        image: taskImageBase64,
                        createdAt: new Date()
                    });
                    alert('Tugas berhasil dibuat!');
                    navigateTo('/tasks');
                } catch (error) { alert(error.message); }
            });
        }
    }

    // Settings page
    if (path === '/settings') {
        let user = JSON.parse(userJson);

        // Logika Export
        const btnExport = document.getElementById('btnExport');
        if (btnExport) {
            btnExport.addEventListener('click', async () => {
                try {
                    const data = await exportDatabase();
                    // Bikin file JSON virtual
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    // Bikin link download palsu lalu diklik otomatis
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup-todo-${new Date().toISOString().slice(0,10)}.json`;
                    a.click();
                    alert('Data berhasil didownload!');
                } catch (e) { alert('Gagal export: ' + e.message); }
            });
        }

        // logika Import
        const btnImportTrigger = document.getElementById('btnImportTrigger');
        const fileImport = document.getElementById('fileImport');
        
        if (btnImportTrigger && fileImport) {
            // Klik tombol -> Buka file explorer
            btnImportTrigger.addEventListener('click', () => fileImport.click());

            // Saat file dipilih
            fileImport.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (evt) => {
                    try {
                        const data = JSON.parse(evt.target.result);
                        if(confirm('Data lama akan ditimpa/digabung. Yakin import?')) {
                            await importDatabase(data);
                            alert('Data berhasil dipulihkan!');
                            location.reload(); // Refresh biar data muncul
                        }
                    } catch (err) { alert('File rusak atau format salah!'); }
                };
                reader.readAsText(file);
            });
        }

        // logika Dark Mode Toggle
        const toggleDark = document.getElementById('darkModeToggle');
        if (toggleDark) {
            // Set posisi tombol sesuai status sekarang
            if (localStorage.getItem('theme') === 'dark') {
                toggleDark.checked = true;
            }

            // Saat tombol diklik (Change Event)
            toggleDark.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Aktifkan Mode Gelap
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark'); // Simpan ke memori
                } else {
                    // Matikan Mode Gelap
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light'); // Simpan ke memori
                }
            });
        }

        const updateSettingsUI = (userData) => {
            let displayName = userData.username;
            if (userData.firstName) displayName = `${userData.firstName} ${userData.lastName || ''}`.trim();
            document.querySelectorAll('.profile-name').forEach(el => el.textContent = displayName);
            document.querySelectorAll('.profile-email').forEach(el => el.textContent = userData.email);
            if (userData.profilePic) {
                document.querySelectorAll('.profile-img').forEach(img => img.src = userData.profilePic);
                const settingImg = document.getElementById('settingProfileImg');
                if (settingImg) settingImg.src = userData.profilePic;
            }
        };
        updateSettingsUI(user);

        const inputFirst = document.getElementById('inputFirstName');
        const inputLast = document.getElementById('inputLastName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPhone = document.getElementById('inputPhone');

        if (inputFirst) {
            inputFirst.value = user.firstName || user.username || ''; 
            inputLast.value = user.lastName || '';
            inputEmail.value = user.email || '';
            inputPhone.value = user.phone || '';
            inputEmail.readOnly = true; 
            inputEmail.style.backgroundColor = '#e9ecef';
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) { alert("Maksimal 2MB"); return; }

                const reader = new FileReader();
                reader.onload = async function(evt) {
                    const base64Image = evt.target.result;
                    const updatedUser = { ...user, profilePic: base64Image };
                    try {
                        await updateUser(updatedUser);
                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                        user = updatedUser;
                        updateSettingsUI(updatedUser);
                        alert("📸 Foto berhasil diganti!");
                    } catch (err) { alert("Gagal: " + err.message); }
                };
                reader.readAsDataURL(file);
            });
        }

        const formProfile = document.getElementById('editProfileForm');
        if (formProfile) {
            formProfile.addEventListener('submit', async (e) => {
                e.preventDefault();
                const updatedUser = {
                    ...user,
                    firstName: inputFirst.value,
                    lastName: inputLast.value,
                    phone: inputPhone.value,
                    username: `${inputFirst.value} ${inputLast.value}`.trim() || user.username
                };
                try {
                    await updateUser(updatedUser);
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    user = updatedUser;
                    updateSettingsUI(updatedUser);
                    alert("✅ Info diperbarui!");
                } catch(err) { alert(err.message); }
            });
        }

        const formPass = document.getElementById('changePasswordForm');
        if (formPass) {
            formPass.addEventListener('submit', async (e) => {
                e.preventDefault();
                const oldPass = document.getElementById('inputOldPass').value;
                const newPass = document.getElementById('inputNewPass').value;
                const confirmPass = document.getElementById('inputConfirmPass').value;
                if (newPass !== confirmPass) { alert("Konfirmasi salah!"); return; }
                try {
                    const fullUser = await getUser(user.email); 
                    if (fullUser.password !== oldPass) { alert("Password lama salah!"); return; }
                    fullUser.password = newPass;
                    await updateUser(fullUser);
                    alert("✅ Password diganti!");
                    formPass.reset();
                } catch (error) { alert("Gagal: " + error.message); }
            });
        }

        const btnDeleteAll = document.getElementById('btnDeleteAll');
        if (btnDeleteAll) {
            btnDeleteAll.addEventListener('click', async () => {
                if (confirm("Hapus SEMUA tugas permanen?")) {
                    try {
                        const allTasks = await getTasksByUser(user.email);
                        await Promise.all(allTasks.map(task => deleteTask(task.id)));
                        alert("Data bersih.");
                        navigateTo('/dashboard');
                    } catch (error) { alert(error.message); }
                }
            });
        }
    }
};

// Setup event listeners untuk tombol aksi di daftar tugas
async function setupActionListeners(container, userEmail, refreshCallback) {
    container.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-icon'); 
        if (!btn) return;
        
        const id = parseInt(btn.dataset.id);

        // untuk melihat detail tugas
        if (btn.classList.contains('btn-view')) {
            const task = await getTaskById(id);
            const modal = document.getElementById('detailModal');
            
            document.getElementById('detailTitle').textContent = task.title;
            document.getElementById('detailDate').textContent = `📅 Tenggat: ${task.dueDate || '-'}`;
            
            const statusEl = document.getElementById('detailStatus');
            if(task.status === 'done') { statusEl.innerText = '● Selesai'; statusEl.style.color = 'green'; }
            else if(task.status === 'process') { statusEl.innerText = '● Dalam Proses'; statusEl.style.color = '#2979FF'; }
            else { statusEl.innerText = '● Belum Dikerjakan'; statusEl.style.color = '#FF1744'; }

            const badgeEl = document.getElementById('detailBadge');
            badgeEl.innerText = task.priority;
            badgeEl.className = 'badge'; 
            if(task.priority === 'High') badgeEl.classList.add('badge-priority-high');

            const descEl = document.getElementById('detailDesc');
            descEl.innerHTML = task.description ? task.description.replace(/\n/g, '<br>') : '<i>Tidak ada deskripsi.</i>';

            const imgContainer = document.getElementById('detailImageContainer');
            const imgEl = document.getElementById('detailImage');
            if (task.image) {
                imgEl.src = task.image;
                imgContainer.style.display = 'block';
            } else {
                imgContainer.style.display = 'none';
            }

            modal.style.display = 'flex';
            modal.classList.remove('hidden');

            document.getElementById('closeDetailModal').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (event) => { if (event.target === modal) modal.style.display = 'none'; };
        }

        // untuk mengedit tugas
        if (btn.classList.contains('btn-edit')) {
            const task = await getTaskById(id);
            const modal = document.getElementById('editModal');
            
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDesc').value = task.description || ''; 
            document.getElementById('editTaskPriority').value = task.priority;
            document.getElementById('editTaskStatus').value = task.status;

            modal.style.display = 'flex';
            modal.classList.remove('hidden');

            document.getElementById('closeEditModal').onclick = () => { modal.style.display = 'none'; };

            const formEdit = document.getElementById('editTaskForm');
            formEdit.onsubmit = async (evt) => {
                evt.preventDefault();
                task.title = document.getElementById('editTaskTitle').value;
                task.description = document.getElementById('editTaskDesc').value; 
                task.priority = document.getElementById('editTaskPriority').value;
                task.status = document.getElementById('editTaskStatus').value;

                await updateTask(task);
                alert('Tugas berhasil diupdate!');
                modal.style.display = 'none';
                refreshCallback(); 
            };
        }

        // 3. tombol selesai, hapus, dan restore
        if (btn.classList.contains('btn-done')) {
            const task = await getTaskById(id);
            task.status = 'done';
            task.completedAt = Date.now();

            await updateTask(task);
            refreshCallback(); 
        }

        if (btn.classList.contains('btn-delete')) {
            if (confirm('Hapus tugas ini?')) {
                await deleteTask(id);
                refreshCallback();
            }
        }
        
        if (btn.classList.contains('btn-restore')) {
             const task = await getTaskById(id);
             task.status = 'todo';
             await updateTask(task);
             refreshCallback();
        }
    });
}