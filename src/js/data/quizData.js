// Quiz Questions Bank (5 MCQs per module = 50 MCQs total)
export const QUIZ_DATA = {
  "process-management": [
    {
      q: "Which state transition is invalid for a standard process lifecycle?",
      options: ["Ready -> Running", "Running -> Waiting", "Waiting -> Running", "Waiting -> Ready"],
      answer: 2,
      explanation: "A process in the Waiting (Blocked) state must first transition to READY when its I/O finishes before it can be dispatched to RUNNING by the CPU scheduler."
    },
    {
      q: "What component saves and restores process execution context during context switching?",
      options: ["Program Counter", "Process Control Block (PCB)", "Page Table", "Instruction Register"],
      answer: 1,
      explanation: "The Process Control Block (PCB) stores CPU registers, program counter, memory limits, and state so context switching can suspend and resume processes."
    },
    {
      q: "In UNIX systems, which system call creates a duplicate child process?",
      options: ["exec()", "fork()", "spawn()", "clone()"],
      answer: 1,
      explanation: "`fork()` creates an exact duplicate copy of the parent process, returning PID 0 to the child and the child's PID to the parent."
    },
    {
      q: "What is a 'Zombie Process'?",
      options: [
        "A process that has completed execution but its exit status has not been read by its parent",
        "A process running continuously in an infinite loop",
        "A process waiting indefinitely for I/O",
        "A process whose parent terminated before it did"
      ],
      answer: 0,
      explanation: "A zombie process has terminated execution, but its PCB entry remains in the process table until the parent invokes `wait()` to collect its exit status."
    },
    {
      q: "Which scheduler selects processes from disk memory to load into Ready Queue in RAM?",
      options: ["Short-term Scheduler", "Medium-term Scheduler", "Long-term Scheduler", "CPU Dispatcher"],
      answer: 2,
      explanation: "The Long-term Scheduler (Job Scheduler) determines degree of multiprogramming by selecting jobs from disk queue into memory ready queue."
    }
  ],

  "cpu-scheduling": [
    {
      q: "Which CPU scheduling algorithm is non-preemptive and guarantees optimal minimum average waiting time?",
      options: ["Round Robin", "FCFS", "Non-Preemptive SJF", "Preemptive Priority"],
      answer: 2,
      explanation: "Shortest Job First (SJF) is provably optimal because moving short processes ahead of long processes minimizes total queue waiting time."
    },
    {
      q: "What happens if the Time Quantum in Round Robin scheduling is set excessively large?",
      options: ["It causes starvation", "It degrades into FCFS scheduling", "It increases context switch overhead", "It becomes Shortest Job First"],
      answer: 1,
      explanation: "If time quantum $q$ is larger than the longest burst time, no process is preempted and Round Robin behaves identically to First-Come First-Served."
    },
    {
      q: "What is the 'Convoy Effect'?",
      options: [
        "Multiple short processes waiting behind one long CPU-bound process in FCFS",
        "High context switching overhead in Round Robin",
        "Low priority processes waiting indefinitely",
        "Deadlock caused by circular resource requests"
      ],
      answer: 0,
      explanation: "The convoy effect occurs in FCFS when small I/O bound processes get stuck waiting behind a massive CPU bound process."
    },
    {
      q: "Which scheduling algorithm uses dynamic aging to prevent process starvation?",
      options: ["FCFS", "Priority Scheduling", "Multilevel Feedback Queue", "Round Robin"],
      answer: 1,
      explanation: "Aging gradually increases the priority of processes that wait in the system for a long time, preventing indefinite starvation."
    },
    {
      q: "Turnaround Time ($TAT$) is calculated as:",
      options: ["Burst Time - Waiting Time", "Completion Time - Arrival Time", "Waiting Time + Arrival Time", "Completion Time - Burst Time"],
      answer: 1,
      explanation: "$TAT = \\text{Completion Time} - \\text{Arrival Time}$."
    }
  ],

  "threads": [
    {
      q: "Which resource is NOT shared between threads belonging to the same process?",
      options: ["Global Variables", "Heap Memory", "Open File Descriptors", "Stack Memory & Registers"],
      answer: 3,
      explanation: "Each thread has its own private Stack and Register set (including Program Counter) to manage its independent execution function calls."
    },
    {
      q: "What is a disadvantage of User-Level Threads compared to Kernel-Level Threads?",
      options: [
        "Creating user threads requires OS kernel context switch",
        "If one user thread invokes a blocking system call, the entire process blocks",
        "User threads cannot run on single core CPUs",
        "User thread context switching is slower than kernel threads"
      ],
      answer: 1,
      explanation: "Because the kernel is unaware of user-level threads, if one user thread blocks on I/O, the kernel puts the entire process to sleep."
    },
    {
      q: "In a Multithreading One-to-One model:",
      options: [
        "Multiple user threads map to a single kernel thread",
        "Each user thread maps directly to an independent kernel thread",
        "Kernel threads are not supported",
        "Threads cannot run in parallel on multicore systems"
      ],
      answer: 1,
      explanation: "The One-to-One model maps each user thread to a kernel thread, allowing true multicore parallel execution."
    },
    {
      q: "What is a Race Condition?",
      options: [
        "A situation where thread execution speed depends on CPU clock frequency",
        "A condition where concurrent execution on shared data yields non-deterministic results depending on timing",
        "A deadlock between two competing threads",
        "A thread running in an infinite loop"
      ],
      answer: 1,
      explanation: "A race condition occurs when outcome depends on uncontrolled thread timing/interleaving when mutating shared variables."
    },
    {
      q: "What is the primary benefit of using a Thread Pool?",
      options: [
        "Eliminating mutual exclusion locks",
        "Reusing existing threads to eliminate thread creation/destruction overhead",
        "Converting non-preemptive scheduling to preemptive",
        "Preventing external memory fragmentation"
      ],
      answer: 1,
      explanation: "Thread pools pre-allocate a set of worker threads, avoiding the performance cost of repeatedly spawning and destroying threads."
    }
  ],

  "process-synchronization": [
    {
      q: "Which condition is NOT a mandatory requirement for solving the Critical Section Problem?",
      options: ["Mutual Exclusion", "Progress", "Bounded Waiting", "Strict Alternation"],
      answer: 3,
      explanation: "Strict Alternation forces processes to rigidly take turns, violating the Progress requirement if a process does not wish to enter the critical section."
    },
    {
      q: "What is a Binary Semaphore equivalent to?",
      options: ["Counting Semaphore", "Mutex Lock", "Spinlock", "Condition Variable"],
      answer: 1,
      explanation: "A Binary Semaphore takes values only 0 or 1, functioning identically to a Mutex lock."
    },
    {
      q: "What are the two atomic operations performed on a Semaphore $S$?",
      options: ["lock() and unlock()", "wait() [P] and signal() [V]", "read() and write()", "enter() and exit()"],
      answer: 1,
      explanation: "Semaphores are modified exclusively via atomic `wait()` (decrements S) and `signal()` (increments S)."
    },
    {
      q: "In the Producer-Consumer problem, what is the purpose of the `mutex` semaphore?",
      options: [
        "To track number of empty slots",
        "To track number of full slots",
        "To ensure mutual exclusion when modifying buffer memory",
        "To count consumer threads"
      ],
      answer: 2,
      explanation: "The `mutex` semaphore guarantees only one thread (Producer or Consumer) modifies the shared buffer array at a time."
    },
    {
      q: "What is 'Busy Waiting' in synchronization?",
      options: [
        "A thread sleeping until signaled",
        "A thread repeatedly testing a condition loop while consuming CPU cycles (Spinlock)",
        "A process waiting in I/O queue",
        "A thread performing background computations"
      ],
      answer: 1,
      explanation: "Busy waiting (spinlock) repeatedly executes a test loop waiting for a lock, consuming CPU time while waiting."
    }
  ],

  "deadlocks": [
    {
      q: "Which of the following is NOT one of Coffman's 4 necessary deadlock conditions?",
      options: ["Mutual Exclusion", "Preemptive Resource Access", "Hold and Wait", "Circular Wait"],
      answer: 1,
      explanation: "No Preemption (resources cannot be taken away forcibly) is required for deadlock; preemptive access actually prevents deadlocks!"
    },
    {
      q: "Resource Allocation Graphs (RAG) detect deadlocks. If a RAG has NO cycles:",
      options: ["Deadlock definitely exists", "System is guaranteed NOT to be deadlocked", "System is in an unsafe state", "Banker's algorithm must run"],
      answer: 1,
      explanation: "If a Resource Allocation Graph contains no cycles, the system is 100% guaranteed to be free of deadlocks."
    },
    {
      q: "Banker's Algorithm is primarily used for:",
      options: ["Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection", "Deadlock Recovery"],
      answer: 1,
      explanation: "Banker's algorithm is a Deadlock Avoidance algorithm that dynamically tests if granting a request leaves system in a Safe State."
    },
    {
      q: "In Banker's Algorithm, how is the `Need` matrix computed for process $P_i$?",
      options: ["Need = Allocation - Max", "Need = Max - Allocation", "Need = Available - Allocation", "Need = Max - Available"],
      answer: 1,
      explanation: "$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$."
    },
    {
      q: "What does an 'Unsafe State' mean in deadlock avoidance?",
      options: ["System is deadlocked right now", "System cannot prevent future deadlock if processes request maximum resources", "All processes are blocked", "Memory has heavy fragmentation"],
      answer: 1,
      explanation: "An unsafe state is not necessarily deadlocked yet, but OS cannot guarantee that processes won't deadlock if max requests are issued."
    }
  ],

  "memory-management": [
    {
      q: "Which dynamic memory allocation strategy allocates the SMALLEST hole large enough for a request?",
      options: ["First Fit", "Best Fit", "Worst Fit", "Next Fit"],
      answer: 1,
      explanation: "Best Fit searches the entire free list to allocate the smallest block that satisfies request size, leaving small remaining holes."
    },
    {
      q: "What is External Fragmentation?",
      options: [
        "Unused memory space within assigned fixed partition",
        "Total memory free is sufficient for request, but split into non-contiguous small holes",
        "Page fault caused by missing pages in RAM",
        "Overhead of page table storage"
      ],
      answer: 1,
      explanation: "External fragmentation occurs when aggregate free space is large enough, but fragmented into non-adjacent blocks across RAM."
    },
    {
      q: "Which technique resolves External Fragmentation in contiguous memory allocation?",
      options: ["Paging", "Compaction", "Swapping", "Both Paging and Compaction"],
      answer: 3,
      explanation: "Compaction shifts memory contents to aggregate free holes, while Paging eliminates external fragmentation entirely by non-contiguous allocation."
    },
    {
      q: "What is the purpose of the Limit Register in CPU hardware memory protection?",
      options: ["Specifies starting physical address", "Specifies range size of logical address space", "Stores page table base address", "Counts page faults"],
      answer: 1,
      explanation: "Base register specifies physical start address; Limit register specifies logical address range size to prevent memory boundary violation."
    },
    {
      q: "Internal Fragmentation occurs when:",
      options: ["Allocated memory block is slightly larger than requested process memory", "Total free RAM is less than request", "Page size is too small", "Hard disk runs out of swap space"],
      answer: 0,
      explanation: "Internal fragmentation is wasted memory inside an assigned fixed block partition."
    }
  ],

  "paging": [
    {
      q: "In paging, what is the relationship between Page size and Frame size?",
      options: ["Page size is always twice Frame size", "Page size and Frame size are always strictly equal", "Frame size is variable while Page size is fixed", "Frame size depends on disk block size"],
      answer: 1,
      explanation: "Physical memory (Frames) and Logical memory (Pages) are divided into chunks of identical byte size."
    },
    {
      q: "If Page size is 4KB ($2^{12}$ bytes), how many bits are used for Offset $d$ in a 32-bit logical address?",
      options: ["10 bits", "12 bits", "20 bits", "32 bits"],
      answer: 1,
      explanation: "Since $4\\text{KB} = 4096 = 2^{12}$ bytes, 12 bits are required for offset $d$. Remaining 20 bits index Page Number $p$."
    },
    {
      q: "What hardware component accelerates page address translation by caching recent page-to-frame entries?",
      options: ["Instruction Cache", "Translation Lookaside Buffer (TLB)", "Register File", "DMA Controller"],
      answer: 1,
      explanation: "The TLB is a high-speed associative hardware cache storing recent page table lookup entries."
    },
    {
      q: "What is a Page Fault?",
      options: ["A hardware error in physical RAM chip", "An exception raised when CPU accesses a page not present in RAM", "A corrupt entry in the page table", "An overflow of the TLB cache"],
      answer: 1,
      explanation: "A page fault occurs when referenced logical page has valid-invalid bit set to invalid (not loaded in physical RAM)."
    },
    {
      q: "How does Hierarchical (Multi-level) Paging reduce page table memory overhead?",
      options: ["By compressing page entries using ZIP", "By paging the page table itself so non-contiguous tables don't occupy full RAM", "By eliminating offset bits", "By storing page tables on disk exclusively"],
      answer: 1,
      explanation: "Multi-level paging breaks huge linear page tables into smaller paged structures so unused page table pages needn't reside in RAM."
    }
  ],

  "page-replacement": [
    {
      q: "Which page replacement algorithm suffers from Belady's Anomaly?",
      options: ["LRU", "Optimal", "FIFO", "Second Chance"],
      answer: 2,
      explanation: "First-In First-Out (FIFO) suffers from Belady's Anomaly where allocating more physical frames can paradoxically increase page faults."
    },
    {
      q: "What does the Least Recently Used (LRU) algorithm replace?",
      options: ["The page loaded earliest into memory", "The page that will not be used for longest future duration", "The page that has not been referenced for the longest period of time", "The page with smallest size"],
      answer: 2,
      explanation: "LRU looks backward in time and replaces the frame whose page has gone untouched for the longest past time interval."
    },
    {
      q: "Why is the Optimal Page Replacement Algorithm (OPT) impossible to implement in real OS kernels?",
      options: ["It requires infinite physical RAM", "It requires future knowledge of reference requests", "It causes Belady's Anomaly", "It requires hardware atomic locks"],
      answer: 1,
      explanation: "OPT requires knowing the future sequence of page accesses, making it a theoretical benchmark only."
    },
    {
      q: "What is 'Thrashing' in Virtual Memory?",
      options: [
        "High CPU utilization due to multi-core threads",
        "System spending more time swapping pages in/out than executing real process work",
        "A hardware crash of storage disk arm",
        "Corrupted page table pointers"
      ],
      answer: 1,
      explanation: "Thrashing occurs when active processes lack enough frames, triggering continuous page faulting and disk swapping."
    },
    {
      q: "The Second Chance (Clock) algorithm is an efficient approximation of which algorithm?",
      options: ["FIFO", "LRU", "Optimal", "Priority"],
      answer: 1,
      explanation: "Second Chance uses a reference bit circular queue to approximate LRU behavior with low hardware overhead."
    }
  ],

  "disk-scheduling": [
    {
      q: "Which disk scheduling algorithm selects the pending request closest to current head position?",
      options: ["FCFS", "SSTF (Shortest Seek Time First)", "SCAN", "C-SCAN"],
      answer: 1,
      explanation: "SSTF chooses request requiring minimum seek head movement from current position."
    },
    {
      q: "What is a drawback of SSTF disk scheduling?",
      options: ["High head movement overhead", "Potential starvation for requests at track extremities", "Inability to service requests in order", "Requires disk platter formatting"],
      answer: 1,
      explanation: "SSTF can cause starvation if new requests continuously arrive near current head position, stranding distant tracks."
    },
    {
      q: "How does C-SCAN differ from standard SCAN (Elevator) algorithm?",
      options: [
        "C-SCAN services requests in both head directions",
        "C-SCAN services requests in one direction only, then returns directly to start track 0 without servicing requests on return",
        "C-SCAN moves disk head randomly",
        "C-SCAN has higher seek time than FCFS"
      ],
      answer: 1,
      explanation: "C-SCAN (Circular SCAN) treats tracks as a circular list, servicing in one direction and returning to start immediately for uniform wait distribution."
    },
    {
      q: "Total Disk Access Time consists of:",
      options: [
        "Seek Time + Rotational Latency + Transfer Time",
        "Seek Time + CPU Execution Time",
        "Rotational Latency + Memory Bus Speed",
        "Track Count * Sector Count"
      ],
      answer: 0,
      explanation: "Total Access Time = Seek Time (head arm move) + Rotational Latency (disk spin) + Transfer Time (data read)."
    },
    {
      q: "In LOOK disk scheduling algorithm, the disk head arm:",
      options: [
        "Moves all the way to physical disk boundaries (track 0 and 199)",
        "Goes only as far as the final request in current direction before reversing",
        "Services requests in random order",
        "Rotates disk platter backwards"
      ],
      answer: 1,
      explanation: "LOOK (and C-LOOK) optimizes SCAN by reversing immediately at the furthest pending request instead of traveling to physical disk edge."
    }
  ],

  "file-systems": [
    {
      q: "What data structure stores metadata (owner, permissions, size, block pointers) for a file in Unix file systems?",
      options: ["File Allocation Table (FAT)", "Inode (Index Node)", "Superblock", "Directory Entry"],
      answer: 1,
      explanation: "An Inode stores all metadata and data block pointers for a specific file."
    },
    {
      q: "Which directory structure eliminates naming conflicts between different users while keeping flat structure?",
      options: ["Single-Level Directory", "Two-Level Directory", "Tree-Structured Directory", "Acyclic Graph Directory"],
      answer: 1,
      explanation: "Two-Level directory creates a separate Master File Directory for each user containing User File Directories."
    },
    {
      q: "In contiguous file block allocation, what is a major drawback?",
      options: ["Slow sequential access", "External fragmentation and difficulty expanding file size", "Complex Inode pointer lookup", "High CPU overhead"],
      answer: 1,
      explanation: "Contiguous allocation requires contiguous free disk sectors, causing external fragmentation and preventing easy file expansion."
    },
    {
      q: "What is a 'Hard Link' in Unix file systems?",
      options: ["A special file containing path string to target file (symbolic link)", "A directory entry pointing directly to an existing file's Inode number", "A backup copy of file data", "A shortcut icon"],
      answer: 1,
      explanation: "A Hard Link is a directory entry referencing the exact same Inode number on disk as the original file."
    },
    {
      q: "How does Indexed Allocation (Inodes) solve the limitations of Linked Allocation?",
      options: [
        "By storing all file block pointers in a centralized index block allowing direct random access",
        "By compressing disk sectors",
        "By eliminating file permissions",
        "By enforcing contiguous block layout"
      ],
      answer: 0,
      explanation: "Indexed allocation collects all block pointers into an index block (Inode), enabling fast $O(1)$ direct access to any block."
    }
  ]
};
