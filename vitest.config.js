import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
      include: ["src/js/LessonState.js", "src/js/TutorialApp.js", "src/data/**/*.js"],
      exclude: ["src/main.js", "src/js/AppRenderer.js"],
    },
  },
});
