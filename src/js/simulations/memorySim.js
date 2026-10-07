// Memory Management Dynamic Allocator Simulator with FULL Custom Inputs
export class MemorySimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.algo = "first-fit";
    this.blocks = [
      { size: 100, free: true, proc: null },
      { size: 500, free: true, proc: null },
      { size: 200, free: true, proc: null },
      { size: 300, free: true, proc: null },
      { size: 600, free: true, proc: null }
    ];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:2px solid var(--accent-cyan);">
        <div class="sim-control-bar">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Allocation Strategy:</label>
            <select id="mem-algo-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--accent-cyan);">
              <option value="first-fit">First Fit</option>
              <option value="best-fit">Best Fit</option>
              <option value="worst-fit">Worst Fit</option>
            </select>
          </div>
          <div class="control-group">
            <button id="mem-btn-compact" class="sim-btn" style="background:var(--accent-purple); color:#fff; font-weight:700;">🧹 Compact Memory</button>
            <button id="mem-btn-reset" class="sim-btn">↺ Reset RAM</button>
          </div>
        </div>

        <!-- Custom Process & Hole Creator Bar -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
            <div style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan); display:flex; align-items:center; gap:0.4rem;">
              <span>💾</span> Allocate Process of Your Choice:
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center;">
              <input type="number" id="mem-size-input" class="task-input-field" value="212" placeholder="Process Size (KB)" style="width:140px; padding:0.4rem; font-weight:700; text-align:center; border-color:var(--accent-cyan);"/>
              <button id="mem-btn-alloc" class="btn-primary" style="padding:0.45rem 1rem;">
                + Allocate Process
              </button>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.75rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--accent-purple);">
              🔧 Set Custom RAM Hole Sizes List (KB):
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center; flex:1; max-width:500px;">
              <input type="text" id="mem-custom-holes-input" class="task-input-field" value="100, 500, 200, 300, 600" style="flex:1; font-weight:700; font-family:var(--font-mono);"/>
              <button id="mem-btn-apply-holes" class="sim-btn" style="white-space:nowrap; background:rgba(168,85,247,0.15); color:var(--accent-purple); border-color:var(--accent-purple); font-weight:700;">Apply Holes</button>
            </div>
          </div>
        </div>

        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan); display:flex; justify-content:space-between; align-items:center;">
            <span>💾 RAM Partition Map (Click any allocated block to de-allocate it!)</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">Total RAM Capacity: <strong id="total-ram-cap">1700</strong> KB</span>
          </div>

          <div id="mem-map-bar" class="memory-map-bar" style="height:65px; box-shadow:0 4px 15px rgba(0,0,0,0.15);"></div>

          <div id="mem-stats" style="display:flex; justify-content:space-around; background:linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15)); padding:1.15rem; border-radius:12px; border:2px solid var(--accent-cyan); font-size:1rem; font-weight:800;">
            <div>Allocated Memory: <strong id="mem-used" style="color:var(--accent-cyan); font-size:1.2rem;">0 KB</strong></div>
            <div>Free Memory: <strong id="mem-free" style="color:var(--accent-emerald); font-size:1.2rem;">1700 KB</strong></div>
            <div>External Fragmentation: <strong id="mem-frag" style="color:var(--accent-amber); font-size:1.2rem;">0 KB</strong></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.renderMap();
  }

  attachEvents() {
    const algoSelect = this.container.querySelector("#mem-algo-select");
    const allocBtn = this.container.querySelector("#mem-btn-alloc");
    const compactBtn = this.container.querySelector("#mem-btn-compact");
    const resetBtn = this.container.querySelector("#mem-btn-reset");
    const holesInput = this.container.querySelector("#mem-custom-holes-input");
    const applyHolesBtn = this.container.querySelector("#mem-btn-apply-holes");

    algoSelect.onchange = (e) => this.algo = e.target.value;

    allocBtn.onclick = () => {
      const sizeInput = this.container.querySelector("#mem-size-input");
      const reqSize = parseInt(sizeInput.value) || 100;
      this.allocate(reqSize);
    };

    applyHolesBtn.onclick = () => {
      const raw = holesInput.value;
      const parsed = raw.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x > 0);
      if (parsed.length > 0) {
        this.blocks = parsed.map(s => ({ size: s, free: true, proc: null }));
        this.renderMap();
      } else {
        alert("Please enter a valid comma-separated list of positive numbers for RAM hole sizes.");
      }
    };

    compactBtn.onclick = () => {
      let totalFree = 0;
      let allocatedBlocks = [];

      this.blocks.forEach(b => {
        if (!b.free) allocatedBlocks.push(b);
        else totalFree += b.size;
      });

      if (totalFree > 0) {
        allocatedBlocks.push({ size: totalFree, free: true, proc: null });
        this.blocks = allocatedBlocks;
      }
      this.renderMap();
    };

    resetBtn.onclick = () => {
      this.blocks = [
        { size: 100, free: true, proc: null },
        { size: 500, free: true, proc: null },
        { size: 200, free: true, proc: null },
        { size: 300, free: true, proc: null },
        { size: 600, free: true, proc: null }
      ];
      this.renderMap();
    };
  }

  allocate(reqSize) {
    let targetIdx = -1;

    if (this.algo === "first-fit") {
      targetIdx = this.blocks.findIndex(b => b.free && b.size >= reqSize);
    } else if (this.algo === "best-fit") {
      let minHole = Infinity;
      this.blocks.forEach((b, i) => {
        if (b.free && b.size >= reqSize && b.size < minHole) {
          minHole = b.size;
          targetIdx = i;
        }
      });
    } else if (this.algo === "worst-fit") {
      let maxHole = -1;
      this.blocks.forEach((b, i) => {
        if (b.free && b.size >= reqSize && b.size > maxHole) {
          maxHole = b.size;
          targetIdx = i;
        }
      });
    }

    if (targetIdx !== -1) {
      const target = this.blocks[targetIdx];
      const remaining = target.size - reqSize;
      const procName = `P${Math.floor(Math.random()*90)+10} (${reqSize}K)`;

      target.size = reqSize;
      target.free = false;
      target.proc = procName;

      if (remaining > 0) {
        this.blocks.splice(targetIdx + 1, 0, { size: remaining, free: true, proc: null });
      }
      this.renderMap();
    } else {
      alert(`❌ Allocation Failed! No hole satisfies process request size ${reqSize}KB.`);
    }
  }

  renderMap() {
    const mapBar = this.container.querySelector("#mem-map-bar");
    mapBar.innerHTML = "";

    let totalMem = 0;
    this.blocks.forEach(b => totalMem += b.size);
    if (totalMem === 0) totalMem = 1;

    let usedMem = 0;
    let freeMem = 0;

    this.blocks.forEach((b, idx) => {
      const widthPct = (b.size / totalMem) * 100;
      const blockEl = document.createElement("div");
      blockEl.className = `mem-block ${b.free ? 'free' : 'allocated'}`;
      blockEl.style.width = `${widthPct}%`;
      blockEl.style.cursor = b.free ? "default" : "pointer";
      blockEl.title = b.free ? `Hole ${b.size}KB` : `Click to free ${b.proc}`;
      blockEl.innerHTML = b.free ? `Hole<br/>${b.size}K` : `${b.proc}<br/><small style="font-size:0.65rem;">(click to free)</small>`;

      if (!b.free) {
        usedMem += b.size;
        blockEl.onclick = () => {
          b.free = true;
          b.proc = null;
          this.renderMap();
        };
      } else {
        freeMem += b.size;
      }

      mapBar.appendChild(blockEl);
    });

    this.container.querySelector("#total-ram-cap").textContent = totalMem;
    this.container.querySelector("#mem-used").textContent = `${usedMem} KB`;
    this.container.querySelector("#mem-free").textContent = `${freeMem} KB`;
    this.container.querySelector("#mem-frag").textContent = `${freeMem} KB`;
  }

  destroy() {}
}
