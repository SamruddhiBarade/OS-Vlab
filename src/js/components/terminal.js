// Simulated Command-Line Interface (CLI) Component
import { sound } from "../audio.js";
import { store } from "../store.js";

export class TerminalCLI {
  constructor(containerEl, currentTopicId = null, onCmdExec = null) {
    this.container = containerEl;
    this.currentTopicId = currentTopicId;
    this.onCmdExec = onCmdExec;
    this.history = [];
    this.historyIdx = -1;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-dots">
            <div class="terminal-dot dot-red"></div>
            <div class="terminal-dot dot-yellow"></div>
            <div class="terminal-dot dot-green"></div>
          </div>
          <div class="terminal-title">bash -- simulated-os-kernel (v5.15)</div>
          <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">SAFE SIMULATION MODE</div>
        </div>

        <div id="term-body" class="terminal-body">
          <div class="term-line term-out-system">Antigravity OS Virtual Kernel [Version 5.15.0-sim-generic]</div>
          <div class="term-line term-out-info">Type 'help' to see available OS lab commands or click suggested pills below.</div>
          <div class="term-line">--------------------------------------------------------------------------------</div>
        </div>

        <div class="terminal-cmd-suggestions" id="term-pills"></div>

        <div style="padding:0.75rem 1rem; background:#0e1526; border-top:1px solid var(--border-color);">
          <form id="term-form" class="term-prompt-line">
            <span class="term-user">student</span><span class="term-symbol">@</span><span class="term-host">os-virtulab</span><span class="term-symbol">:</span><span class="term-path">~</span><span class="term-symbol">$</span>
            <input type="text" id="term-input" class="term-input" placeholder="Type a command (e.g. 'help', 'ps', 'cpu schedule', 'mem alloc')..." autocomplete="off"/>
          </form>
        </div>
      </div>
    `;

    this.renderPills();
    this.attachEvents();
  }

  renderPills() {
    const pillsContainer = this.container.querySelector("#term-pills");
    const pills = [
      "help",
      "ps",
      "cpu schedule --algo rr",
      "mem alloc --size 150 --algo best-fit",
      "pages swap --algo lru --frames 3",
      "banker check",
      "disk scan --algo sstf",
      "tree",
      "status"
    ];

    pillsContainer.innerHTML = "";
    pills.forEach(cmd => {
      const btn = document.createElement("button");
      btn.className = "cmd-pill";
      btn.textContent = cmd;
      btn.onclick = () => {
        const input = this.container.querySelector("#term-input");
        input.value = cmd;
        this.executeCommand(cmd);
      };
      pillsContainer.appendChild(btn);
    });
  }

  attachEvents() {
    const form = this.container.querySelector("#term-form");
    const input = this.container.querySelector("#term-input");

    form.onsubmit = (e) => {
      e.preventDefault();
      const cmd = input.value.trim();
      if (cmd) {
        this.history.push(cmd);
        this.historyIdx = this.history.length;
        this.executeCommand(cmd);
        input.value = "";
      }
    };

    input.onkeydown = (e) => {
      if (e.key === "ArrowUp") {
        if (this.historyIdx > 0) {
          this.historyIdx--;
          input.value = this.history[this.historyIdx];
        }
      } else if (e.key === "ArrowDown") {
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          input.value = this.history[this.historyIdx];
        } else {
          this.historyIdx = this.history.length;
          input.value = "";
        }
      }
    };
  }

  executeCommand(cmdStr) {
    sound.playClick();
    if (typeof this.onCmdExec === "function") {
      this.onCmdExec(cmdStr);
    }

    const body = this.container.querySelector("#term-body");

    const promptLine = document.createElement("div");
    promptLine.className = "term-line";
    promptLine.innerHTML = `<span class="term-user">student</span><span class="term-symbol">@</span><span class="term-host">os-virtulab</span><span class="term-symbol">:</span><span class="term-path">~</span><span class="term-symbol">$</span> ${this.escapeHtml(cmdStr)}`;
    body.appendChild(promptLine);

    const parts = cmdStr.trim().split(/\s+/);
    const mainCmd = parts[0].toLowerCase();

    const outputEl = document.createElement("div");
    outputEl.className = "term-line term-out-info";
    outputEl.textContent = "Processing simulated OS kernel command...";
    body.appendChild(outputEl);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      outputEl.innerHTML = this.parseCmd(mainCmd, parts);
      body.scrollTop = body.scrollHeight;
    }, 400);
  }

  parseCmd(mainCmd, parts) {
    if (mainCmd === "help") {
      return `
<span class="term-out-success">Available Simulated OS Commands:</span>
• <strong>help</strong> : Displays this help documentation
• <strong>clear</strong> : Clears the terminal screen
• <strong>ps</strong> : Lists active process table PCBs
• <strong>kill &lt;pid&gt;</strong> : Sends SIGKILL signal to process ID
• <strong>cpu schedule [--algo fcfs|sjf|rr|priority]</strong> : Simulates CPU Gantt scheduler
• <strong>mem alloc [--size n] [--algo first|best|worst]</strong> : Simulates dynamic RAM memory allocation
• <strong>pages swap [--algo lru|fifo|opt] [--frames n]</strong> : Simulates page replacement fault solver
• <strong>banker check</strong> : Runs Banker's Algorithm safety sequence check
• <strong>disk scan [--algo sstf|scan|cscan]</strong> : Plots disk platter arm trajectory
• <strong>tree</strong> : Displays Unix hierarchical file system directory tree
• <strong>status</strong> : Shows overall student OS lab progress percentage & XP
      `;
    } else if (mainCmd === "clear") {
      const body = this.container.querySelector("#term-body");
      body.innerHTML = "";
      return "";
    } else if (mainCmd === "ps") {
      return `
<span class="term-out-success">PID   USER     PR  STAT  TIME  COMMAND</span>
101   student  20  R     0:05  systemd-init
102   student  15  S     0:02  cpu-scheduler
103   student  10  Z     0:00  zombie-child
402   student  20  R     0:12  bash-sim
      `;
    } else if (mainCmd === "kill") {
      const pid = parts[1] || "103";
      return `<span class="term-out-warning">[SIGNAL] Sent SIGKILL (9) to PID ${pid}. Process terminated and PCB reclaimed.</span>`;
    } else if (mainCmd === "cpu" || (parts[0] === "cpu" && parts[1] === "schedule")) {
      return `
<span class="term-out-success">[CPU SCHEDULER EXECUTION]</span>
Algorithm: Round Robin (Time Quantum q=2)
Execution Sequence: P1 -> P2 -> P3 -> P1 -> P2 -> P1
Average Turnaround Time (TAT): 11.25 ms
Average Waiting Time (WT): 5.75 ms
      `;
    } else if (mainCmd === "mem") {
      return `
<span class="term-out-success">[MEMORY ALLOCATOR SIMULATION]</span>
Strategy: Best Fit
Allocated 150 KB into Partition Hole [size 200 KB].
Remaining Hole size: 50 KB.
Internal/External Fragmentation meter updated.
      `;
    } else if (mainCmd === "pages") {
      return `
<span class="term-out-success">[PAGE REPLACEMENT ENGINE]</span>
Reference String: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3
Physical Frames: 3
Algorithm: LRU
Result: Total Page Faults = 9 | Hit Ratio = 30.7%
      `;
    } else if (mainCmd === "banker") {
      return `
<span class="term-out-success">[BANKER'S SAFETY ALGORITHM]</span>
Available Resources: [3, 3, 2]
Safe Sequence Found: &lt; P1, P3, P4, P0, P2 &gt;
Status: SAFE STATE (No deadlock possible).
      `;
    } else if (mainCmd === "disk") {
      return `
<span class="term-out-success">[DISK HEAD SCANNER]</span>
Algorithm: SSTF (Shortest Seek Time First)
Initial Head: Track 53
Queue: 98, 183, 37, 122, 14, 124, 65, 67
Total Track Seek Movements: 236 tracks.
      `;
    } else if (mainCmd === "tree") {
      return `
<span class="term-out-success">.</span>
├── <span class="term-user">bin/</span>
│   └── kernel.sys
├── <span class="term-user">home/student/</span>
│   ├── readme.txt (Inode #402)
│   └── lab_results.json
└── <span class="term-user">var/log/</span>
    └── dmesg.log
      `;
    } else if (mainCmd === "status") {
      const pct = store.calculateOverallProgress();
      return `
<span class="term-out-success">[STUDENT PROGRESS STATUS]</span>
Overall OS Lab Completion: <strong>${pct}%</strong>
Total XP Earned: <strong>${store.state.xp} XP</strong>
Current Topic ID: ${this.currentTopicId || "Dashboard"}
      `;
    } else {
      return `<span class="term-out-error">bash: command not found: ${this.escapeHtml(cmdStr)}. Type 'help' for command list.</span>`;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  destroy() {}
}
