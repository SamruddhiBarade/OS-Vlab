import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULES_DATA, ACHIEVEMENTS } from '../data/modulesData';
import confetti from 'canvas-confetti';

const ProgressContext = createContext();

const STORAGE_KEY = 'os_virtual_lab_progress_v2';
const ACHIEVEMENTS_KEY = 'os_virtual_lab_achievements_v2';

const createInitialProgress = () => {
  const init = {};
  MODULES_DATA.forEach((m) => {
    init[m.id] = {
      learn: false,
      animation: false,
      task: false,
      terminal: false,
      quiz: false,
      completed: false,
      quizScore: 0,
    };
  });
  return init;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return createInitialProgress();
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [executedCommandsCount, setExecutedCommandsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unlockAchievement = (id) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements((prev) => [...prev, id]);
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        showToast(`🏆 Achievement Unlocked: ${ach.title}!`);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
        } catch (e) {}
      }
    }
  };

  const markStepComplete = (moduleId, stepName) => {
    setProgress((prev) => {
      const mod = prev[moduleId] || {
        learn: false,
        animation: false,
        task: false,
        terminal: false,
        quiz: false,
        completed: false,
        quizScore: 0,
      };

      const updatedMod = { ...mod, [stepName]: true };
      const isAllDone = updatedMod.learn && updatedMod.animation && updatedMod.task && updatedMod.terminal && updatedMod.quiz;
      updatedMod.completed = isAllDone;

      const newProgress = { ...prev, [moduleId]: updatedMod };

      const completedCount = Object.values(newProgress).filter((m) => m && m.completed).length;
      if (completedCount >= 1) unlockAchievement('first_module');
      if (completedCount >= 5) unlockAchievement('halfway');
      if (completedCount >= 10) unlockAchievement('master');

      return newProgress;
    });
  };

  const setQuizScore = (moduleId, score) => {
    setProgress((prev) => {
      const mod = prev[moduleId] || {};
      const updatedMod = { ...mod, quiz: true, quizScore: score };
      const isAllDone = updatedMod.learn && updatedMod.animation && updatedMod.task && updatedMod.terminal && updatedMod.quiz;
      updatedMod.completed = isAllDone;

      if (score === 100) {
        unlockAchievement('quiz_ace');
      }

      return { ...prev, [moduleId]: updatedMod };
    });
  };

  const incrementTerminalCommands = () => {
    setExecutedCommandsCount((prev) => {
      const next = prev + 1;
      if (next >= 5) unlockAchievement('terminal_hacker');
      return next;
    });
  };

  const resetAllProgress = () => {
    const init = createInitialProgress();
    setProgress(init);
    setUnlockedAchievements([]);
    setCurrentModuleId(null);
    setCurrentStep(1);
    showToast('Progress has been reset!');
  };

  const getModuleProgressPercent = (moduleId) => {
    const m = progress[moduleId];
    if (!m) return 0;
    const steps = [m.learn, m.animation, m.task, m.terminal, m.quiz];
    const done = steps.filter(Boolean).length;
    return Math.round((done / 5) * 100);
  };

  const getOverallProgressPercent = () => {
    const totalModules = MODULES_DATA.length;
    if (totalModules === 0) return 0;
    const totalPercentage = MODULES_DATA.reduce((acc, m) => acc + getModuleProgressPercent(m.id), 0);
    return Math.round(totalPercentage / totalModules);
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      currentModuleId,
      setCurrentModuleId,
      currentStep,
      setCurrentStep,
      markStepComplete,
      setQuizScore,
      resetAllProgress,
      getModuleProgressPercent,
      getOverallProgressPercent,
      unlockedAchievements,
      incrementTerminalCommands,
      executedCommandsCount,
      toastMessage,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
