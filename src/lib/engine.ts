import { hexagramMap, hexagrams } from "../data/hexagrams";
import type { ChoiceTemplate, DailyReflection, EncounterResult, Hexagram, ProgressState } from "../types";

export const INITIAL_PROGRESS: ProgressState = {
  encounteredHexagramIds: [],
  unlockedHexagramIds: [],
  completedHexagramIds: [],
  insights: [],
  notes: {},
  journal: [],
  dailyReflections: [],
  theme: "dark",
  readingMode: false,
};

export function getHexagramById(id: number): Hexagram {
  const hexagram = hexagramMap.get(id);

  if (!hexagram) {
    throw new Error(`Unknown hexagram id: ${id}`);
  }

  return hexagram;
}

export function drawHexagram(seed: number): Hexagram {
  const normalized = ((seed % hexagrams.length) + hexagrams.length) % hexagrams.length;
  return hexagrams[normalized];
}

export function applyChoice(progress: ProgressState, hexagramId: number, choice: ChoiceTemplate): ProgressState {
  const fromHexagram = getHexagramById(hexagramId);
  const unlockedHexagramIds = Array.from(
    new Set([hexagramId, choice.transformedHexagramId, ...choice.unlocks]),
  ).sort((left, right) => left - right);
  const unlockedInsight = `${fromHexagram.name} · 第${choice.changingLine}爻：${fromHexagram.lineImages[choice.changingLine - 1]}`;
  const entry: EncounterResult = {
    fromHexagramId: hexagramId,
    choiceId: choice.id,
    changingLine: choice.changingLine,
    transformedHexagramId: choice.transformedHexagramId,
    consequence: choice.consequence,
    unlockedHexagramIds,
    unlockedInsight,
    timestamp: new Date().toISOString(),
  };

  return {
    ...progress,
    encounteredHexagramIds: mergeIds(progress.encounteredHexagramIds, [hexagramId]),
    unlockedHexagramIds: mergeIds(progress.unlockedHexagramIds, unlockedHexagramIds),
    completedHexagramIds: mergeIds(progress.completedHexagramIds, [hexagramId]),
    insights: [...progress.insights, unlockedInsight],
    journal: [entry, ...progress.journal].slice(0, 32),
  };
}

export function mergeIds(current: number[], next: number[]): number[] {
  return Array.from(new Set([...current, ...next])).sort((left, right) => left - right);
}

export function updateNote(progress: ProgressState, hexagramId: number, note: string): ProgressState {
  return {
    ...progress,
    notes: {
      ...progress.notes,
      [hexagramId]: note,
    },
  };
}

export function toggleTheme(progress: ProgressState): ProgressState {
  return {
    ...progress,
    theme: progress.theme === "dark" ? "light" : "dark",
  };
}

export function toggleReadingMode(progress: ProgressState): ProgressState {
  return {
    ...progress,
    readingMode: !progress.readingMode,
  };
}

export function getDailyReflection(date: string): DailyReflection {
  const seed = date
    .split("")
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 0);
  const hexagram = drawHexagram(seed);
  const prompt = `今天适合从“${hexagram.themes[0]}”切入：哪件事需要你少一点预判，多一点观照？`;

  return {
    date,
    hexagramId: hexagram.id,
    prompt,
    reflectionSeed: `${hexagram.name}-${seed % 9}`,
  };
}

export function saveDailyReflection(progress: ProgressState, reflection: DailyReflection): ProgressState {
  const existing = progress.dailyReflections.find((item) => item.date === reflection.date);

  if (existing) {
    return progress;
  }

  return {
    ...progress,
    dailyReflections: [reflection, ...progress.dailyReflections],
    unlockedHexagramIds: mergeIds(progress.unlockedHexagramIds, [reflection.hexagramId]),
    encounteredHexagramIds: mergeIds(progress.encounteredHexagramIds, [reflection.hexagramId]),
  };
}

export function getCompletionRate(progress: ProgressState): number {
  return Math.round((progress.completedHexagramIds.length / hexagrams.length) * 100);
}

export function getChapterProgress(progress: ProgressState, chapter: Hexagram["chapter"]): number {
  const chapterIds = hexagrams.filter((hexagram) => hexagram.chapter === chapter).map((hexagram) => hexagram.id);
  return chapterIds.filter((id) => progress.unlockedHexagramIds.includes(id)).length;
}

export function getSearchResults(query: string, chapter?: Hexagram["chapter"]): Hexagram[] {
  const normalized = query.trim().toLowerCase();

  return hexagrams.filter((hexagram) => {
    const matchesChapter = !chapter || hexagram.chapter === chapter;

    if (!matchesChapter) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    return [
      hexagram.name,
      hexagram.pinyin.toLowerCase(),
      hexagram.title,
      hexagram.summary.toLowerCase(),
      hexagram.themes.join(" "),
    ].some((field) => field.toLowerCase().includes(normalized));
  });
}
