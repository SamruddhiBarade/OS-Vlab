// Disk Scheduling Simulation Module with FULL Custom Inputs
export class DiskSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.algorithm = "sstf";
    this.head = 53;
    this.queue = [98, 183, 37, 122, 14, 124, 65, 67];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:2px solid var(--accent-cyan);">
        <div class="sim-control-bar">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Algorithm:</label>
            <select id="disk-algo-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--accent-cyan);">
              <option value="sstf">Shortest Seek Time First (SSTF)</option>
              <option value="fcfs">First-Come First-Served (FCFS)</option>
              <option value="scan">SCAN (Elevator)</option>
              <option value="cscan">C-SCAN (Circular SCAN)</option>
            </select>
          </div>

          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Initial Head (0-199):</label>
            <input type="number" id="disk-head-input" class="task-input-field" value="53" min="0" max="199" style="width:75px; padding:0.35rem; font-weight:700; text-align:center; border-color:var(--accent-cyan);"/>
          </div>

          <div class="control-group">
            <button id="disk-btn-run" class="sim-btn play-btn" style="background:linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo)); font-weight:700;">▶ Plot Disk Head Movement</button>
          </div>
        </div>

        <!-- Custom Track Queue Input Creator -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="font-size:0.9rem; font-weight:800; color:var(--accent-purple); display:flex; align-items:center; gap:0.4rem;">
            <span>💽</span> Enter Custom Disk Track Request Queue (0 to 199):
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center;">
            <input type="text" id="disk-queue-input" class="task-input-field" value="98, 183, 37, 122, 14, 124, 65, 67" placeholder="e.g. 50, 120, 15, 180, 40" style="flex:1; font-weight:700; font-family:var(--font-mono);"/>
            <button id="disk-btn-rand-queue" class="sim-btn" style="white-space:nowrap; background:rgba(168,85,247,0.15); color:var(--accent-purple); border-color:var(--accent-purple);">🎲 Random Queue</button>
            <button id="disk-btn-apply-queue" class="btn-primary" style="white-space:nowrap;">
              Apply Queue
            </button>
          </div>
        </div>

        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan); display:flex; justify-content:space-between;">
            <span>💽 Disk Arm Trajectory & Track Movements</span>
            <span style="color:var(--text-muted); font-size:0.8rem;">Requests: <strong>${this.queue.length}</strong> tracks</span>
          </div>

          <div class="sim-canvas-container" style="height:270px; background:var(--bg-dark); border:2px solid var(--border-color);">
            <canvas id="disk-canvas" width="700" height="250" class="sim-canvas"></canvas>
          </div>

          <div id="disk-summary" style="display:flex; justify-content:space-around; background:linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15)); padding:1.15rem; border-radius:12px; border:2px solid var(--accent-cyan); font-size:1rem; font-weight:800;">
            <div>Initial Head Position: <strong style="color:var(--accent-cyan); font-size:1.2rem;">${this.head}</strong></div>
            <div>Total Seek Distance: <strong id="disk-total-seek" style="color:var(--accent-purple); font-size:1.2rem;">0 tracks</strong></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.plot();
  }

  attachEvents() {
    const algoSelect = this.container.querySelector("#disk-algo-select");
    const headInput = this.container.querySelector("#disk-head-input");
    const queueInput = this.container.querySelector("#disk-queue-input");
    const applyBtn = this.container.querySelector("#disk-btn-apply-queue");
    const randBtn = this.container.querySelector("#disk-btn-rand-queue");
    const runBtn = this.container.querySelector("#disk-btn-run");

    algoSelect.onchange = (e) => {
      this.algorithm = e.target.value;
      this.plot();
    };

    headInput.onchange = (e) => {
      this.head = parseInt(e.target.value) || 53;
      this.plot();
    };

    applyBtn.onclick = () => {
      const raw = queueInput.value;
      const parsed = raw.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x >= 0 && x <= 199);
      if (parsed.length > 0) {
        this.queue = parsed;
        this.plot();
      } else {
        alert("Please enter a valid comma-separated list of track numbers between 0 and 199.");
      }
    };

    randBtn.onclick = () => {
      let randArr = [];
      const len = Math.floor(Math.random() * 6) + 6;
      for (let i = 0; i < len; i++) {
        randArr.push(Math.floor(Math.random() * 195) + 2);
      }
      this.queue = randArr;
      queueInput.value = randArr.join(", ");
      this.plot();
    };

    runBtn.onclick = () => this.plot();
  }

  plot() {
    let sequence = [this.head];
    let q = [...this.queue];
    let curr = this.head;
    let totalSeek = 0;

    if (this.algorithm === "fcfs") {
      sequence.push(...q);
    } else if (this.algorithm === "sstf") {
      while (q.length > 0) {
        q.sort((a, b) => Math.abs(a - curr) - Math.abs(b - curr));
        let next = q.shift();
        sequence.push(next);
        curr = next;
      }
    } else if (this.algorithm === "scan") {
      let left = q.filter(x => x < curr).sort((a, b) => b - a);
      let right = q.filter(x => x >= curr).sort((a, b) => a - b);
      sequence.push(...right, 199, ...left);
    } else if (this.algorithm === "cscan") {
      let left = q.filter(x => x < curr).sort((a, b) => a - b);
      let right = q.filter(x => x >= curr).sort((a, b) => a - b);
      sequence.push(...right, 199, 0, ...left);
    }

    for (let i = 0; i < sequence.length - 1; i++) {
      totalSeek += Math.abs(sequence[i+1] - sequence[i]);
    }

    this.drawCanvas(sequence);
    this.container.querySelector("#disk-total-seek").textContent = `${totalSeek} tracks`;
  }

  drawCanvas(sequence) {
    const canvas = this.container.querySelector("#disk-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(width - 40, 30);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Track 0", 30, 18);
    ctx.fillText("Track 199", width - 60, 18);

    const stepY = (height - 60) / Math.max(1, sequence.length - 1);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3.5;
    ctx.beginPath();

    sequence.forEach((track, i) => {
      const x = 40 + (track / 199) * (width - 80);
      const y = 45 + i * stepY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    sequence.forEach((track, i) => {
      const x = 40 + (track / 199) * (width - 80);
      const y = 45 + i * stepY;

      ctx.fillStyle = i === 0 ? "#d97706" : "#7e22ce";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#3b0764";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`${track}`, x - 10, y - 8);
    });
  }

  destroy() {}
}
