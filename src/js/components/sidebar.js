// Sidebar Navigation Component
import { TOPICS } from "../data/topicsData.js";
import { store } from "../store.js";
import { sound } from "../audio.js";

export class Sidebar {
  constructor(containerEl, onNavigate) {
    this.container = containerEl;
    this.onNavigate = onNavigate;
    this.render();
  }

  render() {
    const overallPct = store.calculateOverallProgress(TOPICS.length);

    this.container.innerHTML = `
      <div class="brand-header">
        <div class="brand-logo-icon">💻</div>
        <div>
          <div class="brand-title">OS VirtuLab</div>
          <div class="brand-sub">Interactive Simulator</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="#" class="nav-item active" data-route="dashboard">
          <div class="nav-item-left">
            <span class="nav-item-icon">🏠</span>
            <span>Dashboard</span>
          </div>
        </a>

        <div class="nav-section-title">10 OS Modules</div>
        <div id="sidebar-topics-list" style="display:flex; flex-direction:column; gap:0.25rem;"></div>
      </nav>

      <div class="sidebar-footer">
        <div class="progress-widget">
          <div class="progress-widget-top">
            <span>Overall Progress</span>
            <strong id="sidebar-overall-pct" style="color:var(--accent-cyan);">${overallPct}%</strong>
          </div>
          <div class="progress-bar-bg">
            <div id="sidebar-overall-bar" class="progress-bar-fill" style="width:${overallPct}%;"></div>
          </div>
        </div>
      </div>
    `;

    this.renderTopics();
    this.attachEvents();
  }

  renderTopics() {
    const listEl = this.container.querySelector("#sidebar-topics-list");
    listEl.innerHTML = "";

    TOPICS.forEach(topic => {
      const prog = store.getTopicProgress(topic.id);
      const isCompleted = prog.completed;
      const stepsDone = (prog.stepsCompleted || []).length;

      const a = document.createElement("a");
      a.className = `nav-item ${isCompleted ? 'completed' : ''}`;
      a.dataset.route = `topic:${topic.id}`;
      a.innerHTML = `
        <div class="nav-item-left">
          <span class="nav-item-icon">${topic.icon}</span>
          <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;">${topic.title}</span>
        </div>
        <span class="nav-item-badge">${isCompleted ? '✓' : `${stepsDone}/5`}</span>
      `;
      listEl.appendChild(a);
    });
  }

  attachEvents() {
    this.container.querySelectorAll(".nav-item").forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        sound.playClick();
        this.container.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const route = item.dataset.route;
        this.onNavigate(route);
      };
    });
  }

  updateProgress() {
    const overallPct = store.calculateOverallProgress(TOPICS.length);
    const pctEl = this.container.querySelector("#sidebar-overall-pct");
    const barEl = this.container.querySelector("#sidebar-overall-bar");

    if (pctEl) pctEl.textContent = `${overallPct}%`;
    if (barEl) barEl.style.width = `${overallPct}%`;

    this.renderTopics();
    this.attachEvents();
  }
}
