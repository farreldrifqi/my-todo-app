import { mainLayout } from '../layout.js';
import '../../styles/pages/dashboard.css';

export function completedView() {
    const content = `
        <div class="dashboard-grid">
            <section class="full-column">
                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title">🏆 Riwayat Pekerjaan</div>
                    </div>
                    <div id="completedListContainer"></div>
                </div>
            </section>
        </div>
    `;
    return mainLayout(content, 'completed');
}