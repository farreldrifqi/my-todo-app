// src/js/views/add.js
import { mainLayout } from '../layout.js';

export function addView() {
    const content = `
        <div class="dashboard-grid">
            <section class="full-column">
                
                <div class="widget-card" style="padding: 40px; min-height: 600px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                        <h2 style="font-size: 24px; font-weight: 700; margin: 0; color: #333;">Tambah Tugas</h2>
                        <a href="/dashboard" data-link style="text-decoration: underline; color: #333; font-size: 14px; font-weight: 600;">Kembali</a>
                    </div>
                    
                    <form id="addPageForm">
                        
                        <div style="margin-bottom: 20px;">
                            <label class="form-label" style="font-weight: 700;">Judul</label>
                            <input type="text" id="pageTaskTitle" class="form-input" placeholder="Contoh: Mengerjakan Tugas Akhir" required>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label class="form-label" style="font-weight: 700;">Tanggal</label>
                            <input type="date" id="pageTaskDate" class="form-input" required>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <label class="form-label" style="font-weight: 700; margin-bottom: 10px;">Prioritas</label>
                            <div style="display: flex; gap: 25px;">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="priority" value="High">
                                    <span style="color: #D32F2F; font-weight: 600;">🔥 Penting</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="priority" value="Medium" checked>
                                    <span style="color: #F57C00; font-weight: 600;">⚡ Sedang</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="priority" value="Low">
                                    <span style="color: #2979FF; font-weight: 600;">☕ Santai</span>
                                </label>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 30px;">
                            
                            <div>
                                <label class="form-label" style="font-weight: 700;">Deskripsi Tugas</label>
                                <textarea id="pageTaskDesc" class="form-input" rows="8" placeholder="Mulai Tulis disini..." style="resize: none; height: 200px;"></textarea>
                            </div>

                            <div>
                                <label class="form-label" style="font-weight: 700;">Unggah Foto</label>
                                <div id="dropZone" style="border: 2px dashed #ccc; border-radius: 12px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; cursor: pointer; position: relative; overflow: hidden;">
                                    
                                    <img id="previewTaskImg" style="position: absolute; width: 100%; height: 100%; object-fit: cover; display: none;">
                                    
                                    <div id="uploadPlaceholder" style="text-align: center; pointer-events: none;">
                                        <div style="font-size: 30px; color: #aaa; margin-bottom: 10px;">🖼️</div>
                                        <p style="margin: 0; font-size: 12px; color: #888;">Drag & Drop files here<br>or</p>
                                        <span style="display: inline-block; margin-top: 8px; border: 1px solid #aaa; padding: 4px 12px; border-radius: 4px; font-size: 12px; color: #666;">Browse</span>
                                    </div>

                                    <input type="file" id="taskFileInput" accept="image/*" style="opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer;">
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn--primary" style="padding: 12px 30px; font-size: 14px;">Selesai</button>

                    </form>
                </div>
            </section>
        </div>
    `;
    return mainLayout(content, 'add');
}