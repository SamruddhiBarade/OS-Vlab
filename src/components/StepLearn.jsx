import React from 'react';
import { BookOpen, Lightbulb, HelpCircle, CheckCircle, Info } from 'lucide-react';

export default function StepLearn({ moduleData }) {
  const { learn } = moduleData;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <BookOpen size={22} className="text-blue-400" />
          <h3 className="text-lg font-bold text-slate-100">Theoretical Overview & Foundations</h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
          {learn.overview}
        </p>
      </div>

      {/* Real World Analogy */}
      {learn.realWorldAnalogy && (
        <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
            <Lightbulb size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300 text-sm">Real-World Analogy</h4>
            <p className="text-amber-200/80 text-xs leading-relaxed">
              {learn.realWorldAnalogy}
            </p>
          </div>
        </div>
      )}

      {/* Key Terms Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
          <Info size={18} className="text-purple-400" /> Essential Key Concepts & Definitions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learn.keyTerms.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 hover:border-slate-700 transition"
            >
              <div className="font-mono font-bold text-sm text-blue-400">{item.term}</div>
              <p className="text-slate-400 text-xs leading-normal">{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
