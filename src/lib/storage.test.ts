import { describe, expect, it, vi } from "vitest";
import { INITIAL_PROGRESS } from "./engine";
import { loadProgress, saveProgress, STORAGE_KEY } from "./storage";

describe("storage helpers", () => {
  it("returns initial state when storage is empty", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(null),
    };

    expect(loadProgress(storage)).toEqual(INITIAL_PROGRESS);
  });

  it("parses stored progress", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ theme: "light", notes: { 1: "note" } })),
    };

    const loaded = loadProgress(storage);
    expect(loaded.theme).toBe("light");
    expect(loaded.notes[1]).toBe("note");
  });

  it("falls back to initial state on invalid json", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue("{bad json"),
    };

    expect(loadProgress(storage)).toEqual(INITIAL_PROGRESS);
  });

  it("saves progress to storage", () => {
    const storage = {
      setItem: vi.fn(),
    };

    saveProgress(INITIAL_PROGRESS, storage);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
  });
});
