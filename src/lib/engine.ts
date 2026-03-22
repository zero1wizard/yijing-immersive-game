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

function addDays(date: string, offset: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const current = new Date(year, month - 1, day);
  current.setDate(current.getDate() + offset);

  const nextYear = current.getFullYear();
  const nextMonth = `${current.getMonth() + 1}`.padStart(2, "0");
  const nextDay = `${current.getDate()}`.padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function getReflectionPath(startDate: string, days = 7): DailyReflection[] {
  return Array.from({ length: days }, (_, index) => getDailyReflection(addDays(startDate, index)));
}

export function getThemeMomentum(progress: ProgressState): Array<{ theme: string; count: number }> {
  const counts = new Map<string, number>();

  progress.completedHexagramIds.forEach((id) => {
    const hexagram = getHexagramById(id);
    hexagram.themes.forEach((theme) => {
      counts.set(theme, (counts.get(theme) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((left, right) => right.count - left.count || left.theme.localeCompare(right.theme, "zh-Hans-CN"))
    .slice(0, 5);
}

export function getRecentChapterFocus(progress: ProgressState): Array<{ chapter: Hexagram["chapter"]; count: number }> {
  const counts = new Map<Hexagram["chapter"], number>();

  progress.journal.slice(0, 12).forEach((entry) => {
    const chapter = getHexagramById(entry.fromHexagramId).chapter;
    counts.set(chapter, (counts.get(chapter) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([chapter, count]) => ({ chapter, count }))
    .sort((left, right) => right.count - left.count);
}

export function getRecommendedHexagrams(currentHexagramId: number, progress: ProgressState): Hexagram[] {
  const current = getHexagramById(currentHexagramId);
  const seen = new Set<number>([currentHexagramId, ...progress.encounteredHexagramIds]);

  const ranked = hexagrams
    .filter((hexagram) => !seen.has(hexagram.id))
    .map((hexagram) => {
      const sharedThemes = hexagram.themes.filter((theme) => current.themes.includes(theme)).length;
      const chapterBonus = hexagram.chapter === current.chapter ? 2 : 0;
      const relatedBonus = current.related.includes(hexagram.id) ? 3 : 0;

      return {
        hexagram,
        score: sharedThemes * 3 + chapterBonus + relatedBonus,
      };
    })
    .sort((left, right) => right.score - left.score || left.hexagram.id - right.hexagram.id)
    .slice(0, 3)
    .map((item) => item.hexagram);

  if (ranked.length === 3) {
    return ranked;
  }

  const fallback = hexagrams.filter((hexagram) => !seen.has(hexagram.id) && !ranked.some((item) => item.id === hexagram.id));
  return [...ranked, ...fallback].slice(0, 3);
}

export function getPracticeSummary(progress: ProgressState): {
  totalSessions: number;
  reflectionDays: number;
  noteCount: number;
  insightCount: number;
} {
  return {
    totalSessions: progress.journal.length,
    reflectionDays: progress.dailyReflections.length,
    noteCount: Object.values(progress.notes).filter((note) => note.trim().length > 0).length,
    insightCount: progress.insights.length,
  };
}
