import { mainLayout } from '../layout.js';
import '../../styles/pages/dashboard.css';

export function tasksView() {
    const content = `
        <div class="dashboard-grid">
            <section class="full-column">
                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title">🔥 Daftar Tugas Saya</div>
                        <a href="/add" class="btn btn--primary" data-link>+ Tambah Baru</a>
                    </div>
                    <div id="myTasksListContainer"></div>
                </div>
            </section>
        </div>
    `;
    return mainLayout(content, 'tasks');
}