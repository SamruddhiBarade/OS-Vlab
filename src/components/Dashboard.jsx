import React from 'react';
import { MODULES_DATA } from '../data/modulesData';
import { useProgress } from '../context/ProgressContext';
import { 
  Cpu, Clock, GitFork, Lock, AlertTriangle, Database, 
  Layers, RefreshCw, HardDrive, FolderTree, CheckCircle2, ArrowRight, Award, Zap, BookOpen 
} from 'lucide-react';

const ICON_MAP = {
  Cpu, Clock, GitFork, Lock, AlertTriangle, Database, Layers, RefreshCw, HardDrive, FolderTree
};

export default function Dashboard() {
  const { setCurrentModuleId, setCurrentStep, getModuleProgressPercent, getOverallProgressPercent, progress } = useProgress();

  const overallPercent = getOverallProgressPercent();
  const completedCount = MODULES_DATA.filter(m => progress[m.id]?.completed).length;

  const quizScores = MODULES_DATA.map(m => progress[m.id]?.quizScore || 0).filter(s => s > 0);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  const openModule = (id) => {
    setCurrentModuleId(id);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Overview Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
            <Zap size={14} /> Interactive Educational Platform
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Master Operating System Concepts
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Explore 10 comprehensive OS lab modules. Learn theoretical foundations, step through visual concept animations, complete hands-on student tasks, run simulated terminal CLI commands, and test your knowledge with interactive quizzes.
          </p>

          {/* Stat Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-mono">Overall Progress</div>
              <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">{overallPercent}%</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-mono">Modules Completed</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{completedCount} / 10</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-mono">Quiz Average</div>
              <div className="text-xl font-extrabold text-purple-400 font-mono mt-0.5">{avgQuizScore}%</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <div className="text-xs text-slate-500 font-mono">Total Topics</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">10 Topics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Virtual Lab Modules</h2>
          <p className="text-xs text-slate-400">Select any module to start learning and complete all 5 steps.</p>
        </div>
      </div>

      {/* 10 Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES_DATA.map((module) => {
          const IconComponent = ICON_MAP[module.icon] || Cpu;
          const pct = getModuleProgressPercent(module.id);
          const modState = progress[module.id] || {};
          const isCompleted = modState.completed;
          const quizScore = modState.quizScore || 0;

          return (
            <div
              key={module.id}
              onClick={() => openModule(module.id)}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header icon + category + status badge */}
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${module.color} text-white shadow-md`}>
                    <IconComponent size={22} />
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      <CheckCircle2 size={14}/> Completed
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                      {pct}% Done
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {module.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {module.shortDesc}
                  </p>
                </div>
              </div>

              {/* Progress bar + Quiz Score Tag + Action button */}
              <div className="pt-6 space-y-3">
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-mono">
                    {quizScore > 0 ? `Quiz Score: ${quizScore}%` : `${module.category}`}
                  </span>
                  <span className="font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Open Lab <ArrowRight size={14}/>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
