import React, { useState } from 'react';
import { Plus, RotateCcw, Box, Database, Trash2 } from 'lucide-react';

export default function MemoryManagementSim({ onInteract }) {
  const [strategy, setStrategy] = useState('first'); // 'first' | 'best' | 'worst'
  const [requestSize, setRequestSize] = useState(150);

  const [memoryBlocks, setMemoryBlocks] = useState([
    { id: 'B1', size: 100, free: 100, process: null },
    { id: 'B2', size: 500, free: 500, process: null },
    { id: 'B3', size: 200, free: 200, process: null },
    { id: 'B4', size: 300, free: 300, process: null },
    { id: 'B5', size: 600, free: 600, process: null },
  ]);

  const [nextPid, setNextPid] = useState(1);
  const [log, setLog] = useState(["Memory blocks initialized: 100KB, 500KB, 200KB, 300KB, 600KB."]);

  const addLog = (msg) => setLog(prev => [msg, ...prev.slice(0, 10)]);

  const allocateMemory = () => {
    const pid = `P${nextPid}`;
    let chosenIndex = -1;

    if (strategy === 'first') {
      chosenIndex = memoryBlocks.findIndex(b => b.process === null && b.size >= requestSize);
    } else if (strategy === 'best') {
      let minDiff = Infinity;
      memoryBlocks.forEach((b, idx) => {
        if (b.process === null && b.size >= requestSize) {
          let diff = b.size - requestSize;
          if (diff < minDiff) {
            minDiff = diff;
            chosenIndex = idx;
          }
        }
      });
    } else if (strategy === 'worst') {
      let maxDiff = -1;
      memoryBlocks.forEach((b, idx) => {
        if (b.process === null && b.size >= requestSize) {
          let diff = b.size - requestSize;
          if (diff > maxDiff) {
            maxDiff = diff;
            chosenIndex = idx;
          }
        }
      });
    }

    if (chosenIndex !== -1) {
      setMemoryBlocks(prev => prev.map((b, idx) => {
        if (idx === chosenIndex) {
          return { ...b, process: pid, allocatedSize: requestSize, free: b.size - requestSize };
        }
        return b;
      }));
      setNextPid(n => n + 1);
      addLog(`✅ Allocated ${pid} (${requestSize}KB) into Block ${memoryBlocks[chosenIndex].id} (${memoryBlocks[chosenIndex].size}KB) using ${strategy.toUpperCase()}-FIT strategy.`);
    } else {
      addLog(`❌ Allocation FAILED for ${pid} (${requestSize}KB)! External Fragmentation (No continuous block big enough).`);
    }

    if (onInteract) onInteract();
  };

  const freeBlock = (id) => {
    setMemoryBlocks(prev => prev.map(b => b.id === id ? { ...b, process: null, allocatedSize: 0, free: b.size } : b));
    addLog(`Freed Block ${id}.`);
    if (onInteract) onInteract();
  };

  const reset = () => {
    setMemoryBlocks([
      { id: 'B1', size: 100, free: 100, process: null },
      { id: 'B2', size: 500, free: 500, process: null },
      { id: 'B3', size: 200, free: 200, process: null },
      { id: 'B4', size: 300, free: 300, process: null },
      { id: 'B5', size: 600, free: 600, process: null },
    ]);
    setNextPid(1);
    setLog(["Memory reset."]);
  };

  return (
    <div className="space-y-6">
      {/* Control Configuration Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold font-mono">Strategy:</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-rose-400 font-semibold text-xs px-3 py-1.5 rounded-lg"
            >
              <option value="first">First-Fit</option>
              <option value="best">Best-Fit</option>
              <option value="worst">Worst-Fit</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Process Size:</label>
            <input
              type="number"
              min="10"
              max="600"
              step="10"
              value={requestSize}
              onChange={(e) => setRequestSize(Number(e.target.value))}
              className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono text-slate-200 text-xs"
            />
            <span className="text-xs text-slate-500 font-mono">KB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={allocateMemory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition"
          >
            <Plus size={16}/> Allocate Process P{nextPid}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            <RotateCcw size={16}/> Reset Memory
          </button>
        </div>
      </div>

      {/* Memory Blocks Visual Grid */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-semibold text-slate-300 font-mono flex items-center gap-2">
          <Database size={18} className="text-rose-400"/> Physical Memory Partition Map
        </h4>

        <div className="space-y-3">
          {memoryBlocks.map(block => {
            const usedPct = block.process ? Math.round((block.allocatedSize / block.size) * 100) : 0;
            return (
              <div key={block.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center gap-4">
                <div className="w-24 font-mono text-xs font-bold text-slate-300">
                  {block.id} ({block.size}KB)
                </div>

                <div className="flex-1 bg-slate-800 h-10 rounded-lg overflow-hidden relative flex items-center border border-slate-700">
                  {block.process ? (
                    <>
                      <div
                        style={{ width: `${usedPct}%` }}
                        className="bg-rose-600/80 border-r border-rose-400 h-full flex items-center justify-center font-mono text-xs text-white font-bold"
                      >
                        {block.process} ({block.allocatedSize}KB)
                      </div>
                      <div className="flex-1 bg-slate-900/60 h-full flex items-center justify-center font-mono text-[11px] text-slate-500 italic">
                        Internal Frag: {block.free}KB
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center font-mono text-xs text-emerald-400 font-medium">
                      FREE ({block.size}KB available)
                    </div>
                  )}
                </div>

                {block.process && (
                  <button
                    onClick={() => freeBlock(block.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                    title="Free block"
                  >
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs">
        <div className="text-slate-400 font-semibold mb-2">Memory Allocation Console:</div>
        <div className="h-28 overflow-y-auto space-y-1">
          {log.map((line, idx) => (
            <div key={idx} className="text-slate-300 border-l-2 border-rose-500/40 pl-2">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
