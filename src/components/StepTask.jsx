import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

export default function StepTask({ moduleData, onComplete }) {
  const { task } = moduleData;
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsSubmitted(true);
    if (selectedIdx === task.correctAnswer) {
      if (onComplete) onComplete();
    }
  };

  const isCorrect = selectedIdx === task.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Exercise Card Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Target size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">{task.title}</h3>
            <p className="text-slate-400 text-xs">{task.instructions}</p>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-medium text-slate-200 text-sm">
          {task.question}
        </div>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {task.options.map((opt, idx) => {
          let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";

          if (selectedIdx === idx) {
            btnStyle = "bg-blue-950/60 border-blue-500 text-blue-300 font-semibold";
          }

          if (isSubmitted) {
            if (idx === task.correctAnswer) {
              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold glow-emerald";
            } else if (selectedIdx === idx) {
              btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300 font-semibold";
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              {isSubmitted && idx === task.correctAnswer && <CheckCircle2 size={18} className="text-emerald-400 shrink-0"/>}
              {isSubmitted && selectedIdx === idx && idx !== task.correctAnswer && <XCircle size={18} className="text-rose-400 shrink-0"/>}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIdx === null}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
        >
          Submit Answer <ArrowRight size={18}/>
        </button>
      ) : (
        <div className={`p-5 rounded-2xl border space-y-2 font-mono text-xs ${
          isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
        }`}>
          <div className="font-bold text-sm flex items-center gap-2">
            {isCorrect ? <><CheckCircle2 size={20} className="text-emerald-400"/> Excellent! Task Completed Successfully</> : <><XCircle size={20} className="text-rose-400"/> Incorrect Attempt</>}
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {task.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
