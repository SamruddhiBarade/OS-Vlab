// Threads & Concurrency Simulation Module
export class ThreadsSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.useMutex = false;
    this.counter = 0;
    this.thread1Progress = 0;
    this.thread2Progress = 0;
    this.isRunning = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel">
        <div class="sim-control-bar">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">Atomic Lock / Mutex:</label>
            <button id="t-btn-mutex" class="sim-btn" style="background:rgba(244,63,94,0.2); border-color:var(--accent-rose); color:var(--accent-rose);">
              ❌ Mutex OFF (Race Condition On)
            </button>
          </div>
          <div class="control-group">
            <button id="t-btn-run" class="sim-btn play-btn">▶ Run Multithread Test</button>
            <button id="t-btn-reset" class="sim-btn">↺ Reset</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-top:1rem;">
          <!-- Parallel Threads Visualizer -->
          <div style="background:#fdf6e2; padding:1.25rem; border-radius:8px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:1rem;">
            <div style="font-size:0.9rem; font-weight:700; color:var(--accent-cyan);">
              🔀 Concurrent Threads Execution
            </div>

            <!-- Thread 1 -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.35rem;">
                <span style="color:var(--accent-cyan); font-weight:700;">Thread 1 (Worker A)</span>
                <span id="t1-val" style="color:var(--text-muted);">0 / 100 ops</span>
              </div>
              <div class="progress-bar-bg"><div id="t1-bar" class="progress-bar-fill" style="width:0%; background:var(--accent-cyan);"></div></div>
            </div>

            <!-- Thread 2 -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.35rem;">
                <span style="color:var(--accent-purple); font-weight:700;">Thread 2 (Worker B)</span>
                <span id="t2-val" style="color:var(--text-muted);">0 / 100 ops</span>
              </div>
              <div class="progress-bar-bg"><div id="t2-bar" class="progress-bar-fill" style="width:0%; background:var(--accent-purple);"></div></div>
            </div>
          </div>

          <!-- Shared Memory Counter Result -->
          <div style="background:linear-gradient(135deg,#fdf6e2,#f3e8ff); padding:1.25rem; border-radius:8px; border:1px solid var(--accent-purple); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:0.5rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-dim); text-transform:uppercase;">SHARED MEMORY COUNTER</div>
            <div id="shared-counter-val" style="font-size:3rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-amber);">0</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Expected Value: <strong>200</strong></div>
            <div id="race-verdict" style="font-size:0.85rem; font-weight:700; padding:0.35rem 0.85rem; border-radius:12px; margin-top:0.5rem;"></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const mutexBtn = this.container.querySelector("#t-btn-mutex");
    const runBtn = this.container.querySelector("#t-btn-run");
    const resetBtn = this.container.querySelector("#t-btn-reset");

    mutexBtn.onclick = () => {
      this.useMutex = !this.useMutex;
      if (this.useMutex) {
        mutexBtn.textContent = "🔒 Mutex ON (Thread Safe)";
        mutexBtn.style.background = "rgba(16,185,129,0.2)";
        mutexBtn.style.borderColor = "var(--accent-emerald)";
        mutexBtn.style.color = "var(--accent-emerald)";
      } else {
        mutexBtn.textContent = "❌ Mutex OFF (Race Condition On)";
        mutexBtn.style.background = "rgba(244,63,94,0.2)";
        mutexBtn.style.borderColor = "var(--accent-rose)";
        mutexBtn.style.color = "var(--accent-rose)";
      }
    };

    runBtn.onclick = () => this.runSimulation();
    resetBtn.onclick = () => this.reset();
  }

  runSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.counter = 0;
    this.thread1Progress = 0;
    this.thread2Progress = 0;

    const t1Bar = this.container.querySelector("#t1-bar");
    const t2Bar = this.container.querySelector("#t2-bar");
    const t1Val = this.container.querySelector("#t1-val");
    const t2Val = this.container.querySelector("#t2-val");
    const counterVal = this.container.querySelector("#shared-counter-val");
    const verdict = this.container.querySelector("#race-verdict");

    verdict.textContent = "Running thread execution...";
    verdict.style.background = "transparent";
    verdict.style.color = "var(--text-muted)";

    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (this.thread1Progress < 100) this.thread1Progress += 5;
      if (this.thread2Progress < 100) this.thread2Progress += 5;

      // Simulate shared memory updates
      if (this.useMutex) {
        this.counter = (this.thread1Progress + this.thread2Progress);
      } else {
        // Race condition data loss simulation
        if (Math.random() < 0.35) {
          this.counter += 1; // missed increment!
        } else {
          this.counter += 2;
        }
      }

      t1Bar.style.width = `${this.thread1Progress}%`;
      t2Bar.style.width = `${this.thread2Progress}%`;
      t1Val.textContent = `${this.thread1Progress} / 100 ops`;
      t2Val.textContent = `${this.thread2Progress} / 100 ops`;
      counterVal.textContent = this.counter;

      if (this.thread1Progress >= 100 && this.thread2Progress >= 100) {
        clearInterval(interval);
        this.isRunning = false;
        if (this.counter === 200) {
          verdict.textContent = "✅ SUCCESS: Mutex prevented data loss!";
          verdict.style.background = "rgba(16,185,129,0.2)";
          verdict.style.color = "var(--accent-emerald)";
        } else {
          verdict.textContent = `⚠️ RACE CONDITION CORRUPTION: Lost ${200 - this.counter} increments!`;
          verdict.style.background = "rgba(244,63,94,0.2)";
          verdict.style.color = "var(--accent-rose)";
        }
      }
    }, 100);
  }

  reset() {
    this.counter = 0;
    this.thread1Progress = 0;
    this.thread2Progress = 0;
    this.isRunning = false;
    this.container.querySelector("#t1-bar").style.width = "0%";
    this.container.querySelector("#t2-bar").style.width = "0%";
    this.container.querySelector("#t1-val").textContent = "0 / 100 ops";
    this.container.querySelector("#t2-val").textContent = "0 / 100 ops";
    this.container.querySelector("#shared-counter-val").textContent = "0";
    this.container.querySelector("#race-verdict").textContent = "";
  }

  destroy() {}
}
