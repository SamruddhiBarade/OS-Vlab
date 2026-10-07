import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TopicPage from './components/TopicPage';
import AchievementsModal from './components/AchievementsModal';
import { Sparkles, Medal } from 'lucide-react';
import { MODULES_DATA } from './data/modulesData';

function MainContent() {
  const { currentModuleId, toastMessage, progress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const allCompleted = MODULES_DATA.every((m) => progress[m.id]?.completed);

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2d1a38] flex flex-col">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-2xl border border-violet-200/80 flex items-center gap-2 animate-bounce">
          <Sparkles size={16} /> {toastMessage}
        </div>
      )}

      {allCompleted && currentModuleId === null && (
        <div className="fixed inset-0 z-40 bg-[#fffaf5]/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative w-full max-w-2xl rounded-[32px] border-2 border-violet-200 bg-gradient-to-br from-violet-100 via-white to-pink-100 p-8 shadow-[0_30px_80px_rgba(168,85,247,0.22)] text-center">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-violet-500 p-4 shadow-xl text-white">
              <Medal size={30} />
            </div>
            <div className="mt-10 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600">Final Milestone</p>
              <h2 className="text-4xl sm:text-5xl font-black text-[#2d1a38]">🎉 Congratulations!</h2>
              <p className="text-sm sm:text-base text-violet-700/80 max-w-xl mx-auto">
                You have successfully completed all 10 OS Virtual Lab modules and earned the OS Master badge.
              </p>
              <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-left shadow-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-violet-500">Badge</div>
                  <div className="mt-1 text-lg font-black text-violet-700">OS Virtual Lab Master</div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-2 text-xl shadow-lg shadow-violet-300/60">🏅</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAchievements={() => setAchievementsOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          {currentModuleId === null ? (<Dashboard />) : (<TopicPage />)}
        </main>
      </div>

      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <MainContent />
    </ProgressProvider>
  );
}
