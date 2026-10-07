import React from 'react';
import { ACHIEVEMENTS } from '../data/modulesData';
import { useProgress } from '../context/ProgressContext';
import { Award, Zap, Crown, CheckCircle, Terminal, X, Lock } from 'lucide-react';

const ICON_MAP = { Award, Zap, Crown, CheckCircle, Terminal };

export default function AchievementsModal({ isOpen, onClose }) {
  const { unlockedAchievements } = useProgress();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
              <Award size={24}/>
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Virtual Lab Achievements</h3>
              <p className="text-slate-400 text-xs">Unlocked {unlockedAchievements.length} of {ACHIEVEMENTS.length} badges</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            const IconComp = ICON_MAP[ach.icon] || Award;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition ${
                  isUnlocked
                    ? 'bg-purple-950/30 border-purple-500/40 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-xl border ${
                  isUnlocked ? 'bg-purple-600/20 border-purple-500/40 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {isUnlocked ? <IconComp size={20}/> : <Lock size={20}/>}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>{ach.title}</h4>
                  <p className="text-xs text-slate-400">{ach.desc}</p>
                </div>
                {isUnlocked && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold">
                    UNLOCKED
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
        >
          Close Achievements
        </button>
      </div>
    </div>
  );
}
