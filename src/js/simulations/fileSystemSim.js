// File Systems Simulation Module with Dynamic Custom File Calculator
export class FileSystemSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.customFileName = "custom_data.bin";
    this.customFileSizeKB = 52; // 52 KB
    this.blockSizeKB = 4; // 4 KB
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel" style="border:2px solid var(--accent-emerald);">
        <div class="sim-control-bar">
          <div class="control-group">
            <span style="font-size:0.9rem; font-weight:800; color:var(--accent-emerald);">📁 Dynamic File System & Inode Block Allocator</span>
          </div>
        </div>

        <!-- Custom File Creator Controls -->
        <div style="background:var(--bg-card); padding:1rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); margin-top:1rem; display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
          <div style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan); display:flex; align-items:center; gap:0.4rem;">
            <span>📄</span> Create Custom File of Your Choice:
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Filename:</label>
              <input type="text" id="fs-custom-name" class="task-input-field" value="my_project.dat" style="width:130px; padding:0.35rem; font-weight:700;"/>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">File Size (KB):</label>
              <input type="number" id="fs-custom-size" class="task-input-field" value="52" min="1" max="10000" style="width:90px; padding:0.35rem; font-weight:700; text-align:center;"/>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:var(--text-dim);">Block Size (KB):</label>
              <select id="fs-custom-blocksize" class="task-input-field" style="width:auto; padding:0.35rem; font-weight:700;">
                <option value="4">4 KB</option>
                <option value="2">2 KB</option>
                <option value="8">8 KB</option>
              </select>
            </div>
            <button id="fs-btn-calculate" class="btn-primary" style="padding:0.45rem 1rem;">
              ⚡ Calculate Inode Map
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:1.5rem; margin-top:1rem;">
          <!-- Directory Tree Explorer -->
          <div style="background:var(--bg-dark); padding:1.25rem; border-radius:10px; border:1px solid var(--border-color); font-family:var(--font-mono); font-size:0.88rem; line-height:1.9;">
            <div style="font-weight:800; color:var(--accent-purple); margin-bottom:0.5rem;">/ (root directory)</div>
            <div style="margin-left:1rem; color:var(--accent-cyan);">├── 📁 bin/</div>
            <div style="margin-left:2rem; color:var(--text-muted);">│   ├── 📄 kernel.sys (48 KB)</div>
            <div style="margin-left:1rem; color:var(--accent-cyan);">├── 📁 home/student/</div>
            <div style="margin-left:2rem; color:var(--accent-emerald); font-weight:700; background:rgba(16,185,129,0.1); padding:0.2rem 0.5rem; border-radius:4px;" id="fs-custom-tree-node">│   ├── 📄 <span id="tree-custom-name">my_project.dat</span> (<span id="tree-custom-size">52</span> KB)</div>
            <div style="margin-left:2rem; color:var(--text-muted);">│   ├── 📄 notes.txt (12 KB)</div>
            <div style="margin-left:1rem; color:var(--accent-cyan);">└── 📁 var/log/</div>
          </div>

          <!-- Dynamic Inode Metadata Panel -->
          <div id="fs-inode-panel" style="background:var(--bg-card); padding:1.25rem; border-radius:10px; border:2px solid var(--accent-emerald); display:flex; flex-direction:column; gap:1rem; box-shadow:0 4px 15px var(--accent-emerald-glow);">
            <div style="font-weight:800; font-size:0.95rem; color:var(--accent-emerald); border-bottom:1px solid var(--border-color); padding-bottom:0.4rem; display:flex; justify-content:space-between;">
              <span>🔍 Inode metadata & Block Pointer Calculator</span>
              <span id="inode-num-tag" style="color:var(--accent-purple);">Inode #704</span>
            </div>
            <div id="fs-inode-details" style="font-family:var(--font-mono); font-size:0.85rem; line-height:1.8; color:var(--text-main);"></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.calculate();
  }

  attachEvents() {
    const calcBtn = this.container.querySelector("#fs-btn-calculate");
    const nameInput = this.container.querySelector("#fs-custom-name");
    const sizeInput = this.container.querySelector("#fs-custom-size");
    const bsizeSelect = this.container.querySelector("#fs-custom-blocksize");

    calcBtn.onclick = () => {
      this.customFileName = nameInput.value.trim() || "my_project.dat";
      this.customFileSizeKB = parseInt(sizeInput.value) || 52;
      this.blockSizeKB = parseInt(bsizeSelect.value) || 4;
      this.calculate();
    };
  }

  calculate() {
    const fileName = this.customFileName;
    const fileSizeKB = this.customFileSizeKB;
    const bSize = this.blockSizeKB;
    const totalBytes = fileSizeKB * 1024;
    const totalBlocksRequired = Math.ceil(fileSizeKB / bSize);

    this.container.querySelector("#tree-custom-name").textContent = fileName;
    this.container.querySelector("#tree-custom-size").textContent = fileSizeKB;

    // Unix Inode allocation rules: 12 direct pointers
    const directLimitBlocks = 12;
    const directBlocks = Math.min(totalBlocksRequired, directLimitBlocks);
    const directSize = directBlocks * bSize;

    let indirectBlocks = 0;
    if (totalBlocksRequired > directLimitBlocks) {
      indirectBlocks = totalBlocksRequired - directLimitBlocks;
    }
    const indirectSize = indirectBlocks * bSize;

    const details = this.container.querySelector("#fs-inode-details");
    details.innerHTML = `
      <div><strong>Filename Path:</strong> /home/student/<span style="color:var(--accent-emerald); font-weight:700;">${fileName}</span></div>
      <div><strong>Total File Size:</strong> ${fileSizeKB} KB (${totalBytes.toLocaleString()} Bytes)</div>
      <div><strong>Block Size:</strong> ${bSize} KB (${bSize * 1024} Bytes)</div>
      <div><strong>Total Disk Blocks Required:</strong> <strong style="color:var(--accent-cyan); font-size:1.05rem;">${totalBlocksRequired} blocks</strong></div>
      
      <div style="margin-top:0.75rem; padding:0.75rem; background:var(--bg-dark); border-radius:8px; border:1px solid var(--border-color);">
        <div style="color:var(--accent-emerald); font-weight:800; margin-bottom:0.25rem;">📌 Direct Pointers (Max 12):</div>
        <div>Direct Pointers Used: <strong>${directBlocks} / 12</strong> (${directSize} KB)</div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Mapped Disk Sectors: Block #100 ➔ Block #${100 + directBlocks - 1}</div>
      </div>

      <div style="margin-top:0.5rem; padding:0.75rem; background:var(--bg-dark); border-radius:8px; border:1px solid var(--border-color);">
        <div style="color:var(--accent-purple); font-weight:800; margin-bottom:0.25rem;">🔀 Single Indirect Pointer:</div>
        <div>Indirect Pointers Used: <strong>${indirectBlocks} blocks</strong> (${indirectSize} KB)</div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Indirect Index Block #250 ➔ Disk Sectors #${300} ➔ #${300 + Math.max(0, indirectBlocks - 1)}</div>
      </div>
    `;
  }

  destroy() {}
}
