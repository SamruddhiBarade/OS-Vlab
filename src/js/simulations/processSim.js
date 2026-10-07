// Process Management Simulation Module (Dark/Black colors completely removed)
export class ProcessSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.processes = [
      { id: "P1", pid: 101, state: "READY", pc: 0x004010, priority: 1, burst: 5, executed: 0 },
      { id: "P2", pid: 102, state: "RUNNING", pc: 0x004050, priority: 2, burst: 8, executed: 3 },
      { id: "P3", pid: 103, state: "WAITING", pc: 0x0040A0, priority: 3, burst: 4, executed: 1 }
    ];
    this.nextPid = 104;
    this.isRunning = false;
    this.intervalId = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border: 3px solid var(--color-burgundy); background:#ffffff;">
        <div class="sim-control-bar" style="background:var(--color-beige); border:2px solid var(--color-brown);">
          <div class="control-group">
            <button id="p-btn-play" class="sim-btn play-btn" style="background:linear-gradient(135deg, #059669, #10b981); color:#fff; font-weight:800;">▶ Play</button>
            <button id="p-btn-step" class="sim-btn" style="font-weight:700;">⏭ Step Clock</button>
            <button id="p-btn-add" class="sim-btn" style="background:var(--color-purple); color:#fff; font-weight:800;">+ Spawn Process</button>
            <button id="p-btn-reset" class="sim-btn" style="font-weight:700;">↺ Reset</button>
          </div>
          <div class="control-group">
            <span style="font-size:0.9rem; color:var(--color-deep-plum); font-weight:800;">Clock Tick: <strong id="p-clock" style="color:var(--color-burgundy); font-size:1.1rem;">0</strong></span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1.1fr; gap:1.25rem; margin-top:1rem;">
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <!-- Queues Grid with Clean White/Beige Backgrounds -->
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.75rem;">
              <div class="queue-card" style="background:#ffffff; padding:0.85rem; border-radius:10px; border:2px solid var(--color-light-blue); box-shadow:0 4px 12px rgba(2,132,199,0.1);">
                <div style="font-size:0.8rem; font-weight:800; color:var(--color-light-blue); margin-bottom:0.5rem; text-transform:uppercase;">READY QUEUE</div>
                <div id="queue-ready" style="display:flex; flex-direction:column; gap:0.5rem; min-height:90px;"></div>
              </div>

              <div class="queue-card" style="background:#ffffff; padding:0.85rem; border-radius:10px; border:2px solid var(--color-purple); box-shadow:0 4px 12px rgba(126,34,206,0.1);">
                <div style="font-size:0.8rem; font-weight:800; color:var(--color-purple); margin-bottom:0.5rem; text-transform:uppercase;">CPU RUNNING</div>
                <div id="queue-running" style="display:flex; flex-direction:column; gap:0.5rem; min-height:90px;"></div>
              </div>

              <div class="queue-card" style="background:#ffffff; padding:0.85rem; border-radius:10px; border:2px solid var(--color-yellow); box-shadow:0 4px 12px rgba(245,158,11,0.1);">
                <div style="font-size:0.8rem; font-weight:800; color:var(--color-brown); margin-bottom:0.5rem; text-transform:uppercase;">I/O WAITING</div>
                <div id="queue-waiting" style="display:flex; flex-direction:column; gap:0.5rem; min-height:90px;"></div>
              </div>

              <div class="queue-card" style="background:#ffffff; padding:0.85rem; border-radius:10px; border:2px solid #059669; box-shadow:0 4px 12px rgba(5,150,105,0.1);">
                <div style="font-size:0.8rem; font-weight:800; color:#059669; margin-bottom:0.5rem; text-transform:uppercase;">TERMINATED</div>
                <div id="queue-terminated" style="display:flex; flex-direction:column; gap:0.5rem; min-height:90px;"></div>
              </div>
            </div>

            <!-- Hint Box with Soft Warm Beige Background -->
            <div style="background:var(--color-beige); padding:1rem; border-radius:10px; border:2px solid var(--color-yellow); font-size:0.88rem; color:var(--color-deep-plum); font-weight:600;">
              💡 <strong>Interactive Hint:</strong> Click on any process block to inspect its complete PCB metadata parameters or force an I/O wait state interrupt!
            </div>
          </div>

          <!-- PCB Inspector Panel with Bright White Background -->
          <div id="pcb-panel" style="background:#ffffff; padding:1.25rem; border-radius:10px; border:2px solid var(--color-burgundy); display:flex; flex-direction:column; gap:0.75rem; box-shadow:0 4px 15px rgba(112,26,117,0.12);">
            <div style="font-weight:800; font-size:1rem; color:var(--color-burgundy); border-bottom:2px solid var(--border-color); padding-bottom:0.4rem; display:flex; justify-content:space-between;">
              <span>📋 PCB Inspector</span>
              <span>Metadata</span>
            </div>
            <div id="pcb-details" style="font-family:var(--font-mono); font-size:0.85rem; line-height:1.7; color:var(--color-deep-plum); font-weight:700;">
              Select a process above to view its Process Control Block metadata.
            </div>
          </div>
        </div>
      </div>
    `;

    this.clock = 0;
    this.attachEvents();
    this.updateUI();
  }

  attachEvents() {
    const playBtn = this.container.querySelector("#p-btn-play");
    const stepBtn = this.container.querySelector("#p-btn-step");
    const addBtn = this.container.querySelector("#p-btn-add");
    const resetBtn = this.container.querySelector("#p-btn-reset");

    playBtn.onclick = () => {
      this.isRunning = !this.isRunning;
      if (this.isRunning) {
        playBtn.textContent = "⏸ Pause";
        playBtn.className = "sim-btn pause-btn";
        this.intervalId = setInterval(() => this.step(), 1000);
      } else {
        playBtn.textContent = "▶ Play";
        playBtn.className = "sim-btn play-btn";
        clearInterval(this.intervalId);
      }
    };

    stepBtn.onclick = () => this.step();

    addBtn.onclick = () => {
      const pName = `P${this.processes.length + 1}`;
      this.processes.push({
        id: pName,
        pid: this.nextPid++,
        state: "READY",
        pc: 0x004000 + Math.floor(Math.random() * 0x1000),
        priority: Math.floor(Math.random() * 5) + 1,
        burst: Math.floor(Math.random() * 6) + 3,
        executed: 0
      });
      this.updateUI();
    };

    resetBtn.onclick = () => {
      this.isRunning = false;
      clearInterval(this.intervalId);
      playBtn.textContent = "▶ Play";
      playBtn.className = "sim-btn play-btn";
      this.clock = 0;
      this.processes = [
        { id: "P1", pid: 101, state: "READY", pc: 0x004010, priority: 1, burst: 5, executed: 0 },
        { id: "P2", pid: 102, state: "RUNNING", pc: 0x004050, priority: 2, burst: 8, executed: 3 },
        { id: "P3", pid: 103, state: "WAITING", pc: 0x0040A0, priority: 3, burst: 4, executed: 1 }
      ];
      this.updateUI();
    };
  }

  step() {
    this.clock++;
    const running = this.processes.find(p => p.state === "RUNNING");
    if (running) {
      running.executed++;
      running.pc += 0x4;
      if (running.executed >= running.burst) {
        running.state = "TERMINATED";
        const ready = this.processes.find(p => p.state === "READY");
        if (ready) ready.state = "RUNNING";
      } else if (Math.random() < 0.25) {
        running.state = "WAITING";
        const ready = this.processes.find(p => p.state === "READY");
        if (ready) ready.state = "RUNNING";
      }
    } else {
      const ready = this.processes.find(p => p.state === "READY");
      if (ready) ready.state = "RUNNING";
    }

    const waiting = this.processes.filter(p => p.state === "WAITING");
    waiting.forEach(p => {
      if (Math.random() < 0.4) p.state = "READY";
    });

    this.updateUI();
  }

  updateUI() {
    this.container.querySelector("#p-clock").textContent = this.clock;
    const readyEl = this.container.querySelector("#queue-ready");
    const runningEl = this.container.querySelector("#queue-running");
    const waitingEl = this.container.querySelector("#queue-waiting");
    const termEl = this.container.querySelector("#queue-terminated");

    readyEl.innerHTML = "";
    runningEl.innerHTML = "";
    waitingEl.innerHTML = "";
    termEl.innerHTML = "";

    this.processes.forEach(p => {
      const badge = document.createElement("div");
      badge.style.padding = "0.5rem 0.65rem";
      badge.style.borderRadius = "8px";
      badge.style.background = "var(--color-beige)";
      badge.style.border = "2px solid var(--color-brown)";
      badge.style.color = "var(--color-deep-plum)";
      badge.style.fontSize = "0.82rem";
      badge.style.fontWeight = "700";
      badge.style.cursor = "pointer";
      badge.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
      badge.innerHTML = `<strong style="color:var(--color-burgundy);">${p.id}</strong> (PID:${p.pid})<br/><small style="color:var(--text-muted);">Progress: ${p.executed}/${p.burst}</small>`;
      badge.onclick = () => this.inspectPCB(p);

      if (p.state === "READY") readyEl.appendChild(badge);
      else if (p.state === "RUNNING") runningEl.appendChild(badge);
      else if (p.state === "WAITING") waitingEl.appendChild(badge);
      else if (p.state === "TERMINATED") termEl.appendChild(badge);
    });
  }

  inspectPCB(p) {
    const details = this.container.querySelector("#pcb-details");
    details.innerHTML = `
      <div><strong>PROCESS ID:</strong> <span style="color:var(--color-burgundy);">${p.pid} (${p.id})</span></div>
      <div><strong>STATE:</strong> <span style="color:var(--color-purple); font-weight:800;">${p.state}</span></div>
      <div><strong>PROG COUNTER:</strong> 0x${p.pc.toString(16).toUpperCase()}</div>
      <div><strong>PRIORITY:</strong> Level ${p.priority}</div>
      <div><strong>BURST TIME:</strong> ${p.burst} ms</div>
      <div><strong>EXECUTED:</strong> ${p.executed} ms</div>
      <div><strong>MEM LIMITS:</strong> 0x100000 - 0x140000</div>
    `;
  }

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
