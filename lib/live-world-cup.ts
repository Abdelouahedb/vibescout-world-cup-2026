import { useEffect, useMemo, useState } from "react";
import { allMatches, type Match } from "@/lib/matches";

type LivePatch = Pick<Match, "id" | "status" | "scoreline">;

type LivePayload = {
  patches: LivePatch[];
  source: {
    provider: string;
    updatedAt: string;
    mode: "live-merge" | "fallback";
  };
};

const CACHE_KEY = "vibescout-world-cup-live-payload";
const REFRESH_INTERVAL_MS = 1000 * 60 * 30;

const fallbackSource: LivePayload["source"] = {
  provider: "Local fallback snapshot",
  updatedAt: "",
  mode: "fallback",
};

const readCachedPayload = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { savedAt: number; payload: LivePayload };
    if (!parsed?.savedAt || !parsed?.payload) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeCachedPayload = (payload: LivePayload) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        payload,
      }),
    );
  } catch {
    // Ignore storage failures and keep the in-memory data path alive.
  }
};

const mergeMatches = (payload: LivePayload) => {
  const patchMap = new Map(payload.patches.map((patch) => [patch.id, patch]));
  return allMatches.map((match) => {
    const patch = patchMap.get(match.id);
    return patch ? { ...match, ...patch } : match;
  });
};

export function useWorldCupMatches() {
  const [matches, setMatches] = useState<Match[]>(allMatches);
  const [source, setSource] = useState<LivePayload["source"]>(fallbackSource);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const cached = readCachedPayload();
    if (cached) {
      setMatches(mergeMatches(cached.payload));
      setSource(cached.payload.source);
    }

    const load = async (force = false) => {
      if (inFlight) {
        return;
      }

      const cachedPayload = readCachedPayload();
      const cacheIsFresh =
        cachedPayload && Date.now() - cachedPayload.savedAt < REFRESH_INTERVAL_MS;

      if (!force && cacheIsFresh) {
        setMatches(mergeMatches(cachedPayload.payload));
        setSource(cachedPayload.payload.source);
        return;
      }

      inFlight = true;
      try {
        const response = await fetch("/api/world-cup");
        if (!response.ok) {
          throw new Error(`World Cup source failed: ${response.status}`);
        }
        const payload = (await response.json()) as LivePayload;
        if (cancelled) {
          return;
        }
        writeCachedPayload(payload);
        setMatches(mergeMatches(payload));
        setSource(payload.source);
      } catch {
        if (cancelled) {
          return;
        }
        setMatches(allMatches);
        setSource(fallbackSource);
      } finally {
        inFlight = false;
      }
    };

    load();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void load();
      }
    }, REFRESH_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void load();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== CACHE_KEY) {
        return;
      }

      const nextCached = readCachedPayload();
      if (!nextCached) {
        return;
      }

      setMatches(mergeMatches(nextCached.payload));
      setSource(nextCached.payload.source);
    };

    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return useMemo(() => ({ matches, source }), [matches, source]);
}
