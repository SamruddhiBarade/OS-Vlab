// Dashboard View Component
import { TOPICS } from "../data/topicsData.js";
import { store } from "../store.js";
import { sound } from "../audio.js";

export class Dashboard {
  constructor(containerEl, onSelectTopic) {
    this.container = containerEl;
    this.onSelectTopic = onSelectTopic;
    this.render();
  }

  render() {
    const overallPct = store.calculateOverallProgress(TOPICS.length);
    let completedModules = 0;
    TOPICS.forEach(t => {
      if (store.getTopicProgress(t.id).completed) completedModules++;
    });

    this.container.innerHTML = `
      <div class="dashboard-container animate-fade-in">
        <!-- Hero Banner -->
        <div class="hero-card glass-panel">
          <div class="hero-content">
            <h1 class="hero-title">Master Operating Systems with <span>Interactive Visual Simulations</span></h1>
            <p class="hero-description">
              Step into a comprehensive Virtual Operating Systems Laboratory. Explore process management, CPU scheduling, threads, semaphores, Banker's deadlock safety, memory paging, disk arms, and Inodes with real-time interactive controls, hands-on lab challenges, safe terminal CLI, and self-assessment quizzes.
            </p>
            <button id="hero-start-btn" class="btn-primary">
              🚀 Explore First Module: Process Management
            </button>
          </div>

          <div class="hero-stats">
            <div class="stat-box">
              <div class="stat-value">${completedModules} / 10</div>
              <div class="stat-label">Modules Done</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color:var(--accent-purple);">${overallPct}%</div>
              <div class="stat-label">Lab Progress</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color:var(--accent-emerald);">${store.state.xp}</div>
              <div class="stat-label">XP Earned</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color:var(--accent-amber);">50</div>
              <div class="stat-label">Quiz Bank</div>
            </div>
          </div>
        </div>

        <!-- 10 Topic Cards Grid -->
        <div class="dashboard-grid-header">
          <div class="section-title-main">
            <span>📚</span>
            <span>10 Operating System Lab Modules</span>
          </div>
        </div>

        <div id="modules-grid" class="modules-grid"></div>
      </div>
    `;

    this.renderCards();
    this.attachEvents();
  }

  renderCards() {
    const grid = this.container.querySelector("#modules-grid");
    grid.innerHTML = "";

    TOPICS.forEach(topic => {
      const prog = store.getTopicProgress(topic.id);
      const stepsDone = (prog.stepsCompleted || []).length;
      const pct = Math.round((stepsDone / 5) * 100);

      let statusClass = "status-not-started";
      let statusText = "Not Started";
      if (prog.completed) {
        statusClass = "status-completed";
        statusText = "Completed";
      } else if (stepsDone > 0) {
        statusClass = "status-in-progress";
        statusText = "In Progress";
      }

      const card = document.createElement("div");
      card.className = "module-card glass-panel";
      card.dataset.topicId = topic.id;
      card.innerHTML = `
        <div class="module-card-top">
          <div class="module-icon-box">${topic.icon}</div>
          <span class="module-status-tag ${statusClass}">${statusText}</span>
        </div>

        <div style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; margin-bottom:0.25rem;">
          Module ${topic.num} • ${topic.category}
        </div>
        <h3 class="module-card-title">${topic.title}</h3>
        <p class="module-card-desc">${topic.shortDesc}</p>

        <div class="module-card-footer">
          <div class="module-card-meta">
            <span>Progress: <strong>${pct}%</strong> (${stepsDone}/5)</span>
            <span class="quiz-score-badge">🏆 Quiz: ${prog.quizScore || 0}%</span>
          </div>

          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width:${pct}%;"></div>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  attachEvents() {
    const heroBtn = this.container.querySelector("#hero-start-btn");
    if (heroBtn) {
      heroBtn.onclick = () => {
        sound.playClick();
        this.onSelectTopic("process-management");
      };
    }

    this.container.querySelectorAll(".module-card").forEach(card => {
      card.onclick = () => {
        sound.playClick();
        const tid = card.dataset.topicId;
        this.onSelectTopic(tid);
      };
    });
  }
}
