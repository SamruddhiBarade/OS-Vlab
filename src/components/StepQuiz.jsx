import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import confetti from 'canvas-confetti';

export default function StepQuiz({ moduleData, onComplete }) {
  const { setQuizScore, progress } = useProgress();
  const questions = moduleData.quiz;

  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  const savedScore = progress[moduleData.id]?.quizScore || 0;
  const isAlreadyDone = progress[moduleData.id]?.quiz || false;

  const handleSelect = (questionId, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setScorePercent(score);
    setIsSubmitted(true);

    // Save to context
    setQuizScore(moduleData.id, score);
    if (onComplete) onComplete();

    if (score === 100) {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScorePercent(0);
  };

  const isAllAnswered = questions.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle size={22} className="text-purple-400" /> Module Knowledge Verification Quiz
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Answer all {questions.length} questions to assess your understanding and complete this step.
          </p>
        </div>

        {isAlreadyDone && !isSubmitted && (
          <div className="bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl font-mono text-xs text-purple-300">
            Previous Best Score: <span className="font-bold text-purple-400">{savedScore}%</span>
          </div>
        )}
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selectedOption = userAnswers[q.id];

          return (
            <div key={q.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <h4 className="font-semibold text-slate-200 text-sm">{q.question}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";

                  if (selectedOption === optIdx) {
                    btnStyle = "bg-purple-950/60 border-purple-500 text-purple-300 font-semibold";
                  }

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold glow-emerald";
                    } else if (selectedOption === optIdx) {
                      btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300 font-semibold";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && optIdx === q.correctIndex && <CheckCircle2 size={16} className="text-emerald-400 shrink-0"/>}
                      {isSubmitted && selectedOption === optIdx && optIdx !== q.correctIndex && <XCircle size={16} className="text-rose-400 shrink-0"/>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {isSubmitted && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 font-sans leading-relaxed">
                  <span className="font-bold text-slate-300 block mb-1">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission / Results Footer */}
      {!isSubmitted ? (
        <button
          onClick={calculateResults}
          disabled={!isAllAnswered}
          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
        >
          Submit Quiz Answers <ArrowRight size={18}/>
        </button>
      ) : (
        <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
            <Award size={32} />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-100 font-mono">Quiz Completed!</h4>
            <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">{scorePercent}% Score</div>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {scorePercent >= 80 ? "Outstanding mastery! You have demonstrated excellent comprehension." : "Good effort! Review the detailed explanations above and retry to score 100%."}
          </p>

          <button
            onClick={resetQuiz}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition inline-flex items-center gap-2"
          >
            <RotateCcw size={16}/> Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
