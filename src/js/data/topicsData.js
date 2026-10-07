// Metadata for all 10 OS Virtual Lab Modules
export const TOPICS = [
  {
    id: "process-management",
    num: 1,
    title: "Process Management",
    shortDesc: "PCB structure, state transitions (Ready/Running/Wait), context switching, fork/exec.",
    icon: "⚡",
    category: "Core OS",
    estimatedMinutes: 20
  },
  {
    id: "cpu-scheduling",
    num: 2,
    title: "CPU Scheduling",
    shortDesc: "FCFS, SJF, Round Robin, Priority algorithms with live Gantt chart visualizer.",
    icon: "📊",
    category: "Scheduling",
    estimatedMinutes: 25
  },
  {
    id: "threads",
    num: 3,
    title: "Threads & Concurrency",
    shortDesc: "User vs Kernel threads, multithreading models, thread pools, and race conditions.",
    icon: "🔀",
    category: "Concurrency",
    estimatedMinutes: 20
  },
  {
    id: "process-synchronization",
    num: 4,
    title: "Process Synchronization",
    shortDesc: "Mutex locks, Semaphores, Producer-Consumer buffer, Dining Philosophers table.",
    icon: "🔒",
    category: "Synchronization",
    estimatedMinutes: 30
  },
  {
    id: "deadlocks",
    num: 5,
    title: "Deadlocks",
    shortDesc: "4 Conditions, Resource Allocation Graphs (RAG), Banker's Algorithm safety matrix.",
    icon: "⚠️",
    category: "Synchronization",
    estimatedMinutes: 30
  },
  {
    id: "memory-management",
    num: 6,
    title: "Memory Management",
    shortDesc: "Contiguous allocation, First Fit, Best Fit, Worst Fit, internal & external fragmentation.",
    icon: "💾",
    category: "Memory",
    estimatedMinutes: 25
  },
  {
    id: "paging",
    num: 7,
    title: "Paging & Virtual Memory",
    shortDesc: "Logical to Physical address translation, Page tables, TLB lookups, frame mapping.",
    icon: "📄",
    category: "Memory",
    estimatedMinutes: 25
  },
  {
    id: "page-replacement",
    num: 8,
    title: "Page Replacement",
    shortDesc: "FIFO, LRU, Optimal page fault step-by-step matrix & Belady's anomaly.",
    icon: "🔄",
    category: "Memory",
    estimatedMinutes: 25
  },
  {
    id: "disk-scheduling",
    num: 9,
    title: "Disk Scheduling",
    shortDesc: "FCFS, SSTF, SCAN, C-SCAN head movement platter visualizer & total seek distance.",
    icon: "💽",
    category: "Storage",
    estimatedMinutes: 25
  },
  {
    id: "file-systems",
    num: 10,
    title: "File Systems",
    shortDesc: "Directory tree explorer, Inodes, FAT allocation table, and block pointer mapping.",
    icon: "📁",
    category: "Storage",
    estimatedMinutes: 20
  }
];

export const STEP_NAMES = ["Learn", "Animation", "Task", "Terminal", "Quiz", "Completed"];
