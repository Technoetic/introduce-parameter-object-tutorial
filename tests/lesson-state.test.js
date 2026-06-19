import { describe, expect, it } from "vitest";
import { tutorialContent } from "../src/data/tutorialContent.js";
import { LessonState } from "../src/js/LessonState.js";
import { TutorialApp } from "../src/js/TutorialApp.js";

describe("LessonState", () => {
  it("starts with a beginner-friendly app scenario", () => {
    const state = new LessonState(tutorialContent);

    expect(state.selectedApp.name).toBe("배달 앱");
    expect(state.fragments).toHaveLength(4);
    expect(state.isBundleReady).toBe(false);
    expect(state.getProgressLabel()).toContain("0 / 4");
  });

  it("collects fragments and sends a bundle only when ready", () => {
    const state = new LessonState(tutorialContent);

    state.sendBundle();
    expect(state.bundleSent).toBe(false);

    for (const fragment of state.fragments) {
      state.toggleFragment(fragment.id);
    }

    expect(state.isBundleReady).toBe(true);
    state.sendBundle();
    expect(state.bundleSent).toBe(true);
    expect(state.getProgressLabel()).toBe("묶음 전달 완료");
    expect(state.getClarityBand()).toBe("full");
  });

  it("resets gathered fragments when the app scenario changes", () => {
    const state = new LessonState(tutorialContent);

    state.toggleFragment(state.fragments[0].id);
    state.selectApp("maps");

    expect(state.selectedApp.id).toBe("maps");
    expect(state.gatheredCount).toBe(0);
    expect(state.bundleSent).toBe(false);
  });

  it("keeps compare slider and lesson tabs within valid bounds", () => {
    const state = new LessonState(tutorialContent);

    state.setCompare("73");
    expect(state.compareBucket).toBe(3);

    state.setCompare("not-a-number");
    expect(state.compareValue).toBe(0);

    state.showLesson(2);
    expect(state.lesson.id).toBe("carry");

    state.showLesson(99);
    expect(state.lesson.id).toBe("carry");
  });

  it("stores quiz feedback without accepting unknown choices", () => {
    const state = new LessonState(tutorialContent);

    state.answerQuiz("missing");
    expect(state.quizChoice).toBeNull();

    state.answerQuiz("bundle");
    expect(state.quizChoice?.correct).toBe(true);
  });

  it("delegates async initialization to the renderer", async () => {
    let initialized = false;
    const app = new TutorialApp({
      renderer: {
        async init() {
          initialized = true;
        },
      },
    });

    await app.init();

    expect(initialized).toBe(true);
  });
});
