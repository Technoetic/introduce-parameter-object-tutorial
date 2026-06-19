// @MX:NOTE State is isolated from the DOM so the tutorial interactions can be tested directly.
export class LessonState {
  constructor(content) {
    this.content = content;
    this.selectedAppId = content.apps[0].id;
    this.gatheredIds = new Set();
    this.bundleSent = false;
    this.lessonIndex = 0;
    this.compareValue = 0;
    this.quizChoiceId = null;
  }

  get selectedApp() {
    return this.content.apps.find((app) => app.id === this.selectedAppId) ?? this.content.apps[0];
  }

  get fragments() {
    return this.selectedApp.fragments;
  }

  get gatheredCount() {
    return this.gatheredIds.size;
  }

  get totalCount() {
    return this.fragments.length;
  }

  get isBundleReady() {
    return this.gatheredCount === this.totalCount;
  }

  get compareBucket() {
    return Math.min(4, Math.max(0, Math.round(this.compareValue / 25)));
  }

  get lesson() {
    return this.content.lessons[this.lessonIndex];
  }

  get quizChoice() {
    return this.content.quiz.choices.find((choice) => choice.id === this.quizChoiceId) ?? null;
  }

  selectApp(appId) {
    if (!this.content.apps.some((app) => app.id === appId)) {
      return;
    }
    this.selectedAppId = appId;
    this.gatheredIds.clear();
    this.bundleSent = false;
    this.quizChoiceId = null;
  }

  toggleFragment(fragmentId) {
    if (!this.fragments.some((fragment) => fragment.id === fragmentId)) {
      return;
    }
    if (this.gatheredIds.has(fragmentId)) {
      this.gatheredIds.delete(fragmentId);
      this.bundleSent = false;
      return;
    }
    this.gatheredIds.add(fragmentId);
  }

  sendBundle() {
    if (this.isBundleReady) {
      this.bundleSent = true;
    }
  }

  setCompare(value) {
    const parsed = Number.parseInt(value, 10);
    this.compareValue = Number.isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
  }

  showLesson(index) {
    if (index >= 0 && index < this.content.lessons.length) {
      this.lessonIndex = index;
    }
  }

  answerQuiz(choiceId) {
    if (this.content.quiz.choices.some((choice) => choice.id === choiceId)) {
      this.quizChoiceId = choiceId;
    }
  }

  resetLab() {
    this.gatheredIds.clear();
    this.bundleSent = false;
    this.compareValue = 0;
    this.quizChoiceId = null;
  }

  getProgressLabel() {
    if (this.bundleSent) {
      return "묶음 전달 완료";
    }
    if (this.isBundleReady) {
      return "묶음 준비 완료";
    }
    return `${this.gatheredCount} / ${this.totalCount} 조각 수집`;
  }

  getClarityBand() {
    const base = this.gatheredCount * 25;
    const sentBonus = this.bundleSent ? 25 : 0;
    const score = Math.min(100, base + sentBonus);
    if (score >= 90) {
      return "full";
    }
    if (score >= 70) {
      return "high";
    }
    if (score >= 40) {
      return "mid";
    }
    return "low";
  }
}
