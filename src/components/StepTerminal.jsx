import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, Trash2, HelpCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function StepTerminal({ moduleId, onComplete }) {
  const { incrementTerminalCommands } = useProgress();
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([
    { type: 'sys', text: 'Antigravity OS Terminal Simulator v2.4' },
    { type: 'sys', text: 'Type "help" to view all available interactive commands.' }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isProcessing]);

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    // Add user command entry
    setHistory(prev => [...prev, { type: 'user', text: `$ ${trimmed}` }]);
    setInputVal('');
    setIsProcessing(true);
    incrementTerminalCommands();

    setTimeout(() => {
      let responseLines = [];

      switch (trimmed) {
        case 'help':
          responseLines = [
            'Available Virtual OS Commands:',
            '  help              - Display this command reference menu',
            '  cpu schedule      - Simulate CPU Scheduling (FCFS / SJF / RR)',
            '  memory            - Execute dynamic memory allocation test',
            '  disk              - Simulate disk head seek movement (SCAN / SSTF)',
            '  deadlock          - Run Banker\'s safe state verification check',
            '  paging            - Translate logical page address to physical frame',
            '  sync              - Run producer-consumer bounded buffer thread test',
            '  ps                - List active system processes',
            '  status            - Display module completion status',
            '  clear             - Clear terminal log output'
          ];
          break;
        case 'cpu schedule':
        case 'cpu':
          responseLines = [
            '[CPU Scheduler Simulator]',
            'Scheduling 4 processes: P1 (burst:6), P2 (burst:4), P3 (burst:8), P4 (burst:3)...',
            'Gantt Chart: | P1 (0-6ms) | P2 (6-10ms) | P4 (10-13ms) | P3 (13-21ms) |',
            'Average Waiting Time: 7.25 ms',
            'Average Turnaround Time: 12.50 ms'
          ];
          break;
        case 'memory':
          responseLines = [
            '[Memory Manager Subsystem]',
            'Allocating process P1 (150KB) using Best-Fit algorithm...',
            'Checked holes: 100KB (Too small), 500KB (Diff: 350KB), 300KB (Diff: 150KB - BEST MATCH!)',
            'Allocated P1 at Physical Memory Block B4 [300KB partition]. Internal Frag: 150KB.'
          ];
          break;
        case 'disk':
          responseLines = [
            '[Disk Controller I/O Subsystem]',
            'Head Position: Cylinder 50',
            'Queue: 82 -> 170 -> 43',
            'Algorithm: SSTF (Shortest Seek Time First)',
            'Seek Path: 50 -> 43 -> 82 -> 170',
            'Total Seek Distance: 134 Cylinders.'
          ];
          break;
        case 'deadlock':
          responseLines = [
            '[Banker\'s Deadlock Engine]',
            'Evaluating System Matrix Claims...',
            'Need Matrix calculated: Max - Allocation.',
            'Executing Safety Algorithm: P1 -> P3 -> P4 -> P0 -> P2',
            'Result: SAFE STATE DETECTED. No deadlock risk.'
          ];
          break;
        case 'paging':
          responseLines = [
            '[MMU Address Translator]',
            'Input Address: 2448 bytes (Logical)',
            'Page Size: 1024 bytes (1KB)',
            'Page Number (p) = 2, Offset (d) = 400',
            'Page Table Lookup: Page 2 maps to Frame 5',
            'Physical Address = (5 * 1024) + 400 = 5520 bytes.',
            'TLB Cache Status: HIT (Fast match)'
          ];
          break;
        case 'sync':
          responseLines = [
            '[Process Synchronization Kernel]',
            'Mutex Semaphore: 1 (UNLOCKED)',
            'Producer produced Item-#1 -> Enqueued in Bounded Buffer Slot 0',
            'Full Semaphore: 1, Empty Semaphore: 4',
            'Consumer consumed Item-#1 -> Dequeued from Bounded Buffer Slot 0'
          ];
          break;
        case 'ps':
          responseLines = [
            'PID   TTY      TIME     CMD',
            '101   tty1     00:00:01 init',
            '204   tty1     00:00:04 os_kernel',
            '312   pts/0    00:00:00 bash',
            '580   pts/0    00:00:02 lab_simulator'
          ];
          break;
        case 'status':
          responseLines = [
            `Module ID: ${moduleId}`,
            'CLI Verification: COMPLETE',
            'Terminal Step Status: Verified'
          ];
          break;
        case 'clear':
          setHistory([]);
          setIsProcessing(false);
          return;
        default:
          responseLines = [
            `zsh: command not found: ${trimmed}`,
            'Type "help" to view valid OS commands.'
          ];
      }

      setHistory(prev => [
        ...prev,
        ...responseLines.map(line => ({ type: 'output', text: line }))
      ]);
      setIsProcessing(false);

      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Terminal Window Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Title bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-400 font-semibold ml-2 flex items-center gap-2">
              <TerminalIcon size={14} className="text-blue-400"/> simulated-os-shell ~ zsh
            </span>
          </div>

          <button
            onClick={() => setHistory([])}
            className="text-slate-500 hover:text-slate-300 transition"
            title="Clear terminal"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Console Content */}
        <div className="p-4 h-80 overflow-y-auto space-y-2 text-slate-300">
          {history.map((item, idx) => {
            if (item.type === 'user') {
              return <div key={idx} className="text-blue-400 font-bold">{item.text}</div>;
            }
            if (item.type === 'sys') {
              return <div key={idx} className="text-slate-500 italic">{item.text}</div>;
            }
            return <div key={idx} className="text-emerald-400/90 pl-2 border-l border-emerald-500/30">{item.text}</div>;
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-amber-400 font-mono italic text-[11px] animate-pulse">
              <Sparkles size={12}/> Processing OS Command System Call...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input prompt line */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleCommand(inputVal); }}
          className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex items-center gap-2"
        >
          <span className="text-blue-400 font-bold">$</span>
          <input
            type="text"
            value={inputVal}
            disabled={isProcessing}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'cpu schedule', 'memory', 'disk', 'deadlock'..."
            className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-600 font-mono text-xs"
          />
          <button type="submit" className="text-slate-500 hover:text-blue-400 transition">
            <CornerDownLeft size={16}/>
          </button>
        </form>
      </div>

      {/* Suggested Quick Commands */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="text-slate-500 py-1">Quick Try:</span>
        {['help', 'cpu schedule', 'memory', 'disk', 'deadlock', 'paging', 'sync'].map(cmd => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
