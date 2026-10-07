// Paging & Address Translation Simulation Module with FULL Custom Inputs
export class PagingSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.pageSize = 4096; // 4KB
    this.pageTable = { 0: 4, 1: 1, 2: 7, 3: 2, 4: 9, 5: 3 };
    this.tlb = { 2: 7, 0: 4 }; // Page -> Frame
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:2px solid var(--accent-cyan);">
        <div class="sim-control-bar">
          <div class="control-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Page Size:</label>
            <select id="pg-size-select" class="task-input-field" style="width:auto; padding:0.4rem 0.8rem; font-weight:700; border-color:var(--accent-cyan);">
              <option value="1024">1 KB (1024 bytes)</option>
              <option value="2048">2 KB (2048 bytes)</option>
              <option value="4096" selected>4 KB (4096 bytes)</option>
              <option value="8192">8 KB (8192 bytes)</option>
            </select>
          </div>

          <div class="control-group">
            <button id="pg-btn-translate" class="sim-btn play-btn" style="background:linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo)); font-weight:700;">⚡ Calculate Translation</button>
          </div>
        </div>

        <!-- Custom Address & Page Table Input Creator -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
            <div style="font-size:0.9rem; font-weight:800; color:var(--accent-purple); display:flex; align-items:center; gap:0.4rem;">
              <span>📄</span> Enter Custom Logical Byte Address:
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center;">
              <input type="number" id="pg-addr-input" class="task-input-field" value="10500" min="0" style="width:160px; padding:0.4rem; font-weight:700; text-align:center; border-color:var(--accent-purple);"/>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.75rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--accent-cyan);">
              ⚙️ Custom Page-to-Frame Map (Format: Page:Frame, ...):
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center; flex:1; max-width:500px;">
              <input type="text" id="pg-custom-table-input" class="task-input-field" value="0:4, 1:1, 2:7, 3:2, 4:9, 5:3" style="flex:1; font-weight:700; font-family:var(--font-mono);"/>
              <button id="pg-btn-apply-table" class="sim-btn" style="white-space:nowrap; background:rgba(6,182,212,0.15); color:var(--accent-cyan); border-color:var(--accent-cyan); font-weight:700;">Apply Map</button>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:1.5rem; margin-top:1rem;">
          <!-- Step-by-Step Translation Visual -->
          <div style="background:var(--bg-dark); padding:1.25rem; border-radius:10px; border:2px solid var(--accent-cyan); display:flex; flex-direction:column; gap:1rem; box-shadow:0 4px 15px var(--accent-cyan-glow);">
            <div style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan);">
              🔍 Address Translation Breakdown
            </div>

            <div id="pg-breakdown" style="font-family:var(--font-mono); font-size:0.88rem; line-height:1.8; color:var(--text-main);"></div>
          </div>

          <!-- TLB & Page Table Cards -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div style="background:var(--bg-card); padding:1rem; border-radius:10px; border:1px solid var(--accent-purple);">
              <div style="font-size:0.88rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.4rem;">
                ⚡ Hardware TLB Cache
              </div>
              <div id="tlb-display-text" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">
                Page 2 ➔ Frame 7<br/>Page 0 ➔ Frame 4
              </div>
            </div>

            <div style="background:var(--bg-card); padding:1rem; border-radius:10px; border:1px solid var(--accent-cyan);">
              <div style="font-size:0.88rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.4rem;">
                📄 Process Page Table (RAM)
              </div>
              <div id="pagetable-display-text" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted); line-height:1.6;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.translate();
  }

  attachEvents() {
    const btn = this.container.querySelector("#pg-btn-translate");
    const addrInput = this.container.querySelector("#pg-addr-input");
    const psizeSelect = this.container.querySelector("#pg-size-select");
    const tableInput = this.container.querySelector("#pg-custom-table-input");
    const applyTableBtn = this.container.querySelector("#pg-btn-apply-table");

    psizeSelect.onchange = (e) => {
      this.pageSize = parseInt(e.target.value) || 4096;
      this.translate();
    };

    btn.onclick = () => this.translate();
    addrInput.oninput = () => this.translate();

    applyTableBtn.onclick = () => {
      const raw = tableInput.value;
      const pairs = raw.split(",");
      let newTable = {};
      pairs.forEach(p => {
        const parts = p.split(":");
        if (parts.length === 2) {
          const page = parseInt(parts[0].trim());
          const frame = parseInt(parts[1].trim());
          if (!isNaN(page) && !isNaN(frame)) {
            newTable[page] = frame;
          }
        }
      });

      if (Object.keys(newTable).length > 0) {
        this.pageTable = newTable;
        this.tlb = {};
        let count = 0;
        for (let k in newTable) {
          this.tlb[k] = newTable[k];
          count++;
          if (count >= 2) break;
        }
        this.translate();
      } else {
        alert("Invalid format! Use format: 0:4, 1:1, 2:7, 3:2");
      }
    };
  }

  translate() {
    const addrInput = this.container.querySelector("#pg-addr-input");
    const logicalAddr = parseInt(addrInput.value) || 0;
    const pageNum = Math.floor(logicalAddr / this.pageSize);
    const offset = logicalAddr % this.pageSize;
    const isTlbHit = this.tlb.hasOwnProperty(pageNum);
    const frameNum = isTlbHit ? this.tlb[pageNum] : (this.pageTable[pageNum] !== undefined ? this.pageTable[pageNum] : 0);
    const physicalAddr = (frameNum * this.pageSize) + offset;

    // Render page table display
    const tableTextEl = this.container.querySelector("#pagetable-display-text");
    let ptEntries = [];
    for (let p in this.pageTable) {
      ptEntries.push(`Page ${p} ➔ Frame ${this.pageTable[p]}`);
    }
    tableTextEl.innerHTML = ptEntries.join("<br/>");

    const breakdown = this.container.querySelector("#pg-breakdown");
    breakdown.innerHTML = `
      <div><strong>Logical Byte Address:</strong> <span style="color:var(--accent-cyan); font-weight:700;">${logicalAddr}</span></div>
      <div><strong>Page Size:</strong> ${this.pageSize} bytes (${this.pageSize/1024} KB)</div>
      <div><strong>Page Number (p):</strong> Math.floor(${logicalAddr} / ${this.pageSize}) = <strong style="color:var(--accent-cyan); font-size:1.05rem;">${pageNum}</strong></div>
      <div><strong>Offset (d):</strong> ${logicalAddr} % ${this.pageSize} = <strong style="color:var(--accent-cyan); font-size:1.05rem;">${offset}</strong></div>
      <div style="margin:0.5rem 0; padding:0.6rem; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-color);">
        <strong>TLB Cache Status:</strong> ${isTlbHit ? '<span style="color:var(--accent-emerald); font-weight:800;">⚡ TLB HIT (Fast Hardware Lookup)!</span>' : '<span style="color:var(--accent-amber); font-weight:800;">⚠️ TLB MISS -> Page Table Query</span>'}
      </div>
      <div><strong>Mapped Frame Number (f):</strong> <strong style="color:var(--accent-purple); font-size:1.1rem;">Frame ${frameNum}</strong></div>
      <div style="margin-top:0.6rem; font-size:1.05rem; padding:0.75rem; background:rgba(16,185,129,0.15); border:2px solid var(--accent-emerald); border-radius:8px;">
        Physical RAM Address = (Frame × ${this.pageSize}) + Offset<br/>
        = (${frameNum} × ${this.pageSize}) + ${offset} = <strong style="color:var(--accent-emerald); font-size:1.2rem;">${physicalAddr}</strong>
      </div>
    `;
  }

  destroy() {}
}
