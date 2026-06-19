const html = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// @MX:NOTE Renderer owns DOM updates while LessonState owns learning state transitions.
export class AppRenderer {
  constructor({ documentRef, root, state }) {
    this.document = documentRef;
    this.root = root;
    this.state = state;
  }

  async init() {
    await Promise.resolve();
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    this.root.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) {
        return;
      }
      this.handleAction(action);
    });

    this.root.addEventListener("input", (event) => {
      const range = event.target.closest("[data-compare]");
      if (!range) {
        return;
      }
      this.state.setCompare(range.value);
      this.render();
    });
  }

  handleAction(action) {
    const { action: actionName, appId, fragmentId, lessonIndex, choiceId } = action.dataset;
    if (actionName === "select-app") {
      this.state.selectApp(appId);
    }
    if (actionName === "toggle-fragment") {
      this.state.toggleFragment(fragmentId);
    }
    if (actionName === "send-bundle") {
      this.state.sendBundle();
    }
    if (actionName === "show-lesson") {
      this.state.showLesson(Number.parseInt(lessonIndex, 10));
    }
    if (actionName === "answer-quiz") {
      this.state.answerQuiz(choiceId);
    }
    if (actionName === "reset") {
      this.state.resetLab();
    }
    this.render();
  }

  render() {
    if (!this.root) {
      return;
    }
    this.root.innerHTML = `
      <div class="app-shell" data-testid="tutorial-app">
        ${this.renderHeader()}
        <main>
          ${this.renderHero()}
          ${this.renderLab()}
          ${this.renderLessonMap()}
          ${this.renderQuiz()}
        </main>
      </div>
    `;
  }

  renderHeader() {
    return `
      <header class="topbar" aria-label="튜토리얼 탐색">
        <a class="brand" href="#top" aria-label="첫 화면으로 이동">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Parameter Object Lab</span>
        </a>
        <nav class="topnav" aria-label="주요 영역">
          <a href="#lab">실험</a>
          <a href="#map">흐름</a>
          <a href="#check">확인</a>
        </nav>
      </header>
    `;
  }

  renderHero() {
    return `
      <section class="hero" id="top" aria-labelledby="hero-title">
        <img
          class="hero-media"
          src="./assets/parameter-flow-hero.png"
          alt="흩어진 앱 조건 조각들이 하나의 묶음으로 정리되어 여러 앱 흐름으로 이동하는 추상 이미지"
        />
        <div class="hero-copy">
          <p class="eyebrow">코드 없이 만지는 리팩토링</p>
          <h1 id="hero-title">${html(this.state.content.title)}</h1>
          <p>${html(this.state.content.subtitle)}</p>
          <div class="hero-actions" aria-label="빠른 이동">
            <a class="button button--primary" href="#lab">
              <span class="button-icon button-icon--play" aria-hidden="true"></span>
              실험 시작
            </a>
            <a class="button button--quiet" href="#map">
              <span class="button-icon button-icon--map" aria-hidden="true"></span>
              흐름 보기
            </a>
          </div>
        </div>
      </section>
    `;
  }

  renderLab() {
    const app = this.state.selectedApp;
    const flowClasses = [
      "flow-board",
      `flow-board--${app.tone}`,
      `flow-board--mix-${this.state.compareBucket}`,
      this.state.bundleSent ? "is-sent" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <section class="workspace" id="lab" aria-labelledby="lab-title">
        <div class="section-heading">
          <p class="eyebrow">대중 앱 사례</p>
          <h2 id="lab-title">흩어진 조건을 하나의 여행권처럼 묶어 보세요</h2>
          <p>칩을 눌러 함께 이동하는 조각을 모으고, 준비되면 묶음째 앱 흐름으로 보내세요.</p>
        </div>
        <div class="app-picker" aria-label="앱 사례 선택">
          ${this.renderAppButtons()}
        </div>
        <div class="lab-grid">
          <section class="panel panel--scatter" aria-labelledby="scatter-title">
            <div class="panel-heading">
              <span class="panel-kicker">Before</span>
              <h3 id="scatter-title">${html(app.beforeLabel)}</h3>
            </div>
            <div class="fragment-cloud" aria-label="흩어진 조건 조각">
              ${this.renderFragments()}
            </div>
          </section>
          <section class="panel panel--bundle" aria-labelledby="bundle-title">
            <div class="panel-heading">
              <span class="panel-kicker">Bundle</span>
              <h3 id="bundle-title">${html(app.bundleName)}</h3>
            </div>
            <div class="${flowClasses}" aria-live="polite">
              ${this.renderBundleSlots()}
              <div class="bundle-core" aria-label="${html(app.bundleName)}">
                <span class="bundle-core__ring" aria-hidden="true"></span>
                <strong>${html(app.shortName)} 묶음</strong>
                <span>${html(this.state.getProgressLabel())}</span>
              </div>
              <div class="flow-lanes" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <button
              class="button button--primary button--wide"
              type="button"
              data-action="send-bundle"
              ${this.state.isBundleReady ? "" : "disabled"}
            >
              <span class="button-icon button-icon--send" aria-hidden="true"></span>
              묶음째 보내기
            </button>
          </section>
          <section class="panel panel--outcome" aria-labelledby="outcome-title">
            <div class="panel-heading">
              <span class="panel-kicker">After</span>
              <h3 id="outcome-title">${html(app.afterLabel)}</h3>
            </div>
            <div class="clarity-meter" aria-label="흐름 선명도">
              <span class="clarity-meter__track">
                <span class="clarity-meter__fill clarity-meter__fill--${this.state.getClarityBand()}"></span>
              </span>
              <strong>${this.state.bundleSent ? "선명한 흐름" : "아직 정리 중"}</strong>
            </div>
            <label class="compare-control">
              <span>흩어짐과 묶임 비교</span>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value="${this.state.compareValue}"
                data-compare
              />
            </label>
            <button class="button button--quiet button--wide" type="button" data-action="reset">
              <span class="button-icon button-icon--reset" aria-hidden="true"></span>
              다시 해보기
            </button>
          </section>
        </div>
      </section>
    `;
  }

  renderAppButtons() {
    return this.state.content.apps
      .map((app) => {
        const isActive = app.id === this.state.selectedAppId;
        return `
          <button
            class="app-choice app-choice--${app.tone} ${isActive ? "is-active" : ""}"
            type="button"
            data-action="select-app"
            data-app-id="${html(app.id)}"
            aria-pressed="${isActive}"
          >
            <span class="app-mark ${html(app.iconClass)}" aria-hidden="true"></span>
            <span>${html(app.name)}</span>
          </button>
        `;
      })
      .join("");
  }

  renderFragments() {
    return this.state.fragments
      .map((fragment) => {
        const isGathered = this.state.gatheredIds.has(fragment.id);
        return `
          <button
            class="fragment-chip ${isGathered ? "is-gathered" : ""}"
            type="button"
            data-action="toggle-fragment"
            data-fragment-id="${html(fragment.id)}"
            aria-pressed="${isGathered}"
          >
            <span>${html(fragment.label)}</span>
            <small>${html(fragment.hint)}</small>
          </button>
        `;
      })
      .join("");
  }

  renderBundleSlots() {
    return `
      <div class="bundle-slots" aria-label="묶음에 들어간 조각">
        ${this.state.fragments
          .map((fragment) => {
            const isGathered = this.state.gatheredIds.has(fragment.id);
            return `
              <span class="bundle-slot ${isGathered ? "is-filled" : ""}">
                ${isGathered ? html(fragment.label) : "비어 있음"}
              </span>
            `;
          })
          .join("")}
      </div>
    `;
  }

  renderLessonMap() {
    const lesson = this.state.lesson;
    return `
      <section class="lesson-map" id="map" aria-labelledby="map-title">
        <div class="section-heading">
          <p class="eyebrow">초보자 흐름</p>
          <h2 id="map-title">네 번의 움직임만 기억하면 됩니다</h2>
        </div>
        <div class="lesson-shell">
          <div class="lesson-steps" role="tablist" aria-label="학습 단계">
            ${this.state.content.lessons
              .map(
                (item, index) => `
                  <button
                    class="lesson-step ${index === this.state.lessonIndex ? "is-active" : ""}"
                    type="button"
                    role="tab"
                    aria-selected="${index === this.state.lessonIndex}"
                    data-action="show-lesson"
                    data-lesson-index="${index}"
                  >
                    <span>${index + 1}</span>
                    ${html(item.title)}
                  </button>
                `,
              )
              .join("")}
          </div>
          <div class="lesson-stage" role="tabpanel">
            <span class="lesson-orbit" aria-hidden="true"></span>
            <h3>${html(lesson.title)}</h3>
            <p>${html(lesson.body)}</p>
          </div>
        </div>
      </section>
    `;
  }

  renderQuiz() {
    const quiz = this.state.content.quiz;
    const choice = this.state.quizChoice;
    return `
      <section class="quiz" id="check" aria-labelledby="quiz-title">
        <div class="section-heading">
          <p class="eyebrow">확인</p>
          <h2 id="quiz-title">${html(quiz.prompt)}</h2>
          <p>${html(quiz.situation)}</p>
        </div>
        <div class="quiz-options">
          ${quiz.choices
            .map(
              (item) => `
                <button
                  class="quiz-option ${choice?.id === item.id ? "is-selected" : ""}"
                  type="button"
                  data-action="answer-quiz"
                  data-choice-id="${html(item.id)}"
                >
                  <span class="quiz-option__mark" aria-hidden="true"></span>
                  ${html(item.label)}
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="quiz-result ${choice ? "is-visible" : ""}" aria-live="polite">
          ${choice ? html(choice.result) : "선택하면 바로 피드백이 나타납니다."}
        </p>
      </section>
    `;
  }
}
