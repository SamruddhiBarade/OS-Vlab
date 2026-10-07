import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, BarChart2 } from 'lucide-react';

export default function CpuSchedulingSim({ onInteract }) {
  const [algo, setAlgo] = useState('FCFS'); // FCFS, SJF, Priority, RR
  const [quantum, setQuantum] = useState(2);
  const [processes, setProcesses] = useState([
    { id: 'P1', arrival: 0, burst: 6, priority: 2 },
    { id: 'P2', arrival: 1, burst: 4, priority: 1 },
    { id: 'P3', arrival: 2, burst: 8, priority: 3 },
    { id: 'P4', arrival: 3, burst: 3, priority: 4 },
  ]);

  const [ganttChart, setGanttChart] = useState([]);
  const [stats, setStats] = useState({ avgWT: 0, avgTAT: 0, details: [] });
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute Gantt Chart and Statistics whenever processes, algo, or quantum changes
  useEffect(() => {
    computeScheduling();
  }, [processes, algo, quantum]);

  const computeScheduling = () => {
    let procs = processes.map(p => ({ ...p, remaining: p.burst }));
    let timeline = [];
    let time = 0;
    let completed = [];

    if (algo === 'FCFS') {
      // Sort by arrival time
      procs.sort((a, b) => a.arrival - b.arrival);
      procs.forEach(p => {
        if (time < p.arrival) {
          timeline.push({ id: 'IDLE', start: time, end: p.arrival });
          time = p.arrival;
        }
        let start = time;
        time += p.burst;
        timeline.push({ id: p.id, start, end: time });
        completed.push({
          id: p.id,
          arrival: p.arrival,
          burst: p.burst,
          completion: time,
          tat: time - p.arrival,
          wt: (time - p.arrival) - p.burst
        });
      });
    } else if (algo === 'SJF') {
      let n = procs.length;
      let count = 0;
      let isCompleted = new Array(n).fill(false);

      while (count < n) {
        let idx = -1;
        let minBurst = 999999;

        for (let i = 0; i < n; i++) {
          if (procs[i].arrival <= time && !isCompleted[i]) {
            if (procs[i].burst < minBurst) {
              minBurst = procs[i].burst;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          let p = procs[idx];
          let start = time;
          time += p.burst;
          timeline.push({ id: p.id, start, end: time });
          completed.push({
            id: p.id,
            arrival: p.arrival,
            burst: p.burst,
            completion: time,
            tat: time - p.arrival,
            wt: (time - p.arrival) - p.burst
          });
          isCompleted[idx] = true;
          count++;
        } else {
          timeline.push({ id: 'IDLE', start: time, end: time + 1 });
          time++;
        }
      }
    } else if (algo === 'Priority') {
      // Non-preemptive priority (lower number = higher priority)
      let n = procs.length;
      let count = 0;
      let isCompleted = new Array(n).fill(false);

      while (count < n) {
        let idx = -1;
        let minPrio = 999999;

        for (let i = 0; i < n; i++) {
          if (procs[i].arrival <= time && !isCompleted[i]) {
            if (procs[i].priority < minPrio) {
              minPrio = procs[i].priority;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          let p = procs[idx];
          let start = time;
          time += p.burst;
          timeline.push({ id: p.id, start, end: time });
          completed.push({
            id: p.id,
            arrival: p.arrival,
            burst: p.burst,
            completion: time,
            tat: time - p.arrival,
            wt: (time - p.arrival) - p.burst
          });
          isCompleted[idx] = true;
          count++;
        } else {
          timeline.push({ id: 'IDLE', start: time, end: time + 1 });
          time++;
        }
      }
    } else if (algo === 'RR') {
      let queue = [];
      let inQueue = new Array(procs.length).fill(false);
      let compTimes = {};
      let remaining = {};
      procs.forEach(p => { remaining[p.id] = p.burst; });

      // Add arrived processes at time 0
      procs.forEach((p, i) => {
        if (p.arrival <= time && !inQueue[i]) {
          queue.push(p.id);
          inQueue[i] = true;
        }
      });

      while (queue.length > 0 || Object.values(remaining).some(r => r > 0)) {
        if (queue.length === 0) {
          time++;
          procs.forEach((p, i) => {
            if (p.arrival <= time && !inQueue[i] && remaining[p.id] > 0) {
              queue.push(p.id);
              inQueue[i] = true;
            }
          });
          continue;
        }

        let currId = queue.shift();
        let execTime = Math.min(quantum, remaining[currId]);
        let start = time;
        time += execTime;
        remaining[currId] -= execTime;
        timeline.push({ id: currId, start, end: time });

        // Add newly arrived processes during execution
        procs.forEach((p, i) => {
          if (p.arrival <= time && !inQueue[i] && remaining[p.id] > 0) {
            queue.push(p.id);
            inQueue[i] = true;
          }
        });

        if (remaining[currId] > 0) {
          queue.push(currId);
        } else {
          compTimes[currId] = time;
        }
      }

      completed = processes.map(p => {
        let comp = compTimes[p.id] || p.arrival + p.burst;
        return {
          id: p.id,
          arrival: p.arrival,
          burst: p.burst,
          completion: comp,
          tat: comp - p.arrival,
          wt: (comp - p.arrival) - p.burst
        };
      });
    }

    const totalWT = completed.reduce((a, b) => a + b.wt, 0);
    const totalTAT = completed.reduce((a, b) => a + b.tat, 0);

    setGanttChart(timeline);
    setStats({
      avgWT: (totalWT / Math.max(1, completed.length)).toFixed(2),
      avgTAT: (totalTAT / Math.max(1, completed.length)).toFixed(2),
      details: completed
    });

    if (onInteract) onInteract();
  };

  const addProcess = () => {
    const nextId = `P${processes.length + 1}`;
    setProcesses(prev => [
      ...prev,
      { id: nextId, arrival: 0, burst: Math.floor(Math.random() * 6) + 2, priority: Math.floor(Math.random() * 5) + 1 }
    ]);
  };

  const removeProcess = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const updateProc = (id, field, value) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, [field]: Number(value) } : p));
  };

  const maxTime = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1].end : 0;

  return (
    <div className="space-y-6">
      {/* Algorithm Config */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-300">Algorithm:</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-blue-400 font-semibold px-3 py-1.5 rounded-lg text-sm"
          >
            <option value="FCFS">First-Come First-Served (FCFS)</option>
            <option value="SJF">Shortest Job First (SJF - Non-Preemptive)</option>
            <option value="Priority">Priority Scheduling (Non-Preemptive)</option>
            <option value="RR">Round Robin (RR)</option>
          </select>

          {algo === 'RR' && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>Time Quantum:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={quantum}
                onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-center text-blue-400 font-mono font-bold"
              />
            </div>
          )}
        </div>

        <button
          onClick={addProcess}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition"
        >
          <Plus size={16}/> Add Process
        </button>
      </div>

      {/* Process Table Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 font-semibold text-sm text-slate-300">
          Process Queue Configuration
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-mono">
              <tr>
                <th className="p-3">Process ID</th>
                <th className="p-3">Arrival Time (ms)</th>
                <th className="p-3">Burst Time (ms)</th>
                {algo === 'Priority' && <th className="p-3">Priority (Lower = Higher)</th>}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {processes.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{p.id}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      value={p.arrival}
                      onChange={(e) => updateProc(p.id, 'arrival', e.target.value)}
                      className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={p.burst}
                      onChange={(e) => updateProc(p.id, 'burst', e.target.value)}
                      className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </td>
                  {algo === 'Priority' && (
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={p.priority}
                        onChange={(e) => updateProc(p.id, 'priority', e.target.value)}
                        className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-amber-400"
                      />
                    </td>
                  )}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeProcess(p.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Gantt Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-400"/> Generated Gantt Chart Timeline
          </h4>
          <span className="text-xs text-slate-400 font-mono">Total Execution: {maxTime}ms</span>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex items-center min-w-[500px]">
            {ganttChart.map((block, idx) => {
              const widthPct = Math.max(6, ((block.end - block.start) / maxTime) * 100);
              const isIdle = block.id === 'IDLE';
              const colors = [
                'bg-blue-600/80 border-blue-400',
                'bg-emerald-600/80 border-emerald-400',
                'bg-purple-600/80 border-purple-400',
                'bg-amber-600/80 border-amber-400',
                'bg-rose-600/80 border-rose-400',
              ];
              const pIndex = parseInt(block.id.replace('P', '')) || 0;
              const colorClass = isIdle ? 'bg-slate-800 border-slate-700 text-slate-500' : colors[pIndex % colors.length];

              return (
                <div
                  key={idx}
                  style={{ width: `${widthPct}%` }}
                  className={`relative border h-14 flex flex-col items-center justify-center font-mono font-bold text-xs text-white shadow-inner transition-all ${colorClass}`}
                >
                  <span>{block.id}</span>
                  <span className="text-[10px] opacity-75">{block.end - block.start}ms</span>

                  {/* Start time label */}
                  {idx === 0 && (
                    <span className="absolute -bottom-6 left-0 text-[11px] font-mono text-slate-400">
                      {block.start}
                    </span>
                  )}
                  {/* End time label */}
                  <span className="absolute -bottom-6 right-0 text-[11px] font-mono text-slate-400">
                    {block.end}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide font-mono">Average Waiting Time</div>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{stats.avgWT} ms</div>
          </div>
          <div className="text-xs text-slate-500 max-w-[150px]">
            Sum(WT) / Total Processes
          </div>
        </div>
        <div className="bg-slate-900/90 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide font-mono">Average Turnaround Time</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{stats.avgTAT} ms</div>
          </div>
          <div className="text-xs text-slate-500 max-w-[150px]">
            Sum(TAT) / Total Processes
          </div>
        </div>
      </div>
    </div>
  );
}
