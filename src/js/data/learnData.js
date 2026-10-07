// Educational Learn content for all 10 topics
export const LEARN_DATA = {
  "process-management": {
    overview: "A **Process** is a program in execution. Unlike a passive program stored on disk, a process is an active entity with a Program Counter (PC), registers, stack, heap, and assigned OS resources.",
    sections: [
      {
        title: "Process Control Block (PCB)",
        content: "The OS tracks each process using a data structure called the **Process Control Block (PCB)**. The PCB contains critical metadata including Process ID (PID), Process State, Program Counter, CPU Registers, Memory Allocation Limits, and Open File Descriptors."
      },
      {
        title: "Process State Lifecycle",
        content: "During its execution lifecycle, a process transitions through 5 primary states:\n• **New**: The process is being created.\n• **Ready**: Waiting to be assigned to a CPU core by the scheduler.\n• **Running**: Instructions are actively executing on the CPU.\n• **Waiting (Blocked)**: Waiting for an event (such as I/O completion or signal).\n• **Terminated**: Execution has finished and OS is reclaiming resources."
      },
      {
        title: "Context Switching & Creation",
        content: "When switching CPU execution from one process to another, the kernel saves the current process state into its PCB and restores the state of the next process. Processes are spawned via system calls like `fork()` (duplicate parent) and `exec()` (load new executable)."
      }
    ],
    terms: [
      { name: "PID (Process ID)", desc: "Unique numerical identifier assigned by the operating system kernel to each active process." },
      { name: "Context Switch", desc: "The operation of saving the CPU state of a running process and loading the saved state of another process." },
      { name: "PCB", desc: "Process Control Block - data structure holding process metadata, registers, and memory bounds." },
      { name: "Orphan / Zombie Process", desc: "An orphan has no living parent; a zombie has finished execution but still has an entry in the process table." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="20" y="90" width="80" height="50" rx="10" fill="#3b0764" stroke="#06b6d4" stroke-width="2"/>
        <text x="60" y="120" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">NEW</text>
        
        <rect x="150" y="90" width="90" height="50" rx="10" fill="#3b0764" stroke="#06b6d4" stroke-width="2"/>
        <text x="195" y="120" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">READY</text>
        
        <rect x="300" y="90" width="100" height="50" rx="10" fill="#3b0764" stroke="#a855f7" stroke-width="2"/>
        <text x="350" y="120" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">RUNNING</text>
        
        <rect x="460" y="90" width="110" height="50" rx="10" fill="#3b0764" stroke="#10b981" stroke-width="2"/>
        <text x="515" y="120" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">TERMINATED</text>
        
        <rect x="220" y="180" width="110" height="45" rx="10" fill="#3b0764" stroke="#f59e0b" stroke-width="2"/>
        <text x="275" y="207" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">WAITING</text>
        
        <!-- Arrows -->
        <path d="M 100 115 L 150 115" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)"/>
        <path d="M 240 115 L 300 115" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 400 115 L 460 115" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 330 140 L 290 180" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 220 195 L 180 140" stroke="#94a3b8" stroke-width="2"/>
      </svg>
    `
  },

  "cpu-scheduling": {
    overview: "CPU Scheduling determines which process in the Ready Queue is allocated CPU execution time. The goal is to maximize CPU utilization, throughput, and minimize turnaround and waiting times.",
    sections: [
      {
        title: "Scheduling Criteria & Metrics",
        content: "• **CPU Utilization**: Percentage of time the CPU is actively executing instructions.\n• **Throughput**: Number of processes completed per unit of time.\n• **Turnaround Time ($TAT$)**: Total time from process arrival to completion ($TAT = Completion - Arrival$).\n• **Waiting Time ($WT$)**: Total time process spends waiting in ready queue ($WT = TAT - Burst$)."
      },
      {
        title: "Preemptive vs Non-Preemptive",
        content: "• **Non-Preemptive**: Once a process gets CPU, it keeps execution until termination or I/O request (e.g. FCFS, SJF Non-Preemptive).\n• **Preemptive**: OS scheduler can interrupt running process to allocate CPU to higher priority process or quantum expiration (e.g. Round Robin, Shortest Remaining Time First)."
      },
      {
        title: "Algorithms Overview",
        content: "• **FCFS (First-Come, First-Served)**: Simple FIFO queue, prone to Convoy Effect.\n• **SJF (Shortest Job First)**: Optimal minimum average waiting time.\n• **Round Robin (RR)**: Designed for time-sharing with fixed time quantum $q$.\n• **Priority Scheduling**: Allocates CPU based on assigned process priority (watch out for starvation!)."
      }
    ],
    terms: [
      { name: "Burst Time", desc: "The duration of CPU time required by a process to finish execution." },
      { name: "Time Quantum", desc: "Fixed small slice of CPU time allocated to each process in Round Robin scheduling." },
      { name: "Convoy Effect", desc: "Short processes waiting behind a long CPU-bound process in FCFS scheduling." },
      { name: "Starvation", desc: "Indefinite blocking where low-priority processes never execute due to continuous stream of higher priority processes." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <text x="300" y="25" text-anchor="middle" fill="#06b6d4" font-weight="bold">Sample Gantt Chart (Round Robin q=2)</text>
        <rect x="50" y="45" width="100" height="45" fill="#0284c7" stroke="#fff"/>
        <text x="100" y="72" text-anchor="middle" fill="#fff" font-weight="bold">P1</text>
        <rect x="150" y="45" width="80" height="45" fill="#a855f7" stroke="#fff"/>
        <text x="190" y="72" text-anchor="middle" fill="#fff" font-weight="bold">P2</text>
        <rect x="230" y="45" width="140" height="45" fill="#10b981" stroke="#fff"/>
        <text x="300" y="72" text-anchor="middle" fill="#fff" font-weight="bold">P3</text>
        <rect x="370" y="45" width="100" height="45" fill="#0284c7" stroke="#fff"/>
        <text x="420" y="72" text-anchor="middle" fill="#fff" font-weight="bold">P1</text>
        
        <!-- Time Markers -->
        <text x="50" y="110" text-anchor="middle" fill="#94a3b8">0</text>
        <text x="150" y="110" text-anchor="middle" fill="#94a3b8">2</text>
        <text x="230" y="110" text-anchor="middle" fill="#94a3b8">4</text>
        <text x="370" y="110" text-anchor="middle" fill="#94a3b8">7</text>
        <text x="470" y="110" text-anchor="middle" fill="#94a3b8">9</text>
      </svg>
    `
  },

  "threads": {
    overview: "A **Thread** is the basic unit of CPU utilization, consisting of a thread ID, program counter, register set, and stack. Multiple threads within the same process share code, data, and OS resources.",
    sections: [
      {
        title: "Process vs Thread",
        content: "Processes are heavyweight with isolated virtual address spaces. Threads are lightweight lightweight execution units running within a process, sharing memory space. Creating and switching threads requires significantly less overhead than processes."
      },
      {
        title: "Multithreading Models",
        content: "• **Many-to-One**: Multiple user-level threads mapped to single kernel thread (fast context switch, no true parallelism).\n• **One-to-One**: Each user thread mapped to a kernel thread (true multicore parallelism, higher overhead).\n• **Many-to-Many**: Multiplexes many user threads to smaller/equal number of kernel threads."
      },
      {
        title: "Race Conditions & Safety",
        content: "Because threads share global variables and memory, concurrent non-atomic modifications cause **Race Conditions**, leading to non-deterministic data corruption unless synchronized."
      }
    ],
    terms: [
      { name: "User Threads", desc: "Threads managed above kernel level without kernel support via thread libraries." },
      { name: "Kernel Threads", desc: "Threads supported and managed directly by the OS kernel." },
      { name: "Race Condition", desc: "Flaw where output depends on sequence or timing of uncontrollable thread execution." },
      { name: "Thread Pool", desc: "Collection of pre-allocated threads ready to perform work tasks on demand." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="40" y="20" width="240" height="140" rx="10" fill="#3b0764" stroke="#06b6d4" stroke-width="2"/>
        <text x="160" y="45" text-anchor="middle" fill="#06b6d4" font-weight="bold">Single-Threaded Process</text>
        <rect x="60" y="60" width="200" height="30" fill="#fdf6e2" rx="5"/>
        <text x="160" y="80" text-anchor="middle" fill="#94a3b8" font-size="12">Code | Data | Files</text>
        <path d="M 160 100 Q 170 115 160 130 T 160 150" stroke="#f59e0b" stroke-width="3" fill="none"/>
        
        <rect x="320" y="20" width="240" height="140" rx="10" fill="#3b0764" stroke="#a855f7" stroke-width="2"/>
        <text x="440" y="45" text-anchor="middle" fill="#a855f7" font-weight="bold">Multi-Threaded Process</text>
        <rect x="340" y="60" width="200" height="30" fill="#fdf6e2" rx="5"/>
        <text x="440" y="80" text-anchor="middle" fill="#94a3b8" font-size="12">Shared Code | Data | Files</text>
        <path d="M 370 100 Q 380 115 370 130 T 370 150" stroke="#10b981" stroke-width="3" fill="none"/>
        <path d="M 440 100 Q 450 115 440 130 T 440 150" stroke="#06b6d4" stroke-width="3" fill="none"/>
        <path d="M 510 100 Q 520 115 510 130 T 510 150" stroke="#a855f7" stroke-width="3" fill="none"/>
      </svg>
    `
  },

  "process-synchronization": {
    overview: "Process Synchronization ensures cooperative processes share memory and resources safely without data inconsistency or race conditions.",
    sections: [
      {
        title: "Critical Section Problem",
        content: "A **Critical Section** is a code segment accessing shared resources. Any solution must satisfy:\n1. **Mutual Exclusion**: Only one process at a time can execute in critical section.\n2. **Progress**: Selection of next entering process cannot be postponed indefinitely.\n3. **Bounded Waiting**: Bound on times other processes enter critical section after request."
      },
      {
        title: "Mutex & Semaphores",
        content: "• **Mutex Lock**: Binary lock (`acquire()` and `release()`) enforcing mutual exclusion.\n• **Semaphore**: Integer variable accessed via atomic `wait()` (P) and `signal()` (V) operations.\n  - *Counting Semaphore*: Controls access to resource with multiple instances.\n  - *Binary Semaphore*: Behaves identically to Mutex (0 or 1)."
      },
      {
        title: "Classic Synchronization Problems",
        content: "• **Producer-Consumer**: Bounded buffer synchronization using `empty`, `full`, and `mutex` semaphores.\n• **Dining Philosophers**: Avoid deadlock and starvation while sharing adjacent chopsticks."
      }
    ],
    terms: [
      { name: "Critical Section", desc: "Code segment accessing shared data that must not be concurrently executed." },
      { name: "Mutex", desc: "Mutual Exclusion lock used to serialize access to shared memory." },
      { name: "Semaphore", desc: "Signaling variable used for thread coordination and resource counters." },
      { name: "Spinlock", desc: "Lock where thread busy-waits in a continuous loop checking for lock availability." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="50" y="60" width="100" height="50" rx="8" fill="#0284c7"/>
        <text x="100" y="90" text-anchor="middle" fill="#fff" font-weight="bold">Producer</text>
        
        <path d="M 150 85 L 220 85" stroke="#06b6d4" stroke-width="3" marker-end="url(#arrow)"/>
        
        <rect x="220" y="40" width="160" height="90" rx="8" fill="#3b0764" stroke="#a855f7" stroke-width="2"/>
        <text x="300" y="65" text-anchor="middle" fill="#a855f7" font-weight="bold">Bounded Buffer (Size 4)</text>
        <rect x="235" y="80" width="30" height="35" fill="#10b981" rx="4"/>
        <rect x="270" y="80" width="30" height="35" fill="#10b981" rx="4"/>
        <rect x="305" y="80" width="30" height="35" fill="#334155" rx="4"/>
        <rect x="340" y="80" width="30" height="35" fill="#334155" rx="4"/>
        
        <path d="M 380 85 L 450 85" stroke="#06b6d4" stroke-width="3"/>
        
        <rect x="450" y="60" width="100" height="50" rx="8" fill="#7e22ce"/>
        <text x="500" y="90" text-anchor="middle" fill="#fff" font-weight="bold">Consumer</text>
      </svg>
    `
  },

  "deadlocks": {
    overview: "A **Deadlock** occurs when a set of processes are blocked because every process holds a resource and waits for another resource held by another process in the set.",
    sections: [
      {
        title: "4 Necessary Conditions for Deadlock",
        content: "Deadlock can arise ONLY IF all 4 Coffman conditions hold simultaneously:\n1. **Mutual Exclusion**: Non-sharable resources.\n2. **Hold and Wait**: Process holds resources while requesting new ones.\n3. **No Preemption**: Resources cannot be forcibly taken away.\n4. **Circular Wait**: Closed chain of processes waiting for next process's resource."
      },
      {
        title: "Resource Allocation Graph (RAG)",
        content: "RAG uses directed graphs to detect deadlocks. Processes are represented by circles, resources by rectangles (with dot instances). Request edges ($P \\to R$) and Assignment edges ($R \\to P$) reveal cycles."
      },
      {
        title: "Banker's Algorithm",
        content: "A deadlock avoidance algorithm that checks if allocating requested resources leaves the system in a **Safe State** (where there exists a sequence of execution avoiding deadlock). Uses matrices: `Available`, `Max`, `Allocation`, and `Need = Max - Allocation`."
      }
    ],
    terms: [
      { name: "Safe State", desc: "State where system can allocate resources to each process in some order without causing deadlock." },
      { name: "Resource Allocation Graph", desc: "Directed graph representing processes, resource instances, and request/assignment edges." },
      { name: "Banker's Algorithm", desc: "Deadlock avoidance algorithm evaluating allocation safety prior to granting resources." },
      { name: "Circular Wait", desc: "Condition where P0 waits for R0 held by P1, P1 waits for R1 held by P2... and Pn waits for Rn held by P0." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <circle cx="150" cy="90" r="30" fill="#0284c7"/>
        <text x="150" y="95" text-anchor="middle" fill="#fff" font-weight="bold">P1</text>
        
        <circle cx="450" cy="90" r="30" fill="#7e22ce"/>
        <text x="450" y="95" text-anchor="middle" fill="#fff" font-weight="bold">P2</text>
        
        <rect x="270" y="30" width="60" height="40" rx="5" fill="#3b0764" stroke="#f59e0b" stroke-width="2"/>
        <text x="300" y="55" text-anchor="middle" fill="#fff" font-weight="bold">R1</text>
        
        <rect x="270" y="110" width="60" height="40" rx="5" fill="#3b0764" stroke="#f59e0b" stroke-width="2"/>
        <text x="300" y="135" text-anchor="middle" fill="#fff" font-weight="bold">R2</text>
        
        <!-- Circular arrows -->
        <path d="M 180 80 Q 240 45 270 50" stroke="#f43f5e" stroke-width="2" fill="none"/>
        <path d="M 330 50 Q 390 55 420 80" stroke="#f43f5e" stroke-width="2" fill="none"/>
        <path d="M 420 100 Q 360 135 330 130" stroke="#f43f5e" stroke-width="2" fill="none"/>
        <path d="M 270 130 Q 210 125 180 100" stroke="#f43f5e" stroke-width="2" fill="none"/>
        <text x="300" y="95" text-anchor="middle" fill="#f43f5e" font-weight="bold" font-size="12">DEADLOCK CYCLE</text>
      </svg>
    `
  },

  "memory-management": {
    overview: "Memory Management oversees physical RAM allocation to active processes, managing logical-to-physical mapping and memory protection.",
    sections: [
      {
        title: "Contiguous Memory Allocation",
        content: "Each process is allocated a single contiguous block of physical RAM. The OS uses **Base** and **Limit** registers to enforce protection between process memory spaces."
      },
      {
        title: "Dynamic Allocation Strategies",
        content: "• **First Fit**: Allocate the *first* hole large enough.\n• **Best Fit**: Allocate the *smallest* hole large enough (leaves tiny unusable holes).\n• **Worst Fit**: Allocate the *largest* hole available (leaves remaining large hole)."
      },
      {
        title: "Fragmentation & Compaction",
        content: "• **Internal Fragmentation**: Unused memory inside allocated block partition.\n• **External Fragmentation**: Total free memory is sufficient for request, but fragmented into non-contiguous small holes.\n• **Compaction**: Re-locating processes in RAM to merge all free holes into one large block."
      }
    ],
    terms: [
      { name: "External Fragmentation", desc: "Total memory space exists to satisfy request, but free space is split into non-contiguous blocks." },
      { name: "Compaction", desc: "Shifting allocated memory partitions to merge free holes into a single continuous block." },
      { name: "Base & Limit Registers", desc: "Hardware registers defining physical start address and range size for process memory protection." },
      { name: "First Fit", desc: "Memory allocation algorithm selecting the first free block that satisfies process request size." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="40" y="30" width="520" height="60" fill="#3b0764" stroke="#06b6d4" stroke-width="2" rx="6"/>
        <rect x="40" y="30" width="90" height="60" fill="#0284c7"/>
        <text x="85" y="65" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">OS (100KB)</text>
        
        <rect x="130" y="30" width="120" height="60" fill="#a855f7"/>
        <text x="190" y="65" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">P1 (200KB)</text>
        
        <rect x="250" y="30" width="70" height="60" fill="#334155"/>
        <text x="285" y="65" text-anchor="middle" fill="#94a3b8" font-size="11">Hole (50KB)</text>
        
        <rect x="320" y="30" width="140" height="60" fill="#10b981"/>
        <text x="390" y="65" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">P2 (300KB)</text>
        
        <rect x="460" y="30" width="100" height="60" fill="#334155"/>
        <text x="510" y="65" text-anchor="middle" fill="#94a3b8" font-size="11">Hole (150KB)</text>
        
        <text x="300" y="125" text-anchor="middle" fill="#f59e0b" font-weight="bold" font-size="13">External Fragmentation = 50KB + 150KB = 200KB Free</text>
      </svg>
    `
  },

  "paging": {
    overview: "Paging is a non-contiguous memory management scheme permitting process physical address space to be non-contiguous, avoiding external fragmentation.",
    sections: [
      {
        title: "Pages, Frames, and Page Table",
        content: "• **Pages**: Logical memory divided into fixed-size blocks.\n• **Frames**: Physical RAM divided into fixed-size blocks of identical size.\n• **Page Table**: Per-process map translating logical Page Numbers ($p$) to physical Frame Numbers ($f$)."
      },
      {
        title: "Address Translation Math",
        content: "A CPU-generated Logical Address consists of:\n• **Page Number ($p$)**: Index into the Page Table.\n• **Offset ($d$)**: Displacement within the page/frame.\nPhysical Address = $(\\text{Frame Number } f \\times \\text{Page Size}) + \\text{Offset } d$."
      },
      {
        title: "Translation Lookaside Buffer (TLB)",
        content: "A high-speed hardware associative cache. TLB lookup yields physical frame number in 1 clock cycle on a **TLB Hit**. On **TLB Miss**, page table in RAM is queried and TLB updated."
      }
    ],
    terms: [
      { name: "Logical Address", desc: "Address generated by the CPU, consisting of Page Number (p) and Offset (d)." },
      { name: "Frame Number (f)", desc: "Physical RAM block index containing the mapped logical page." },
      { name: "TLB", desc: "Translation Lookaside Buffer - fast associative hardware cache storing recent page-to-frame translations." },
      { name: "Page Fault", desc: "Interrupt raised when accessing a page not currently loaded into physical memory RAM." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="40" y="40" width="140" height="50" fill="#3b0764" stroke="#06b6d4" stroke-width="2" rx="6"/>
        <text x="110" y="60" text-anchor="middle" fill="#06b6d4" font-weight="bold">Logical Addr</text>
        <text x="80" y="80" text-anchor="middle" fill="#fff" font-size="12">p = 2</text>
        <text x="140" y="80" text-anchor="middle" fill="#fff" font-size="12">d = 14</text>
        
        <path d="M 180 65 L 250 65" stroke="#06b6d4" stroke-width="2"/>
        
        <rect x="250" y="20" width="100" height="110" fill="#3b0764" stroke="#a855f7" stroke-width="2" rx="6"/>
        <text x="300" y="40" text-anchor="middle" fill="#a855f7" font-weight="bold" font-size="12">Page Table</text>
        <text x="300" y="65" text-anchor="middle" fill="#94a3b8" font-size="11">0 -> Frame 5</text>
        <text x="300" y="85" text-anchor="middle" fill="#94a3b8" font-size="11">1 -> Frame 1</text>
        <text x="300" y="105" text-anchor="middle" fill="#10b981" font-weight="bold" font-size="11">2 -> Frame 9</text>
        
        <path d="M 350 105 L 420 105" stroke="#10b981" stroke-width="2"/>
        
        <rect x="420" y="40" width="140" height="50" fill="#3b0764" stroke="#10b981" stroke-width="2" rx="6"/>
        <text x="490" y="60" text-anchor="middle" fill="#10b981" font-weight="bold">Physical Addr</text>
        <text x="460" y="80" text-anchor="middle" fill="#fff" font-size="12">f = 9</text>
        <text x="520" y="80" text-anchor="middle" fill="#fff" font-size="12">d = 14</text>
      </svg>
    `
  },

  "page-replacement": {
    overview: "Page Replacement occurs when a page fault happens and no free physical frames exist. The OS selects a victim page in memory to swap out to disk.",
    sections: [
      {
        title: "Demand Paging & Page Faults",
        content: "Virtual memory loads pages into RAM only when requested (on demand). If referenced page is not in RAM, a **Page Fault** trap triggers disk read."
      },
      {
        title: "Page Replacement Algorithms",
        content: "• **FIFO (First-In, First-Out)**: Replaces the oldest loaded page. Simple, but suffers from Belady's Anomaly.\n• **LRU (Least Recently Used)**: Replaces page that hasn't been accessed for longest time. Excellent performance.\n• **Optimal (OPT)**: Replaces page that will not be used for longest future duration (theoretical benchmark)."
      },
      {
        title: "Belady's Anomaly",
        content: "Belady's Anomaly is the counter-intuitive phenomenon where increasing physical frame allocation causes MORE page faults under FIFO replacement algorithm."
      }
    ],
    terms: [
      { name: "FIFO", desc: "First-In First-Out page replacement replacing the page loaded longest ago." },
      { name: "LRU", desc: "Least Recently Used algorithm replacing the page untouched for the longest time interval." },
      { name: "Belady's Anomaly", desc: "Phenomenon where increasing physical frames yields a higher page fault count under FIFO." },
      { name: "Hit Ratio", desc: "Percentage of memory requests satisfied directly from RAM without requiring page replacement." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <text x="300" y="25" text-anchor="middle" fill="#06b6d4" font-weight="bold">LRU Page Replacement (3 Frames)</text>
        <g transform="translate(50, 45)">
          <rect x="0" y="0" width="50" height="30" fill="#0284c7"/><text x="25" y="20" text-anchor="middle" fill="#fff">Ref: 7</text>
          <rect x="0" y="35" width="50" height="25" fill="#3b0764" stroke="#f43f5e"/><text x="25" y="52" text-anchor="middle" fill="#f43f5e" font-size="11">7 (Fault)</text>
        </g>
        <g transform="translate(120, 45)">
          <rect x="0" y="0" width="50" height="30" fill="#0284c7"/><text x="25" y="20" text-anchor="middle" fill="#fff">Ref: 0</text>
          <rect x="0" y="35" width="50" height="25" fill="#3b0764" stroke="#f43f5e"/><text x="25" y="52" text-anchor="middle" fill="#f43f5e" font-size="11">7, 0 (Fault)</text>
        </g>
        <g transform="translate(190, 45)">
          <rect x="0" y="0" width="50" height="30" fill="#0284c7"/><text x="25" y="20" text-anchor="middle" fill="#fff">Ref: 1</text>
          <rect x="0" y="35" width="50" height="25" fill="#3b0764" stroke="#f43f5e"/><text x="25" y="52" text-anchor="middle" fill="#f43f5e" font-size="11">7, 0, 1</text>
        </g>
        <g transform="translate(260, 45)">
          <rect x="0" y="0" width="50" height="30" fill="#0284c7"/><text x="25" y="20" text-anchor="middle" fill="#fff">Ref: 2</text>
          <rect x="0" y="35" width="50" height="25" fill="#3b0764" stroke="#f43f5e"/><text x="25" y="52" text-anchor="middle" fill="#f43f5e" font-size="11">2, 0, 1</text>
        </g>
        <g transform="translate(330, 45)">
          <rect x="0" y="0" width="50" height="30" fill="#0284c7"/><text x="25" y="20" text-anchor="middle" fill="#fff">Ref: 0</text>
          <rect x="0" y="35" width="50" height="25" fill="#3b0764" stroke="#10b981"/><text x="25" y="52" text-anchor="middle" fill="#10b981" font-size="11">Hit!</text>
        </g>
      </svg>
    `
  },

  "disk-scheduling": {
    overview: "Disk Scheduling algorithms order I/O track requests to minimize disk head seek time and maximize total read/write throughput.",
    sections: [
      {
        title: "Disk Structure & Latency",
        content: "• **Seek Time**: Time for disk arm to move head to target track cylinder.\n• **Rotational Latency**: Time for target sector to rotate under disk head.\n• **Transfer Time**: Time to transmit data blocks.\nTotal Access Time = $\\text{Seek Time} + \\text{Rotational Latency} + \\text{Transfer Time}$."
      },
      {
        title: "Algorithms Overview",
        content: "• **FCFS**: Services requests in queue arrival order (high seek movement).\n• **SSTF (Shortest Seek Time First)**: Services request closest to current head position (starvation risk for distant tracks).\n• **SCAN (Elevator)**: Head moves in one direction to end of disk servicing requests, then reverses.\n• **C-SCAN (Circular SCAN)**: Moves in one direction servicing requests, then jumps back to start track 0 immediately without servicing on return."
      }
    ],
    terms: [
      { name: "Seek Time", desc: "Time required to position the read/write head over the target track." },
      { name: "SSTF", desc: "Shortest Seek Time First algorithm selecting request with minimum head distance." },
      { name: "C-SCAN", desc: "Circular SCAN algorithm providing uniform wait time by servicing requests in one direction only." },
      { name: "Track Cylinder", desc: "Concentric circular track ring on a disk platter surface." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <line x1="50" y1="80" x2="550" y2="80" stroke="#94a3b8" stroke-width="4"/>
        <text x="50" y="110" text-anchor="middle" fill="#94a3b8">Track 0</text>
        <text x="550" y="110" text-anchor="middle" fill="#94a3b8">Track 199</text>
        
        <circle cx="200" cy="80" r="10" fill="#06b6d4"/>
        <text x="200" y="55" text-anchor="middle" fill="#06b6d4" font-weight="bold">Head (53)</text>
        
        <path d="M 200 80 L 320 40 L 480 90 L 120 30" stroke="#a855f7" stroke-width="2" fill="none" stroke-dasharray="4"/>
        <circle cx="320" cy="40" r="6" fill="#a855f7"/>
        <circle cx="480" cy="90" r="6" fill="#a855f7"/>
        <circle cx="120" cy="30" r="6" fill="#a855f7"/>
      </svg>
    `
  },

  "file-systems": {
    overview: "File Systems provide structured persistent storage abstraction (files and directories) over physical storage media sectors.",
    sections: [
      {
        title: "File Structure & Inodes",
        content: "In Unix-like systems, an **Inode (Index Node)** stores file metadata (permissions, owner, size, timestamps) and block pointers to physical disk data blocks."
      },
      {
        title: "Inode Block Pointer Structure",
        content: "• **Direct Pointers**: Point directly to data blocks (fast access for small files).\n• **Single Indirect Pointer**: Points to a block of block pointers.\n• **Double & Triple Indirect Pointers**: Allow massive file sizes up to Terabytes."
      },
      {
        title: "Directory & FAT Allocation",
        content: "• **Directory Tree**: Hierarchical mapping of filenames to Inode numbers (`/root/docs`).\n• **FAT (File Allocation Table)**: Table index mapping file linked clusters."
      }
    ],
    terms: [
      { name: "Inode", desc: "Index Node data structure holding metadata and data block pointers for a file." },
      { name: "Direct Block Pointer", desc: "Inode pointer containing physical disk sector address of actual file data." },
      { name: "Directory Tree", desc: "Hierarchical file organizational structure connecting path names to Inodes." },
      { name: "FAT", desc: "File Allocation Table system storing file block chain links in a table array." }
    ],
    diagramSvg: `
      <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
        <rect x="40" y="30" width="120" height="110" fill="#3b0764" stroke="#06b6d4" stroke-width="2" rx="6"/>
        <text x="100" y="55" text-anchor="middle" fill="#06b6d4" font-weight="bold">Inode #402</text>
        <text x="100" y="75" text-anchor="middle" fill="#94a3b8" font-size="11">Mode: rw-r--r--</text>
        <text x="100" y="95" text-anchor="middle" fill="#94a3b8" font-size="11">Size: 12 KB</text>
        <text x="100" y="115" text-anchor="middle" fill="#10b981" font-size="11">Direct Blk 0 -> 88</text>
        
        <path d="M 160 115 L 240 115" stroke="#10b981" stroke-width="2"/>
        
        <rect x="240" y="90" width="100" height="45" fill="#10b981" rx="6"/>
        <text x="290" y="117" text-anchor="middle" fill="#fff" font-weight="bold">Disk Block 88</text>
      </svg>
    `
  }
};
