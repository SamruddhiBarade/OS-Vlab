import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Lock, ArrowRight, Package, Box } from 'lucide-react';

export default function ProcessSyncSim({ onInteract }) {
  const BUFFER_SIZE = 5;
  const [buffer, setBuffer] = useState([]);
  const [mutex, setMutex] = useState(1); // 1 = unlocked, 0 = locked
  const [empty, setEmpty] = useState(BUFFER_SIZE);
  const [full, setFull] = useState(0);
  const [itemCounter, setItemCounter] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState(["Producer-Consumer Bounded Buffer Initialized (Size = 5)."]);

  const addLog = (msg) => setLog(prev => [msg, ...prev.slice(0, 10)]);

  const produceItem = () => {
    if (empty <= 0) {
      addLog("⚠️ Buffer FULL! Producer is BLOCKED on wait(empty).");
      return;
    }
    if (mutex <= 0) {
      addLog("⚠️ Mutex LOCKED! Producer waiting for mutex lock.");
      return;
    }

    // Acquire mutex & update semaphores
    setMutex(0);
    const item = `Item-#${itemCounter}`;
    setItemCounter(i => i + 1);

    setTimeout(() => {
      setBuffer(prev => [...prev, item]);
      setEmpty(e => e - 1);
      setFull(f => f + 1);
      setMutex(1);
      addLog(`🎁 Producer produced ${item}. (full: ${full + 1}, empty: ${empty - 1})`);
      if (onInteract) onInteract();
    }, 400);
  };

  const consumeItem = () => {
    if (full <= 0) {
      addLog("⚠️ Buffer EMPTY! Consumer is BLOCKED on wait(full).");
      return;
    }
    if (mutex <= 0) {
      addLog("⚠️ Mutex LOCKED! Consumer waiting for mutex lock.");
      return;
    }

    setMutex(0);
    setTimeout(() => {
      setBuffer(prev => {
        const item = prev[0];
        addLog(`🛒 Consumer consumed ${item}. (full: ${full - 1}, empty: ${empty + 1})`);
        return prev.slice(1);
      });
      setFull(f => f - 1);
      setEmpty(e => e + 1);
      setMutex(1);
      if (onInteract) onInteract();
    }, 400);
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (Math.random() < 0.6) {
          produceItem();
        } else {
          consumeItem();
        }
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isRunning, buffer, mutex, empty, full]);

  const reset = () => {
    setIsRunning(false);
    setBuffer([]);
    setMutex(1);
    setEmpty(BUFFER_SIZE);
    setFull(0);
    setItemCounter(1);
    setLog(["Buffer reset."]);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isRunning ? <><Pause size={18}/> Stop Auto-Loop</> : <><Play size={18}/> Auto-Run Simulation</>}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            <RotateCcw size={18}/> Reset
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={produceItem}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium transition"
          >
            <Package size={18}/> Produce Item
          </button>
          <button
            onClick={consumeItem}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium transition"
          >
            <Box size={18}/> Consume Item
          </button>
        </div>
      </div>

      {/* Semaphore States */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">Mutex Semaphore</div>
            <div className={`text-xl font-bold font-mono mt-1 ${mutex === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {mutex === 1 ? '1 (UNLOCKED)' : '0 (LOCKED)'}
            </div>
          </div>
          <Lock size={24} className={mutex === 1 ? 'text-emerald-400' : 'text-rose-400'} />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">Empty Count Semaphore</div>
            <div className="text-xl font-bold font-mono text-blue-400 mt-1">{empty} / {BUFFER_SIZE}</div>
          </div>
          <Package size={24} className="text-blue-400" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">Full Count Semaphore</div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">{full} / {BUFFER_SIZE}</div>
          </div>
          <Box size={24} className="text-purple-400" />
        </div>
      </div>

      {/* Visual Bounded Buffer Slots */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
        <h4 className="text-sm font-semibold text-slate-300 font-mono">Bounded Queue Memory Buffer (Capacity = 5)</h4>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: BUFFER_SIZE }).map((_, idx) => {
            const item = buffer[idx];
            return (
              <div
                key={idx}
                className={`h-24 rounded-xl border flex flex-col items-center justify-center font-mono text-xs transition-all ${
                  item
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 glow-emerald'
                    : 'border-slate-800 bg-slate-950/40 text-slate-600'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1">Slot [{idx}]</div>
                {item ? (
                  <span className="font-bold text-slate-100 bg-emerald-600/40 px-2 py-1 rounded border border-emerald-500/40">
                    {item}
                  </span>
                ) : (
                  <span className="italic">Empty</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs">
        <div className="text-slate-400 font-semibold mb-2">Semaphore Event Console:</div>
        <div className="h-28 overflow-y-auto space-y-1">
          {log.map((line, idx) => (
            <div key={idx} className="text-slate-300 border-l-2 border-emerald-500/40 pl-2">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
