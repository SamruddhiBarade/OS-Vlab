// Lab Tasks definitions and solution verification algorithms for all 10 topics
export const TASKS_DATA = {
  "process-management": {
    title: "Process State Transition Challenge",
    instructions: "A process P1 is created at t=0 with CPU burst 5ms. At t=2ms, P1 performs an I/O request taking 3ms. Calculate total time P1 spent in **READY** state.",
    hint: "P1 runs from t=0 to t=2 (2ms CPU), then enters WAITING state for I/O (3ms, t=2 to t=5). At t=5, I/O finishes, P1 returns to READY. Ready queue has no other process, so P1 gets CPU from t=5 to t=8 (remaining 3ms CPU burst).",
    inputType: "number",
    targetLabel: "Total Waiting/Ready Time in ms:",
    correctAnswer: "0",
    explanation: "Since there were no competing processes in the Ready queue, P1 spent 0ms waiting in the Ready state!"
  },

  "cpu-scheduling": {
    title: "FCFS Average Waiting Time Calculation",
    instructions: "Given 3 processes arriving at time t=0 with burst times: P1 = 24ms, P2 = 3ms, P3 = 3ms using **FCFS**. Calculate the **Average Waiting Time** ($WT_{avg}$) in ms.",
    hint: "WT(P1) = 0, WT(P2) = 24, WT(P3) = 24 + 3 = 27. Total WT = 0 + 24 + 27 = 51. Average WT = 51 / 3.",
    inputType: "number",
    targetLabel: "Average Waiting Time (ms):",
    correctAnswer: "17",
    explanation: "WT(P1)=0, WT(P2)=24, WT(P3)=27. (0 + 24 + 27) / 3 = 17ms."
  },

  "threads": {
    title: "Thread Race Condition Output Analysis",
    instructions: "Two parallel threads execute the non-atomic loop `count = count + 1` 100 times each. What is the **minimum possible final value** of `count` if race conditions occur?",
    hint: "Consider thread context switches occurring right after read step before write step.",
    inputType: "number",
    targetLabel: "Minimum possible final value:",
    correctAnswer: "2",
    explanation: "In worst-case race condition interleaving (where reads overwrite unwritten updates), the final value can be as low as 2."
  },

  "process-synchronization": {
    title: "Producer-Consumer Semaphore Initializer",
    instructions: "In a Bounded Buffer of size N = 8 items, what should be the initial integer value of the `empty` semaphore?",
    hint: "`empty` semaphore counts available empty slots in the buffer initially.",
    inputType: "number",
    targetLabel: "Initial value of empty semaphore:",
    correctAnswer: "8",
    explanation: "Initially, all 8 slots in the bounded buffer are empty, so `empty = 8`."
  },

  "deadlocks": {
    title: "Banker's Algorithm Need Matrix Calculation",
    instructions: "Process P2 has Max request array `[7, 5, 3]` and currently holds Allocation array `[3, 0, 2]`. Calculate the **Need** array value for resource type R1 (first index).",
    hint: "Need = Max - Allocation. Need[R1] = Max[R1] - Allocation[R1].",
    inputType: "number",
    targetLabel: "Need[R1] value:",
    correctAnswer: "4",
    explanation: "Need[R1] = 7 - 3 = 4."
  },

  "memory-management": {
    title: "Best Fit Memory Block Selector",
    instructions: "Free memory partition holes in RAM are: `[100KB, 500KB, 200KB, 300KB, 600KB]`. Process P1 requests **212KB**. Which hole size (in KB) will **Best Fit** allocate to P1?",
    hint: "Best Fit selects the smallest hole that is >= 212KB.",
    inputType: "number",
    targetLabel: "Allocated hole size (KB):",
    correctAnswer: "300",
    explanation: "The holes >= 212KB are 500KB, 300KB, and 600KB. Best Fit selects 300KB as it is the smallest valid hole."
  },

  "paging": {
    title: "Logical to Physical Address Translation",
    instructions: "Given Page Size = 1024 bytes (1 KB). The CPU generates Logical Address = **3080**. Calculate the **Page Number ($p$)**.",
    hint: "Page Number = Math.floor(Logical Address / Page Size) = floor(3080 / 1024).",
    inputType: "number",
    targetLabel: "Page Number (p):",
    correctAnswer: "3",
    explanation: "3080 / 1024 = 3 with remainder 8. So Page Number p = 3 (and Offset d = 8)."
  },

  "page-replacement": {
    title: "FIFO Page Fault Tally",
    instructions: "A system with 3 physical frames receives reference string: `1, 2, 3, 4, 1, 2`. How many total **Page Faults** occur using **FIFO** replacement?",
    hint: "Frames init empty. 1 (fault [1]), 2 (fault [1,2]), 3 (fault [1,2,3]), 4 (fault [4,2,3]), 1 (fault [4,1,3]), 2 (fault [4,1,2]).",
    inputType: "number",
    targetLabel: "Total Page Faults:",
    correctAnswer: "6",
    explanation: "Every single page request in string 1, 2, 3, 4, 1, 2 causes a page fault under FIFO, totaling 6 faults!"
  },

  "disk-scheduling": {
    title: "SSTF Head Movement Distance",
    instructions: "Disk head starts at track **50**. Pending request queue is `[40, 70]`. Calculate total track head movement distance using **SSTF**.",
    hint: "From 50, SSTF visits track 40 first (dist |50-40| = 10). Then moves from 40 to 70 (dist |40-70| = 30). Total = 10 + 30.",
    inputType: "number",
    targetLabel: "Total Track Movements:",
    correctAnswer: "40",
    explanation: "|50 - 40| = 10, then |40 - 70| = 30. Total seek distance = 10 + 30 = 40 tracks."
  },

  "file-systems": {
    title: "Direct Inode Capacity Calculation",
    instructions: "An Inode has 12 Direct Block Pointers. Block size is **4 KB (4096 bytes)**. What is the maximum file size (in KB) achievable using **only** Direct Block Pointers?",
    hint: "12 direct pointers * 4 KB per block.",
    inputType: "number",
    targetLabel: "Max Direct File Size (KB):",
    correctAnswer: "48",
    explanation: "12 pointers * 4 KB = 48 KB total capacity."
  }
};
