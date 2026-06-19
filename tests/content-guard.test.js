import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { tutorialContent } from "../src/data/tutorialContent.js";

const flattenText = (value) => {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenText);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenText);
  }
  return [];
};

describe("code-free learning surface", () => {
  it("does not use code presentation tags in the document shell", () => {
    const html = readFileSync("src/index.html", "utf8");

    expect(html).not.toMatch(/<code|<pre|<samp|<kbd/i);
    expect(html).not.toMatch(/style="/i);
  });

  it("keeps learner-facing content free of snippet-like syntax", () => {
    const allText = flattenText(tutorialContent).join("\n");

    expect(allText).not.toMatch(/=>|console\.|function\s+\w+\(|\{\s*\w+:/);
    expect(allText).not.toMatch(/startDate|endDate|aDateRange/);
  });
});
