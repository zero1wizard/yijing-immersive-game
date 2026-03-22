import { describe, expect, it } from "vitest";
import { hexagrams } from "../data/hexagrams";
import {
  applyChoice,
  drawHexagram,
  getChapterProgress,
  getCompletionRate,
  getDailyReflection,
  getHexagramById,
  getPracticeSummary,
  getRecommendedHexagrams,
  getRecentChapterFocus,
  getReflectionPath,
  getSearchResults,
  getThemeMomentum,
  INITIAL_PROGRESS,
  mergeIds,
  saveDailyReflection,
  toggleReadingMode,
  toggleTheme,
  updateNote,
} from "./engine";

describe("engine", () => {
  it("draws a stable hexagram from a seed", () => {
    expect(drawHexagram(7).id).toBe(8);
    expect(drawHexagram(71).id).toBe(8);
  });

  it("looks up hexagrams by id", () => {
    expect(getHexagramById(1).name).toBe("乾");
    expect(() => getHexagramById(99)).toThrow();
  });

  it("merges ids uniquely and sorts them", () => {
    expect(mergeIds([3, 1], [2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it("applies a choice and unlocks results", () => {
    const hexagram = hexagrams[0];
    const updated = applyChoice(INITIAL_PROGRESS, hexagram.id, hexagram.choices[0]);

    expect(updated.completedHexagramIds).toContain(hexagram.id);
    expect(updated.unlockedHexagramIds).toContain(hexagram.choices[0].transformedHexagramId);
    expect(updated.journal).toHaveLength(1);
    expect(updated.insights[0]).toContain("第");
  });

  it("updates notes by hexagram", () => {
    const updated = updateNote(INITIAL_PROGRESS, 3, "先稳住，再前进");
    expect(updated.notes[3]).toBe("先稳住，再前进");
  });

  it("toggles theme", () => {
    expect(toggleTheme(INITIAL_PROGRESS).theme).toBe("light");
  });

  it("toggles reading mode", () => {
    expect(toggleReadingMode(INITIAL_PROGRESS).readingMode).toBe(true);
  });

  it("builds a stable daily reflection from a date", () => {
    const reflection = getDailyReflection("2026-03-18");
    expect(reflection).toEqual(getDailyReflection("2026-03-18"));
    expect(reflection.prompt.length).toBeGreaterThan(10);
  });

  it("builds a stable seven day reflection path", () => {
    const path = getReflectionPath("2026-03-18");

    expect(path).toHaveLength(7);
    expect(path[0].date).toBe("2026-03-18");
    expect(path[6].date).toBe("2026-03-24");
    expect(path).toEqual(getReflectionPath("2026-03-18"));
  });

  it("stores daily reflections once per date", () => {
    const reflection = getDailyReflection("2026-03-18");
    const once = saveDailyReflection(INITIAL_PROGRESS, reflection);
    const twice = saveDailyReflection(once, reflection);

    expect(once.dailyReflections).toHaveLength(1);
    expect(twice.dailyReflections).toHaveLength(1);
  });

  it("computes completion rate", () => {
    expect(getCompletionRate(INITIAL_PROGRESS)).toBe(0);
    expect(
      getCompletionRate({
        ...INITIAL_PROGRESS,
        completedHexagramIds: Array.from({ length: 32 }, (_, index) => index + 1),
      }),
    ).toBe(50);
  });

  it("computes chapter progress from unlocked hexagrams", () => {
    const progress = {
      ...INITIAL_PROGRESS,
      unlockedHexagramIds: [1, 2, 3, 15, 16],
    };

    expect(getChapterProgress(progress, "起势")).toBeGreaterThan(0);
  });

  it("searches by theme, pinyin, and chapter", () => {
    expect(getSearchResults("Qian").some((item) => item.id === 1)).toBe(true);
    expect(getSearchResults("承载").some((item) => item.id === 2)).toBe(true);
    expect(getSearchResults("", "终局").every((item) => item.chapter === "终局")).toBe(true);
  });

  it("summarizes theme momentum and practice stats", () => {
    const progress = {
      ...INITIAL_PROGRESS,
      completedHexagramIds: [1, 2, 3],
      notes: { 1: "记一笔", 2: "" },
      insights: ["a", "b"],
      dailyReflections: [getDailyReflection("2026-03-18")],
      journal: [applyChoice(INITIAL_PROGRESS, 1, hexagrams[0].choices[0]).journal[0]],
    };

    expect(getThemeMomentum(progress)[0].count).toBeGreaterThan(0);
    expect(getPracticeSummary(progress)).toEqual({
      totalSessions: 1,
      reflectionDays: 1,
      noteCount: 1,
      insightCount: 2,
    });
  });

  it("recommends unseen related hexagrams and chapter focus", () => {
    const progress = applyChoice(INITIAL_PROGRESS, 1, hexagrams[0].choices[0]);
    const recommendations = getRecommendedHexagrams(1, progress);

    expect(recommendations).toHaveLength(3);
    expect(recommendations.every((item) => item.id !== 1)).toBe(true);

    const chapterFocus = getRecentChapterFocus(progress);
    expect(chapterFocus[0]?.count).toBe(1);
  });
});
