// src/js/views/dashboard.js
import { mainLayout } from '../layout.js';
import '../../styles/pages/dashboard.css';

export function dashboardView() {
    const content = `
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 25px;">Selamat Datang Kembali 👋</h2>

        <div class="dashboard-grid">
            <section class="left-column">
                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title">📝 Tugas Aktif</div>
                    </div>
                    <div id="taskListContainer"></div>
                </div>
            </section>

            <section class="right-column">
                
                <div class="widget-card" style="margin-bottom: 25px; padding: 24px;">
                    <div class="widget-title" style="margin-bottom: 24px; display: flex; align-items: center; gap: 8px; color: #8F7F60;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>
                        Status Tugas
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        
                        <div class="chart-item">
                            <div class="donut-wrapper">
                                <div id="chartDone" class="donut-ring"></div>
                                <div class="donut-text" id="textDone">0%</div>
                            </div>
                            <div class="chart-label">
                                <span class="dot" style="background: #00C853;"></span> Selesai
                            </div>
                        </div>

                        <div class="chart-item">
                            <div class="donut-wrapper">
                                <div id="chartProcess" class="donut-ring"></div>
                                <div class="donut-text" id="textProcess">0%</div>
                            </div>
                            <div class="chart-label">
                                <span class="dot" style="background: #0046FF;"></span> Dalam Proses
                            </div>
                        </div>

                        <div class="chart-item">
                            <div class="donut-wrapper">
                                <div id="chartTodo" class="donut-ring"></div>
                                <div class="donut-text" id="textTodo">0%</div>
                            </div>
                            <div class="chart-label">
                                <span class="dot" style="background: #FF1744;"></span> Belum Dikerjakan
                            </div>
                        </div>

                    </div>
                </div>

                <div class="widget-card">
                    <div class="widget-title">☑ Selesai Terakhir</div>
                    <div id="miniDoneList" style="margin-top:10px;">
                        <p style="color:#aaa; font-size:12px;">Belum ada data.</p>
                    </div>
                </div>
            </section>
        </div>
    `;
    return mainLayout(content, 'dashboard');
}