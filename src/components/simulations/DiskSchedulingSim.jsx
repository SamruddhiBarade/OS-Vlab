import React, { useState } from 'react';
import { Play, RotateCcw, HardDrive, Compass } from 'lucide-react';

export default function DiskSchedulingSim({ onInteract }) {
  const [algo, setAlgo] = useState('FCFS'); // FCFS, SSTF, SCAN, C-SCAN, LOOK
  const [headPos, setHeadPos] = useState(50);
  const [direction, setDirection] = useState('right'); // 'left' | 'right'
  const [diskSize, setDiskSize] = useState(200); // cylinders 0-199
  const [queueInput, setQueueInput] = useState('82, 170, 43, 140, 24, 16, 190');

  const [sequence, setSequence] = useState([]);
  const [totalSeek, setTotalSeek] = useState(0);

  const parseQueue = () => {
    return queueInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < diskSize);
  };

  const calculateDiskSchedule = () => {
    const queue = parseQueue();
    let current = headPos;
    let seq = [current];
    let total = 0;

    if (algo === 'FCFS') {
      queue.forEach(q => {
        total += Math.abs(q - current);
        current = q;
        seq.push(current);
      });
    } else if (algo === 'SSTF') {
      let reqs = [...queue];
      while (reqs.length > 0) {
        let minDiff = Infinity;
        let minIdx = -1;
        reqs.forEach((r, idx) => {
          let diff = Math.abs(r - current);
          if (diff < minDiff) {
            minDiff = diff;
            minIdx = idx;
          }
        });
        let target = reqs[minIdx];
        total += Math.abs(target - current);
        current = target;
        seq.push(current);
        reqs.splice(minIdx, 1);
      }
    } else if (algo === 'SCAN') {
      let reqs = [...queue];
      reqs.sort((a, b) => a - b);
      let left = reqs.filter(r => r < current);
      let right = reqs.filter(r => r >= current);

      if (direction === 'right') {
        right.forEach(r => {
          total += Math.abs(r - current);
          current = r;
          seq.push(current);
        });
        // Move to end of disk boundary
        if (diskSize - 1 > current) {
          total += Math.abs((diskSize - 1) - current);
          current = diskSize - 1;
          seq.push(current);
        }
        // Reverse direction
        left.reverse().forEach(l => {
          total += Math.abs(l - current);
          current = l;
          seq.push(current);
        });
      } else {
        left.reverse().forEach(l => {
          total += Math.abs(l - current);
          current = l;
          seq.push(current);
        });
        if (current > 0) {
          total += Math.abs(0 - current);
          current = 0;
          seq.push(current);
        }
        right.forEach(r => {
          total += Math.abs(r - current);
          current = r;
          seq.push(current);
        });
      }
    } else if (algo === 'C-SCAN') {
      let reqs = [...queue];
      reqs.sort((a, b) => a - b);
      let left = reqs.filter(r => r < current);
      let right = reqs.filter(r => r >= current);

      right.forEach(r => {
        total += Math.abs(r - current);
        current = r;
        seq.push(current);
      });
      // Move to disk end boundary
      if (diskSize - 1 > current) {
        total += Math.abs((diskSize - 1) - current);
        current = diskSize - 1;
        seq.push(current);
      }
      // Jump to 0 boundary
      total += (diskSize - 1);
      current = 0;
      seq.push(current);

      left.forEach(l => {
        total += Math.abs(l - current);
        current = l;
        seq.push(current);
      });
    } else if (algo === 'LOOK') {
      let reqs = [...queue];
      reqs.sort((a, b) => a - b);
      let left = reqs.filter(r => r < current);
      let right = reqs.filter(r => r >= current);

      if (direction === 'right') {
        right.forEach(r => {
          total += Math.abs(r - current);
          current = r;
          seq.push(current);
        });
        left.reverse().forEach(l => {
          total += Math.abs(l - current);
          current = l;
          seq.push(current);
        });
      } else {
        left.reverse().forEach(l => {
          total += Math.abs(l - current);
          current = l;
          seq.push(current);
        });
        right.forEach(r => {
          total += Math.abs(r - current);
          current = r;
          seq.push(current);
        });
      }
    }

    setSequence(seq);
    setTotalSeek(total);

    if (onInteract) onInteract();
  };

  const reset = () => {
    setSequence([]);
    setTotalSeek(0);
  };

  return (
    <div className="space-y-6">
      {/* Control Configuration Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Algorithm:</label>
            <select
              value={algo}
              onChange={(e) => { setAlgo(e.target.value); reset(); }}
              className="bg-slate-800 border border-slate-700 text-sky-400 font-semibold text-xs px-3 py-1.5 rounded-lg"
            >
              <option value="FCFS">FCFS (First-Come First-Served)</option>
              <option value="SSTF">SSTF (Shortest Seek Time First)</option>
              <option value="SCAN">SCAN (Elevator Algorithm)</option>
              <option value="C-SCAN">C-SCAN (Circular SCAN)</option>
              <option value="LOOK">LOOK Algorithm</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Head Start Pos:</label>
            <input
              type="number"
              min="0"
              max={diskSize - 1}
              value={headPos}
              onChange={(e) => { setHeadPos(Number(e.target.value)); reset(); }}
              className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono text-sky-400 font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Cylinder Queue:</label>
            <input
              type="text"
              value={queueInput}
              onChange={(e) => { setQueueInput(e.target.value); reset(); }}
              className="w-52 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={calculateDiskSchedule}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition"
          >
            <Play size={16}/> Calculate Seek Path
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            <RotateCcw size={16}/> Reset
          </button>
        </div>
      </div>

      {/* Seek Stats */}
      {sequence.length > 0 && (
        <div className="bg-slate-900 border border-sky-500/30 p-4 rounded-xl flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Total Cylinder Seek Distance</span>
            <span className="text-2xl font-bold text-sky-400">{totalSeek} Cylinders</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">Head Seek Traversal Path</span>
            <span className="text-slate-200 font-bold text-xs">{sequence.join(' → ')}</span>
          </div>
        </div>
      )}

      {/* Visual Cylinder Track Graph */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-300 font-mono flex items-center gap-2">
            <HardDrive size={18} className="text-sky-400"/> Disk Platter Track Traversal (0 to 199 Cylinders)
          </h4>
          <span className="text-xs text-slate-500 font-mono">Head Start: {headPos}</span>
        </div>

        {/* Cylinder Track Ruler */}
        <div className="relative border-b-2 border-slate-700 h-10 flex items-center">
          <span className="absolute left-0 -top-4 text-[10px] font-mono text-slate-500">0</span>
          <span className="absolute right-0 -top-4 text-[10px] font-mono text-slate-500">199</span>

          {/* Requested Points */}
          {parseQueue().map((cyl, idx) => (
            <div
              key={idx}
              style={{ left: `${(cyl / 199) * 100}%` }}
              className="absolute -bottom-2 w-2 h-4 bg-sky-500/60 border border-sky-400 rounded-sm"
              title={`Cylinder ${cyl}`}
            />
          ))}

          {/* Initial Head Position Marker */}
          <div
            style={{ left: `${(headPos / 199) * 100}%` }}
            className="absolute -top-3 w-4 h-8 bg-amber-500 rounded flex items-center justify-center text-[9px] font-bold text-slate-950 shadow-md"
            title={`Start Head ${headPos}`}
          >
            H
          </div>
        </div>
      </div>
    </div>
  );
}
