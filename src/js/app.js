// Main SPA Router & Controller with Step Completion Popups & Bottom Next Task Navigation
import { store } from "./store.js";
import { sound } from "./audio.js";
import { TOPICS, STEP_NAMES } from "./data/topicsData.js";
import { LEARN_DATA } from "./data/learnData.js";
import { TASKS_DATA } from "./data/tasksData.js";

import { Sidebar } from "./components/sidebar.js";
import { Dashboard } from "./components/dashboard.js";
import { StepTimeline } from "./components/timeline.js";
import { TerminalCLI } from "./components/terminal.js";
import { QuizRunner } from "./components/quiz.js";
import { AchievementsDrawer } from "./components/achievements.js";
import { GraduationModal } from "./components/graduationModal.js";
import { StepCompleteModal } from "./components/stepCompleteModal.js";

// Interactive Simulation Classes
import { ProcessSimulator } from "./simulations/processSim.js";
import { CpuSchedulerSimulator } from "./simulations/cpuSim.js";
import { ThreadsSimulator } from "./simulations/threadsSim.js";
import { SyncSimulator } from "./simulations/syncSim.js";
import { DeadlockSimulator } from "./simulations/deadlockSim.js";
import { MemorySimulator } from "./simulations/memorySim.js";
import { PagingSimulator } from "./simulations/pagingSim.js";
import { PageReplaceSimulator } from "./simulations/pageReplaceSim.js";
import { DiskSimulator } from "./simulations/diskSim.js";
import { FileSystemSimulator } from "./simulations/fileSystemSim.js";

class App {
  constructor() {
    this.sidebarContainer = document.getElementById("sidebar");
    this.contentArea = document.getElementById("content-area");
    this.modalContainer = document.getElementById("modal-container");

    this.currentRoute = "dashboard";
    this.currentTopicId = null;
    this.currentStepIndex = 0;
    this.activeSimInstance = null;

    this.init();
  }

  init() {
    store.state.theme = "light";
    document.documentElement.setAttribute("data-theme", "light");

    this.sidebar = new Sidebar(this.sidebarContainer, (route) => this.navigate(route));
    this.attachHeaderEvents();
    this.renderRoute();
    this.checkGraduationStatus();
  }

