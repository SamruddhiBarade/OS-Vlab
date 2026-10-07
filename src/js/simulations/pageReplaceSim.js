// Page Replacement Algorithms Simulation Module with FULL Custom Inputs
export class PageReplaceSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.algorithm = "lru";
    this.framesCount = 3;
    this.refString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:2px solid var(--accent-purple);">
        <div class="sim-control-bar">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Algorithm:</label>
            <select id="pr-algo-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--accent-purple);">
              <option value="lru">Least Recently Used (LRU)</option>
              <option value="fifo">First-In First-Out (FIFO)</option>
              <option value="optimal">Optimal (OPT)</option>
            </select>
          </div>
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">RAM Frames Count:</label>
            <input type="number" id="pr-frames-input" class="task-input-field" value="3" min="1" max="8" style="width:70px; padding:0.35rem; font-weight:700; text-align:center; border-color:var(--accent-purple);"/>
          </div>
          <div class="control-group">
            <button id="pr-btn-run" class="sim-btn play-btn" style="background:linear-gradient(135deg, var(--accent-purple), var(--accent-indigo)); font-weight:700;">▶ Compute Page Faults</button>
          </div>
        </div>

        <!-- Custom Reference String Creator Bar -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan); display:flex; align-items:center; gap:0.4rem;">
            <span>✏️</span> Enter Custom Page Reference String of Your Choice:
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center;">
            <input type="text" id="pr-custom-string-input" class="task-input-field" value="7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2" placeholder="e.g. 1, 2, 3, 4, 1, 2, 5, 1, 2, 3" style="flex:1; font-weight:700; font-family:var(--font-mono);"/>
            <button id="pr-btn-rand-string" class="sim-btn" style="white-space:nowrap; background:rgba(6,182,212,0.15); color:var(--accent-cyan); border-color:var(--accent-cyan);">🎲 Random String</button>
            <button id="pr-btn-apply-custom" class="btn-primary" style="white-space:nowrap;">
              Apply String
            </button>
          </div>
        </div>

        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan); display:flex; justify-content:space-between;">
            <span>🔄 Frame Replacement Matrix</span>
            <span style="color:var(--text-muted); font-size:0.8rem;">Current Length: <strong>${this.refString.length}</strong> references</span>
          </div>

          <div style="overflow-x:auto;">
            <table id="pr-matrix-table" class="page-matrix-table"></table>
          </div>

          <div id="pr-stats-box" style="display:flex; justify-content:space-around; background:linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(6, 182, 212, 0.15)); padding:1.15rem; border-radius:12px; border:2px solid var(--accent-purple); font-size:1rem; font-weight:800;">
            <div>Total Page Faults: <span id="pr-faults" style="color:var(--accent-rose); font-size:1.2rem;">0</span></div>
            <div>Total Page Hits: <span id="pr-hits" style="color:var(--accent-emerald); font-size:1.2rem;">0</span></div>
            <div>Hit Ratio: <span id="pr-ratio" style="color:var(--accent-cyan); font-size:1.2rem;">0%</span></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.compute();
  }

  attachEvents() {
    const algoSelect = this.container.querySelector("#pr-algo-select");
    const framesInput = this.container.querySelector("#pr-frames-input");
    const stringInput = this.container.querySelector("#pr-custom-string-input");
    const applyBtn = this.container.querySelector("#pr-btn-apply-custom");
    const randBtn = this.container.querySelector("#pr-btn-rand-string");
    const runBtn = this.container.querySelector("#pr-btn-run");

    algoSelect.onchange = (e) => {
      this.algorithm = e.target.value;
      this.compute();
    };

    framesInput.onchange = (e) => {
      this.framesCount = parseInt(e.target.value) || 3;
      this.compute();
    };

    applyBtn.onclick = () => {
      const raw = stringInput.value;
      const parsed = raw.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (parsed.length > 0) {
        this.refString = parsed;
        this.compute();
      } else {
        alert("Please enter a valid comma-separated list of numbers (e.g. 1, 2, 3, 4, 1, 2).");
      }
    };

    randBtn.onclick = () => {
      let randArr = [];
      const len = Math.floor(Math.random() * 8) + 8;
      for (let i = 0; i < len; i++) {
        randArr.push(Math.floor(Math.random() * 8));
      }
      this.refString = randArr;
      stringInput.value = randArr.join(", ");
      this.compute();
    };

    runBtn.onclick = () => this.compute();
  }

  compute() {
    const n = this.refString.length;
    const fCount = this.framesCount;
    let frames = [];
    let history = [];
    let faults = 0;
    let hits = 0;
    let fifoQueue = [];
    let lastUsed = {};

    for (let i = 0; i < n; i++) {
      const page = this.refString[i];
      let isHit = frames.includes(page);
      let stepState = { ref: page, hit: isHit, frames: [] };

      if (isHit) {
        hits++;
        if (this.algorithm === "lru") lastUsed[page] = i;
      } else {
        faults++;
        if (frames.length < fCount) {
          frames.push(page);
          fifoQueue.push(page);
        } else {
          let victim = -1;
          if (this.algorithm === "fifo") {
            victim = fifoQueue.shift();
            fifoQueue.push(page);
          } else if (this.algorithm === "lru") {
            let lruTime = Infinity;
            frames.forEach(fp => {
              if ((lastUsed[fp] || 0) < lruTime) {
                lruTime = lastUsed[fp] || 0;
                victim = fp;
              }
            });
          } else if (this.algorithm === "optimal") {
            let maxFuture = -1;
            frames.forEach(fp => {
              let futureIdx = this.refString.slice(i + 1).indexOf(fp);
              if (futureIdx === -1) futureIdx = Infinity;
              if (futureIdx > maxFuture) {
                maxFuture = futureIdx;
                victim = fp;
              }
            });
          }
          const replaceIdx = frames.indexOf(victim);
          if (replaceIdx !== -1) frames[replaceIdx] = page;
        }
        lastUsed[page] = i;
      }

      stepState.frames = [...frames];
      history.push(stepState);
    }

    this.renderMatrix(history, faults, hits);
  }

  renderMatrix(history, faults, hits) {
    const table = this.container.querySelector("#pr-matrix-table");
    table.innerHTML = "";

    let headerRow = `<tr style="background:var(--accent-purple); color:#fff;"><th>Ref Page</th>`;
    history.forEach(h => headerRow += `<th>${h.ref}</th>`);
    headerRow += `</tr>`;

    let bodyRows = "";
    for (let f = 0; f < this.framesCount; f++) {
      let row = `<tr><td style="font-weight:800; color:var(--accent-purple);">Frame ${f+1}</td>`;
      history.forEach(h => {
        const pageVal = h.frames[f] !== undefined ? h.frames[f] : "-";
        row += `<td>${pageVal}</td>`;
      });
      row += `</tr>`;
      bodyRows += row;
    }

    let statusRow = `<tr><td style="font-weight:800;">Status</td>`;
    history.forEach(h => {
      statusRow += h.hit ? `<td class="hit" style="font-weight:800;">HIT</td>` : `<td class="fault" style="font-weight:800;">FAULT</td>`;
    });
    statusRow += `</tr>`;

    table.innerHTML = `<thead>${headerRow}</thead><tbody>${bodyRows}${statusRow}</tbody>`;

    const total = history.length;
    this.container.querySelector("#pr-faults").textContent = faults;
    this.container.querySelector("#pr-hits").textContent = hits;
    this.container.querySelector("#pr-ratio").textContent = `${Math.round((hits / total) * 100)}%`;
  }

  destroy() {}
}
