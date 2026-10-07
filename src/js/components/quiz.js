// Premium Quiz Runner Component
import { QUIZ_DATA } from "../data/quizData.js";
import { store } from "../store.js";
import { sound } from "../audio.js";

export class QuizRunner {
  constructor(containerEl, topicId, onQuizComplete) {
    this.container = containerEl;
    this.topicId = topicId;
    this.onQuizComplete = onQuizComplete;
    this.questions = QUIZ_DATA[topicId] || [];
    this.currentQuestionIdx = 0;
    this.selectedOptionIdx = null;
    this.score = 0;
    this.isAnswered = false;
    this.render();
  }

  render() {
    if (this.questions.length === 0) {
      this.container.innerHTML = `<div class="quiz-container"><div class="quiz-card glass-panel">No quiz questions available for this topic.</div></div>`;
      return;
    }

    if (this.currentQuestionIdx >= this.questions.length) {
      this.renderSummary();
      return;
    }

    const q = this.questions[this.currentQuestionIdx];

    this.container.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="quiz-card glass-panel">
          <div class="quiz-header">
            <span class="quiz-question-num">Question ${this.currentQuestionIdx + 1} of ${this.questions.length}</span>
            <span class="quiz-timer">⏱ Module Quiz</span>
          </div>

          <h3 class="quiz-question-text">${q.q}</h3>

          <div class="quiz-options-list" id="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option-btn" data-idx="${i}">
                <span class="option-prefix">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </button>
            `).join("")}
          </div>

          <div id="quiz-explanation" class="quiz-explanation-box" style="display:none;"></div>

          <div style="display:flex; justify-content:flex-end; margin-top:1rem;">
            <button id="quiz-next-btn" class="btn-primary" style="display:none;">
              Next Question ➔
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const q = this.questions[this.currentQuestionIdx];
    const optionsContainer = this.container.querySelector("#quiz-options");
    const expBox = this.container.querySelector("#quiz-explanation");
    const nextBtn = this.container.querySelector("#quiz-next-btn");

    optionsContainer.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.onclick = () => {
        if (this.isAnswered) return;
        sound.playClick();
        this.isAnswered = true;
        const selectedIdx = parseInt(btn.dataset.idx);
        this.selectedOptionIdx = selectedIdx;

        optionsContainer.querySelectorAll(".quiz-option-btn").forEach((b, i) => {
          if (i === q.answer) {
            b.classList.add("correct");
          } else if (i === selectedIdx) {
            b.classList.add("wrong");
          }
        });

        if (selectedIdx === q.answer) {
          this.score++;
          sound.playSuccess();
        }

        expBox.style.display = "block";
        expBox.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
        nextBtn.style.display = "inline-flex";
      };
    });

    nextBtn.onclick = () => {
      sound.playClick();
      this.currentQuestionIdx++;
      this.isAnswered = false;
      this.selectedOptionIdx = null;
      this.render();
    };
  }

  renderSummary() {
    const total = this.questions.length;
    const scorePct = Math.round((this.score / total) * 100);
    const isPassed = scorePct >= 60;

    store.setQuizScore(this.topicId, scorePct);

    this.container.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="quiz-card glass-panel quiz-summary-card" style="--score-pct:${scorePct};">
          <div class="score-circle">
            <span class="score-text">${scorePct}%</span>
          </div>

          <h2 style="font-size:1.6rem; font-weight:800;">
            ${isPassed ? '🎉 Quiz Passed!' : '📖 Needs Review'}
          </h2>

          <p style="color:var(--text-muted); font-size:0.95rem; max-width:450px;">
            You scored <strong>${this.score}</strong> out of <strong>${total}</strong> questions correctly on this module test.
            ${isPassed ? 'Great job! Step 5: Quiz is now marked completed.' : 'Review the Learn material and simulation tasks, then retry.'}
          </p>

          <div style="display:flex; gap:1rem; margin-top:1rem;">
            <button id="quiz-retry-btn" class="btn-secondary">↺ Retry Quiz</button>
            <button id="quiz-finish-btn" class="btn-primary">Finish Topic 🏆</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector("#quiz-retry-btn").onclick = () => {
      sound.playClick();
      this.currentQuestionIdx = 0;
      this.score = 0;
      this.isAnswered = false;
      this.render();
    };

    this.container.querySelector("#quiz-finish-btn").onclick = () => {
      sound.playSuccess();
      this.onQuizComplete(scorePct);
    };
  }
}
