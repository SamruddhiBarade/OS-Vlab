import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Lock, Unlock, ShieldAlert } from 'lucide-react';

export default function ThreadsSim({ onInteract }) {
  const [activeTab, setActiveTab] = useState('race'); // 'race' | 'models'
  const [sharedCounter, setSharedCounter] = useState(0);
  const [useLock, setUseLock] = useState(false);
  const [thread1Progress, setThread1Progress] = useState(0);
  const [thread2Progress, setThread2Progress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState([]);

  const runRaceSimulation = () => {
    setIsRunning(true);
    setSharedCounter(0);
    setThread1Progress(0);
    setThread2Progress(0);
    setLog(["Simulation started. Shared variable counter = 0"]);

    let c = 0;
    let t1 = 0;
    let t2 = 0;
    let lockState = false; // false = unlocked, true = locked

    const interval = setInterval(() => {
      let done1 = t1 >= 10;
      let done2 = t2 >= 10;

      if (done1 && done2) {
        clearInterval(interval);
        setIsRunning(false);
        setLog(prev => [`Final Shared Counter = ${c} (Expected: 20)`, ...prev]);
        if (onInteract) onInteract();
        return;
      }

      // Thread 1 step
      if (!done1) {
        if (!useLock || !lockState) {
          if (useLock) lockState = true;
          t1 += 1;
          // Interleaved non-atomic operation simulation
          c += 1;
          setThread1Progress((t1 / 10) * 100);
          setLog(prev => [`Thread 1 incremented counter -> ${c}`, ...prev.slice(0, 10)]);
          if (useLock) lockState = false;
        } else {
          setLog(prev => [`Thread 1 BLOCKED waiting for lock!`, ...prev.slice(0, 10)]);
        }
      }

      // Thread 2 step
      if (!done2) {
        if (!useLock || !lockState) {
          if (useLock) lockState = true;
          t2 += 1;
          c += 1;
          setThread2Progress((t2 / 10) * 100);
          setLog(prev => [`Thread 2 incremented counter -> ${c}`, ...prev.slice(0, 10)]);
          if (useLock) lockState = false;
        } else {
          setLog(prev => [`Thread 2 BLOCKED waiting for lock!`, ...prev.slice(0, 10)]);
        }
      }

      setSharedCounter(c);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('race')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            activeTab === 'race' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Race Condition Visualizer
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            activeTab === 'models' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Threading Models (Many-to-One vs One-to-One)
        </button>
      </div>

      {activeTab === 'race' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={runRaceSimulation}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium transition"
              >
                <Play size={18}/> Start Race Simulation
              </button>

              <button
                onClick={() => setUseLock(!useLock)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition ${
                  useLock
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                }`}
              >
                {useLock ? <><Lock size={18}/> Mutex Lock Enabled</> : <><Unlock size={18}/> Mutex Lock Disabled (Race Condition!)</>}
              </button>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Shared Memory Counter</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{sharedCounter}</span>
            </div>
          </div>

          {/* Concurrent Execution Trackers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thread 1 */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
                <span className="text-blue-400 font-mono">Thread 1 (Loop x10)</span>
                <span className="text-xs text-slate-400">{Math.round(thread1Progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${thread1Progress}%` }} />
              </div>
            </div>

            {/* Thread 2 */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
                <span className="text-purple-400 font-mono">Thread 2 (Loop x10)</span>
                <span className="text-xs text-slate-400">{Math.round(thread2Progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${thread2Progress}%` }} />
              </div>
            </div>
          </div>

          {/* Log Stream */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs">
            <div className="text-slate-400 font-semibold mb-2">Interleaved Execution Timeline:</div>
            <div className="h-32 overflow-y-auto space-y-1">
              {log.map((line, idx) => (
                <div key={idx} className="text-slate-300 border-l-2 border-cyan-500/40 pl-2">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-sm font-bold text-cyan-400">Many-to-One Model</div>
            <p className="text-xs text-slate-400">
              Multiple user-level threads map to a single kernel-level thread. Thread management done in user space.
            </p>
            <div className="border border-slate-800 bg-slate-950 p-3 rounded text-center text-xs space-y-2">
              <div className="flex justify-center gap-2 text-blue-400 font-mono">User: [T1] [T2] [T3]</div>
              <div className="text-slate-600">↓↓↓</div>
              <div className="text-purple-400 font-mono">Kernel: [Single Kernel Thread]</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-sm font-bold text-emerald-400">One-to-One Model</div>
            <p className="text-xs text-slate-400">
              Each user thread maps directly to an independent kernel thread. Supports true parallel multi-core execution.
            </p>
            <div className="border border-slate-800 bg-slate-950 p-3 rounded text-center text-xs space-y-2">
              <div className="flex justify-center gap-2 text-blue-400 font-mono">User: [T1] [T2] [T3]</div>
              <div className="text-slate-600">↓ ↓ ↓</div>
              <div className="flex justify-center gap-2 text-purple-400 font-mono">Kernel: [K1] [K2] [K3]</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-sm font-bold text-amber-400">Many-to-Many Model</div>
            <p className="text-xs text-slate-400">
              Multiplexes many user-level threads to a smaller or equal number of kernel threads.
            </p>
            <div className="border border-slate-800 bg-slate-950 p-3 rounded text-center text-xs space-y-2">
              <div className="flex justify-center gap-2 text-blue-400 font-mono">User: [T1] [T2] [T3] [T4]</div>
              <div className="text-slate-600">↘ ↙ ↘ ↙</div>
              <div className="flex justify-center gap-2 text-purple-400 font-mono">Kernel: [K1] [K2]</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
