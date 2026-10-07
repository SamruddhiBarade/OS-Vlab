import React, { useState } from 'react';
import { Layers, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';

export default function PagingSim({ onInteract }) {
  const PAGE_SIZE = 1024; // 1KB
  const [logicalAddr, setLogicalAddr] = useState(2448);
  const [tlbEnabled, setTlbEnabled] = useState(true);
  const [translationResult, setTranslationResult] = useState(null);

  // Page Table Mappings: Page# -> Frame#
  const [pageTable] = useState([
    { page: 0, frame: 3, valid: true },
    { page: 1, frame: 7, valid: true },
    { page: 2, frame: 5, valid: true },
    { page: 3, frame: 1, valid: true },
    { page: 4, frame: 8, valid: true },
  ]);

  // TLB Cache Entries (max 2 entries)
  const [tlbEntries, setTlbEntries] = useState([
    { page: 1, frame: 7 },
    { page: 2, frame: 5 }
  ]);

  const translateAddress = () => {
    const pageNum = Math.floor(logicalAddr / PAGE_SIZE);
    const offset = logicalAddr % PAGE_SIZE;

    // Check TLB hit
    const tlbHit = tlbEnabled && tlbEntries.some(e => e.page === pageNum);
    let frameNum = null;

    if (tlbHit) {
      const entry = tlbEntries.find(e => e.page === pageNum);
      frameNum = entry.frame;
    } else {
      // Page table lookup
      const entry = pageTable.find(e => e.page === pageNum);
      if (entry && entry.valid) {
        frameNum = entry.frame;
        // Update TLB cache with new entry
        setTlbEntries(prev => [{ page: pageNum, frame: frameNum }, prev[0]]);
      }
    }

    if (frameNum !== null) {
      const physAddr = (frameNum * PAGE_SIZE) + offset;
      setTranslationResult({
        success: true,
        pageNum,
        offset,
        frameNum,
        physAddr,
        tlbHit
      });
    } else {
      setTranslationResult({
        success: false,
        pageNum,
        offset,
        reason: "PAGE FAULT! Page not present in physical RAM."
      });
    }

    if (onInteract) onInteract();
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Logical Address:</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={logicalAddr}
              onChange={(e) => setLogicalAddr(Number(e.target.value))}
              className="w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono text-indigo-400 font-bold text-xs"
            />
            <span className="text-xs text-slate-500 font-mono">bytes</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 font-mono cursor-pointer">
            <input
              type="checkbox"
              checked={tlbEnabled}
              onChange={(e) => setTlbEnabled(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            Enable Hardware TLB Cache
          </label>
        </div>

        <button
          onClick={translateAddress}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
        >
          <Zap size={16}/> Translate Address
        </button>
      </div>

      {/* Translation Result Card */}
      {translationResult && (
        <div className={`p-4 rounded-xl border font-mono text-xs ${
          translationResult.success ? 'bg-indigo-950/40 border-indigo-500/40 text-slate-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          {translationResult.success ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                <span className="font-bold flex items-center gap-2 text-indigo-400">
                  <CheckCircle2 size={16}/> Address Translation Successful
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  translationResult.tlbHit ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {translationResult.tlbHit ? '⚡ TLB HIT (Fast Cache Match)' : '🐢 TLB MISS (Page Table Lookup)'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Page Number (p)</div>
                  <div className="text-indigo-400 font-bold text-sm mt-0.5">{translationResult.pageNum}</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Page Offset (d)</div>
                  <div className="text-slate-300 font-bold text-sm mt-0.5">{translationResult.offset}</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Frame Number (f)</div>
                  <div className="text-purple-400 font-bold text-sm mt-0.5">{translationResult.frameNum}</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Physical Address</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{(translationResult.frameNum * 1024) + translationResult.offset}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-rose-400"/>
              <span>{translationResult.reason}</span>
            </div>
          )}
        </div>
      )}

      {/* Visual Component Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TLB Hardware Cache Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="p-3 bg-slate-950 font-mono font-semibold text-slate-300 border-b border-slate-800 flex justify-between">
            <span>Hardware TLB Cache (Fast Lookup)</span>
            <span className="text-indigo-400 font-normal">Capacity: 2 Entries</span>
          </div>
          <div className="p-3">
            <table className="w-full text-center">
              <thead className="text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="pb-1">Page #</th>
                  <th className="pb-1">Frame #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {tlbEntries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 text-indigo-400 font-bold">{e.page}</td>
                    <td className="py-2 text-purple-400 font-bold">{e.frame}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="p-3 bg-slate-950 font-mono font-semibold text-slate-300 border-b border-slate-800">
            Main Memory Page Table (MMU)
          </div>
          <div className="p-3">
            <table className="w-full text-center">
              <thead className="text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="pb-1">Logical Page</th>
                  <th className="pb-1">Physical Frame</th>
                  <th className="pb-1">Valid Bit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {pageTable.map((row) => (
                  <tr key={row.page} className="hover:bg-slate-800/40">
                    <td className="py-2 text-indigo-400 font-bold">{row.page}</td>
                    <td className="py-2 text-purple-400 font-bold">{row.frame}</td>
                    <td className="py-2 text-emerald-400 font-bold">1 (Valid)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
