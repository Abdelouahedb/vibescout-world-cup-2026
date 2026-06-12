import { NextResponse } from "next/server";
import { allMatches, type Match } from "@/lib/matches";

const FOOTBALL_DATA_URL = "https://api.football-data.org/v4/competitions/WC/matches?season=2026";
const WIKIPEDIA_PARSE_URL =
  "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup&prop=text&formatversion=2&format=json";

type LivePatch = Pick<Match, "id" | "status" | "scoreline">;

type FootballDataMatch = {
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime?: { home?: number | null; away?: number | null };
    regularTime?: { home?: number | null; away?: number | null };
  };
};

const aliasMap: Record<string, string[]> = {
  Algeria: ["Algeria"],
  Argentina: ["Argentina"],
  Australia: ["Australia"],
  Austria: ["Austria"],
  Belgium: ["Belgium"],
  Brazil: ["Brazil"],
  Canada: ["Canada"],
  "Bosnia and Herzegovina": ["Bosnia and Herzegovina", "Bosnia & Herzegovina", "Bosnia-Herzegovina"],
  "Cape Verde": ["Cape Verde", "Cape Verde Islands", "Cabo Verde"],
  Colombia: ["Colombia"],
  Croatia: ["Croatia"],
  Curacao: ["Curacao", "Curacao"],
  Czechia: ["Czechia", "Czech Republic"],
  Ecuador: ["Ecuador"],
  Egypt: ["Egypt"],
  England: ["England"],
  France: ["France"],
  Germany: ["Germany"],
  Ghana: ["Ghana"],
  Haiti: ["Haiti"],
  Iran: ["Iran", "IR Iran"],
  Iraq: ["Iraq"],
  "Ivory Coast": ["Ivory Coast", "Cote d'Ivoire", "Cote dIvoire"],
  Japan: ["Japan"],
  Jordan: ["Jordan"],
  Mexico: ["Mexico"],
  Morocco: ["Morocco"],
  Netherlands: ["Netherlands"],
  "New Zealand": ["New Zealand"],
  Norway: ["Norway"],
  Panama: ["Panama"],
  Paraguay: ["Paraguay"],
  Portugal: ["Portugal"],
  Qatar: ["Qatar"],
  "Saudi Arabia": ["Saudi Arabia"],
  Scotland: ["Scotland"],
  Senegal: ["Senegal"],
  "South Africa": ["South Africa"],
  "South Korea": ["South Korea", "Korea Republic"],
  Spain: ["Spain"],
  Sweden: ["Sweden"],
  Switzerland: ["Switzerland"],
  Tunisia: ["Tunisia"],
  Turkiye: ["Turkiye", "Turkey"],
  Uruguay: ["Uruguay"],
  Uzbekistan: ["Uzbekistan"],
  "United States": ["United States", "USA"],
  "DR Congo": ["DR Congo", "Congo DR", "Democratic Republic of the Congo"],
};

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();

