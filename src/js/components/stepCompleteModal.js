// Step Task Completion Celebration Modal
import { sound } from "../audio.js";

export class StepCompleteModal {
  /**
   * @param {HTMLElement} containerEl  - modal container
   * @param {string}      stepName     - step label (e.g. "Learn") OR module title for module-complete popup
   * @param {Function}    onNext       - called when user clicks "Next Task"
   * @param {boolean}     isModuleComplete - if true, show the big "Module Completed" popup (no Next btn)
   */
  constructor(containerEl, stepName, onNext, isModuleComplete = false) {
    this.container = containerEl;
    this.stepName = stepName;
    this.onNext = onNext;
    this.isModuleComplete = isModuleComplete;
    this.render();
  }

  render() {
    if (this.isModuleComplete) {
      this.renderModuleComplete();
    } else {
      this.renderStepComplete();
    }
    sound.playSuccess();
    this.attachEvents();
  }

  renderStepComplete() {
    this.container.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(59,7,100,0.6); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem;" class="animate-fade-in">
        <div class="glass-panel" style="width:100%; max-width:480px; padding:2rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1.25rem; border:3px solid var(--color-yellow); background:#ffffff; box-shadow:0 0 30px rgba(245,158,11,0.5);">
          
          <div style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg, var(--color-yellow), var(--color-pink)); display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:#fff; box-shadow:0 4px 15px rgba(245,158,11,0.4);">
            🎉
          </div>

          <div>
            <div style="font-size:0.8rem; font-weight:800; color:var(--color-burgundy); text-transform:uppercase; letter-spacing:1px;">TASK COMPLETED</div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--color-deep-plum); margin-top:0.2rem;">
              "${this.stepName}" Done!
            </h2>
          </div>

          <p style="color:var(--color-brown); font-size:0.92rem; line-height:1.5;">
            Great job! You completed this step. Click <strong>Next Task</strong> to continue.
          </p>

          <div style="display:flex; gap:1rem; width:100%; margin-top:0.5rem;">
            <button id="modal-btn-stay" class="btn-secondary" style="flex:1; justify-content:center;">
              Stay Here
            </button>
            <button id="modal-btn-next" class="btn-primary" style="flex:1; justify-content:center; background:linear-gradient(135deg, var(--color-purple), var(--color-pink));">
              Next Task ➔
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderModuleComplete() {
    this.container.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(59,7,100,0.7); backdrop-filter:blur(10px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem;" class="animate-fade-in">
        <div class="glass-panel" style="width:100%; max-width:540px; padding:2.5rem 2rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1.5rem; border:4px solid var(--color-burgundy); background:#ffffff; box-shadow:0 0 50px rgba(112,26,117,0.55);">

          <div style="font-size:5rem; line-height:1;">🎓</div>

          <div>
            <div style="font-size:0.78rem; font-weight:900; color:var(--color-burgundy); text-transform:uppercase; letter-spacing:3px; margin-bottom:0.5rem;">
              MODULE COMPLETED
            </div>
            <h2 style="font-size:2rem; font-weight:900; color:var(--color-deep-plum); line-height:1.2;">
              Congratulations! 🎉
            </h2>
            <p style="margin-top:0.75rem; font-size:1rem; color:var(--color-brown); font-weight:600; line-height:1.6;">
              You finished <strong style="color:var(--color-burgundy);">${this.stepName}</strong>!<br/>
              All 5 tasks — Learn, Animation, Task, Terminal &amp; Quiz — are complete.
            </p>
          </div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center;">
            ${['📖 Learn','🎬 Animation','🛠 Task','💻 Terminal','❓ Quiz'].map(s => `
              <span style="background:linear-gradient(135deg,var(--color-yellow),var(--color-pink)); color:var(--color-deep-plum); padding:0.4rem 1rem; border-radius:20px; font-weight:800; font-size:0.82rem;">✅ ${s}</span>
            `).join('')}
          </div>

          <button id="modal-btn-close-complete" class="btn-primary" style="background:linear-gradient(135deg,var(--color-burgundy),var(--color-purple)); font-size:1.05rem; padding:0.85rem 2.5rem; border-radius:30px; width:100%; max-width:300px;">
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    if (this.isModuleComplete) {
      const closeBtn = this.container.querySelector("#modal-btn-close-complete");
      if (closeBtn) {
        closeBtn.onclick = () => {
          this.container.innerHTML = "";
          if (this.onNext) this.onNext();
        };
      }
    } else {
      const stayBtn = this.container.querySelector("#modal-btn-stay");
      const nextBtn = this.container.querySelector("#modal-btn-next");

      if (stayBtn) {
        stayBtn.onclick = () => {
          this.container.innerHTML = "";
        };
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          this.container.innerHTML = "";
          this.onNext();
        };
      }
    }
  }
}
