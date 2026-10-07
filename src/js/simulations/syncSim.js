// Process Synchronization Simulation Module (Dark/Black colors completely removed)
export class SyncSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.mode = "producer-consumer";
    this.bufferSize = 6;
    this.buffer = [];
    this.philoEating = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:3px solid var(--color-purple); background:#ffffff;">
        <div class="sim-control-bar" style="background:var(--color-beige); border:2px solid var(--color-brown);">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Simulation Scenario:</label>
            <select id="sync-scenario-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--color-purple);">
              <option value="producer-consumer">Producer-Consumer Bounded Buffer</option>
              <option value="dining-philosophers">Dining Philosophers Interactive Table</option>
            </select>
          </div>
          <div class="control-group">
            <button id="sync-btn-action1" class="sim-btn play-btn" style="background:linear-gradient(135deg, #059669, #10b981); color:#fff; font-weight:800;">+ Produce Item</button>
            <button id="sync-btn-action2" class="sim-btn" style="background:var(--color-purple); color:#fff; font-weight:800;">- Consume Item</button>
            <button id="sync-btn-reset" class="sim-btn">↺ Reset</button>
          </div>
        </div>

        <div id="sync-display-area" style="margin-top:1rem; min-height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center;"></div>
      </div>
    `;

    this.attachEvents();
    this.renderScenario();
  }

  attachEvents() {
    const select = this.container.querySelector("#sync-scenario-select");
    const act1 = this.container.querySelector("#sync-btn-action1");
    const act2 = this.container.querySelector("#sync-btn-action2");
    const reset = this.container.querySelector("#sync-btn-reset");

    select.onchange = (e) => {
      this.mode = e.target.value;
      if (this.mode === "dining-philosophers") {
        act1.textContent = "🍽 Philosophers Eat";
        act2.textContent = "🤔 Philosophers Think";
      } else {
        act1.textContent = "+ Produce Item";
        act2.textContent = "- Consume Item";
      }
      this.buffer = [];
      this.renderScenario();
    };

    act1.onclick = () => {
      if (this.mode === "producer-consumer") {
        if (this.buffer.length < this.bufferSize) {
          this.buffer.push(`Item #${Math.floor(Math.random()*900)+100}`);
          this.renderScenario();
        } else {
          alert("⚠️ Buffer Full! Semaphore 'empty' = 0. Producer blocked.");
        }
      } else {
        this.philoEating = !this.philoEating;
        this.renderScenario();
      }
    };

    act2.onclick = () => {
      if (this.mode === "producer-consumer") {
        if (this.buffer.length > 0) {
          this.buffer.shift();
          this.renderScenario();
        } else {
          alert("⚠️ Buffer Empty! Semaphore 'full' = 0. Consumer blocked.");
        }
      } else {
        this.philoEating = false;
        this.renderScenario();
      }
    };

    reset.onclick = () => {
      this.buffer = [];
      this.philoEating = false;
      this.renderScenario();
    };
  }

  renderScenario() {
    const area = this.container.querySelector("#sync-display-area");
    area.innerHTML = "";

    if (this.mode === "producer-consumer") {
      const emptyCount = this.bufferSize - this.buffer.length;
      const fullCount = this.buffer.length;

      let slotsHtml = "";
      for (let i = 0; i < this.bufferSize; i++) {
        if (i < this.buffer.length) {
          slotsHtml += `<div style="width:75px; height:75px; background:linear-gradient(135deg, var(--color-light-blue), var(--color-purple)); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.85rem; box-shadow:0 4px 12px rgba(126,34,206,0.2);">${this.buffer[i]}</div>`;
        } else {
          slotsHtml += `<div style="width:75px; height:75px; background:var(--color-beige); border:2px dashed var(--color-brown); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--color-brown); font-size:0.8rem; font-weight:700;">EMPTY</div>`;
        }
      }

      area.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.5rem; width:100%; align-items:center;">
          <!-- Semaphores State Box -->
          <div style="display:flex; gap:2rem; background:var(--color-beige); padding:1rem 2.5rem; border-radius:12px; border:2px solid var(--color-brown);">
            <div style="text-align:center;"><span style="color:var(--color-brown); font-size:0.78rem; font-weight:700;">SEMAPHORE 'mutex'</span><div style="font-size:1.3rem; font-weight:800; color:#059669;">1 (Unlocked)</div></div>
            <div style="text-align:center;"><span style="color:var(--color-brown); font-size:0.78rem; font-weight:700;">SEMAPHORE 'empty'</span><div style="font-size:1.3rem; font-weight:800; color:var(--color-light-blue);">${emptyCount}</div></div>
            <div style="text-align:center;"><span style="color:var(--color-brown); font-size:0.78rem; font-weight:700;">SEMAPHORE 'full'</span><div style="font-size:1.3rem; font-weight:800; color:var(--color-purple);">${fullCount}</div></div>
          </div>

          <!-- Bounded Buffer Slots -->
          <div style="display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; padding:1.5rem; background:#ffffff; border-radius:12px; border:2px solid var(--color-purple); width:100%;">
            ${slotsHtml}
          </div>
        </div>
      `;
    } else {
      const isEating = this.philoEating;
      area.innerHTML = `
        <div style="position:relative; width:300px; height:300px; border-radius:50%; background:var(--color-beige); border:3px solid var(--color-purple); display:flex; align-items:center; justify-content:center;">
          <div style="font-size:0.95rem; font-weight:800; color:var(--color-purple);">Round Table</div>
          <div style="position:absolute; top:15px; left:130px; padding:0.6rem; background:${isEating ? '#059669' : 'var(--color-burgundy)'}; border-radius:50%; color:#fff; font-weight:800;">P1</div>
          <div style="position:absolute; top:100px; right:15px; padding:0.6rem; background:${isEating ? '#059669' : 'var(--color-burgundy)'}; border-radius:50%; color:#fff; font-weight:800;">P2</div>
          <div style="position:absolute; bottom:20px; right:60px; padding:0.6rem; background:${isEating ? '#059669' : 'var(--color-burgundy)'}; border-radius:50%; color:#fff; font-weight:800;">P3</div>
          <div style="position:absolute; bottom:20px; left:60px; padding:0.6rem; background:${isEating ? '#059669' : 'var(--color-burgundy)'}; border-radius:50%; color:#fff; font-weight:800;">P4</div>
          <div style="position:absolute; top:100px; left:15px; padding:0.6rem; background:${isEating ? '#059669' : 'var(--color-burgundy)'}; border-radius:50%; color:#fff; font-weight:800;">P5</div>
        </div>
        <div style="margin-top:1rem; font-size:0.9rem; color:var(--color-deep-plum); font-weight:700;">
          Chopstick Mutex locks state: <strong style="color:${isEating ? '#059669' : 'var(--color-purple)'}; font-size:1.05rem;">${isEating ? 'Acquired (Eating)' : 'Released (Thinking)'}</strong>
        </div>
      `;
    }
  }

  destroy() {}
}
