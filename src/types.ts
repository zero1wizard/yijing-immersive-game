export const CHAPTERS = [
  "起势",
  "处世",
  "应变",
  "治理",
  "修身",
  "终局",
] as const;

export type Chapter = (typeof CHAPTERS)[number];

export type ThemeMode = "light" | "dark";

export interface ChoiceTemplate {
  id: string;
  label: string;
  stance: "observe" | "advance" | "withdraw";
  changingLine: number;
  transformedHexagramId: number;
  consequence: string;
  unlocks: number[];
}

export interface Hexagram {
  id: number;
  key: string;
  name: string;
  pinyin: string;
  title: string;
  symbol: string;
  chapter: Chapter;
  themes: string[];
  summary: string;
  scenario: string;
  studyNotes: string[];
  related: number[];
  lineImages: string[];
  choices: ChoiceTemplate[];
}

export interface EncounterResult {
  fromHexagramId: number;
  choiceId: string;
  changingLine: number;
  transformedHexagramId: number;
  consequence: string;
  unlockedHexagramIds: number[];
  unlockedInsight: string;
  timestamp: string;
}

export interface DailyReflection {
  date: string;
  hexagramId: number;
  prompt: string;
  reflectionSeed: string;
}

export interface ProgressState {
  encounteredHexagramIds: number[];
  unlockedHexagramIds: number[];
  completedHexagramIds: number[];
  insights: string[];
  notes: Record<number, string>;
  journal: EncounterResult[];
  dailyReflections: DailyReflection[];
  theme: ThemeMode;
  readingMode: boolean;
}
