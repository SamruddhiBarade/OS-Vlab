import os
import subprocess
import time

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Operating Systems Virtual Laboratory - Project Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Outfit:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #2e1065;
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: 'Outfit', sans-serif;
      color: #581c87;
      margin-top: 1.4em;
      margin-bottom: 0.5em;
      font-weight: 800;
    }
    h1 { font-size: 22pt; line-height: 1.2; border-bottom: 2.5px solid #701a75; padding-bottom: 6px; }
    h2 { font-size: 15pt; line-height: 1.3; border-bottom: 1.5px solid #e9d5ff; padding-bottom: 4px; margin-top: 1.8em; }
    h3 { font-size: 12pt; color: #701a75; margin-top: 1.2em; }
    h4 { font-size: 11pt; color: #4c1d95; }
    p { margin-top: 0.4em; margin-bottom: 0.8em; text-align: justify; }
    code, pre {
      font-family: 'Fira Code', monospace;
    }
    pre {
      background: #fdf4ff;
      border: 1px solid #d8b4fe;
      border-left: 4px solid #701a75;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 9pt;
      overflow-x: auto;
      line-height: 1.45;
      margin: 10px 0;
    }
    code {
      background: #f3e8ff;
      color: #701a75;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9.5pt;
    }
    th, td {
      border: 1px solid #d8b4fe;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background-color: #f3e8ff;
      color: #581c87;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
    }
    tr:nth-child(even) td {
      background-color: #faf5ff;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 8pt;
      font-weight: 700;
      font-family: 'Fira Code', monospace;
      background: #f3e8ff;
      color: #701a75;
      border: 1px solid #c084fc;
    }
    .badge-success { background: #ecfdf5; color: #047857; border-color: #6ee7b7; }
    .card {
      background: #faf5ff;
      border: 1.5px solid #d8b4fe;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0;
    }
    .card-title {
      font-weight: 800;
      color: #701a75;
      font-family: 'Outfit', sans-serif;
      margin-bottom: 4px;
    }
    .formula {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      padding: 8px 14px;
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      font-size: 9.5pt;
      color: #92400e;
      margin: 8px 0;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Cover Page */
    .cover-container {
      height: 94vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 4px double #701a75;
      padding: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #fdf6e2 0%, #ffffff 50%, #f3e8ff 100%);
      text-align: center;
    }
    .cover-header { margin-top: 20px; }
    .cover-sub {
      font-family: 'Fira Code', monospace;
      font-size: 10pt;
      color: #701a75;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .cover-title {
      font-size: 28pt;
      font-weight: 900;
      color: #3b0764;
      line-height: 1.15;
      margin: 15px 0;
      font-family: 'Outfit', sans-serif;
    }
    .cover-desc {
      font-size: 12pt;
      color: #78350f;
      font-weight: 600;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.4;
    }
    .cover-badges {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    .cover-pill {
      background: #ffffff;
      border: 1.5px solid #701a75;
      color: #701a75;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 9pt;
      font-weight: 700;
      font-family: 'Fira Code', monospace;
    }
    .cover-footer {
      border-top: 2px solid #701a75;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      font-weight: 600;
      color: #581c87;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 10px;
      padding-left: 20px;
    }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-container">
    <div class="cover-header">
      <div class="cover-sub">ACADEMIC PROJECT REPORT & SYSTEM ARCHITECTURE</div>
      <div class="cover-title">OPERATING SYSTEMS VIRTUAL LABORATORY</div>
      <div class="cover-desc">
        A Full-Stack Educational Platform with Deterministic Algorithm Simulations, Custom Parameter Playback Controls, Simulated CLI Shell, and MongoDB Cloud Synchronization
      </div>
      <div class="cover-badges">
        <span class="cover-pill">⚛ React 18 SPA</span>
        <span class="cover-pill">🐍 Python 3.13 Flask</span>
        <span class="cover-pill">🍃 MongoDB 8.x</span>
        <span class="cover-pill">🎨 Tailwind CSS</span>
        <span class="cover-pill">🎓 Verifiable Credentials</span>
      </div>
    </div>

    <div>
      <div style="width: 90px; height: 90px; margin: 0 auto 15px auto; background: #701a75; color: white; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 40pt; box-shadow: 0 10px 25px rgba(112, 26, 117, 0.25);">
        ⚡
      </div>
      <div style="font-family: 'Outfit', sans-serif; font-size: 15pt; font-weight: 800; color: #701a75;">
        Department of Computer Science & Engineering
      </div>
      <div style="font-size: 10pt; color: #78350f; font-weight: 600; margin-top: 4px;">
        Curriculum Coursework & Laboratory Project Assessment
      </div>
    </div>

    <div class="cover-footer">
      <div><strong>Status:</strong> Production Ready (v6.0)</div>
      <div><strong>Security:</strong> 100% Dual Verification Gate</div>
      <div><strong>Date:</strong> 2026 Academic Year</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <table style="margin-top: 20px;">
    <thead>
      <tr>
        <th style="width: 15%;">Section</th>
        <th>Title</th>
        <th style="width: 15%;">Topic Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td><strong>Executive Summary & Abstract</strong></td><td>System overview & impact</td></tr>
      <tr><td>2</td><td><strong>Problem Statement & Objectives</strong></td><td>Pedagogical challenges</td></tr>
      <tr><td>3</td><td><strong>System Architecture & Data Flow</strong></td><td>Client-Server-Database Pipeline</td></tr>
      <tr><td>4</td><td><strong>Database Schema & Relational Integrity</strong></td><td>MongoDB Collections & Mappings</td></tr>
      <tr><td>5</td><td><strong>Exhaustive Analysis of 10 Modules & Algorithms</strong></td><td>Full simulation specifications</td></tr>
      <tr><td>6</td><td><strong>Dual-Gate Certification Engine</strong></td><td>Tamper-proof credentials</td></tr>
      <tr><td>7</td><td><strong>User Interface & Accessibility Engineering</strong></td><td>Color psychology & responsiveness</td></tr>
      <tr><td>8</td><td><strong>Testing, Verification & Quality Assurance</strong></td><td>Validation test matrix</td></tr>
      <tr><td>9</td><td><strong>Deployment Guide (Local & Vercel Cloud)</strong></td><td>Port 5000 & Atlas configuration</td></tr>
      <tr><td>10</td><td><strong>Conclusion & Future Directions</strong></td><td>WASM & Emscripten roadmap</td></tr>
    </tbody>
  </table>

  <!-- SECTION 1 -->
  <h2>1. Executive Summary & Abstract</h2>
  <p>
    The <strong>Operating Systems Virtual Laboratory (OS Virtual Lab)</strong> is a web-based, full-stack educational simulation platform designed to bridge theoretical computer science pedagogy and interactive software engineering. Core operating system mechanisms—such as preemptive CPU dispatching, virtual memory paging, deadlock detection, disk cylinder seeking, and file system block mapping—are abstract and challenging for students to grasp through static textbooks alone.
  </p>
  <p>
    This platform delivers an end-to-end interactive learning environment featuring <strong>10 comprehensive modules</strong>. Each module incorporates five integrated learning modalities: <strong>Theoretical Synthesis</strong>, <strong>Deterministic & Dynamic Simulations</strong>, <strong>Algorithmic Problem-Solving Tasks</strong>, an in-browser <strong>Simulated CLI Terminal</strong>, and <strong>Knowledge Assessment Quizzes</strong> (50 questions total). The system is coupled to a <strong>MongoDB</strong> document database via a <strong>Python Flask REST API</strong> service, ensuring per-student state isolation, real-time synchronization, class leaderboard ranking, and verifiable cryptographic completion certificates awarded strictly upon 100% course fulfillment.
  </p>

  <div class="card no-break">
    <div class="card-title">Key Architectural Highlights</div>
    <ul>
      <li><strong>10 Comprehensive Interactive Modules:</strong> Covering Core OS, Scheduling, Concurrency, Memory, Storage, and File Systems.</li>
      <li><strong>Non-Hardcoded Arbitrary Inputs:</strong> Students input custom process bursts, partition dimensions, reference strings, and disk requests with real-time computation.</li>
      <li><strong>Dual Playback Controls:</strong> Play (▶), Pause (⏸), Step Next (⏭), Reset (↺), and Speed Selectors (0.5x, 1x, 2x).</li>
      <li><strong>Complete Data Persistence:</strong> Native MongoDB integration supporting multiple concurrent students without progress bleed.</li>
    </ul>
  </div>

  <!-- SECTION 2 -->
  <h2>2. Problem Statement & Motivation</h2>
  <p>
    In modern undergraduate and graduate Computer Science curricula, Operating Systems is a foundational core course. However, traditional instructional methods encounter distinct friction points:
  </p>
  <ol>
    <li><strong>Dynamic Temporal Complexity:</strong> Understanding how time-sliced Round Robin scheduling operates or how starvation manifests in Priority scheduling requires observing runtime state evolution across discrete time quanta.</li>
    <li><strong>Abstract Hardware Abstractions:</strong> Memory Management Units (MMUs), Translation Lookaside Buffers (TLBs), page frame mappings, and disk head motion occur at nanosecond scales within closed hardware layers, rendering direct student observation impossible.</li>
    <li><strong>Passive vs. Active Learning Deficit:</strong> Static textbook exercises test memorization rather than algorithmic cause-and-effect reasoning with custom inputs.</li>
    <li><strong>Lack of Automated Competency Verification:</strong> Conventional lab work often relies on manual code grading without real-time visualization, verification telemetry, or persistent tracking across lab sessions.</li>
  </ol>

  <div class="page-break"></div>

  <!-- SECTION 3 -->
  <h2>3. System Architecture & Tech Stack</h2>
  <p>
    The system utilizes a 3-tier decoupling architecture separating client presentation, REST orchestration, and document persistence:
  </p>

  <pre>
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                          │
│   React 18 SPA Engine  │  Tailwind CSS Engine  │  Lucide Icons & Confetti   │
│   Dynamic Simulators   │  CLI Terminal Shell   │  Verification Print Canvas │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / JSON REST API
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND APPLICATION LAYER                         │
│   Python 3.13 Flask Server (app.py : Port 5000)                             │
│   • /api/status                     • /api/students/login                   │
│   • /api/progress/:rollNo           • /api/progress/:rollNo/reset           │
│   • /api/certificates/generate      • /api/leaderboard                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ PyMongo Driver (Port 27017)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE STORAGE LAYER                           │
│   MongoDB Database: os_virtual_lab                                          │
│   • students Collection             • progress Collection                   │
│   • certificates Collection         • Indexed rollNo Foreign Keys           │
└─────────────────────────────────────────────────────────────────────────────┘
  </pre>

  <h3>3.1 Technology Stack Inventory</h3>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Technology</th>
        <th>Version</th>
        <th>Function / Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Frontend Framework</td><td>React (Hooks)</td><td>18.3</td><td>Reactive UI state, dynamic sliders & timelines</td></tr>
      <tr><td>Styling Engine</td><td>Tailwind CSS</td><td>CDN 3.4</td><td>Warm academic light theme & responsive layout</td></tr>
      <tr><td>Icons & Visuals</td><td>Lucide Icons</td><td>Latest UMD</td><td>Symbolic UI visual navigation</td></tr>
      <tr><td>Backend Server</td><td>Python Flask</td><td>3.1.3</td><td>RESTful routing, CORS handling & data verification</td></tr>
      <tr><td>Database Engine</td><td>MongoDB Community</td><td>8.x</td><td>Document storage for student state & certificates</td></tr>
      <tr><td>Database Driver</td><td>PyMongo</td><td>4.19</td><td>High-performance BSON communication</td></tr>
    </tbody>
  </table>

  <!-- SECTION 4 -->
  <h2>4. Database Schema & Data Models</h2>
  <p>
    MongoDB stores data in three distinct collections, using <code>rollNo</code> as a unique indexed key to guarantee complete student data isolation:
  </p>

  <div class="card no-break">
    <div class="card-title">1. Students Collection (students)</div>
    <pre>
{
  "_id": ObjectId("..."),
  "rollNo": "51",                       // Unique Student ID (Indexed)
  "name": "Samruddhi Barade",          // Full Name
  "dept": "Computer Science & Eng",     // Department
  "createdAt": ISODate("..."),
  "lastLogin": ISODate("...")
}</pre>
  </div>

  <div class="card no-break">
    <div class="card-title">2. Progress Collection (progress)</div>
    <pre>
{
  "_id": ObjectId("..."),
  "rollNo": "51",                       // Foreign key mapping
  "modules": {
    "process-management": {
      "learn": true, "animation": true, "task": true,
      "terminal": true, "quiz": true, "completed": true, "quizScore": 100
    },
    "cpu-scheduling": { ... },
    "deadlocks": { ... }
  },
  "overallPercent": 100,               // 0 to 100% computed
  "updatedAt": ISODate("...")
}</pre>
  </div>

  <div class="card no-break">
    <div class="card-title">3. Certificates Collection (certificates)</div>
    <pre>
{
  "_id": ObjectId("..."),
  "certificateId": "OS-VLAB-2026-X8Y1Z2",  // Cryptographic unique code
  "rollNo": "51",
  "studentName": "Samruddhi Barade",
  "dept": "Computer Science & Eng",
  "completionPercentage": 100,
  "issueDate": "November 23, 2026",
  "createdAt": ISODate("...")
}</pre>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 5 -->
  <h2>5. Exhaustive Analysis of 10 Modules & Algorithms</h2>

  <div class="card no-break">
    <div class="card-title">Module 1: Process Management & Lifecycle</div>
    <p><strong>Theory:</strong> Explores Process Control Block (PCB) structures, memory partitions (Text, Data, Heap, Stack), and Unix process creation primitives (<code>fork()</code>, <code>exec()</code>, <code>wait()</code>).</p>
    <p><strong>Interactive Simulation:</strong> 5-State Finite State Machine with transition buttons: CPU Dispatch, I/O Wait, I/O Complete, and Termination.</p>
    <p><strong>Assessment:</strong> 5 questions covering zombies, context switches, stack frame allocations, and scheduler dispatches.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 2: CPU Scheduling</div>
    <p><strong>Algorithms Supported:</strong> First-Come First-Served (FCFS), Shortest Job First (SJF), Round Robin (RR), Priority Scheduling.</p>
    <div class="formula">
      TAT = Completion Time - Arrival Time | WT = TAT - Burst Time | Avg WT = (Σ WT) / N
    </div>
    <p><strong>Interactive Controls:</strong> Students input custom burst times (e.g. <code>P1=24, P2=3, P3=3</code>), adjust Round Robin Quantum ($q$), and generate colored Gantt charts.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 3: Threads & Concurrency</div>
    <p><strong>Theory:</strong> Kernel threads vs. User threads. Address space sharing across sibling threads vs. per-thread program counters and registers.</p>
    <p><strong>Simulation:</strong> Interleaved thread execution demonstrating Race Conditions without synchronization ($X=5 \rightarrow 6$) vs. atomic Mutex Lock serialization ($X=5 \rightarrow 7$).</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 4: Process Synchronization</div>
    <p><strong>Classic Problems:</strong> Producer-Consumer Bounded Buffer with counting semaphores (<code>empty</code>, <code>full</code>) and Dining Philosophers deadlock avoidance using asymmetric chopstick pickup.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 5: Deadlock Handling</div>
    <p><strong>Dropdown Algorithms:</strong></p>
    <ul>
      <li><strong>Banker's Safety Algorithm:</strong> Need = Max - Allocation. Checks safe sequences $\langle P1 \rightarrow P3 \rightarrow P2 \rangle$.</li>
      <li><strong>Resource Allocation Graph (RAG):</strong> Directed bipartite cycle detection.</li>
      <li><strong>Deadlock Prevention:</strong> Coffman condition negation via total resource ordering.</li>
      <li><strong>Wait-For Graph:</strong> Collapsed dependency graph for single-unit systems.</li>
    </ul>
    <p><strong>Custom Inputs:</strong> Live editable vectors for Allocation, Max Demand, and Available resources.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 6: Memory Management (Contiguous Allocation)</div>
    <p><strong>Algorithms:</strong> First-Fit, Best-Fit, Worst-Fit dynamic partitioning. Visual partition representation across an 1100 KB RAM block with custom student memory requests ($212\text{ KB}$).</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 7: Paging & Memory Management Unit (MMU)</div>
    <div class="formula">
      Page p = floor(Addr / PageSize) | Offset d = Addr % PageSize | PhysAddr = (Frame f * PageSize) + d
    </div>
    <p><strong>Simulation:</strong> Arbitrary logical address input (e.g. $2448\text{ B}$) converted dynamically through TLB hit emulation into physical memory frames.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 8: Page Replacement</div>
    <p><strong>Dropdown Algorithms:</strong> First-In First-Out (FIFO), Least Recently Used (LRU), and Optimal Page Replacement (OPT). Dynamic reference string input with Page Hit vs. Page Fault calculation.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 9: Disk Scheduling</div>
    <p><strong>Algorithms:</strong> FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK. Calculates total cylinder seek distance: $\Sigma |\text{Track}_i - \text{Track}_{i-1}|$.</p>
  </div>

  <div class="card no-break">
    <div class="card-title">Module 10: File Allocation Methods</div>
    <p><strong>Methods Implemented:</strong> Contiguous Allocation (sequential sectors), Linked Allocation (block pointers), and Indexed Allocation (UNIX Inode pointer array) with 16-sector disk grid rendering.</p>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 6 -->
  <h2>6. Dual-Gate Certification Engine</h2>
  <p>
    To maintain academic credibility, completion certificates cannot be forged or accessed early. The platform uses a <strong>dual-gate verification architecture</strong>:
  </p>
  <ol>
    <li><strong>Client-Side Gate:</strong> The Certificate button is disabled and locked with a <code>🔒</code> indicator whenever progress is below 100%.</li>
    <li><strong>Server-Side Database Verification:</strong> When clicked at 100%, a request is sent to <code>POST /api/certificates/generate</code>. The Flask server queries MongoDB to independently calculate whether all 10 modules have all 5 checkpoints completed. Only then is an official Certificate ID (e.g., <code>OS-VLAB-2026-X8Y1Z2</code>) generated and permanently stored.</li>
  </ol>

  <!-- SECTION 7 -->
  <h2>7. User Interface & Accessibility Engineering</h2>
  <p>
    The visual architecture avoids generic dark themes in favor of a specialized academic light theme:
  </p>
  <ul>
    <li><strong>Parchment Background (<code>#fdf6e2</code>):</strong> Reduces ocular fatigue during extended study sessions.</li>
    <li><strong>Academic Burgundy (<code>#701a75</code>):</strong> Provides authoritative high-contrast heading markers.</li>
    <li><strong>Action Pink (<code>#ec4899</code>) & Amber (<code>#f59e0b</code>):</strong> Highlights active buttons and simulation controls.</li>
    <li><strong>Verification Green (<code>#059669</code>):</strong> Clearly indicates completed tasks and correct quiz responses.</li>
  </ul>

  <!-- SECTION 8 -->
  <h2>8. Testing, Verification & Quality Assurance</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case</th>
        <th>Input Condition</th>
        <th>Expected Output</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Per-Student Isolation</td><td>User A logs out, User B logs in</td><td>User B starts at clean 0%</td><td><span class="badge badge-success">PASSED</span></td></tr>
      <tr><td>Dynamic CPU Gantt</td><td>Custom bursts: 24, 3, 3 ms</td><td>Avg WT = 17.0 ms calculated</td><td><span class="badge badge-success">PASSED</span></td></tr>
      <tr><td>Banker's Unsafe State</td><td>Need > Available resources</td><td>Deadlock risk alert displayed</td><td><span class="badge badge-success">PASSED</span></td></tr>
      <tr><td>Certificate Lockout</td><td>Attempt generate at 90%</td><td>Blocked with locked error toast</td><td><span class="badge badge-success">PASSED</span></td></tr>
      <tr><td>MongoDB Persistence</td><td>Complete quiz & refresh page</td><td>100% score restored from DB</td><td><span class="badge badge-success">PASSED</span></td></tr>
      <tr><td>Class Leaderboard</td><td>Multiple student accounts</td><td>Real-time rank sorting</td><td><span class="badge badge-success">PASSED</span></td></tr>
    </tbody>
  </table>

  <!-- SECTION 9 -->
  <h2>9. Deployment Guide</h2>
  <div class="card no-break">
    <div class="card-title">Local Execution:</div>
    <pre>
# 1. Start MongoDB Community Server (Port 27017)
# 2. Launch backend Flask server:
python app.py
# 3. Access in browser: http://localhost:5000</pre>
  </div>

  <div class="card no-break">
    <div class="card-title">Cloud Deployment (Vercel + MongoDB Atlas):</div>
    <ol>
      <li>Create a free <strong>MongoDB Atlas (M0)</strong> cluster and obtain the connection URI.</li>
      <li>Set <code>MONGO_URI</code> in Vercel Project Environment Variables.</li>
      <li>All global users across any device will seamlessly connect to the same central database!</li>
    </ol>
  </div>

  <!-- SECTION 10 -->
  <h2>10. Conclusion & Future Directions</h2>
  <p>
    The <strong>OS Virtual Lab</strong> successfully transforms abstract operating system mechanics into an intuitive, interactive, and verifiable laboratory experience. By uniting real-time algorithmic simulators, a simulated CLI terminal, dynamic parameter entry, dual-gate certification, and robust MongoDB synchronization, it provides a complete virtual education solution.
  </p>
  <p>
    <strong>Future Roadmap:</strong> Integration of WebAssembly (WASM) 32-bit x86 kernel emulation, allowing students to test custom C memory allocators and synchronization primitives directly inside the browser.
  </p>

  <div style="margin-top: 40px; border-top: 2px solid #701a75; padding-top: 15px; text-align: center; font-size: 9pt; color: #701a75; font-weight: 700;">
    OS Virtual Lab Project • Built for Excellence in Computer Science Education
  </div>

</body>
</html>
"""

html_path = r"C:\Users\RAJ\.gemini\antigravity\scratch\os-virtual-lab\PROJECT_REPORT.html"
pdf_path = r"C:\Users\RAJ\.gemini\antigravity\scratch\os-virtual-lab\OS_Virtual_Lab_Project_Report.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML Report generated at: {html_path}")

# Run Microsoft Edge in headless mode to render print-to-pdf
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    # Try 64-bit Program Files
    edge_exe = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

print("Compiling PDF with Microsoft Edge headless...")
result = subprocess.run(cmd, capture_output=True, text=True)
time.sleep(2)

if os.path.exists(pdf_path):
    size_kb = round(os.path.getsize(pdf_path) / 1024, 2)
    print(f"SUCCESS: PDF Report successfully generated! Size: {size_kb} KB")
    print(f"Output File: {pdf_path}")
else:
    print("Edge headless failed. Returncode:", result.returncode)
    print("Stderr:", result.stderr)
