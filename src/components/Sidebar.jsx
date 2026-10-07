import React from 'react';
import { MODULES_DATA } from '../data/modulesData';
import { useProgress } from '../context/ProgressContext';
import { 
  LayoutDashboard, Cpu, Clock, GitFork, Lock, AlertTriangle, 
  Database, Layers, RefreshCw, HardDrive, FolderTree, CheckCircle2, ChevronRight, X
} from 'lucide-react';

const ICON_MAP = {
  Cpu, Clock, GitFork, Lock, AlertTriangle, Database, Layers, RefreshCw, HardDrive, FolderTree
};

export default function Sidebar({ isOpen, onClose }) {
  const { currentModuleId, setCurrentModuleId, setCurrentStep, getModuleProgressPercent, progress } = useProgress();

  const handleSelectModule = (id) => {
    setCurrentModuleId(id);
    setCurrentStep(1);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:sticky top-0 md:top-16 left-0 h-screen md:h-[calc(100vh-4rem)] w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Mobile Close Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between md:hidden">
          <span className="font-bold text-sm text-slate-200">OS Virtual Lab Modules</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20}/>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Dashboard Button */}
          <button
            onClick={() => handleSelectModule(null)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              currentModuleId === null
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Main Dashboard</span>
          </button>

          <div className="pt-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 mb-2">
              All 10 OS Modules
            </div>

            <div className="space-y-1">
              {MODULES_DATA.map((m) => {
                const IconComponent = ICON_MAP[m.icon] || Cpu;
                const pct = getModuleProgressPercent(m.id);
                const isCompleted = progress[m.id]?.completed;
                const isActive = currentModuleId === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModule(m.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-slate-800/90 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1.5 rounded-lg border text-slate-200 ${
                        isActive ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <IconComponent size={15} />
                      </div>
                      <span className="truncate">{m.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <span className="font-mono text-[10px] text-slate-500">{pct}%</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
