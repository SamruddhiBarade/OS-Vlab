import React from 'react';
import { Cpu, Award, RotateCcw, Menu } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function Navbar({ onToggleSidebar, onOpenAchievements }) {
  const { getOverallProgressPercent, unlockedAchievements, resetAllProgress, setCurrentModuleId } = useProgress();
  const overallPercent = getOverallProgressPercent();

  return (
    <header className="h-16 border-b border-violet-200 bg-[#fffaf5]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-violet-600 hover:text-violet-700 hover:bg-violet-100 md:hidden transition"
        >
          <Menu size={20} />
        </button>

        <div
          onClick={() => setCurrentModuleId(null)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-violet-300/50 group-hover:scale-105 transition-transform">
            <Cpu size={20} />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-violet-900 flex items-center gap-1.5">
              OS Virtual Lab <span className="text-[10px] font-mono font-bold bg-violet-100 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded">v2.0</span>
            </span>
            <span className="text-[10px] text-violet-600 hidden sm:block">Interactive Operating Systems Platform</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden lg:flex items-center gap-3 bg-white border border-violet-200 px-3.5 py-1.5 rounded-full shadow-sm">
          <div className="text-xs font-mono text-violet-700 font-semibold">
            Lab Progress: <span className="text-violet-800">{overallPercent}%</span>
          </div>
          <div className="w-24 bg-violet-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 via-pink-500 to-yellow-400 h-full transition-all duration-500" style={{ width: `${overallPercent}%` }} />
          </div>
        </div>

        <button
          onClick={onOpenAchievements}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 border border-violet-200 hover:border-violet-300 text-violet-700 text-xs font-semibold transition hover:shadow-md"
        >
          <Award size={16} className="text-violet-600" />
          <span>Achievements ({unlockedAchievements.length})</span>
        </button>

        <button
          onClick={resetAllProgress}
          className="p-2 rounded-xl text-violet-600 hover:text-violet-800 hover:bg-violet-100 transition"
          title="Reset lab progress"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
