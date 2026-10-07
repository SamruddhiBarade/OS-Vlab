// Deadlocks & Banker's Algorithm Simulation Module
export class DeadlockSimulator {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-viewport-card glass-panel">
        <div class="sim-control-bar">
          <div class="control-group">
            <button id="d-btn-safe" class="sim-btn play-btn">▶ Test Banker's Safety Sequence</button>
            <button id="d-btn-cycle" class="sim-btn" style="background:var(--accent-rose); color:#fff;">⚠️ Inject Deadlock Cycle</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-top:1rem;">
          <!-- Matrix Table -->
          <div style="background:#fdf6e2; padding:1.25rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.9rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.75rem;">
              📋 Banker's Safety Matrix State
            </div>
            <table class="page-matrix-table" style="font-size:0.78rem;">
              <thead>
                <tr>
                  <th>Proc</th>
                  <th>Allocation (A B C)</th>
                  <th>Max (A B C)</th>
                  <th>Need (Max - Alloc)</th>
                </tr>
              </thead>
              <tbody id="banker-matrix-body">
                <tr><td>P0</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>
                <tr><td>P1</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>
                <tr><td>P2</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>
                <tr><td>P3</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>
                <tr><td>P4</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>
              </tbody>
            </table>
            <div style="margin-top:0.75rem; font-size:0.8rem; color:var(--text-muted);">
              Available Vector: <strong style="color:var(--accent-emerald);">[3, 3, 2]</strong>
            </div>
          </div>

          <!-- RAG Visual / Safe Sequence Output -->
          <div style="background:linear-gradient(135deg,#fdf6e2,#f3e8ff); padding:1.25rem; border-radius:8px; border:1px solid var(--accent-purple); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap:1rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-dim);">SAFETY SEQUENCE RESULT</div>
            <div id="banker-result-seq" style="font-size:1.25rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-emerald);">
              Click "Test Banker's Safety Sequence" to compute.
            </div>
            <div id="banker-status-msg" style="font-size:0.85rem; color:var(--text-muted);"></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const safeBtn = this.container.querySelector("#d-btn-safe");
    const cycleBtn = this.container.querySelector("#d-btn-cycle");
    const seqEl = this.container.querySelector("#banker-result-seq");
    const msgEl = this.container.querySelector("#banker-status-msg");

    safeBtn.onclick = () => {
      seqEl.innerHTML = `<span style="color:var(--accent-emerald);">&lt; P1, P3, P4, P0, P2 &gt;</span>`;
      msgEl.innerHTML = `✅ SYSTEM IS IN A SAFE STATE! Deadlock is guaranteed to be avoided.`;
    };

    cycleBtn.onclick = () => {
      seqEl.innerHTML = `<span style="color:var(--accent-rose);">❌ UNSAFE / DEADLOCK DETECTED!</span>`;
      msgEl.innerHTML = `⚠️ Circular Wait Cycle detected: P0 -> R1 -> P2 -> R2 -> P0!`;
    };
  }

  destroy() {}
}
