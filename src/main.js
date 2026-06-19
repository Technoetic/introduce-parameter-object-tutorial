import { tutorialContent } from "./data/tutorialContent.js";
import { AppRenderer } from "./js/AppRenderer.js";
import { LessonState } from "./js/LessonState.js";
import { TutorialApp } from "./js/TutorialApp.js";

const bootstrap = async () => {
  const root = document.querySelector("#app");
  const state = new LessonState(tutorialContent);
  const renderer = new AppRenderer({
    documentRef: document,
    root,
    state,
  });
  const app = new TutorialApp({ renderer });
  await app.init();
};

bootstrap().catch((error) => {
  const fallback = document.createElement("p");
  fallback.textContent = "튜토리얼을 불러오지 못했습니다. 새로고침해 주세요.";
  document.body.append(fallback);
  throw error;
});
