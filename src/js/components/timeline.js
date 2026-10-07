// Module 5-Step Timeline Header Component
import { STEP_NAMES } from "../data/topicsData.js";
import { store } from "../store.js";
import { sound } from "../audio.js";

export class StepTimeline {
  constructor(containerEl, topicId, activeStepIndex, onStepChange) {
    this.container = containerEl;
    this.topicId = topicId;
    this.activeStepIndex = activeStepIndex;
    this.onStepChange = onStepChange;
    this.render();
  }

  render() {
    const prog = store.getTopicProgress(this.topicId);
    const completedSteps = prog.stepsCompleted || [];

    let stepsHtml = "";
    STEP_NAMES.forEach((name, idx) => {
      const isActive = idx === this.activeStepIndex;
      const isCompleted = completedSteps.includes(idx) || (idx === 5 && prog.completed);
      let stepClass = "";
      if (isActive) stepClass += " active";
      if (isCompleted) stepClass += " completed";

      stepsHtml += `
        <button class="timeline-step${stepClass}" data-step="${idx}">
          <div class="step-node">${isCompleted ? '✓' : (idx + 1)}</div>
          <span class="step-label">${name}</span>
        </button>
      `;
    });

    this.container.innerHTML = `
      <div class="module-timeline-card glass-panel">
        <div class="timeline-steps">
          ${stepsHtml}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll(".timeline-step").forEach(stepBtn => {
      stepBtn.onclick = () => {
        sound.playClick();
        const stepIdx = parseInt(stepBtn.dataset.step);
        this.onStepChange(stepIdx);
      };
    });
  }

  setActiveStep(stepIndex) {
    this.activeStepIndex = stepIndex;
    this.render();
  }
}