  attachHeaderEvents() {
    const terminalBtn = document.getElementById("btn-open-terminal");
    const achieveBtn = document.getElementById("btn-open-achievements");
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const searchInput = document.getElementById("global-search-input");

    if (terminalBtn) {
      terminalBtn.onclick = () => {
        sound.playClick();
        this.openTerminalModal();
      };
    }

    if (achieveBtn) {
      achieveBtn.onclick = () => {
        sound.playClick();
        this.openAchievementsModal();
      };
    }

    if (mobileBtn) {
      mobileBtn.onclick = () => {
        this.sidebarContainer.classList.toggle("mobile-open");
      };
    }

    if (searchInput) {
      searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase();
        if (this.currentRoute === "dashboard") {
          const cards = document.querySelectorAll(".module-card");
          cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? "flex" : "none";
          });
        }
      };
    }
  }

  navigate(route) {
    if (this.sidebarContainer.classList.contains("mobile-open")) {
      this.sidebarContainer.classList.remove("mobile-open");
    }

    if (route === "dashboard") {
      this.currentRoute = "dashboard";
      this.currentTopicId = null;
      this.currentStepIndex = 0;
    } else if (route.startsWith("topic:")) {
      const topicId = route.split(":")[1];
      this.currentRoute = "topic";
      this.currentTopicId = topicId;
      this.currentStepIndex = store.state.activeStepIndex || 0;
    }

    this.renderRoute();
  }

  renderRoute() {
    if (this.activeSimInstance && typeof this.activeSimInstance.destroy === "function") {
      this.activeSimInstance.destroy();
      this.activeSimInstance = null;
    }

    if (this.currentRoute === "dashboard") {
      new Dashboard(this.contentArea, (topicId) => {
        this.navigate(`topic:${topicId}`);
      });
    } else if (this.currentRoute === "topic") {
      this.renderTopicModuleView();
    }

    this.sidebar.updateProgress();
    this.checkGraduationStatus();
  }

  renderTopicModuleView() {
    const topic = TOPICS.find(t => t.id === this.currentTopicId);
    if (!topic) {
      this.navigate("dashboard");
      return;
    }

    this.contentArea.innerHTML = `
      <div class="module-view-container animate-fade-in">
        <!-- Module Header -->
        <div class="step-header">
          <div class="step-title-group">
            <h2>Module ${topic.num}: ${topic.title}</h2>
            <p>${topic.shortDesc}</p>
          </div>
          <button id="btn-back-dash" class="btn-secondary">← Back to Dashboard</button>
        </div>

        <!-- 5-Step Timeline Header -->
        <div id="module-timeline-container"></div>

        <!-- Dynamic Step Content Body -->
        <div id="step-content-body" style="margin-top:1rem;"></div>

        <!-- Bottom Module Navigation Bar -->
        <div class="module-bottom-nav">
          <button id="btn-prev-task" class="btn-secondary">
            ← Previous Task
          </button>
          <div style="font-size:0.85rem; font-weight:800; color:var(--color-burgundy);">
            ${this.currentStepIndex < 5
              ? `Step ${this.currentStepIndex + 1} of 5: ${STEP_NAMES[this.currentStepIndex] || ''}`
              : `✅ Module Completed!`}
          </div>
          <button id="btn-next-task" class="btn-primary" style="background:linear-gradient(135deg, var(--color-purple), var(--color-pink));">
            ${this.currentStepIndex >= 5 ? '🏠 Back to Dashboard' : 'Next Task ➔'}
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-back-dash").onclick = () => {
      sound.playClick();
      this.navigate("dashboard");
    };

    const prevBtn = document.getElementById("btn-prev-task");
    const nextBtn = document.getElementById("btn-next-task");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentStepIndex > 0) {
          sound.playClick();
          this.timeline.onStepChange(this.currentStepIndex - 1);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentStepIndex < 5) {
          sound.playClick();
          this.timeline.onStepChange(this.currentStepIndex + 1);
        } else {
          sound.playClick();
          this.navigate("dashboard");
        }
      };
    }

    this.timeline = new StepTimeline(
      document.getElementById("module-timeline-container"),
      this.currentTopicId,
      this.currentStepIndex,
      (stepIdx) => {
        this.currentStepIndex = stepIdx;
        store.state.activeStepIndex = stepIdx;
        store.saveState();
        this.renderStepContent();
      }
    );

    this.renderStepContent();
  }

  renderStepContent() {
    const body = document.getElementById("step-content-body");
    if (!body) return;

    if (this.activeSimInstance && typeof this.activeSimInstance.destroy === "function") {
      this.activeSimInstance.destroy();
      this.activeSimInstance = null;
    }

    this.sidebar.updateProgress();

    if (this.currentStepIndex === 0) {
      this.renderLearnStep(body);
    } else if (this.currentStepIndex === 1) {
      this.renderAnimationStep(body);
    } else if (this.currentStepIndex === 2) {
      this.renderTaskStep(body);
    } else if (this.currentStepIndex === 3) {
      this.renderTerminalStep(body);
    } else if (this.currentStepIndex === 4) {
      this.renderQuizStep(body);
    } else if (this.currentStepIndex === 5) {
      this.renderCompletedStep(body);
    }
  }

  renderLearnStep(container) {
    const data = LEARN_DATA[this.currentTopicId] || {};
    const prog = store.getTopicProgress(this.currentTopicId);
    const isDone = (prog.stepsCompleted || []).includes(0);

    container.innerHTML = `
      <div class="learn-grid animate-fade-in">
        <div class="learn-content-card glass-panel">
          <div style="font-size:1.05rem; line-height:1.75; color:var(--text-main);">
            ${data.overview ? data.overview : ''}
          </div>

          ${(data.sections || []).map(sec => `
            <div class="learn-section-block">
              <h3><span>📌</span> ${sec.title}</h3>
              <p style="color:var(--text-muted); font-size:0.95rem; white-space:pre-line;">${sec.content}</p>
            </div>
          `).join("")}

          ${data.diagramSvg ? `
            <div class="diagram-wrapper">
              <div style="font-size:0.8rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.5rem; text-transform:uppercase;">Visual Diagram Architecture</div>
              ${data.diagramSvg}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; border-top:2px solid var(--border-color); padding-top:1rem;">
            <div style="font-size:0.88rem; color:${isDone ? 'var(--accent-emerald)' : 'var(--color-brown)'}; font-weight:800;">
              ${isDone ? '✓ Learn Material Completed (+50 XP)' : '⚠️ Read content to complete Step 1!'}
            </div>
            <button id="btn-next-step" class="btn-primary" style="background:linear-gradient(135deg, var(--color-burgundy), var(--color-purple));">
              ✓ Complete Step 1 & Proceed ➔
            </button>
          </div>
        </div>

        <div class="key-terms-box glass-panel">
          <div style="font-weight:800; font-size:1.05rem; color:var(--color-burgundy); border-bottom:2px solid var(--border-color); padding-bottom:0.5rem; margin-bottom:0.5rem;">
            📖 Key Technical Terms
          </div>
          ${(data.terms || []).map(t => `
            <div class="term-item">
              <div class="term-title">${t.name}</div>
              <div class="term-desc">${t.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    document.getElementById("btn-next-step").onclick = () => {
      sound.playClick();
      store.markStepCompleted(this.currentTopicId, 0, 50);
      this.sidebar.updateProgress();

      // Trigger Task Completed Popup Modal!
      new StepCompleteModal(this.modalContainer, "Learn", () => {
        this.timeline.onStepChange(1);
      });
    };
  }

  renderAnimationStep(container) {
    container.innerHTML = `<div id="sim-mount-point" class="animate-fade-in"></div>`;
    const mount = document.getElementById("sim-mount-point");

    const onSimInteract = () => {
      const prog = store.getTopicProgress(this.currentTopicId);
      const isAlreadyDone = (prog.stepsCompleted || []).includes(1);

      store.markStepCompleted(this.currentTopicId, 1, 50);
      this.sidebar.updateProgress();

      if (!isAlreadyDone) {
        new StepCompleteModal(this.modalContainer, "Animation & Simulation", () => {
          this.timeline.onStepChange(2);
        });
      }
    };

    if (this.currentTopicId === "process-management") {
      this.activeSimInstance = new ProcessSimulator(mount);
    } else if (this.currentTopicId === "cpu-scheduling") {
      this.activeSimInstance = new CpuSchedulerSimulator(mount);
    } else if (this.currentTopicId === "threads") {
      this.activeSimInstance = new ThreadsSimulator(mount);
    } else if (this.currentTopicId === "process-synchronization") {
      this.activeSimInstance = new SyncSimulator(mount);
    } else if (this.currentTopicId === "deadlocks") {
      this.activeSimInstance = new DeadlockSimulator(mount);
    } else if (this.currentTopicId === "memory-management") {
      this.activeSimInstance = new MemorySimulator(mount);
    } else if (this.currentTopicId === "paging") {
      this.activeSimInstance = new PagingSimulator(mount);
    } else if (this.currentTopicId === "page-replacement") {
      this.activeSimInstance = new PageReplaceSimulator(mount);
    } else if (this.currentTopicId === "disk-scheduling") {
      this.activeSimInstance = new DiskSimulator(mount);
    } else if (this.currentTopicId === "file-systems") {
      this.activeSimInstance = new FileSystemSimulator(mount);
    }

    mount.onclick = onSimInteract;
  }

  renderTaskStep(container) {
    const task = TASKS_DATA[this.currentTopicId] || {};
    const prog = store.getTopicProgress(this.currentTopicId);
    const isDone = (prog.stepsCompleted || []).includes(2);

    container.innerHTML = `
      <div class="task-container animate-fade-in">
        <div class="task-problem-card glass-panel">
          <div style="font-size:0.8rem; font-weight:800; color:var(--color-burgundy); text-transform:uppercase;">
            🛠 Hands-on Practice Lab Challenge
          </div>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--color-deep-plum);">${task.title || 'Lab Challenge'}</h3>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7;">${task.instructions || ''}</p>

          <div style="background:rgba(245,158,11,0.15); border-left:4px solid var(--color-yellow); padding:0.85rem; border-radius:4px; font-size:0.88rem; color:var(--color-deep-plum); margin-top:0.5rem; font-weight:600;">
            💡 <strong>Hint:</strong> ${task.hint || ''}
          </div>
        </div>

        <div class="task-interactive-card glass-panel">
          <div style="font-weight:800; font-size:1.05rem; color:var(--color-deep-plum); display:flex; justify-content:space-between;">
            <span>Submit Lab Answer</span>
            <span style="font-size:0.8rem; color:${isDone ? 'var(--accent-emerald)' : 'var(--color-burgundy)'}; font-weight:800;">
              ${isDone ? '✓ Solved & Verified' : '⚠️ Pending Solution'}
            </span>
          </div>

          <label style="font-size:0.85rem; color:var(--color-brown); font-weight:700;">${task.targetLabel || 'Answer:'}</label>
          <input type="${task.inputType || 'text'}" id="task-user-input" class="task-input-field" placeholder="Enter your computed numerical answer..." autocomplete="off"/>

          <button id="task-submit-btn" class="btn-primary" style="margin-top:0.5rem;">
            ✓ Submit & Validate Answer
          </button>

          <div id="task-feedback" class="task-feedback-box"></div>
        </div>
      </div>
    `;

    const input = document.getElementById("task-user-input");
    const submitBtn = document.getElementById("task-submit-btn");
    const feedback = document.getElementById("task-feedback");

    submitBtn.onclick = () => {
      const userVal = input.value.trim();
      if (userVal === task.correctAnswer) {
        sound.playSuccess();
        this.triggerConfetti();
        feedback.className = "task-feedback-box correct";
        feedback.innerHTML = `🎉 <strong>CORRECT ANSWER!</strong> (+50 XP)<br/>${task.explanation}`;
        
        store.markStepCompleted(this.currentTopicId, 2, 50);
        this.sidebar.updateProgress();

        // Trigger Task Completed Popup Modal!
        new StepCompleteModal(this.modalContainer, "Practice Challenge", () => {
          this.timeline.onStepChange(3);
        });

        this.checkGraduationStatus();
      } else {
        feedback.className = "task-feedback-box incorrect";
        feedback.innerHTML = `❌ Incorrect answer. Try again using the hint above!`;
      }
    };
  }

  renderTerminalStep(container) {
    container.innerHTML = `<div id="term-mount" class="animate-fade-in"></div>`;
    new TerminalCLI(document.getElementById("term-mount"), this.currentTopicId, () => {
      const prog = store.getTopicProgress(this.currentTopicId);
      const isAlreadyDone = (prog.stepsCompleted || []).includes(3);

      store.markStepCompleted(this.currentTopicId, 3, 50);
      this.sidebar.updateProgress();

      if (!isAlreadyDone) {
        new StepCompleteModal(this.modalContainer, "OS Terminal CLI", () => {
          this.timeline.onStepChange(4);
        });
      }

      this.checkGraduationStatus();
    });
  }

  renderQuizStep(container) {
    container.innerHTML = `<div id="quiz-mount" class="animate-fade-in"></div>`;
    new QuizRunner(document.getElementById("quiz-mount"), this.currentTopicId, (scorePct) => {
      const prog = store.getTopicProgress(this.currentTopicId);
      const isAlreadyDone = (prog.stepsCompleted || []).includes(4);
      store.markStepCompleted(this.currentTopicId, 4, 100);
      this.sidebar.updateProgress();
      this.checkGraduationStatus();
      if (!isAlreadyDone) {
        this.timeline.onStepChange(5);
      }
    });
  }

  renderCompletedStep(container) {
    const topic = TOPICS.find(t => t.id === this.currentTopicId);
    container.innerHTML = `
      <div class="animate-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2rem; padding:3rem 1rem; text-align:center;">
        <div style="font-size:5rem; animation:pulse 1.5s infinite;">🎓</div>
        <div>
          <div style="font-size:0.85rem; font-weight:800; color:var(--color-burgundy); text-transform:uppercase; letter-spacing:2px; margin-bottom:0.5rem;">MODULE COMPLETED</div>
          <h2 style="font-size:2.2rem; font-weight:900; color:var(--color-deep-plum); margin-bottom:0.75rem;">
            Congratulations! 🎉
          </h2>
          <p style="font-size:1.1rem; color:var(--color-brown); font-weight:600; max-width:520px;">
            You have successfully completed <strong>Module ${topic ? topic.num : ''}: ${topic ? topic.title : ''}</strong>.<br/>
            All 5 steps — Learn, Animation, Task, Terminal & Quiz — are done!
          </p>
        </div>

        <div style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center;">
          ${['📖 Learn', '🎬 Animation', '🛠 Task', '💻 Terminal', '❓ Quiz'].map(s => `
            <div style="background:linear-gradient(135deg,var(--color-yellow),var(--color-pink)); padding:0.6rem 1.2rem; border-radius:20px; font-weight:800; font-size:0.88rem; color:var(--color-deep-plum);">
              ✅ ${s}
            </div>
          `).join('')}
        </div>

        <button id="btn-goto-dashboard" class="btn-primary" style="background:linear-gradient(135deg,var(--color-burgundy),var(--color-purple)); font-size:1.1rem; padding:1rem 2.5rem; border-radius:30px;">
          🏠 Back to Dashboard
        </button>
      </div>
    `;

    // Auto-show Module Completed popup on arrival
    setTimeout(() => {
      new StepCompleteModal(
        this.modalContainer,
        `Module ${topic ? topic.num + ': ' + topic.title : ''}`,
        () => { this.navigate("dashboard"); },
        true   // isModuleComplete → special celebration popup
      );
    }, 400);

    document.getElementById("btn-goto-dashboard").onclick = () => {
      this.navigate("dashboard");
    };
  }


  checkGraduationStatus() {
    if (store.checkAllModulesCompleted(10) && !store.state.hasGraduated) {
      store.state.hasGraduated = true;
      store.saveState();
      this.triggerConfetti();
      new GraduationModal(this.modalContainer, () => {
        this.modalContainer.innerHTML = "";
      });
    }
  }

  triggerConfetti() {
    const colors = ["#881337", "#7e22ce", "#f59e0b", "#ec4899", "#0284c7", "#78350f"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `-10px`;
      p.style.width = `${Math.random() * 10 + 6}px`;
      p.style.height = `${Math.random() * 10 + 6}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = "50%";
      p.style.zIndex = "9999";
      p.style.pointerEvents = "none";
      p.style.transition = `transform ${Math.random() * 2 + 1}s ease-out, opacity ${Math.random() * 2 + 1}s ease-out`;
      document.body.appendChild(p);

      setTimeout(() => {
        p.style.transform = `translateY(${window.innerHeight + 30}px) rotate(${Math.random() * 360}deg)`;
        p.style.opacity = "0";
      }, 50);

      setTimeout(() => p.remove(), 3000);
    }
  }

  openTerminalModal() {
    this.modalContainer.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
        <div style="width:100%; max-width:800px; position:relative;">
          <button id="modal-term-close" class="btn-icon-toggle" style="position:absolute; right:-15px; top:-15px; z-index:101; background:var(--color-red); color:#fff; border:none;">✕</button>
          <div id="modal-term-mount"></div>
        </div>
      </div>
    `;

    new TerminalCLI(document.getElementById("modal-term-mount"), this.currentTopicId, () => {
      if (this.currentTopicId) {
        store.markStepCompleted(this.currentTopicId, 3, 50);
        this.sidebar.updateProgress();
        this.checkGraduationStatus();
      }
    });

    document.getElementById("modal-term-close").onclick = () => {
      this.modalContainer.innerHTML = "";
    };
  }

  openAchievementsModal() {
    new AchievementsDrawer(this.modalContainer, () => {
      this.modalContainer.innerHTML = "";
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
