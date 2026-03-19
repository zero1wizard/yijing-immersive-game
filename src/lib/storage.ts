import { INITIAL_PROGRESS } from "./engine";
import type { ProgressState } from "../types";

export const STORAGE_KEY = "yijing-immersive-game-progress";

function getDefaultStorage(): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.localStorage;
}

export function loadProgress(storage: Pick<Storage, "getItem"> | undefined = getDefaultStorage()): ProgressState {
  if (!storage) {
    return INITIAL_PROGRESS;
  }

  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    return INITIAL_PROGRESS;
  }

  try {
    return {
      ...INITIAL_PROGRESS,
      ...JSON.parse(raw),
    } as ProgressState;
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: ProgressState, storage: Pick<Storage, "setItem"> | undefined = getDefaultStorage()): void {
  const resolvedStorage = storage ?? getDefaultStorage();

  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
