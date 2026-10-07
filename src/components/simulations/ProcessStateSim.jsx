import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, ArrowRight } from 'lucide-react';

const STATES = ['New', 'Ready', 'Running', 'Waiting', 'Terminated'];

export default function ProcessStateSim({ onInteract }) {
  const [processes, setProcesses] = useState([
    { id: 'P1', state: 'Ready', priority: 1, burst: 5 },
    { id: 'P2', state: 'Running', priority: 2, burst: 3 },
    { id: 'P3', state: 'Waiting', priority: 3, burst: 4 },
  ]);
  const [nextPid, setNextPid] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per tick
  const [log, setLog] = useState(["Simulation initialized."]);

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev.slice(0, 15)]);
  };

  const addProcess = () => {
    const pid = `P${nextPid}`;
    setNextPid(n => n + 1);
    const newProc = { id: pid, state: 'New', priority: Math.floor(Math.random() * 5) + 1, burst: Math.floor(Math.random() * 8) + 2 };
    setProcesses(prev => [...prev, newProc]);
    addLog(`Created process ${pid} in NEW state.`);
    if (onInteract) onInteract();
  };

  const stepSimulation = () => {
    setProcesses(prev => {
      let runningProc = prev.find(p => p.state === 'Running');
      let readyProcs = prev.filter(p => p.state === 'Ready');
      let waitingProcs = prev.filter(p => p.state === 'Waiting');
      let newProcs = prev.filter(p => p.state === 'New');

      return prev.map(p => {
        // Move New -> Ready
        if (p.state === 'New') {
          addLog(`${p.id} moved from NEW -> READY.`);
          return { ...p, state: 'Ready' };
        }
        // Handle Running process burst decrement / termination / waiting
        if (p.state === 'Running') {
          const newBurst = p.burst - 1;
          if (newBurst <= 0) {
            addLog(`${p.id} finished execution -> TERMINATED.`);
            return { ...p, state: 'Terminated', burst: 0 };
          }
          // Randomly trigger I/O waiting (20% chance)
          if (Math.random() < 0.25) {
            addLog(`${p.id} requested I/O -> WAITING.`);
            return { ...p, state: 'Waiting', burst: newBurst };
          }
          return { ...p, burst: newBurst };
        }
        // Waiting -> Ready completion (40% chance)
        if (p.state === 'Waiting') {
          if (Math.random() < 0.5) {
            addLog(`${p.id} completed I/O event -> READY.`);
            return { ...p, state: 'Ready' };
          }
        }
        // If no running process, pick one from Ready
        if (!runningProc && readyProcs.length > 0 && p.id === readyProcs[0].id) {
          addLog(`${p.id} dispatched from READY -> RUNNING.`);
          return { ...p, state: 'Running' };
        }
        return p;
      });
    });
    if (onInteract) onInteract();
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(stepSimulation, speed);
    }
    return () => clearInterval(timer);
  }, [isRunning, speed]);

  const moveProcess = (id, targetState) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, state: targetState } : p));
    addLog(`Manually moved ${id} to ${targetState}.`);
    if (onInteract) onInteract();
  };

  const removeProcess = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    addLog(`Removed process ${id}.`);
  };

  const reset = () => {
    setIsRunning(false);
    setProcesses([
      { id: 'P1', state: 'Ready', priority: 1, burst: 5 },
      { id: 'P2', state: 'Running', priority: 2, burst: 3 },
      { id: 'P3', state: 'Waiting', priority: 3, burst: 4 },
    ]);
    setLog(["Simulation reset."]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play</>}
          </button>
          <button
            onClick={stepSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition font-medium"
          >
            <ArrowRight size={18}/> Step
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition font-medium"
          >
            <RotateCcw size={18}/> Reset
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span>Speed:</span>
            <input
              type="range"
              min="500"
              max="3000"
              step="250"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-28 accent-blue-500"
            />
            <span className="font-mono text-xs text-blue-400">{speed}ms</span>
          </div>
          <button
            onClick={addProcess}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition"
          >
            <Plus size={16}/> Add Process
          </button>
        </div>
      </div>

      {/* Visual State Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {STATES.map(state => {
          const stateProcs = processes.filter(p => p.state === state);
          const stateColors = {
            New: 'border-slate-700 bg-slate-900/40 text-slate-400',
            Ready: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
            Running: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400 glow-emerald',
            Waiting: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
            Terminated: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
          };

          return (
            <div key={state} className={`border rounded-xl p-3 flex flex-col min-h-[280px] ${stateColors[state]}`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-semibold text-sm">
                <span>{state}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono">
                  {stateProcs.length}
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {stateProcs.map(proc => (
                  <div key={proc.id} className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1 shadow-md">
                    <div className="flex items-center justify-between font-mono font-bold text-slate-200">
                      <span>{proc.id}</span>
                      <button onClick={() => removeProcess(proc.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 size={12}/>
                      </button>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Burst: {proc.burst}s</span>
                      <span>Prio: {proc.priority}</span>
                    </div>

                    {/* Quick Move State Select */}
                    <select
                      value={proc.state}
                      onChange={(e) => moveProcess(proc.id, e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-1 py-0.5"
                    >
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
                {stateProcs.length === 0 && (
                  <div className="text-center text-slate-600 text-xs py-8 italic">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Event Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs">
        <div className="text-slate-400 font-semibold mb-2 flex justify-between items-center">
          <span>OS Event Logger:</span>
          <span className="text-slate-500 text-[11px]">{log.length} entries</span>
        </div>
        <div className="h-28 overflow-y-auto space-y-1 pr-2">
          {log.map((entry, idx) => (
            <div key={idx} className="text-slate-300 border-l-2 border-blue-500/50 pl-2 py-0.5">
              <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
