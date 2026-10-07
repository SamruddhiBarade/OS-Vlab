import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, HardDrive, Database, Layers } from 'lucide-react';

export default function FileSystemsSim({ onInteract }) {
  const [allocationMode, setAllocationMode] = useState('indexed'); // 'contiguous' | 'linked' | 'indexed'
  const [selectedFile, setSelectedFile] = useState('doc.pdf');

  const filesMeta = {
    'doc.pdf': {
      size: '3KB (3 Blocks)',
      contiguous: { start: 2, length: 3, blocks: [2, 3, 4] },
      linked: { start: 2, end: 9, chain: 'Block 2 → Block 7 → Block 9' },
      indexed: { inode: 14, indexBlock: 5, pointers: [2, 7, 9] }
    },
    'photo.png': {
      size: '2KB (2 Blocks)',
      contiguous: { start: 10, length: 2, blocks: [10, 11] },
      linked: { start: 10, end: 14, chain: 'Block 10 → Block 14' },
      indexed: { inode: 22, indexBlock: 1, pointers: [10, 14] }
    }
  };

  const curr = filesMeta[selectedFile];

  return (
    <div className="space-y-6">
      {/* Allocation Mode Select */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-mono font-semibold">Allocation Strategy:</label>
          <select
            value={allocationMode}
            onChange={(e) => {
              setAllocationMode(e.target.value);
              if (onInteract) onInteract();
            }}
            className="bg-slate-800 border border-slate-700 text-violet-400 font-semibold text-xs px-3 py-1.5 rounded-lg"
          >
            <option value="contiguous">Contiguous Allocation</option>
            <option value="linked">Linked List Allocation</option>
            <option value="indexed">Indexed Allocation (Unix Inode)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Select File:</label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              if (onInteract) onInteract();
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-mono"
          >
            <option value="doc.pdf">doc.pdf (3 Blocks)</option>
            <option value="photo.png">photo.png (2 Blocks)</option>
          </select>
        </div>
      </div>

      {/* Directory & File Control Block Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Directory Explorer Tree */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-bold font-mono text-slate-300 flex items-center gap-2">
            <Folder size={16} className="text-amber-400"/> Directory Tree Structure
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Folder size={14} className="text-amber-400"/> /home/user/
            </div>
            <div className="pl-4 space-y-1">
              <div
                onClick={() => setSelectedFile('doc.pdf')}
                className={`flex items-center gap-2 cursor-pointer p-1 rounded transition ${
                  selectedFile === 'doc.pdf' ? 'bg-violet-950/60 text-violet-300 font-bold border border-violet-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={14}/> doc.pdf
              </div>
              <div
                onClick={() => setSelectedFile('photo.png')}
                className={`flex items-center gap-2 cursor-pointer p-1 rounded transition ${
                  selectedFile === 'photo.png' ? 'bg-violet-950/60 text-violet-300 font-bold border border-violet-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={14}/> photo.png
              </div>
            </div>
          </div>
        </div>

        {/* FCB / Inode Metadata */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="text-slate-300 font-bold flex items-center justify-between border-b border-slate-800 pb-2">
            <span>File Control Block (FCB) Metadata</span>
            <span className="text-violet-400">{selectedFile}</span>
          </div>

          {allocationMode === 'contiguous' && (
            <div className="space-y-2 text-slate-300">
              <div>Start Sector Block: <span className="text-violet-400 font-bold">{curr.contiguous.start}</span></div>
              <div>Block Length: <span className="text-emerald-400 font-bold">{curr.contiguous.length}</span></div>
              <div>Physical Sectors Occupied: <span className="text-amber-400 font-bold">[{curr.contiguous.blocks.join(', ')}]</span></div>
            </div>
          )}

          {allocationMode === 'linked' && (
            <div className="space-y-2 text-slate-300">
              <div>Start Block Pointer: <span className="text-violet-400 font-bold">{curr.linked.start}</span></div>
              <div>End Block Pointer: <span className="text-emerald-400 font-bold">{curr.linked.end}</span></div>
              <div>Linked Pointer Path: <span className="text-amber-400 font-bold">{curr.linked.chain}</span></div>
            </div>
          )}

          {allocationMode === 'indexed' && (
            <div className="space-y-2 text-slate-300">
              <div>Inode Identifier #: <span className="text-violet-400 font-bold">{curr.indexed.inode}</span></div>
              <div>Index Block Sector: <span className="text-emerald-400 font-bold">{curr.indexed.indexBlock}</span></div>
              <div>Indexed Direct Pointers: <span className="text-amber-400 font-bold">[{curr.indexed.pointers.join(', ')}]</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Disk Sectors Block Grid */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <h4 className="text-sm font-semibold text-slate-300 font-mono flex items-center gap-2">
          <HardDrive size={18} className="text-violet-400"/> Physical Disk Sector Blocks (Sectors 0 to 15)
        </h4>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono text-xs">
          {Array.from({ length: 16 }).map((_, bIdx) => {
            let isFileBlock = false;
            let isIndexBlock = false;

            if (allocationMode === 'contiguous' && curr.contiguous.blocks.includes(bIdx)) {
              isFileBlock = true;
            } else if (allocationMode === 'linked') {
              if (selectedFile === 'doc.pdf' && [2, 7, 9].includes(bIdx)) isFileBlock = true;
              if (selectedFile === 'photo.png' && [10, 14].includes(bIdx)) isFileBlock = true;
            } else if (allocationMode === 'indexed') {
              if (curr.indexed.indexBlock === bIdx) isIndexBlock = true;
              if (curr.indexed.pointers.includes(bIdx)) isFileBlock = true;
            }

            return (
              <div
                key={bIdx}
                className={`h-16 rounded-lg border p-2 flex flex-col items-center justify-center transition-all ${
                  isIndexBlock
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 glow-purple'
                    : isFileBlock
                    ? 'bg-violet-950/60 border-violet-500 text-violet-300 glow-purple'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <div className="text-[10px] opacity-75">Sec [{bIdx}]</div>
                {isIndexBlock && <span className="text-[10px] font-bold">INDEX</span>}
                {isFileBlock && <span className="text-[10px] font-bold">DATA</span>}
                {!isIndexBlock && !isFileBlock && <span className="text-[10px] italic">Free</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
