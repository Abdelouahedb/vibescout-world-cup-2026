import type { DisplayMatch } from "@/lib/preference-scoring";

export type MatchWindow = "soon" | "tonight" | "late" | "later" | "passed";

export type MatchStatus = {
  window: MatchWindow;
  label: string;
  detail: string;
};

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  value: number;
  hint: string;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const parseMoroccoDateTime = (dateISO: string, kickoff: string) => new Date(`${dateISO}T${kickoff}:00+01:00`);

export const getMoroccoNowSnapshot = () => {
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
    timestamp: parseMoroccoDateTime(`${values.year}-${values.month}-${values.day}`, `${values.hour}:${values.minute}`),
  };
};

export const getMatchStatus = (match: Pick<DisplayMatch, "dateISO" | "kickoff">): MatchStatus => {
  const now = getMoroccoNowSnapshot();
  const kickoffDate = parseMoroccoDateTime(match.dateISO, match.kickoff);
  const hour = Number(match.kickoff.split(":")[0]);

  if (!now) {
    return hour < 7
      ? { window: "late", label: "Late Watch", detail: "After midnight in Morocco" }
      : { window: "later", label: "Upcoming", detail: "Still ahead on the schedule" };
  }

  const diffMinutes = Math.round((kickoffDate.getTime() - now.timestamp.getTime()) / 60000);

  if (diffMinutes <= 0) {
    return { window: "passed", label: "Played", detail: "Kickoff has already passed" };
  }

  if (diffMinutes <= 120) {
    return { window: "soon", label: "Soon", detail: "Starts within two hours" };
  }

  if (match.dateISO === now.dateISO && hour >= 18 && hour <= 23) {
    return { window: "tonight", label: "Tonight", detail: "Prime Morocco evening kickoff" };
  }

  if (hour < 7) {
    return { window: "late", label: "Late Watch", detail: "After midnight in Morocco" };
  }

  return { window: "later", label: "Later", detail: "Not in the immediate watch window" };
};

export const getHomeSlate = (matches: DisplayMatch[]) => {
  const now = getMoroccoNowSnapshot();
  const actionableMatches = matches.filter(
    (match) => match.status !== "played" && getMatchStatus(match).window !== "passed",
  );
  const grouped = new Map<string, DisplayMatch[]>();

  actionableMatches.forEach((match) => {
    const current = grouped.get(match.dateISO) ?? [];
    current.push(match);
    grouped.set(match.dateISO, current);
  });

  const orderedDates = Array.from(grouped.keys()).sort();
  const preferredDate =
    (now && orderedDates.find((dateISO) => dateISO >= now.dateISO)) ||
    orderedDates[0];

  const slate = preferredDate ? (grouped.get(preferredDate) ?? []) : [];
  const upcomingSlate = now
    ? slate.filter((match) => match.dateISO > now.dateISO || (match.dateISO === now.dateISO && match.kickoff > now.kickoff))
    : slate;
  const baseSlate = upcomingSlate.length > 0 ? upcomingSlate : slate;
  const sortedSlate = [...baseSlate].sort(
    (a, b) => b.displayScore - a.displayScore || a.kickoff.localeCompare(b.kickoff),
  );

  return {
    dateISO: preferredDate ?? "",
    dateLabel: sortedSlate[0]?.dateLabel ?? "",
    matches: sortedSlate.slice(0, 5),
  };
};

export const getWindowCounts = (matches: DisplayMatch[]) =>
  matches.reduce(
    (acc, match) => {
      const status = getMatchStatus(match);
      acc[status.window] += 1;
      return acc;
    },
    {
      soon: 0,
      tonight: 0,
      late: 0,
      later: 0,
      passed: 0,
    },
  );

export const getScoreBreakdown = (match: DisplayMatch): ScoreBreakdownItem[] => {
  const { scoreFactors } = match;
  const qualityGapValue = clamp(scoreFactors.qualityGap, 10, 100);
  const upsetRiskValue = clamp(scoreFactors.upsetPotential, 10, 100);
  const stakesValue = clamp(scoreFactors.stakes, 10, 100);
  const kickoffValue = clamp(scoreFactors.kickoffWatch * 10, 10, 100);
  const starPlayers = [match.playerWatch[0], match.playerWatch[2]].filter(Boolean).join(", ");

  return [
    {
      id: "stakes",
      label: "Stakes",
      value: Math.round(stakesValue),
      hint:
        scoreFactors.stakes >= 82
          ? "Final group-day leverage"
          : scoreFactors.stakes >= 60
            ? "Second-match pressure"
            : "Opening-match volatility",
    },
    {
      id: "star-power",
      label: "Star Power",
      value: Math.round(scoreFactors.starPower),
      hint: starPlayers,
    },
    {
      id: "upset-risk",
      label: "Upset Risk",
      value: Math.round(upsetRiskValue),
      hint:
        scoreFactors.upsetPotential >= 78
          ? "Very live underdog lane"
          : scoreFactors.rankGap <= 12
          ? "Either team can really own it"
          : scoreFactors.rankGap <= 28
            ? "Favorite, but not safely"
            : "Mostly alive if the underdog lands first",
    },
    {
      id: "quality-gap",
      label: "Quality Gap",
      value: Math.round(qualityGapValue),
      hint:
        scoreFactors.rankGap <= 10
          ? "Tight enough to stay hot"
          : scoreFactors.rankGap <= 24
            ? "Good favorite-underdog tension"
            : "A wider gap lowers the ceiling",
    },
    {
      id: "morocco-kickoff",
      label: "Morocco Kickoff",
      value: Math.round(kickoffValue),
      hint:
        scoreFactors.kickoffWatch >= 9
          ? "Prime-time locally"
          : scoreFactors.kickoffWatch >= 6
            ? "Comfortable afternoon watch"
            : "Late Morocco start",
    },
    {
      id: "fan-pull",
      label: "Fan Pull",
      value: Math.round(scoreFactors.fanInterest),
      hint:
        scoreFactors.fanInterest >= 88
          ? "Global pull"
          : scoreFactors.fanInterest >= 72
            ? "Healthy audience energy"
            : "More niche than marquee",
    },
  ];
};

export const getTodayPulse = (matches: DisplayMatch[]) => {
  const slate = getHomeSlate(matches).matches;
  if (slate.length === 0) {
    return [];
  }

  const counts = getWindowCounts(slate);
  const topMatch = slate[0];
  const second = slate[1];
  const lines = [
    `If you only watch one, start with ${topMatch.teams[0].name} vs ${topMatch.teams[1].name}.`,
    counts.soon > 0
      ? `${counts.soon} match${counts.soon === 1 ? "" : "es"} start soon in Morocco time.`
      : counts.tonight > 0
        ? `${counts.tonight} match${counts.tonight === 1 ? "" : "es"} land in the evening window tonight.`
        : `${counts.late} late watch${counts.late === 1 ? "" : "es"} sit after midnight.`,
    second
      ? `${second.teams[0].name} vs ${second.teams[1].name} is the backup pick if you want a second game.`
      : "Today is light, but the top recommendation still has a clear edge.",
  ];

  return lines;
};
