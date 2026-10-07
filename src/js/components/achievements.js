// Achievements & Badges Showcase Component
export const BADGES = [
  { id: "b1", title: "First Step", desc: "Complete Step 1 (Learn) in any module.", icon: "🌱" },
  { id: "b2", title: "Scheduler Master", desc: "Complete CPU Scheduling module & Gantt chart task.", icon: "📊" },
  { id: "b3", title: "Deadlock Resolver", desc: "Run Banker's Algorithm safety matrix check.", icon: "⚠️" },
  { id: "b4", title: "Terminal Pro", desc: "Execute 5 simulated OS kernel CLI commands.", icon: "⚡" },
  { id: "b5", title: "Quiz Whiz", desc: "Score 100% on any module quiz.", icon: "🎯" },
  { id: "b6", title: "OS Veteran", desc: "Complete all 10 OS Virtual Lab modules.", icon: "👑" }
];

export class AchievementsDrawer {
  constructor(containerEl, onClose) {
    this.container = containerEl;
    this.onClose = onClose;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
        <div class="glass-panel" style="width:100%; max-width:650px; padding:2rem; display:flex; flex-direction:column; gap:1.5rem; max-height:85vh; overflow-y:auto;">
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:1.5rem;">🏆</span>
              <h2 style="font-size:1.3rem; font-weight:800;">Achievements & Honor Badges</h2>
            </div>
            <button id="achieve-close-btn" class="btn-icon-toggle">✕</button>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            ${BADGES.map(b => `
              <div style="background:#fdf6e2; border:1px solid var(--color-burgundy); padding:1rem; border-radius:10px; display:flex; gap:0.85rem; align-items:flex-start;">
                <div style="font-size:2rem; background:rgba(112,26,117,0.12); width:50px; height:50px; border-radius:10px; display:flex; align-items:center; justify-content:center;">${b.icon}</div>
                <div>
                  <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${b.title}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem; line-height:1.4;">${b.desc}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    this.container.querySelector("#achieve-close-btn").onclick = () => this.onClose();
  }
}
