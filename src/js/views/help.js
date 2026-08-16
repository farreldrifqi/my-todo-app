// src/js/views/help.js
import { mainLayout } from '../layout.js';

export function helpView() {
    const content = `
        <div class="dashboard-grid">
            <section class="full-column">
                
                <div class="widget-card" style="padding: 40px; min-height: 600px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid #E5E7EB;">
                        <div style="position: relative; padding-bottom: 15px;">
                            <h2 style="font-size: 24px; font-weight: 700; margin: 0; color: #111;">Bantuan</h2>
                            <div style="position: absolute; bottom: -1px; left: 0; width: 60px; height: 3px; background-color: #A18D6D;"></div>
                        </div>
                        <a href="/dashboard" data-link style="text-decoration: underline; color: #111; font-size: 14px; font-weight: 600; padding-bottom: 15px;">Kembali</a>
                    </div>
                    
                    <div style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 50px 20px; text-align: center; background: #FAFAFA;">

                        <h3 style="font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #111;">Tim Customer Support</h3>

                        <p style="color: #4B5563; max-width: 600px; margin: 0 auto 50px auto; line-height: 1.6; font-size: 14px;">
                            Di What To-Do, kami sangat menjunjung tinggi komunikasi dua arah!
                            Tujuan tim Customer Support kami adalah membuat Anda berhasil!
                            Karena itulah, tim Support kami bekerja 24/7/365 agar Anda tidak
                            menemui kendala apa pun saat menjalankan website!
                        </p>

                        <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

                            <div style="background: white; padding: 30px; border-radius: 16px; width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #E5E7EB; cursor: pointer; transition: 0.2s;" 
                                 onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#A18D6D';" 
                                 onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#E5E7EB';">
                                
                                <div style="width: 60px; height: 60px; border: 2px solid #D1D5DB; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: #A18D6D; font-size: 24px; font-weight: bold;">
                                    !
                                </div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #111;">Laporkan Penyalahgunaan</h4>
                                <p style="font-size: 12px; color: #6B7280; line-height: 1.5; margin: 0;">
                                    Kirim email ke WhatToDo123@gmail.com untuk melaporkan penyalahgunaan.
                                </p>
                            </div>

                            <div style="background: white; padding: 30px; border-radius: 16px; width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #E5E7EB; cursor: pointer; transition: 0.2s;" 
                                 onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#A18D6D';" 
                                 onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#E5E7EB';">
                                
                                <div style="width: 60px; height: 60px; border: 2px solid #D1D5DB; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: #A18D6D; font-size: 24px;">
                                    ✎
                                </div>
                                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #111;">Pernyataan Umum</h4>
                                <p style="font-size: 12px; color: #6B7280; line-height: 1.5; margin: 0;">
                                    Tim kami yang sangat profesional selalu siap membantu klien meraih kesuksesan.
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    `;
    return mainLayout(content, 'help');
}