// CPU Scheduling Simulation Module with FULL Custom Inputs
export class CpuSchedulerSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.algorithm = "fcfs";
    this.quantum = 2;
    this.processes = [
      { id: "P1", arrival: 0, burst: 6, priority: 2 },
      { id: "P2", arrival: 1, burst: 4, priority: 1 },
      { id: "P3", arrival: 2, burst: 8, priority: 3 },
      { id: "P4", arrival: 3, burst: 3, priority: 2 }
    ];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border: 2px solid var(--accent-cyan);">
        <!-- Top Control Bar -->
        <div class="sim-control-bar" style="background:linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Algorithm:</label>
            <select id="cpu-algo-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--accent-cyan);">
              <option value="fcfs">First-Come First-Served (FCFS)</option>
              <option value="sjf">Shortest Job First (SJF Non-Preemptive)</option>
              <option value="rr">Round Robin (RR)</option>
              <option value="priority">Priority Scheduling</option>
            </select>
          </div>

          <div id="rr-quantum-group" class="control-group" style="display:none;">
            <label style="font-size:0.85rem; font-weight:700; color:var(--accent-purple);">Time Quantum (q):</label>
            <input type="number" id="cpu-quantum-input" class="task-input-field" value="2" min="1" max="20" style="width:70px; padding:0.35rem; text-align:center; font-weight:700; border-color:var(--accent-purple);"/>
          </div>

          <div class="control-group">
            <button id="cpu-btn-run" class="sim-btn play-btn" style="background:linear-gradient(135deg, #10b981, #059669); font-weight:700;">▶ Run Gantt Calculation</button>
            <button id="cpu-btn-reset" class="sim-btn">↺ Reset Default</button>
          </div>
        </div>

        <!-- Custom Process Input Creator Bar -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
          <div style="font-size:0.9rem; font-weight:800; color:var(--accent-purple); display:flex; align-items:center; gap:0.4rem;">
            <span>➕</span> Enter Custom Process of Your Choice:
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Proc ID:</label>
              <input type="text" id="add-p-id" class="task-input-field" value="P5" style="width:65px; padding:0.3rem; text-align:center;"/>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Arrival Time:</label>
              <input type="number" id="add-p-arr" class="task-input-field" value="0" min="0" style="width:75px; padding:0.3rem; text-align:center;"/>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Burst Time:</label>
              <input type="number" id="add-p-burst" class="task-input-field" value="5" min="1" style="width:75px; padding:0.3rem; text-align:center;"/>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Priority:</label>
              <input type="number" id="add-p-prio" class="task-input-field" value="1" min="1" style="width:65px; padding:0.3rem; text-align:center;"/>
            </div>
            <button id="cpu-btn-add-custom" class="btn-primary" style="padding:0.4rem 0.9rem; font-size:0.8rem; margin-top:1rem;">
              + Add Process
            </button>
          </div>
        </div>

        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:1.25rem;">
          <!-- Process Table List with Delete Buttons -->
          <div style="background:var(--bg-card); padding:1rem; border-radius:10px; border:1px solid var(--border-color);">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
              <span>📝 Active Custom Process List</span>
              <button id="cpu-btn-clear-all" class="sim-btn" style="font-size:0.75rem; background:rgba(244,63,94,0.15); color:var(--accent-rose); border-color:var(--accent-rose);">🗑 Clear All Processes</button>
            </div>
            <div id="cpu-process-chips" style="display:flex; flex-wrap:wrap; gap:0.6rem;"></div>
          </div>

          <!-- Dynamic Gantt Chart Display -->
          <div style="background:var(--bg-dark); padding:1.25rem; border-radius:10px; border:1px solid var(--accent-cyan); box-shadow:0 4px 15px var(--accent-cyan-glow);">
            <div style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
              <span>📊 Dynamic Color-Coded Gantt Chart</span>
              <span id="gantt-algo-tag" class="module-status-tag status-in-progress" style="font-size:0.75rem;">FCFS</span>
            </div>
            <div id="gantt-container" style="display:flex; height:50px; width:100%; border-radius:8px; overflow:hidden; border:2px solid var(--border-color); box-shadow:inset 0 2px 4px rgba(0,0,0,0.2);"></div>
            <div id="gantt-time-markers" style="display:flex; width:100%; font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem; font-weight:700;"></div>
          </div>

          <!-- Computed Stats Table -->
          <div style="overflow-x:auto;">
            <table class="page-matrix-table" style="width:100%;">
              <thead>
                <tr style="background:linear-gradient(90deg, var(--accent-cyan), var(--accent-purple)); color:#fff;">
                  <th>Process</th>
                  <th>Arrival Time</th>
                  <th>Burst Time</th>
                  <th>Priority</th>
                  <th>Completion Time</th>
                  <th>Turnaround Time (TAT)</th>
                  <th>Waiting Time (WT)</th>
                </tr>
              </thead>
              <tbody id="cpu-results-body"></tbody>
            </table>
          </div>

          <!-- Averages Box -->
          <div id="cpu-summary-box" style="padding:1.15rem; background:linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15)); border:2px solid var(--accent-cyan); border-radius:12px; font-size:1rem; display:flex; gap:2.5rem; justify-content:center; font-weight:800;">
            <div>Average Turnaround Time ($TAT_{avg}$): <span id="avg-tat" style="color:var(--accent-cyan); font-size:1.2rem;">0</span> ms</div>
            <div>Average Waiting Time ($WT_{avg}$): <span id="avg-wt" style="color:var(--accent-purple); font-size:1.2rem;">0</span> ms</div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.renderProcessChips();
    this.compute();
  }

  attachEvents() {
    const algoSelect = this.container.querySelector("#cpu-algo-select");
    const quantumGroup = this.container.querySelector("#rr-quantum-group");
    const quantumInput = this.container.querySelector("#cpu-quantum-input");
    const runBtn = this.container.querySelector("#cpu-btn-run");
    const resetBtn = this.container.querySelector("#cpu-btn-reset");
    const addCustomBtn = this.container.querySelector("#cpu-btn-add-custom");
    const clearAllBtn = this.container.querySelector("#cpu-btn-clear-all");

    algoSelect.onchange = (e) => {
      this.algorithm = e.target.value;
      quantumGroup.style.display = this.algorithm === "rr" ? "flex" : "none";
      this.compute();
    };

    quantumInput.onchange = (e) => {
      this.quantum = parseInt(e.target.value) || 2;
      this.compute();
    };

    addCustomBtn.onclick = () => {
      const pId = this.container.querySelector("#add-p-id").value.trim() || `P${this.processes.length + 1}`;
      const pArr = parseInt(this.container.querySelector("#add-p-arr").value) || 0;
      const pBurst = parseInt(this.container.querySelector("#add-p-burst").value) || 1;
      const pPrio = parseInt(this.container.querySelector("#add-p-prio").value) || 1;

      this.processes.push({ id: pId, arrival: pArr, burst: pBurst, priority: pPrio });
      this.container.querySelector("#add-p-id").value = `P${this.processes.length + 1}`;
      this.renderProcessChips();
      this.compute();
    };

    clearAllBtn.onclick = () => {
      this.processes = [];
      this.renderProcessChips();
      this.compute();
    };

    runBtn.onclick = () => this.compute();

    resetBtn.onclick = () => {
      this.algorithm = "fcfs";
      this.quantum = 2;
      algoSelect.value = "fcfs";
      quantumGroup.style.display = "none";
      this.processes = [
        { id: "P1", arrival: 0, burst: 6, priority: 2 },
        { id: "P2", arrival: 1, burst: 4, priority: 1 },
        { id: "P3", arrival: 2, burst: 8, priority: 3 },
        { id: "P4", arrival: 3, burst: 3, priority: 2 }
      ];
      this.renderProcessChips();
      this.compute();
    };
  }

  renderProcessChips() {
    const container = this.container.querySelector("#cpu-process-chips");
    container.innerHTML = "";

    if (this.processes.length === 0) {
      container.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted);">No processes added. Enter custom values above and click "+ Add Process".</span>`;
      return;
    }

    const colors = ["#0284c7", "#a855f7", "#10b981", "#f59e0b", "#f43f5e", "#6366f1", "#ec4899"];

    this.processes.forEach((p, idx) => {
      const chip = document.createElement("div");
      chip.style.padding = "0.35rem 0.75rem";
      chip.style.borderRadius = "20px";
      chip.style.background = colors[idx % colors.length];
      chip.style.color = "#fff";
      chip.style.fontSize = "0.8rem";
      chip.style.fontWeight = "700";
      chip.style.display = "flex";
      chip.style.alignItems = "center";
      chip.style.gap = "0.5rem";
      chip.innerHTML = `
        <span>${p.id} (Arr:${p.arrival}, Burst:${p.burst}, Prio:${p.priority})</span>
        <span class="del-proc" style="cursor:pointer; opacity:0.8; font-weight:800;">✕</span>
      `;

      chip.querySelector(".del-proc").onclick = () => {
        this.processes.splice(idx, 1);
        this.renderProcessChips();
        this.compute();
      };

      container.appendChild(chip);
    });
  }

  compute() {
    this.container.querySelector("#gantt-algo-tag").textContent = this.algorithm.toUpperCase();
    if (this.processes.length === 0) {
      this.container.querySelector("#gantt-container").innerHTML = "";
      this.container.querySelector("#gantt-time-markers").innerHTML = "";
      this.container.querySelector("#cpu-results-body").innerHTML = "";
      this.container.querySelector("#avg-tat").textContent = "0";
      this.container.querySelector("#avg-wt").textContent = "0";
      return;
    }

    let gantt = [];
    let procs = JSON.parse(JSON.stringify(this.processes));

    if (this.algorithm === "fcfs") {
      procs.sort((a, b) => a.arrival - b.arrival);
      let currentTime = 0;
      procs.forEach(p => {
        if (currentTime < p.arrival) currentTime = p.arrival;
        let start = currentTime;
        currentTime += p.burst;
        gantt.push({ id: p.id, start, end: currentTime, duration: p.burst });
        p.completion = currentTime;
        p.tat = p.completion - p.arrival;
        p.wt = p.tat - p.burst;
      });
    } else if (this.algorithm === "sjf") {
      let currentTime = 0;
      let completed = 0;
      let n = procs.length;
      let isCompleted = new Array(n).fill(false);

      while (completed < n) {
        let idx = -1;
        let minBurst = Infinity;
        for (let i = 0; i < n; i++) {
          if (procs[i].arrival <= currentTime && !isCompleted[i]) {
            if (procs[i].burst < minBurst) {
              minBurst = procs[i].burst;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          let start = currentTime;
          currentTime += procs[idx].burst;
          gantt.push({ id: procs[idx].id, start, end: currentTime, duration: procs[idx].burst });
          procs[idx].completion = currentTime;
          procs[idx].tat = procs[idx].completion - procs[idx].arrival;
          procs[idx].wt = procs[idx].tat - procs[idx].burst;
          isCompleted[idx] = true;
          completed++;
        } else {
          currentTime++;
        }
      }
    } else if (this.algorithm === "rr") {
      let currentTime = 0;
      let queue = [];
      let remBurst = procs.map(p => p.burst);
      let q = this.quantum;
      let n = procs.length;
      let visited = new Array(n).fill(false);

      procs.forEach((p, i) => {
        if (p.arrival === 0) {
          queue.push(i);
          visited[i] = true;
        }
      });

      while (queue.length > 0) {
        let i = queue.shift();
        let execTime = Math.min(remBurst[i], q);
        let start = currentTime;
        currentTime += execTime;
        remBurst[i] -= execTime;

        gantt.push({ id: procs[i].id, start, end: currentTime, duration: execTime });

        for (let j = 0; j < n; j++) {
          if (procs[j].arrival <= currentTime && !visited[j] && remBurst[j] > 0) {
            queue.push(j);
            visited[j] = true;
          }
        }

        if (remBurst[i] > 0) {
          queue.push(i);
        } else {
          procs[i].completion = currentTime;
          procs[i].tat = procs[i].completion - procs[i].arrival;
          procs[i].wt = procs[i].tat - procs[i].burst;
        }
      }
    } else if (this.algorithm === "priority") {
      procs.sort((a, b) => a.priority - b.priority);
      let currentTime = 0;
      procs.forEach(p => {
        if (currentTime < p.arrival) currentTime = p.arrival;
        let start = currentTime;
        currentTime += p.burst;
        gantt.push({ id: p.id, start, end: currentTime, duration: p.burst });
        p.completion = currentTime;
        p.tat = p.completion - p.arrival;
        p.wt = p.tat - p.burst;
      });
    }

    this.renderGantt(gantt, procs);
  }

  renderGantt(gantt, procs) {
    const ganttContainer = this.container.querySelector("#gantt-container");
    const markersContainer = this.container.querySelector("#gantt-time-markers");
    const tbody = this.container.querySelector("#cpu-results-body");

    ganttContainer.innerHTML = "";
    markersContainer.innerHTML = "";
    tbody.innerHTML = "";

    const totalDuration = gantt.length > 0 ? gantt[gantt.length - 1].end : 1;
    const colors = ["#0284c7", "#a855f7", "#10b981", "#f59e0b", "#f43f5e", "#6366f1", "#ec4899"];

    gantt.forEach((block, idx) => {
      const widthPct = (block.duration / totalDuration) * 100;
      const el = document.createElement("div");
      el.className = "gantt-block";
      el.style.width = `${widthPct}%`;
      el.style.background = colors[idx % colors.length];
      el.innerHTML = `<span>${block.id}</span>`;
      ganttContainer.appendChild(el);
    });

    gantt.forEach((block, idx) => {
      if (idx === 0) {
        const m0 = document.createElement("span");
        m0.textContent = "0";
        m0.style.marginRight = "auto";
        markersContainer.appendChild(m0);
      }
      const m = document.createElement("span");
      m.textContent = block.end;
      m.style.marginLeft = "auto";
      markersContainer.appendChild(m);
    });

    let totalTat = 0;
    let totalWt = 0;
    procs.forEach(p => {
      totalTat += p.tat;
      totalWt += p.wt;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color:var(--accent-cyan);">${p.id}</strong></td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td>${p.priority}</td>
        <td>${p.completion}</td>
        <td style="color:var(--accent-cyan); font-weight:700;">${p.tat}</td>
        <td style="color:var(--accent-purple); font-weight:700;">${p.wt}</td>
      `;
      tbody.appendChild(tr);
    });

    this.container.querySelector("#avg-tat").textContent = (totalTat / procs.length).toFixed(2);
    this.container.querySelector("#avg-wt").textContent = (totalWt / procs.length).toFixed(2);
  }

  destroy() {}
}