const canonicalTeam = (value: string) => {
  const normalized = normalize(value);
  for (const [canonical, aliases] of Object.entries(aliasMap)) {
    if (aliases.some((alias) => normalize(alias) === normalized)) {
      return canonical;
    }
  }
  return value;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const aliasesFor = (team: string) => aliasMap[team] ?? [team];

const stripHtml = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;|&#8211;|&#x2013;/g, "-")
    .replace(/&minus;/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const findScoreline = (text: string, match: Match) => {
  const teamAValues = aliasesFor(match.teams[0].name);
  const teamBValues = aliasesFor(match.teams[1].name);

  for (const teamA of teamAValues) {
    for (const teamB of teamBValues) {
      const direct = new RegExp(
        `${escapeRegExp(teamA)}[^0-9]{0,90}(\\d+)\\s*[-]\\s*(\\d+)[^0-9]{0,90}${escapeRegExp(teamB)}`,
        "i",
      );
      const reverse = new RegExp(
        `${escapeRegExp(teamB)}[^0-9]{0,90}(\\d+)\\s*[-]\\s*(\\d+)[^0-9]{0,90}${escapeRegExp(teamA)}`,
        "i",
      );

      const directMatch = text.match(direct);
      if (directMatch) {
        return `${directMatch[1]}-${directMatch[2]}`;
      }

      const reverseMatch = text.match(reverse);
      if (reverseMatch) {
        return `${reverseMatch[2]}-${reverseMatch[1]}`;
      }
    }
  }

  return null;
};

const mergeStructuredFootballData = async () => {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "VibeScout2026/0.1 structured football source",
  };

  if (token) {
    headers["X-Auth-Token"] = token;
  }

  const response = await fetch(FOOTBALL_DATA_URL, {
    next: { revalidate: 900 },
    headers,
  });

  if (!response.ok) {
    throw new Error(`football-data.org fetch failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    matches?: FootballDataMatch[];
  };

  if (!payload.matches?.length) {
    throw new Error("football-data.org returned no matches");
  }

  const byTeams = new Map<string, FootballDataMatch>();
  payload.matches.forEach((match) => {
    const home = canonicalTeam(match.homeTeam.name);
    const away = canonicalTeam(match.awayTeam.name);
    byTeams.set(`${home}__${away}`, match);
    byTeams.set(`${away}__${home}`, match);
  });

  const patches: LivePatch[] = [];

  allMatches.forEach((match) => {
    const key = `${match.teams[0].name}__${match.teams[1].name}`;
    const live = byTeams.get(key);
    if (!live) {
      return;
    }

    const resolvedScore = live.score.fullTime ?? live.score.regularTime;
    const hasScore = typeof resolvedScore?.home === "number" && typeof resolvedScore?.away === "number";
    const scoreline = hasScore ? `${resolvedScore.home}-${resolvedScore.away}` : undefined;
    const status: Match["status"] =
      live.status === "IN_PLAY" || live.status === "PAUSED"
        ? "live"
        : live.status === "FINISHED"
          ? "played"
          : "scheduled";

    if (scoreline || status !== "scheduled") {
      patches.push({
        id: match.id,
        status,
        scoreline,
      });
    }
  });

  return {
    patches,
    source: {
      provider: `football-data.org FIFA World Cup feed${token ? "" : " (no-token mode)"}`,
      updatedAt: new Date().toISOString(),
      mode: "live-merge" as const,
    },
  };
};

const mergeWikipediaScores = async () => {
  const response = await fetch(WIKIPEDIA_PARSE_URL, {
    next: { revalidate: 900 },
    headers: {
      "User-Agent": "VibeScout2026/0.1 public schedule merge",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia fetch failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    parse?: {
      text?: string;
    };
  };

  const html = payload.parse?.text;
  if (!html) {
    throw new Error("Wikipedia payload missing parse text");
  }

  const text = stripHtml(html);
  const patches: LivePatch[] = [];
  let mergedCount = 0;

  allMatches.forEach((match) => {
    const scoreline = findScoreline(text, match);
    if (!scoreline) {
      return;
    }

    mergedCount += 1;
    patches.push({
      id: match.id,
      status: "played",
      scoreline,
    });
  });

  return {
    patches,
    source: {
      provider: `Wikipedia World Cup page merge (${mergedCount} live score${mergedCount === 1 ? "" : "s"})`,
      updatedAt: new Date().toISOString(),
      mode: "live-merge" as const,
    },
  };
};

export async function GET() {
  try {
    const structured = await mergeStructuredFootballData();
    return NextResponse.json(
      {
        patches: structured.patches,
        source: structured.source,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
        },
      },
    );
  } catch {
    try {
      const wiki = await mergeWikipediaScores();
      return NextResponse.json(
        {
          patches: wiki.patches,
          source: wiki.source,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
          },
        },
      );
    } catch {
      return NextResponse.json(
        {
          patches: [] as LivePatch[],
          source: {
            provider: "Local fallback snapshot",
            updatedAt: new Date().toISOString(),
            mode: "fallback",
          },
        },
        {
          headers: {
            "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
          },
        },
      );
    }
  }
}
