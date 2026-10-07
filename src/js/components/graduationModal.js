// Automatic Graduation Badge & Certificate Celebration Component
import { store } from "../store.js";
import { sound } from "../audio.js";

export class GraduationModal {
  constructor(containerEl, onClose) {
    this.container = containerEl;
    this.onClose = onClose;
    this.render();
  }

  render() {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const userName = store.state.userName || "Student";
    const totalXp = store.state.xp;

    this.container.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.82); backdrop-filter:blur(12px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem;" class="animate-fade-in">
        <div class="glass-panel" style="width:100%; max-width:700px; padding:2.5rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1.5rem; border:3px solid var(--accent-cyan); box-shadow:0 0 40px var(--accent-cyan-glow); position:relative; overflow:hidden;">
          
          <button id="grad-close-btn" class="btn-icon-toggle" style="position:absolute; right:15px; top:15px;">✕</button>

          <!-- Glowing Badge Icon -->
          <div style="width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #f59e0b, #ec4899, #6366f1); display:flex; align-items:center; justify-content:center; font-size:3.5rem; box-shadow:0 0 30px rgba(245,158,11,0.6); animation:pulseGlow 2s infinite;">
            👑
          </div>

          <div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:1px;">OFFICIAL GRADUATION BADGE UNLOCKED</div>
            <h1 style="font-size:2rem; font-weight:800; background:linear-gradient(90deg, #f59e0b, #a855f7, #06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-top:0.25rem;">
              CONGRATULATIONS, MASTER OF OPERATING SYSTEMS!
            </h1>
          </div>

          <p style="color:var(--text-muted); font-size:0.95rem; max-width:550px; line-height:1.6;">
            You have successfully completed <strong>all 10 Operating System Lab Modules</strong>! You performed real simulation controls, solved practice lab challenges, executed OS terminal commands, and passed all module quizzes.
          </p>

          <!-- Certificate Box Preview -->
          <div style="width:100%; background:var(--bg-dark); border:2px dashed var(--accent-purple); padding:1.5rem; border-radius:12px; font-family:var(--font-mono); display:flex; flex-direction:column; gap:0.5rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-dim); letter-spacing:1px;">CERTIFICATE OF COMPLETION</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan); font-family:var(--font-sans);">${userName}</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">Total XP Earned: <strong style="color:var(--accent-emerald);">${totalXp} XP</strong> | Date: <strong>${today}</strong></div>
            <div style="font-size:0.75rem; color:var(--accent-purple); margin-top:0.25rem;">Verified by Antigravity OS VirtuLab Simulator Kernel</div>
          </div>

          <div style="display:flex; gap:1rem; margin-top:0.5rem;">
            <button id="btn-print-cert" class="btn-primary" style="background:linear-gradient(135deg, #f59e0b, #d97706); box-shadow:0 4px 15px rgba(245,158,11,0.4);">
              🖨 Print / Save Certificate
            </button>
            <button id="btn-close-grad" class="btn-secondary">
              Back to Dashboard 🏆
            </button>
          </div>
        </div>
      </div>
    `;

    sound.playSuccess();
    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = this.container.querySelector("#grad-close-btn");
    const closeGrad = this.container.querySelector("#btn-close-grad");
    const printBtn = this.container.querySelector("#btn-print-cert");

    const closeHandler = () => {
      this.onClose();
    };

    if (closeBtn) closeBtn.onclick = closeHandler;
    if (closeGrad) closeGrad.onclick = closeHandler;

    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }
}
