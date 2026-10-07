import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function PageReplacementSim({ onInteract }) {
  const [algo, setAlgo] = useState('FIFO'); // FIFO, LRU, Optimal
  const [frameCount, setFrameCount] = useState(3);
  const [refStringInput, setRefStringInput] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3');

  const [stepIndex, setStepIndex] = useState(-1);
  const [framesHistory, setFramesHistory] = useState([]);
  const [faultsHistory, setFaultsHistory] = useState([]);

  const parseRefString = () => {
    return refStringInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const runFullSimulation = () => {
    const refs = parseRefString();
    let frames = new Array(frameCount).fill(null);
    let history = [];
    let faults = [];
    let pageFaultCount = 0;

    if (algo === 'FIFO') {
      let fifoQueue = [];
      refs.forEach(p => {
        let isFault = false;
        if (!frames.includes(p)) {
          isFault = true;
          pageFaultCount++;
          if (fifoQueue.length < frameCount) {
            let emptyIdx = frames.indexOf(null);
            frames[emptyIdx] = p;
            fifoQueue.push(p);
          } else {
            let victim = fifoQueue.shift();
            let idx = frames.indexOf(victim);
            frames[idx] = p;
            fifoQueue.push(p);
          }
        }
        history.push([...frames]);
        faults.push(isFault);
      });
    } else if (algo === 'LRU') {
      let recentUsage = []; // tracks access order
      refs.forEach(p => {
        let isFault = false;
        if (!frames.includes(p)) {
          isFault = true;
          pageFaultCount++;
          let emptyIdx = frames.indexOf(null);
          if (emptyIdx !== -1) {
            frames[emptyIdx] = p;
          } else {
            // Find least recently used page
            let victim = recentUsage[0];
            let idx = frames.indexOf(victim);
            frames[idx] = p;
          }
        }
        // Update recent usage
        recentUsage = recentUsage.filter(item => item !== p);
        recentUsage.push(p);

        history.push([...frames]);
        faults.push(isFault);
      });
    } else if (algo === 'Optimal') {
      refs.forEach((p, currIdx) => {
        let isFault = false;
        if (!frames.includes(p)) {
          isFault = true;
          pageFaultCount++;
          let emptyIdx = frames.indexOf(null);
          if (emptyIdx !== -1) {
            frames[emptyIdx] = p;
          } else {
            // Find page used furthest in future
            let victimIdx = -1;
            let furthest = -1;

            frames.forEach((fPage, fIdx) => {
              let nextUse = refs.slice(currIdx + 1).indexOf(fPage);
              if (nextUse === -1) {
                victimIdx = fIdx;
                furthest = Infinity;
              } else if (nextUse > furthest) {
                furthest = nextUse;
                victimIdx = fIdx;
              }
            });

            frames[victimIdx] = p;
          }
        }
        history.push([...frames]);
        faults.push(isFault);
      });
    }

    setFramesHistory(history);
    setFaultsHistory(faults);
    setStepIndex(refs.length - 1);

    if (onInteract) onInteract();
  };

  const reset = () => {
    setStepIndex(-1);
    setFramesHistory([]);
    setFaultsHistory([]);
  };

  const refs = parseRefString();
  const totalFaults = faultsHistory.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Algorithm:</label>
            <select
              value={algo}
              onChange={(e) => { setAlgo(e.target.value); reset(); }}
              className="bg-slate-800 border border-slate-700 text-teal-400 font-semibold text-xs px-3 py-1.5 rounded-lg"
            >
              <option value="FIFO">FIFO (First-In First-Out)</option>
              <option value="LRU">LRU (Least Recently Used)</option>
              <option value="Optimal">Optimal (OPT / MIN)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Frames:</label>
            <input
              type="number"
              min="2"
              max="5"
              value={frameCount}
              onChange={(e) => { setFrameCount(Math.max(2, Math.min(5, Number(e.target.value)))); reset(); }}
              className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono text-teal-400 font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Reference String:</label>
            <input
              type="text"
              value={refStringInput}
              onChange={(e) => { setRefStringInput(e.target.value); reset(); }}
              className="w-56 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runFullSimulation}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition"
          >
            <Play size={16}/> Run Simulation
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            <RotateCcw size={16}/> Reset
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {framesHistory.length > 0 && (
        <div className="bg-slate-900 border border-teal-500/30 p-4 rounded-xl flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Page Requests</span>
              <span className="text-lg font-bold text-slate-200">{refs.length}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-400 block text-[10px]">Total Page Faults</span>
              <span className="text-lg font-bold text-rose-400">{totalFaults}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-400 block text-[10px]">Fault Ratio</span>
              <span className="text-lg font-bold text-teal-400">{((totalFaults / refs.length) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Frame Matrix Grid */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 overflow-x-auto">
        <h4 className="text-sm font-semibold text-slate-300 font-mono">Step-by-Step Page Frame Execution Grid</h4>

        <div className="min-w-[600px]">
          <div className="grid grid-cols-11 gap-2 text-center font-mono text-xs">
            {/* Header row */}
            <div className="text-slate-500 font-bold p-2 text-left">Req →</div>
            {refs.map((p, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-2 rounded font-bold text-teal-400">
                {p}
              </div>
            ))}

            {/* Frame Rows */}
            {Array.from({ length: frameCount }).map((_, fIdx) => (
              <React.Fragment key={fIdx}>
                <div className="text-slate-500 font-bold p-2 text-left">Frame {fIdx}</div>
                {refs.map((_, rIdx) => {
                  const frameState = framesHistory[rIdx];
                  const val = frameState ? frameState[fIdx] : null;
                  return (
                    <div
                      key={rIdx}
                      className={`p-2 rounded border font-mono font-bold text-xs ${
                        val !== null ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-950 border-slate-900 text-slate-700'
                      }`}
                    >
                      {val !== null ? val : '-'}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Fault Row */}
            <div className="text-slate-500 font-bold p-2 text-left">Status</div>
            {refs.map((_, rIdx) => {
              const isFault = faultsHistory[rIdx];
              return (
                <div
                  key={rIdx}
                  className={`p-1.5 rounded font-mono font-bold text-[10px] uppercase ${
                    isFault ? 'bg-rose-950/60 border border-rose-500/40 text-rose-400' : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isFault ? 'FAULT' : 'HIT'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
