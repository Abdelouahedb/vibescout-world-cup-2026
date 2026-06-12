import type { Match, ScoreTone } from "@/lib/matches";
import type { ScorePreference, VibeScoutSettings } from "@/lib/settings";

export type DisplayMatch = Match & {
  displayRank: number;
  displayScore: number;
  displayScoreLabel: string;
  displayTone: ScoreTone;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const isOvernightMatch = (match: Pick<Match, "kickoff">) => {
  const hour = Number(match.kickoff.split(":")[0]);
  return hour < 7;
};

const getMoroccoNow = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));

  return {
    dateISO: `${values.year}-${values.month}-${values.day}`,
    kickoff: `${values.hour}:${values.minute}`,
  };
};

export const isPassedMatch = (match: Pick<Match, "dateISO" | "kickoff">) => {
  const now = getMoroccoNow();
  if (!now) {
    return false;
  }

  return match.dateISO < now.dateISO || (match.dateISO === now.dateISO && match.kickoff <= now.kickoff);
};

const labelForScore = (score: number) => {
  if (score >= 85) return "Must Watch";
  if (score >= 70) return "Worth It";
  if (score >= 55) return "Chaos Potential";
  if (score >= 40) return "Background Game";
  return "Sleep Is Fine";
};

const toneForScore = (score: number): ScoreTone => {
  if (score >= 85) return "must";
  if (score >= 70) return "worth";
  if (score >= 55) return "chaos";
  if (score >= 40) return "background";
  return "sleep";
};

export const scoreForPreference = (match: Match, preference: ScorePreference) => {
  const factors = match.scoreFactors;
  const maxScore = match.id === "C1" ? 99 : 95;
  let adjusted = match.score;

  if (preference === "stars") {
    adjusted +=
      (factors.starPower - 70) * 0.18 +
      (factors.quality - 65) * 0.08 +
      (factors.fanInterest - 70) * 0.06 +
      (factors.rivalryHeat - 50) * 0.03;
  }

  if (preference === "upsets") {
    adjusted +=
      (factors.upsetPotential - 55) * 0.28 +
      (factors.balance - 62) * 0.07 -
      Math.max(0, factors.rankGap - 42) * 0.11 +
      (factors.form - 64) * 0.04;
  }

  if (preference === "stakes") {
    adjusted +=
      (factors.stakes - 55) * 0.22 +
      factors.hostBoost * 0.18 +
      (factors.narrative - 50) * 0.06;
  }

  adjusted += factors.moroccoMarqueeBonus * 0.08;

  return Math.round(clamp(adjusted, 22, maxScore));
};

export const applyMatchSettings = (matches: Match[], settings: VibeScoutSettings): DisplayMatch[] =>
  matches
    .filter((match) => !settings.hideOvernight || !isOvernightMatch(match))
    .filter((match) => !settings.hidePassedGames || !isPassedMatch(match))
    .map((match) => {
      const displayScore = scoreForPreference(match, settings.scorePreference);
      return {
        ...match,
        displayScore,
        displayScoreLabel: labelForScore(displayScore),
        displayTone: toneForScore(displayScore),
      };
    })
    .sort((a, b) => b.displayScore - a.displayScore || a.dateISO.localeCompare(b.dateISO) || a.kickoff.localeCompare(b.kickoff))
    .map((match, index) => ({
      ...match,
      displayRank: index + 1,
    }));
