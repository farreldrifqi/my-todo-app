import { mainLayout } from '../layout.js';

export function calendarView() {
    const content = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h2 id="monthYear"></h2>
                <div class="calendar-nav">
                    <button class="btn btn--outline" id="prevMonth">&lt;</button>
                    <button class="btn btn--outline" id="nextMonth">&gt;</button>
                </div>
            </div>
            
            <div class="calendar-grid">
                <div class="day-name">Min</div>
                <div class="day-name">Sen</div>
                <div class="day-name">Sel</div>
                <div class="day-name">Rab</div>
                <div class="day-name">Kam</div>
                <div class="day-name">Jum</div>
                <div class="day-name">Sab</div>
                </div>
            <div id="calendarDays" class="calendar-days"></div>
        </div>
    `;
    return mainLayout(content, 'calendar');
}