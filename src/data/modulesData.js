export const MODULES_DATA = [
  {
    id: "process-management",
    title: "Process Management",
    category: "Core OS",
    shortDesc: "Understand process creation, Process Control Blocks (PCB), and state transitions (New, Ready, Running, Waiting, Terminated).",
    icon: "Cpu",
    color: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    learn: {
      overview: `A process is a program in execution. It is more than the program code (text section); it includes current activity represented by the Program Counter (PC), CPU registers, process stack (containing temporary data like function parameters and local variables), and data section (global variables). Operating systems manage processes by creating them, scheduling their execution on CPU cores, synchronizing their activities, and terminating them cleanly.`,
      keyTerms: [
        { term: "PCB (Process Control Block)", definition: "Data structure stored by the OS for every process, containing PID, state, PC, register values, and memory limits." },
        { term: "Context Switching", definition: "The task of saving the state of the currently running process and restoring the saved state of another process." },
        { term: "Process States", definition: "Life cycle stages of a process: New (created), Ready (waiting for CPU), Running (executing), Waiting/Blocked (I/O event), and Terminated." },
        { term: "Forking / Exec", definition: "System calls in Unix/Linux. fork() duplicates the calling process, exec() replaces process memory image with a new executable." }
      ],
      diagramType: "process_state_diagram",
      realWorldAnalogy: "Think of a process as a chef executing a recipe. The recipe is the static program on disk. The chef following steps, measuring ingredients (registers/stack), and cooking is the active process. If an ingredient runs out (I/O event), the chef pauses (Waiting state)."
    },
    task: {
      title: "Process State Machine Challenge",
      instructions: "Identify the correct sequence of states when a process encounters an I/O request.",
      question: "Select the correct sequence of states a process moves through when it requests an I/O operation while running on CPU, completes the I/O, and then finishes execution.",
      options: [
        "Running → Waiting → Ready → Running → Terminated",
        "Running → Ready → Waiting → Running → Terminated",
        "Running → Waiting → Terminated → Ready",
        "Ready → Running → Waiting → Terminated"
      ],
      correctAnswer: 0,
      explanation: "When a process makes an I/O call during execution, it enters the Waiting (Blocked) state. Once I/O completes, an interrupt moves it to Ready. The scheduler dispatches it back to Running, where it completes and goes to Terminated."
    },
    quiz: [
      {
        id: "pm_1",
        question: "Which component of a process contains local variables and function parameters?",
        options: ["Data Section", "Heap Section", "Stack Section", "Text Section"],
        correctIndex: 2,
        explanation: "The Process Stack contains temporary data such as function parameters, return addresses, and local variables."
      },
      {
        id: "pm_2",
        question: "What happens during a Context Switch?",
        options: [
          "The CPU speed is doubled",
          "The current process state is saved and another process state is restored",
          "The process memory is erased completely",
          "A process is moved directly from New to Terminated"
        ],
        correctIndex: 1,
        explanation: "Context switching saves the register and execution context of the active process into its PCB and loads another process's PCB into CPU."
      },
      {
        id: "pm_3",
        question: "When a process is waiting for an I/O operation to complete, which state is it in?",
        options: ["Ready", "Running", "Waiting (Blocked)", "New"],
        correctIndex: 2,
        explanation: "Processes waiting for external events such as disk reads, keyboard input, or timer signals reside in the Waiting/Blocked state."
      },
      {
        id: "pm_4",
        question: "In Unix systems, which system call is used to create a child process?",
        options: ["exec()", "fork()", "exit()", "wait()"],
        correctIndex: 1,
        explanation: "fork() creates an exact duplicate copy of the calling parent process."
      }
    ]
  },
  {
    id: "cpu-scheduling",
    title: "CPU Scheduling",
    category: "Scheduling",
    shortDesc: "Simulate and compare FCFS, Shortest Job First (SJF), Priority Scheduling, and Round Robin (RR) with Gantt charts.",
    icon: "Clock",
    color: "from-purple-500 to-pink-600",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    learn: {
      overview: `CPU scheduling is the process by which the OS allows one process to use the CPU while another process is on hold (in waiting/ready queue). The primary objectives are CPU utilization, throughput, turnaround time, waiting time, and response time. Non-preemptive scheduling allows a process to run until it finishes or waits, while preemptive scheduling can interrupt running processes when higher priority processes arrive or time quanta expire.`,
      keyTerms: [
        { term: "Burst Time", definition: "Amount of CPU time required by a process for execution." },
        { term: "Turnaround Time (TAT)", definition: "Time interval from process submission to process completion (Completion Time - Arrival Time)." },
        { term: "Waiting Time (WT)", definition: "Total time spent by a process waiting in the ready queue (Turnaround Time - Burst Time)." },
        { term: "Time Quantum", definition: "A small fixed unit of CPU execution time allocated in Round Robin scheduling." }
      ],
      diagramType: "gantt_chart",
      realWorldAnalogy: "Like a single bank teller serving a line of customers. FCFS serves people in arrival order. SJF serves customers with quick requests first. Round Robin spends 2 minutes with each customer before moving to the next."
    },
    task: {
      title: "Calculate Average Waiting Time (FCFS)",
      instructions: "Calculate the Average Waiting Time for 3 processes arriving at time 0 with Burst Times: P1 = 24ms, P2 = 3ms, P3 = 3ms under FCFS.",
      question: "What is the Average Waiting Time for P1 (24ms), P2 (3ms), P3 (3ms)?",
      options: ["17.0 ms", "9.0 ms", "8.0 ms", "12.0 ms"],
      correctAnswer: 0,
      explanation: "Waiting times: P1 = 0ms, P2 = 24ms, P3 = 24 + 3 = 27ms. Sum = 0 + 24 + 27 = 51ms. Average = 51 / 3 = 17.0 ms."
    },
    quiz: [
      {
        id: "cs_1",
        question: "Which scheduling algorithm gives the minimum average waiting time for a given set of processes?",
        options: ["First-Come First-Served (FCFS)", "Shortest Job First (SJF)", "Round Robin (RR)", "Priority Scheduling"],
        correctIndex: 1,
        explanation: "SJF (specifically Non-Preemptive SJF / Shortest Remaining Time First) is provably optimal for minimizing average waiting time."
      },
      {
        id: "cs_2",
        question: "In Round Robin scheduling, what happens if the time quantum is extremely large?",
        options: ["It behaves like FCFS", "It causes high starvation", "It behaves like Shortest Job First", "Deadlock occurs"],
        correctIndex: 0,
        explanation: "When time quantum is larger than max burst time, no process is preempted early, degrading Round Robin to FCFS."
      },
      {
        id: "cs_3",
        question: "Starvation (indefinite waiting) is a potential risk in which algorithm?",
        options: ["Round Robin", "FCFS", "Non-Preemptive Priority Scheduling", "FIFO"],
        correctIndex: 2,
        explanation: "Priority-based scheduling can lead to starvation where low-priority processes wait indefinitely if high-priority processes keep arriving. Aging solves this."
      },
      {
        id: "cs_4",
        question: "Turnaround time is defined as:",
        options: ["Completion Time - Arrival Time", "Burst Time - Arrival Time", "Waiting Time + Burst Time", "Both A and C"],
        correctIndex: 3,
        explanation: "Turnaround Time = Completion Time - Arrival Time = Waiting Time + Burst Time."
      }
    ]
  },
  {
    id: "threads",
    title: "Threads & Concurrency",
    category: "Concurrency",
    shortDesc: "Explore lightweight execution units, User vs. Kernel level threads, multithreading models, and race conditions.",
    icon: "GitFork",
    color: "from-cyan-500 to-blue-600",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    learn: {
      overview: `A thread is a basic unit of CPU utilization, comprising a thread ID, program counter, register set, and a stack. It shares code section, data section, and open file handles with other threads belonging to the same process. Multithreading enables responsiveness, resource sharing, economy (threads are cheaper to create and context switch than processes), and scalable utilization of multi-core processors.`,
      keyTerms: [
        { term: "User Threads", definition: "Threads managed above the kernel without OS kernel awareness or support." },
        { term: "Kernel Threads", definition: "Threads managed directly by the Operating System kernel." },
        { term: "Race Condition", definition: "A flaw where several threads access and manipulate shared data concurrently, and final result depends on timing." },
        { term: "Threading Models", definition: "Mapping between user & kernel threads: Many-to-One, One-to-One, and Many-to-Many." }
      ],
      diagramType: "thread_model_diagram",
      realWorldAnalogy: "A process is a factory building. Threads are multiple workers inside the same factory who share tools, raw materials (data section), and room (memory space), operating in parallel."
    },
    task: {
      title: "Race Condition Analyzer",
      instructions: "Two threads execute x = x + 1 concurrently on initial value x = 5 without locks.",
      question: "What are all possible final values of x after both threads finish if reading, incrementing, and writing steps interleave non-atomically?",
      options: ["Only 7", "6 or 7", "5 or 6", "6 only"],
      correctAnswer: 1,
      explanation: "If both threads read x=5 simultaneously before either writes back, both write 6. If executed sequentially, result is 7. Thus possible values are 6 or 7."
    },
    quiz: [
      {
        id: "th_1",
        question: "Which of the following is SHARED among threads of the same process?",
        options: ["Register Set", "Stack", "Program Counter", "Data Section and Heap"],
        correctIndex: 3,
        explanation: "Threads within a process share global data, static variables, and heap memory, but each thread maintains its own stack and registers."
      },
      {
        id: "th_2",
        question: "In which multithreading model does a single blocking user thread block the entire process?",
        options: ["One-to-One Model", "Many-to-One Model", "Many-to-Many Model", "Hybrid Model"],
        correctIndex: 1,
        explanation: "In Many-to-One, all user threads map to 1 kernel thread. If a user thread makes a blocking system call, the kernel blocks the single underlying kernel thread."
      },
      {
        id: "th_3",
        question: "What advantage do user-level threads have over kernel-level threads?",
        options: ["Faster thread creation and context switching without kernel interaction", "Hardware multi-core execution support", "Non-blocking system call efficiency", "Kernel fault tolerance"],
        correctIndex: 0,
        explanation: "User-level thread switching requires no trap to kernel mode, making context switches extremely fast."
      },
      {
        id: "th_4",
        question: "What is an atomic operation?",
        options: ["An operation that runs on nuclear hardware", "An operation that completes in a single indivisible step without interruption", "An operation involving 4 threads", "A thread termination process"],
        correctIndex: 1,
        explanation: "An atomic operation completes as a single uninterruptible unit, preventing race conditions during shared data access."
      }
    ]
  },
  {
    id: "process-sync",
    title: "Process Synchronization",
    category: "Concurrency",
    shortDesc: "Master Critical Section Problem, Mutex Locks, Semaphores, Producer-Consumer, and Dining Philosophers.",
    icon: "Lock",
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    learn: {
      overview: `Process synchronization ensures orderly execution of cooperating processes to maintain data consistency. The Critical Section is a segment of code accessing shared variables. Any valid solution to the critical-section problem must satisfy three requirements: 1) Mutual Exclusion (only one process in CS), 2) Progress (no deadlock when selecting next process), and 3) Bounded Waiting (no process waits forever). Synchronizations primitives include Mutexes, Counting Semaphores, and Condition Variables.`,
      keyTerms: [
        { term: "Critical Section (CS)", definition: "Code region where shared resources (variables, files) are accessed." },
        { term: "Mutex Lock", definition: "A binary synchronization object used to lock access to critical section (acquire/release)." },
        { term: "Semaphore", definition: "An integer variable accessed via atomic wait() (P) and signal() (V) operations." },
        { term: "Producer-Consumer", definition: "Classic synchronization problem using bounded buffers with mutex, empty, and full semaphores." }
      ],
      diagramType: "mutex_buffer_diagram",
      realWorldAnalogy: "A single rest-room with a key card. Only one person holding the key card (Mutex) can enter. Others line up outside. When finished, the key card is released for the next person in line."
    },
    task: {
      title: "Semaphore Value Calculator",
      instructions: "A counting semaphore S is initialized to 5. The following sequence of operations is executed: 8 wait(S) operations and 5 signal(S) operations.",
      question: "What is the final value of Semaphore S?",
      options: ["2", "5", "0", "-3"],
      correctAnswer: 0,
      explanation: "Initial S = 5. 8 wait(S) operations decrement S: 5 - 8 = -3. Then 5 signal(S) operations increment S: -3 + 5 = 2."
    },
    quiz: [
      {
        id: "ps_1",
        question: "Which requirement ensures that no process should wait indefinitely to enter its critical section?",
        options: ["Mutual Exclusion", "Bounded Waiting", "Progress", "Preemption"],
        correctIndex: 1,
        explanation: "Bounded Waiting guarantees a limit on the number of times other processes enter CS after a request is made."
      },
      {
        id: "ps_2",
        question: "In a Producer-Consumer bounded buffer of size N, what are the initial values of semaphores 'mutex', 'empty', and 'full'?",
        options: ["mutex = 1, empty = N, full = 0", "mutex = 0, empty = 0, full = N", "mutex = 1, empty = 0, full = N", "mutex = N, empty = 1, full = 0"],
        correctIndex: 0,
        explanation: "mutex = 1 (binary lock), empty = N (all buffer slots initially empty), full = 0 (no items in buffer initially)."
      },
      {
        id: "ps_3",
        question: "What is the difference between wait() and signal() semaphore primitives?",
        options: [
          "wait() increments semaphore; signal() decrements semaphore",
          "wait() decrements semaphore; signal() increments semaphore",
          "Both increment semaphore",
          "Both pause the process"
        ],
        correctIndex: 1,
        explanation: "wait() [also called P] decrements count and blocks if < 0. signal() [also called V] increments count and wakes up waiting process."
      },
      {
        id: "ps_4",
        question: "What classic problem illustrates resource hierarchy solutions to prevent deadlock among 5 processes?",
        options: ["Readers-Writers Problem", "Dining Philosophers Problem", "Sleeping Barber Problem", "Producer-Consumer Problem"],
        correctIndex: 1,
        explanation: "The Dining Philosophers problem highlights synchronization constraints when 5 philosophers contend for adjacent chopsticks."
      }
    ]
  },
  {
    id: "deadlocks",
    title: "Deadlocks",
    category: "Concurrency",
    shortDesc: "Analyze 4 Coffman conditions, Resource Allocation Graphs (RAG), Banker's Algorithm for Safe State, and Recovery.",
    icon: "AlertTriangle",
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    learn: {
      overview: `A deadlock is a situation where a set of processes are blocked because every process holds a resource and waits for another resource held by another process. Deadlock requires four necessary Coffman conditions simultaneously: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, and 4) Circular Wait. Operating systems handle deadlocks via Deadlock Prevention (breaking 1 of 4 conditions), Deadlock Avoidance (Banker's Algorithm), or Deadlock Detection & Recovery.`,
      keyTerms: [
        { term: "Coffman Conditions", definition: "The 4 necessary conditions for deadlock: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait." },
        { term: "Resource Allocation Graph (RAG)", definition: "Directed graph with process and resource nodes used to detect cycle-based deadlocks." },
        { term: "Banker's Algorithm", definition: "A deadlock avoidance algorithm that tests safety by simulating resource allocation of max declared needs." },
        { term: "Safe State", definition: "A system state where there exists a safe sequence of processes to complete without entering deadlock." }
      ],
      diagramType: "rag_diagram",
      realWorldAnalogy: "4 cars arriving simultaneously at a 4-way stop intersection. Car A blocks Car B, Car B blocks Car C, Car C blocks Car D, and Car D blocks Car A. No car can move forward."
    },
    task: {
      title: "Banker's Algorithm Need Matrix Calculation",
      instructions: "Given Allocation = [2, 1, 1] and Max = [4, 3, 3] for a process P0.",
      question: "Calculate the Need Matrix row for process P0.",
      options: ["[2, 2, 2]", "[6, 4, 4]", "[2, 1, 1]", "[1, 2, 2]"],
      correctAnswer: 0,
      explanation: "Need = Max - Allocation. Need[P0] = [4-2, 3-1, 3-1] = [2, 2, 2]."
    },
    quiz: [
      {
        id: "dl_1",
        question: "Which condition is NOT one of the four necessary Coffman conditions for deadlock?",
        options: ["Mutual Exclusion", "Circular Wait", "Preemption Allowed", "Hold and Wait"],
        correctIndex: 2,
        explanation: "No Preemption (resources cannot be forcibly taken) is a Coffman condition. Preemption Allowed prevents deadlock."
      },
      {
        id: "dl_2",
        question: "If a Resource Allocation Graph contains NO cycles, what can be stated conclusively?",
        options: ["Deadlock is guaranteed", "System is definitely in deadlock", "System is definitely NOT in deadlock", "Banker's algorithm failed"],
        correctIndex: 2,
        explanation: "If a RAG has no cycles, the system is guaranteed to be deadlock-free."
      },
      {
        id: "dl_3",
        question: "What is the primary function of Banker's Algorithm?",
        options: ["Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection", "Deadlock Recovery"],
        correctIndex: 1,
        explanation: "Banker's algorithm dynamically inspects request claims to avoid entering unsafe states that could lead to deadlock."
      },
      {
        id: "dl_4",
        question: "If a cycle exists in a RAG where each resource type has ONLY single instances, then:",
        options: ["System is in safe state", "Deadlock definitely exists", "Deadlock might exist", "System auto-recovers"],
        correctIndex: 1,
        explanation: "For single-instance resources, a cycle in the RAG is a necessary and sufficient condition for deadlock."
      }
    ]
  },
  {
    id: "memory-management",
    title: "Memory Management",
    category: "Memory",
    shortDesc: "Master contiguous memory allocation strategies: First-Fit, Best-Fit, Worst-Fit, internal and external fragmentation.",
    icon: "Database",
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    learn: {
      overview: `Memory management is responsible for allocating main memory (RAM) blocks to executing processes and reclaiming them when finished. In contiguous memory allocation, each process is placed in a single continuous block of physical memory. As memory is allocated and freed, memory gets fragmented into small unusable gaps.`,
      keyTerms: [
        { term: "External Fragmentation", definition: "Total free memory space is enough to satisfy a request, but it is split into non-contiguous small holes." },
        { term: "Internal Fragmentation", definition: "Unused memory space left inside an allocated memory block/partition." },
        { term: "First-Fit", definition: "Allocates the first hole that is big enough for the incoming process." },
        { term: "Best-Fit", definition: "Allocates the smallest hole that is big enough, producing the smallest leftover hole." },
        { term: "Worst-Fit", definition: "Allocates the largest available hole, leaving the largest leftover hole." }
      ],
      diagramType: "memory_fit_diagram",
      realWorldAnalogy: "Parking cars in a parking lot. First-fit parks in the very first available space. Best-fit searches for the space that fits your car tightest. Worst-fit parks in the largest open RV space."
    },
    task: {
      title: "Memory Allocation Strategy Test",
      instructions: "Given memory holes of sizes: 100KB, 500KB, 200KB, 300KB, 600KB in order. A process requests 212KB.",
      question: "Which hole will be selected by Best-Fit algorithm?",
      options: ["500KB hole", "300KB hole", "600KB hole", "200KB hole"],
      correctAnswer: 1,
      explanation: "Best-fit picks the smallest hole >= 212KB. Among candidates [500KB, 300KB, 600KB], 300KB is the smallest suitable hole."
    },
    quiz: [
      {
        id: "mm_1",
        question: "Which memory allocation strategy generally leaves the largest leftover hole after allocation?",
        options: ["First-Fit", "Best-Fit", "Worst-Fit", "Next-Fit"],
        correctIndex: 2,
        explanation: "Worst-Fit specifically searches for and allocates the largest available partition, leaving a large residual free block."
      },
      {
        id: "mm_2",
        question: "What is external fragmentation?",
        options: [
          "Unused memory inside an allocated page frame",
          "Sufficient total free memory available, but fragmented into non-contiguous blocks",
          "Memory corrupted by virus",
          "Disk swap file overflow"
        ],
        correctIndex: 1,
        explanation: "External fragmentation occurs when total free memory is adequate, but fragmented into isolated holes so no single process fits."
      },
      {
        id: "mm_3",
        question: "What technique eliminates external fragmentation in contiguous allocation by moving all free memory into one big block?",
        options: ["Compaction", "Paging", "Segmentation", "Swapping"],
        correctIndex: 0,
        explanation: "Compaction shifts all occupied memory blocks together to merge small free holes into a single continuous memory pool."
      },
      {
        id: "mm_4",
        question: "Which allocation algorithm is fastest in execution speed?",
        options: ["Best-Fit", "Worst-Fit", "First-Fit", "Optimal-Fit"],
        correctIndex: 2,
        explanation: "First-Fit stops searching as soon as it finds the first free block large enough, making it generally the fastest."
      }
    ]
  },
  {
    id: "paging",
    title: "Paging & Address Translation",
    category: "Memory",
    shortDesc: "Understand non-contiguous memory, page tables, logical to physical address translation, and TLB speedup.",
    icon: "Layers",
    color: "from-indigo-500 to-purple-600",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    learn: {
      overview: `Paging is a memory management scheme that permits physical address space of a process to be non-contiguous. Physical memory is divided into fixed-sized blocks called Frames, and logical memory into same-sized blocks called Pages. The CPU generates logical addresses consisting of a Page Number (p) and Page Offset (d). The Page Table maps page number (p) to frame number (f), yielding Physical Address = (f × Page Size) + d. Translation Lookaside Buffer (TLB) is a hardware cache that speeds up address lookup.`,
      keyTerms: [
        { term: "Page & Frame", definition: "Page is a fixed-size logical block; Frame is a physical memory block of identical size." },
        { term: "Page Table", definition: "Data structure used by MMU to map logical page numbers to physical frame numbers." },
        { term: "TLB (Translation Lookaside Buffer)", definition: "High-speed associative hardware cache storing recently used page-table entries." },
        { term: "Effective Access Time (EAT)", definition: "Average memory access time considering TLB Hit Ratio (α): EAT = α(ε + m) + (1-α)(ε + 2m)." }
      ],
      diagramType: "paging_address_diagram",
      realWorldAnalogy: "A book with a Table of Contents. Chapter 4 (Logical Page 4) might be printed on Physical Page 87 (Frame 87). You check the index (Page Table) to jump directly to page 87."
    },
    task: {
      title: "Logical to Physical Address Translation",
      instructions: "Given Page Size = 1KB (1024 bytes). A logical address has Page Number p = 2 and Offset d = 400. Page Table entry for Page 2 points to Frame 5.",
      question: "What is the physical memory address?",
      options: ["5520", "2448", "5120", "4496"],
      correctAnswer: 0,
      explanation: "Physical Address = (Frame Number × Page Size) + Offset = (5 × 1024) + 400 = 5120 + 400 = 5520."
    },
    quiz: [
      {
        id: "pg_1",
        question: "In paging, logical memory is divided into fixed-size blocks called ____, and physical memory into ____.",
        options: ["Frames; Pages", "Pages; Frames", "Segments; Blocks", "Vectors; Slots"],
        correctIndex: 1,
        explanation: "Logical memory is divided into Pages; Physical memory is divided into same-sized Frames."
      },
      {
        id: "pg_2",
        question: "What hardware component accelerates logical-to-physical address translation?",
        options: ["DMA Controller", "TLB (Translation Lookaside Buffer)", "ALU", "Interrupt Controller"],
        correctIndex: 1,
        explanation: "TLB is a fast hardware associative cache that stores page-to-frame translation mappings."
      },
      {
        id: "pg_3",
        question: "If page size is 4KB (4096 bytes = 2^12), how many bits are used for the offset d in a 32-bit logical address?",
        options: ["12 bits", "20 bits", "16 bits", "32 bits"],
        correctIndex: 0,
        explanation: "Since 4096 = 2^12, 12 bits are required for page offset d. The remaining 20 bits specify page number p."
      },
      {
        id: "pg_4",
        question: "Does paging suffer from external fragmentation?",
        options: [
          "Yes, severe external fragmentation",
          "No, paging completely eliminates external fragmentation",
          "Only when TLB is full",
          "Depends on CPU architecture"
        ],
        correctIndex: 1,
        explanation: "Because any free page frame can be allocated to any logical page, paging completely eliminates external fragmentation."
      }
    ]
  },
  {
    id: "page-replacement",
    title: "Page Replacement Algorithms",
    category: "Memory",
    shortDesc: "Simulate virtual memory page fault handling with FIFO, LRU, and Optimal replacement algorithms.",
    icon: "RefreshCw",
    color: "from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    learn: {
      overview: `Virtual memory uses demand paging to load pages into memory only when needed. When a process accesses a page not currently resident in RAM, a Page Fault occurs, triggering the OS to bring the page from disk into a frame. If no free frames are available, a Page Replacement Algorithm selects a victim page to swap out to disk.`,
      keyTerms: [
        { term: "Page Fault", definition: "Interrupt raised when a program accesses a page that is not currently loaded in physical RAM." },
        { term: "FIFO (First-In, First-Out)", definition: "Replaces the oldest page loaded into memory first." },
        { term: "LRU (Least Recently Used)", definition: "Replaces the page that has not been used for the longest period of time." },
        { term: "Belady's Anomaly", definition: "Counter-intuitive phenomenon where increasing frame count increases total page faults (occurs in FIFO)." }
      ],
      diagramType: "page_fault_diagram",
      realWorldAnalogy: "A workbench with room for only 3 tool boxes (3 frames). When you need a wrench not on the table, you put back the tool box you haven't touched in the longest time (LRU) to make room."
    },
    task: {
      title: "FIFO Page Fault Tracing Challenge",
      instructions: "Reference string: 7, 0, 1, 2 with 3 empty page frames initially using FIFO replacement.",
      question: "How many page faults occur for this reference string?",
      options: ["4", "3", "5", "2"],
      correctAnswer: 0,
      explanation: "Frames initially empty []. Page 7 -> Fault [7]. Page 0 -> Fault [7, 0]. Page 1 -> Fault [7, 0, 1]. Page 2 -> Fault (replaces 7) -> [2, 0, 1]. Total 4 faults."
    },
    quiz: [
      {
        id: "pr_1",
        question: "Which page replacement algorithm suffers from Belady's Anomaly?",
        options: ["Optimal", "LRU (Least Recently Used)", "FIFO (First-In First-Out)", "MRU"],
        correctIndex: 2,
        explanation: "FIFO can exhibit Belady's Anomaly, where giving a process more page frames actually causes more page faults."
      },
      {
        id: "pr_2",
        question: "What is the theoretical optimal page replacement algorithm?",
        options: [
          "Replaces the page that will not be used for the longest period of time in the future",
          "Replaces the newest page",
          "Replaces the largest page",
          "Replaces pages randomly"
        ],
        correctIndex: 0,
        explanation: "Optimal algorithm (OPT/MIN) replaces the page that will not be used for the longest future time duration. It requires future knowledge."
      },
      {
        id: "pr_3",
        question: "What is thrashing in virtual memory systems?",
        options: [
          "CPU spending more time paging/swapping than executing instructions",
          "Hard drive mechanical crash",
          "RAM speed doubling",
          "Process context switch failure"
        ],
        correctIndex: 0,
        explanation: "Thrashing happens when a process spends more time swapping pages in and out of disk than executing program instructions."
      },
      {
        id: "pr_4",
        question: "Which hardware mechanism helps LRU implementation efficiently track recency?",
        options: ["Reference Bit / Counter Matrix", "ALU Flags", "Cache Controller", "RAID Array"],
        correctIndex: 0,
        explanation: "LRU uses hardware reference bits, timestamp counters, or stack structures to track page access history."
      }
    ]
  },
  {
    id: "disk-scheduling",
    title: "Disk Scheduling",
    category: "Storage",
    shortDesc: "Visualize disk head movements across cylinders for FCFS, SSTF, SCAN (Elevator), C-SCAN, and LOOK.",
    icon: "HardDrive",
    color: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    learn: {
      overview: `Disk scheduling is conducted by operating systems to manage I/O requests arriving for hard disk drives. Because magnetic disk access times are dominated by Seek Time (moving the disk head arm to the target cylinder track), disk scheduling algorithms aim to minimize total head movement distance to improve overall I/O performance and throughput.`,
      keyTerms: [
        { term: "Seek Time", definition: "Time required for disk head arm to move to the specified cylinder track." },
        { term: "Rotational Latency", definition: "Time taken for target disk sector to rotate under the read/write head." },
        { term: "SSTF (Shortest Seek Time First)", definition: "Services request closest to current head position." },
        { term: "SCAN (Elevator Algorithm)", definition: "Disk head moves from one end of disk to the other servicing requests, then reverses direction." },
        { term: "C-SCAN (Circular SCAN)", definition: "Moves head from one end to the other servicing requests, then immediately jumps back to start without servicing on return." }
      ],
      diagramType: "disk_head_diagram",
      realWorldAnalogy: "An elevator in a skyscraper. SCAN moves all the way to the top floor stopping at requested floors, then reverses direction to move down. C-SCAN moves up stopping at floors, then returns straight to ground floor."
    },
    task: {
      title: "Total Head Movement (FCFS)",
      instructions: "Disk head at cylinder 50. Request queue: [82, 170, 43].",
      question: "Calculate total cylinder head movement under FCFS.",
      options: ["277 cylinders", "247 cylinders", "150 cylinders", "300 cylinders"],
      correctAnswer: 0,
      explanation: "From 50 to 82: |82-50| = 32. From 82 to 170: |170-82| = 88. From 170 to 43: |43-170| = 127. Total = 32 + 88 + 127 = 247... Wait: |82-50|=32, |170-82|=88, |43-170|=127. Total: 32+88+127 = 247 cylinders."
    },
    quiz: [
      {
        id: "ds_1",
        question: "Which disk scheduling algorithm services requests with minimum seek time relative to current head position?",
        options: ["FCFS", "SSTF", "SCAN", "C-LOOK"],
        correctIndex: 1,
        explanation: "SSTF (Shortest Seek Time First) chooses the request that requires the least disk arm movement from current location."
      },
      {
        id: "ds_2",
        question: "Why is SCAN algorithm also known as the Elevator Algorithm?",
        options: [
          "It moves up and down across cylinders servicing requests like a building elevator",
          "It elevates CPU processing speed",
          "It lifts disk head vertically off platter",
          "It skips middle tracks"
        ],
        correctIndex: 0,
        explanation: "SCAN moves back and forth across cylinder tracks continuously servicing requests along its path, identical to an elevator."
      },
      {
        id: "ds_3",
        question: "What advantage does C-SCAN have over SCAN?",
        options: [
          "Provides a more uniform wait time for all requests",
          "Has zero seek time",
          "Eliminates disk rotation",
          "Reduces queue capacity"
        ],
        correctIndex: 0,
        explanation: "C-SCAN treats cylinders as a circular list, providing uniform waiting times regardless of track location."
      },
      {
        id: "ds_4",
        question: "What component accounts for the largest delay in traditional HDD disk access time?",
        options: ["Transfer Time", "Seek Time", "Controller Time", "Interrupt Processing Time"],
        correctIndex: 1,
        explanation: "Mechanical arm movement (Seek Time) is by far the slowest component of disk access time."
      }
    ]
  },
  {
    id: "file-systems",
    title: "File Systems & Allocation",
    category: "Storage",
    shortDesc: "Inspect directory trees, file control blocks, Contiguous, Linked, and Indexed file allocation (Inodes).",
    icon: "FolderTree",
    color: "from-violet-500 to-purple-600",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    learn: {
      overview: `A file system provides logical storage structure for user data and programs on physical secondary storage. Operating systems map logical files onto physical disk blocks using file allocation strategies: 1) Contiguous Allocation (sequential contiguous blocks), 2) Linked Allocation (each block contains pointer to next block), and 3) Indexed Allocation (an Index Block / Inode contains pointers to all file data blocks).`,
      keyTerms: [
        { term: "File Control Block (FCB / Inode)", definition: "Structure containing metadata: file permissions, size, ownership, timestamps, and block pointers." },
        { term: "Contiguous Allocation", definition: "Requires each file to occupy a set of contiguous blocks on disk." },
        { term: "Linked Allocation", definition: "Each file is a linked list of disk blocks scattered anywhere on disk." },
        { term: "Indexed Allocation (Inode)", definition: "Brings all pointers together into one index block for direct block access." }
      ],
      diagramType: "inode_diagram",
      realWorldAnalogy: "Linked allocation is like a treasure hunt clue game (each clue points to next location). Indexed allocation is like a book index pointing directly to page numbers."
    },
    task: {
      title: "File Block Allocation Lookup",
      instructions: "A file of size 4KB (block size = 1KB) uses Indexed Allocation with Index Block at sector 19. Index Block contains block pointers: [4, 7, 12, 15].",
      question: "Which disk block contains logical block index 2 of the file?",
      options: ["Block 12", "Block 7", "Block 4", "Block 15"],
      correctAnswer: 0,
      explanation: "Logical block indices: [0 -> Block 4, 1 -> Block 7, 2 -> Block 12, 3 -> Block 15]. Logical index 2 maps to physical Block 12."
    },
    quiz: [
      {
        id: "fs_1",
        question: "Which file allocation method supports direct/random access WITHOUT external fragmentation?",
        options: ["Contiguous Allocation", "Linked Allocation", "Indexed Allocation", "FAT Allocation"],
        correctIndex: 2,
        explanation: "Indexed allocation allows direct block access via index table pointers while supporting non-contiguous disk placement."
      },
      {
        id: "fs_2",
        question: "What is a major disadvantage of Linked File Allocation?",
        options: [
          "Direct / Random access is very slow because pointers must be traversed sequentially",
          "Severe external fragmentation",
          "File size must be fixed at creation",
          "Cannot store binary files"
        ],
        correctIndex: 0,
        explanation: "To reach the i-th block in linked allocation, the OS must read i-1 preceding blocks from disk sequentially."
      },
      {
        id: "fs_3",
        question: "In Unix systems, what data structure stores file attributes and disk block addresses?",
        options: ["FAT Table", "Inode (Index Node)", "Page Table", "Superblock"],
        correctIndex: 1,
        explanation: "An Inode (index node) stores file metadata, direct block pointers, and indirect block pointers."
      },
      {
        id: "fs_4",
        question: "What happens in contiguous file allocation when a file needs to grow beyond its allocated size?",
        options: [
          "File automatically fragments into inodes",
          "It fails if adjacent blocks are already allocated to another file",
          "Disk automatically expands sector count",
          "Operating system reboots"
        ],
        correctIndex: 1,
        explanation: "In contiguous allocation, expanding a file requires free contiguous space immediately following existing blocks."
      }
    ]
  }
];

export const ACHIEVEMENTS = [
  { id: "first_module", title: "First Step", desc: "Complete all steps of your first module", icon: "Award" },
  { id: "halfway", title: "OS Scholar", desc: "Complete 5 OS Virtual Lab modules", icon: "Zap" },
  { id: "master", title: "OS Master", desc: "Complete all 10 OS Virtual Lab modules", icon: "Crown" },
  { id: "quiz_ace", title: "Quiz Wizard", desc: "Score 100% on any module quiz", icon: "CheckCircle" },
  { id: "terminal_hacker", title: "Terminal Hacker", desc: "Run at least 5 terminal commands", icon: "Terminal" }
];
