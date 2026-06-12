"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ScorePreference = "balanced" | "stars" | "upsets" | "stakes";

export type VibeScoutSettings = {
  scorePreference: ScorePreference;
  hideOvernight: boolean;
  hidePassedGames: boolean;
  reduceMotion: boolean;
};

const SETTINGS_KEY = "vibescout.settings";

const defaultSettings: VibeScoutSettings = {
  scorePreference: "balanced",
  hideOvernight: false,
  hidePassedGames: false,
  reduceMotion: false,
};

const isScorePreference = (value: unknown): value is ScorePreference =>
  value === "balanced" || value === "stars" || value === "upsets" || value === "stakes";

const readSettings = (): VibeScoutSettings => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const value = window.localStorage.getItem(SETTINGS_KEY);
    const parsed = value ? JSON.parse(value) : {};
    return {
      scorePreference: isScorePreference(parsed.scorePreference) ? parsed.scorePreference : defaultSettings.scorePreference,
      hideOvernight: typeof parsed.hideOvernight === "boolean" ? parsed.hideOvernight : defaultSettings.hideOvernight,
      hidePassedGames: typeof parsed.hidePassedGames === "boolean" ? parsed.hidePassedGames : defaultSettings.hidePassedGames,
      reduceMotion: typeof parsed.reduceMotion === "boolean" ? parsed.reduceMotion : defaultSettings.reduceMotion,
    };
  } catch {
    return defaultSettings;
  }
};

const writeSettings = (settings: VibeScoutSettings) => {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("vibescout-settings-change", { detail: settings }));
};

export function useVibeScoutSettings() {
  const [settings, setSettings] = useState<VibeScoutSettings>(defaultSettings);

  useEffect(() => {
    setSettings(readSettings());

    const sync = () => setSettings(readSettings());
    window.addEventListener("storage", sync);
    window.addEventListener("vibescout-settings-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vibescout-settings-change", sync);
    };
  }, []);

  const update = useCallback((next: Partial<VibeScoutSettings>) => {
    setSettings((current) => {
      const merged = { ...current, ...next };
      writeSettings(merged);
      return merged;
    });
  }, []);

  return useMemo(
    () => ({
      settings,
      update,
    }),
    [settings, update],
  );
}
