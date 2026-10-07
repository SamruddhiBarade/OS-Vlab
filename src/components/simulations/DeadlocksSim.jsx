import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

export default function DeadlocksSim({ onInteract }) {
  const [mode, setMode] = useState('rag'); // 'rag' | 'banker'

  // Banker's State
  const [allocation, setAllocation] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ]);
  const [max, setMax] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ]);
  const [available, setAvailable] = useState([3, 3, 2]);
  const [result, setResult] = useState(null);

  // RAG Cycle State
  const [ragEdges, setRagEdges] = useState([
    { from: 'P1', to: 'R1', type: 'request' },
    { from: 'R1', to: 'P2', type: 'assignment' },
    { from: 'P2', to: 'R2', type: 'request' },
    { from: 'R2', to: 'P1', type: 'assignment' } // Cycle P1 -> R1 -> P2 -> R2 -> P1
  ]);

  const runBankersAlgorithm = () => {
    let n = allocation.length; // processes
    let m = available.length; // resources

    let need = [];
    for (let i = 0; i < n; i++) {
      let row = [];
      for (let j = 0; j < m; j++) {
        row.push(max[i][j] - allocation[i][j]);
      }
      need.push(row);
    }

    let work = [...available];
    let finish = new Array(n).fill(false);
    let safeSeq = [];

    let count = 0;
    while (count < n) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          let canAllocate = true;
          for (let j = 0; j < m; j++) {
            if (need[i][j] > work[j]) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            for (let j = 0; j < m; j++) {
              work[j] += allocation[i][j];
            }
            safeSeq.push(`P${i}`);
            finish[i] = true;
            found = true;
            count++;
          }
        }
      }

      if (!found) break;
    }

    if (count === n) {
      setResult({ isSafe: true, seq: safeSeq.join(' → ') });
    } else {
      setResult({ isSafe: false, seq: null });
    }

    if (onInteract) onInteract();
  };

  const toggleRagCycle = () => {
    // Toggle between cycle and no-cycle
    if (ragEdges.length === 4) {
      // Remove edge R2 -> P1 to break cycle
      setRagEdges([
        { from: 'P1', to: 'R1', type: 'request' },
        { from: 'R1', to: 'P2', type: 'assignment' },
        { from: 'P2', to: 'R2', type: 'request' }
      ]);
    } else {
      setRagEdges([
        { from: 'P1', to: 'R1', type: 'request' },
        { from: 'R1', to: 'P2', type: 'assignment' },
        { from: 'P2', to: 'R2', type: 'request' },
        { from: 'R2', to: 'P1', type: 'assignment' }
      ]);
    }
    if (onInteract) onInteract();
  };

  const hasCycle = ragEdges.length === 4;

  return (
    <div className="space-y-6">
      {/* Tab select */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setMode('rag')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            mode === 'rag' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Resource Allocation Graph (RAG) Cycle Detector
        </button>
        <button
          onClick={() => setMode('banker')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            mode === 'banker' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Banker's Algorithm (Safe State Checker)
        </button>
      </div>

      {mode === 'rag' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleRagCycle}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition"
              >
                {hasCycle ? "Break Graph Cycle" : "Inject Deadlock Cycle"}
              </button>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold ${
              hasCycle ? 'bg-rose-950/40 border-rose-500/50 text-rose-400' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
            }`}>
              {hasCycle ? <><AlertTriangle size={18}/> DEADLOCK DETECTED (Cycle P1 → R1 → P2 → R2 → P1)</> : <><ShieldCheck size={18}/> SYSTEM SAFE (No Cycle)</>}
            </div>
          </div>

          {/* Visual Graph Representation */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl flex items-center justify-center min-h-[260px]">
            <div className="grid grid-cols-2 gap-16 relative items-center text-center">
              {/* Processes */}
              <div className="space-y-12">
                <div className="w-20 h-20 rounded-full border-2 border-blue-500 bg-blue-950/30 flex items-center justify-center font-bold text-blue-400 font-mono shadow-lg mx-auto">
                  P1
                </div>
                <div className="w-20 h-20 rounded-full border-2 border-purple-500 bg-purple-950/30 flex items-center justify-center font-bold text-purple-400 font-mono shadow-lg mx-auto">
                  P2
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-12">
                <div className="w-20 h-20 rounded-xl border-2 border-emerald-500 bg-emerald-950/30 flex items-center justify-center font-bold text-emerald-400 font-mono shadow-lg mx-auto">
                  R1
                </div>
                <div className="w-20 h-20 rounded-xl border-2 border-amber-500 bg-amber-950/30 flex items-center justify-center font-bold text-amber-400 font-mono shadow-lg mx-auto">
                  R2
                </div>
              </div>
            </div>
          </div>

          {/* Edges List */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs">
            <div className="text-slate-400 font-semibold mb-2">Active Graph Edges:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ragEdges.map((e, idx) => (
                <div key={idx} className="bg-slate-800/80 p-2 rounded border border-slate-700 flex justify-between">
                  <span className="text-slate-300">{e.from} → {e.to}</span>
                  <span className={e.type === 'request' ? 'text-amber-400' : 'text-emerald-400'}>
                    {e.type === 'request' ? 'Request Edge' : 'Assignment Edge'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'banker' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300 font-mono font-semibold">Available Resources [A, B, C]:</span>
              {available.map((val, idx) => (
                <input
                  key={idx}
                  type="number"
                  min="0"
                  value={val}
                  onChange={(e) => {
                    const newAvail = [...available];
                    newAvail[idx] = Number(e.target.value);
                    setAvailable(newAvail);
                  }}
                  className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono text-blue-400 font-bold"
                />
              ))}
            </div>

            <button
              onClick={runBankersAlgorithm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition"
            >
              <CheckCircle size={18}/> Check System Safety
            </button>
          </div>

          {/* Result Alert */}
          {result && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 font-mono text-sm ${
              result.isSafe ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              {result.isSafe ? (
                <>
                  <ShieldCheck size={24} className="text-emerald-400"/>
                  <div>
                    <div className="font-bold">SYSTEM IS IN A SAFE STATE!</div>
                    <div className="text-xs text-slate-400 mt-1">Safe Execution Sequence: <span className="text-emerald-400">{result.seq}</span></div>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={24} className="text-rose-400"/>
                  <div>
                    <div className="font-bold">UNSAFE STATE DETECTED!</div>
                    <div className="text-xs text-slate-400 mt-1">No safe execution sequence exists for current resource requests.</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Allocation & Max Matrix view */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="p-3 bg-slate-950 font-mono font-semibold text-slate-300 border-b border-slate-800">
              System Resource Allocation & Max Claims Matrix
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2 text-left">Process</th>
                    <th className="pb-2">Allocation [A, B, C]</th>
                    <th className="pb-2">Max [A, B, C]</th>
                    <th className="pb-2">Need [A, B, C]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {allocation.map((allocRow, i) => {
                    const maxRow = max[i];
                    const needRow = maxRow.map((mVal, j) => mVal - allocRow[j]);
                    return (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="py-2 text-left font-bold text-amber-400">P{i}</td>
                        <td className="py-2 text-blue-400">[{allocRow.join(', ')}]</td>
                        <td className="py-2 text-slate-300">[{maxRow.join(', ')}]</td>
                        <td className="py-2 text-rose-400 font-bold">[{needRow.join(', ')}]</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
