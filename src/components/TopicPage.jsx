import React, { useEffect } from 'react';
import { MODULES_DATA } from '../data/modulesData';
import { useProgress } from '../context/ProgressContext';
import StepLearn from './StepLearn';
import StepAnimation from './StepAnimation';
import StepTask from './StepTask';
import StepTerminal from './StepTerminal';
import StepQuiz from './StepQuiz';
import { BookOpen, PlayCircle, Target, Terminal, HelpCircle, CheckCircle2, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'learn', label: 'Step 1: Learn', icon: BookOpen },
  { id: 2, name: 'animation', label: 'Step 2: Animation', icon: PlayCircle },
  { id: 3, name: 'task', label: 'Step 3: Task', icon: Target },
  { id: 4, name: 'terminal', label: 'Step 4: CLI Shell', icon: Terminal },
  { id: 5, name: 'quiz', label: 'Step 5: Quiz', icon: HelpCircle },
];

export default function TopicPage() {
  const { currentModuleId, setCurrentModuleId, currentStep, setCurrentStep, markStepComplete, progress, getModuleProgressPercent } = useProgress();

  const moduleData = MODULES_DATA.find(m => m.id === currentModuleId);
  const modProgress = progress[currentModuleId] || {};
  const pct = getModuleProgressPercent(currentModuleId);

  // Automatically mark 'learn' step complete upon viewing step 1
  useEffect(() => {
    if (currentModuleId && currentStep === 1) {
      markStepComplete(currentModuleId, 'learn');
    }
  }, [currentModuleId, currentStep]);

  if (!moduleData) return <div>Module not found</div>;

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Mark step complete when advancing
      const stepName = STEPS.find(s => s.id === currentStep)?.name;
      if (stepName) markStepComplete(currentModuleId, stepName);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Return to Dashboard */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentModuleId(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">{moduleData.category}</span>
          <span className="text-xs text-slate-700">•</span>
          <span className="text-xs font-mono font-bold text-blue-400">{pct}% Completed</span>
        </div>
      </div>

      {/* Module Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{moduleData.title}</h1>
            <p className="text-slate-400 text-xs mt-1">{moduleData.shortDesc}</p>
          </div>

          {modProgress.completed && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 size={16} /> Module Completed!
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Timeline Navigation Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl overflow-x-auto">
        <div className="flex items-center min-w-[650px] justify-between">
          {STEPS.map((step) => {
            const IconComp = step.icon;
            const isStepDone = modProgress[step.name];
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : isStepDone
                    ? 'text-emerald-400 hover:bg-slate-800'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <IconComp size={16} />
                <span>{step.label}</span>
                {isStepDone && !isCurrent && <CheckCircle2 size={14} className="text-emerald-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Content Component */}
      <div className="min-h-[400px]">
        {currentStep === 1 && <StepLearn moduleData={moduleData} />}
        {currentStep === 2 && (
          <StepAnimation
            moduleId={moduleData.id}
            onInteract={() => markStepComplete(moduleData.id, 'animation')}
          />
        )}
        {currentStep === 3 && (
          <StepTask
            moduleData={moduleData}
            onComplete={() => markStepComplete(moduleData.id, 'task')}
          />
        )}
        {currentStep === 4 && (
          <StepTerminal
            moduleId={moduleData.id}
            onComplete={() => markStepComplete(moduleData.id, 'terminal')}
          />
        )}
        {currentStep === 5 && (
          <StepQuiz
            moduleData={moduleData}
            onComplete={() => markStepComplete(moduleData.id, 'quiz')}
          />
        )}
      </div>

      {/* Step Navigation Controls (Back / Next) */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold transition"
        >
          <ChevronLeft size={18} /> Previous Step
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === 5}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-lg"
        >
          Next Step <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
