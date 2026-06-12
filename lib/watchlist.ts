"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const WATCHLIST_KEY = "vibescout.watchlist";

const readStoredIds = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(WATCHLIST_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const writeStoredIds = (ids: string[]) => {
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("vibescout-watchlist-change", { detail: ids }));
};

export function useWatchlist() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readStoredIds());

    const sync = () => setSavedIds(readStoredIds());
    window.addEventListener("storage", sync);
    window.addEventListener("vibescout-watchlist-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vibescout-watchlist-change", sync);
    };
  }, []);

  const save = useCallback((matchId: string) => {
    setSavedIds((current) => {
      if (current.includes(matchId)) {
        return current;
      }
      const next = [matchId, ...current];
      writeStoredIds(next);
      return next;
    });
  }, []);

  const remove = useCallback((matchId: string) => {
    setSavedIds((current) => {
      const next = current.filter((id) => id !== matchId);
      writeStoredIds(next);
      return next;
    });
  }, []);

  const toggle = useCallback((matchId: string) => {
    setSavedIds((current) => {
      const next = current.includes(matchId)
        ? current.filter((id) => id !== matchId)
        : [matchId, ...current];
      writeStoredIds(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSavedIds([]);
    writeStoredIds([]);
  }, []);

  return useMemo(
    () => ({
      savedIds,
      count: savedIds.length,
      isSaved: (matchId: string) => savedIds.includes(matchId),
      save,
      remove,
      toggle,
      clear,
    }),
    [clear, remove, save, savedIds, toggle],
  );
}
