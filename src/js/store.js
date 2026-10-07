// State & LocalStorage Manager with Strict Completion Rules
const STORAGE_KEY = "os_virtulab_state_v2";

class Store {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }

    return {
      activeTopicId: null,
      activeStepIndex: 0,
      theme: "light",
      soundEnabled: true,
      userName: "Student",
      userProgress: {},
      unlockedBadges: [],
      xp: 0,
      hasGraduated: false
    };
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getTopicProgress(topicId) {
    if (!this.state.userProgress[topicId]) {
      this.state.userProgress[topicId] = {
        stepsCompleted: [], // Only contains step indices (0, 1, 2, 3, 4) strictly completed by actual performance!
        taskSolved: false,
        quizScore: 0,
        completed: false
      };
    }
    return this.state.userProgress[topicId];
  }

  // Strictly mark step completed ONLY upon real user performance
  markStepCompleted(topicId, stepIndex, xpGain = 50) {
    const prog = this.getTopicProgress(topicId);
    if (!prog.stepsCompleted.includes(stepIndex)) {
      prog.stepsCompleted.push(stepIndex);
      this.state.xp += xpGain;
    }

    // Module is completed ONLY if all 5 steps (0, 1, 2, 3, 4) are completed!
    if (prog.stepsCompleted.length >= 5) {
      prog.completed = true;
    }

    this.saveState();
  }

  setQuizScore(topicId, scorePercentage) {
    const prog = this.getTopicProgress(topicId);
    prog.quizScore = Math.max(prog.quizScore || 0, scorePercentage);
    if (scorePercentage >= 60) {
      this.markStepCompleted(topicId, 4, 100); // Step 4: Quiz
    }
    this.saveState();
  }

  calculateOverallProgress(topicsCount = 10) {
    let totalSteps = topicsCount * 5;
    let completedStepsCount = 0;

    Object.keys(this.state.userProgress).forEach(tid => {
      completedStepsCount += (this.state.userProgress[tid].stepsCompleted || []).length;
    });

    return Math.min(100, Math.round((completedStepsCount / totalSteps) * 100));
  }

  checkAllModulesCompleted(topicsCount = 10) {
    let completedCount = 0;
    Object.keys(this.state.userProgress).forEach(tid => {
      const prog = this.state.userProgress[tid];
      if (prog && prog.completed && (prog.stepsCompleted || []).length >= 5) {
        completedCount++;
      }
    });

    return completedCount >= topicsCount;
  }
}

export const store = new Store();
