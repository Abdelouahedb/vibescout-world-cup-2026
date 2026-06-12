import {
  Activity,
  Clock3,
  Flame,
  Goal,
  Medal,
  Radio,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ScoreTone = "must" | "worth" | "chaos" | "background" | "sleep";

export type ScoreDriver = {
  label: string;
  icon: LucideIcon;
};

export type Team = {
  name: string;
  flagCode: string;
};

export type Match = {
  id: string;
  rank: number;
  dateISO: string;
  dateLabel: string;
  teams: [Team, Team];
  kickoff: string;
  stadium: string;
  stage: string;
  group: string;
  status?: "scheduled" | "played" | "live";
  scoreline?: string;
  score: number;
  scoreLabel: string;
  tone: ScoreTone;
  note: string;
  explanation: string;
  playerWatch: string[];
  drivers: ScoreDriver[];
  scoreFactors: {
    stakes: number;
    quality: number;
    qualityGap: number;
    balance: number;
    starPower: number;
    fanInterest: number;
    matchdayPressure: number;
    rankGap: number;
    hostBoost: number;
    upsetPotential: number;
    kickoffWatch: number;
    moroccoMarqueeBonus: number;
    rivalryHeat: number;
    narrative: number;
    form: number;
  };
};

type TeamProfile = Team & {
  strength: number;
  fanInterest: number;
  starPower: number;
  story: string;
  players: string[];
};

type Fixture = {
  id: string;
  dateISO: string;
  localDate: string;
  teamA: string;
  teamB: string;
  group: string;
  stadium: string;
  city: string;
  kickoff: string;
  matchday: 1 | 2 | 3;
  bonus?: number;
  angles?: string[];
};

const MOROCCO_UTC_OFFSET_HOURS = 1;

const venueUtcOffsetHours: Record<string, number> = {
  "Mexico City": -6,
  Zapopan: -6,
  Guadalupe: -6,
  Toronto: -4,
  "East Rutherford": -4,
  Philadelphia: -4,
  Foxborough: -4,
  "Miami Gardens": -4,
  Atlanta: -4,
  Houston: -5,
  Arlington: -5,
  "Kansas City": -5,
  Inglewood: -7,
  "Santa Clara": -7,
  Vancouver: -7,
  Seattle: -7,
};

const fifaRank: Record<string, number> = {
  Spain: 1,
  Argentina: 2,
  France: 3,
  England: 4,
  Brazil: 5,
  Portugal: 6,
  Netherlands: 7,
  Belgium: 8,
  Germany: 9,
  Croatia: 10,
  Morocco: 11,
  Uruguay: 12,
  Colombia: 13,
  "United States": 14,
  Mexico: 15,
  Switzerland: 17,
  Japan: 18,
  Iran: 20,
  Senegal: 21,
  Austria: 22,
  Turkiye: 25,
  Australia: 26,
  Canada: 27,
  Norway: 31,
  Egypt: 34,
  Algeria: 35,
  Paraguay: 39,
  Sweden: 41,
  Ecuador: 44,
  "South Korea": 45,
  "Ivory Coast": 46,
  Qatar: 51,
  Scotland: 52,
  Tunisia: 53,
  "Saudi Arabia": 60,
  Czechia: 61,
  "DR Congo": 63,
  Ghana: 65,
  "Cape Verde": 68,
  "Bosnia and Herzegovina": 71,
  Panama: 75,
  Uzbekistan: 77,
  Curacao: 82,
  "New Zealand": 86,
  Jordan: 87,
  Iraq: 88,
  "South Africa": 89,
  Haiti: 90,
};

const teamProfiles: Record<string, TeamProfile> = {
  Mexico: {
    name: "Mexico",
    flagCode: "mx",
    strength: 74,
    fanInterest: 90,
    starPower: 72,
    story: "host pressure and Azteca noise",
    players: ["Santiago Gimenez", "Edson Alvarez", "Hirving Lozano"],
  },
  "South Africa": {
    name: "South Africa",
    flagCode: "za",
    strength: 56,
    fanInterest: 62,
    starPower: 50,
    story: "underdog return with real upset stakes",
    players: ["Percy Tau", "Teboho Mokoena", "Ronwen Williams"],
  },
  "South Korea": {
    name: "South Korea",
    flagCode: "kr",
    strength: 72,
    fanInterest: 80,
    starPower: 78,
    story: "fast transitions and global star pull",
    players: ["Son Heung-min", "Kim Min-jae", "Lee Kang-in"],
  },
  Czechia: {
    name: "Czechia",
    flagCode: "cz",
    strength: 67,
    fanInterest: 58,
    starPower: 56,
    story: "organized European resistance",
    players: ["Patrik Schick", "Tomas Soucek", "Adam Hlozek"],
  },
  Canada: {
    name: "Canada",
    flagCode: "ca",
    strength: 70,
    fanInterest: 86,
    starPower: 76,
    story: "home-nation energy with pace everywhere",
    players: ["Jonathan David", "Tajon Buchanan", "Alphonso Davies"],
  },
  "Bosnia and Herzegovina": {
    name: "Bosnia and Herzegovina",
    flagCode: "ba",
    strength: 62,
    fanInterest: 62,
    starPower: 58,
    story: "a return built on stubborn tournament nerve",
    players: ["Edin Dzeko", "Rade Krunic", "Ermedin Demirovic"],
  },
  Qatar: {
    name: "Qatar",
    flagCode: "qa",
    strength: 55,
    fanInterest: 54,
    starPower: 47,
    story: "first successful qualification, no host safety net",
    players: ["Akram Afif", "Almoez Ali", "Hassan Al-Haydos"],
  },
  Switzerland: {
    name: "Switzerland",
    flagCode: "ch",
    strength: 76,
    fanInterest: 66,
    starPower: 66,
    story: "reliable knockout pedigree",
    players: ["Granit Xhaka", "Manuel Akanji", "Breel Embolo"],
  },
  Brazil: {
    name: "Brazil",
    flagCode: "br",
    strength: 88,
    fanInterest: 96,
    starPower: 95,
    story: "global box-office talent",
    players: ["Vinicius Junior", "Rodrygo", "Endrick"],
  },
  Morocco: {
    name: "Morocco",
    flagCode: "ma",
    strength: 78,
    fanInterest: 82,
    starPower: 76,
    story: "2022 semifinal belief, now with expectation",
    players: ["Achraf Hakimi", "Sofyan Amrabat", "Youssef En-Nesyri"],
  },
  Haiti: {
    name: "Haiti",
    flagCode: "ht",
    strength: 48,
    fanInterest: 52,
    starPower: 42,
    story: "rare World Cup return with emotional weight",
    players: ["Duckens Nazon", "Frantzdy Pierrot", "Jean-Ricner Bellegarde"],
  },
  Scotland: {
    name: "Scotland",
    flagCode: "gb-sct",
    strength: 65,
    fanInterest: 78,
    starPower: 62,
    story: "first World Cup since 1998",
    players: ["Scott McTominay", "Andy Robertson", "John McGinn"],
  },
  "United States": {
    name: "United States",
    flagCode: "us",
    strength: 76,
    fanInterest: 93,
    starPower: 80,
    story: "host-nation expectation under prime-time glare",
    players: ["Christian Pulisic", "Gio Reyna", "Folarin Balogun"],
  },
  Paraguay: {
    name: "Paraguay",
    flagCode: "py",
    strength: 68,
    fanInterest: 64,
    starPower: 57,
    story: "CONMEBOL edge and spoiler danger",
    players: ["Miguel Almiron", "Julio Enciso", "Gustavo Gomez"],
  },
  Australia: {
    name: "Australia",
    flagCode: "au",
    strength: 64,
    fanInterest: 66,
    starPower: 52,
    story: "tournament toughness and late-night chaos",
    players: ["Mathew Ryan", "Jackson Irvine", "Riley McGree"],
  },
  Turkiye: {
    name: "Turkiye",
    flagCode: "tr",
    strength: 72,
    fanInterest: 78,
    starPower: 76,
    story: "young creators and volatile tournament energy",
    players: ["Arda Guler", "Hakan Calhanoglu", "Kenan Yildiz"],
  },
  "Ivory Coast": {
    name: "Ivory Coast",
    flagCode: "ci",
    strength: 70,
    fanInterest: 67,
    starPower: 66,
    story: "African champions' muscle and momentum",
    players: ["Simon Adingra", "Franck Kessie", "Sebastien Haller"],
  },
  Ecuador: {
    name: "Ecuador",
    flagCode: "ec",
    strength: 73,
    fanInterest: 68,
    starPower: 72,
    story: "pressing, athleticism, and a real dark-horse feel",
    players: ["Moises Caicedo", "Piero Hincapie", "Kendry Paez"],
  },
  Germany: {
    name: "Germany",
    flagCode: "de",
    strength: 84,
    fanInterest: 88,
    starPower: 86,
    story: "heavyweight reset with title expectations",
    players: ["Jamal Musiala", "Florian Wirtz", "Kai Havertz"],
  },
  Curacao: {
    name: "Curacao",
    flagCode: "cw",
    strength: 45,
    fanInterest: 58,
    starPower: 40,
    story: "smallest-nation fairytale",
    players: ["Leandro Bacuna", "Juninho Bacuna", "Eloy Room"],
  },
  Netherlands: {
    name: "Netherlands",
    flagCode: "nl",
    strength: 84,
    fanInterest: 82,
    starPower: 84,
    story: "elite defenders, tournament ghosts, real ceiling",
    players: ["Virgil van Dijk", "Cody Gakpo", "Xavi Simons"],
  },
  Japan: {
    name: "Japan",
    flagCode: "jp",
    strength: 78,
    fanInterest: 77,
    starPower: 74,
    story: "technical control and giant-killer reputation",
    players: ["Takefusa Kubo", "Kaoru Mitoma", "Wataru Endo"],
  },
  Sweden: {
    name: "Sweden",
    flagCode: "se",
    strength: 69,
    fanInterest: 62,
    starPower: 68,
    story: "back with physical edge and forward talent",
    players: ["Alexander Isak", "Dejan Kulusevski", "Viktor Gyokeres"],
  },
  Tunisia: {
    name: "Tunisia",
    flagCode: "tn",
    strength: 61,
    fanInterest: 58,
    starPower: 47,
    story: "compact, awkward, and never pleasant to chase",
    players: ["Hannibal Mejbri", "Ellyes Skhiri", "Youssef Msakni"],
  },
  Iran: {
    name: "Iran",
    flagCode: "ir",
    strength: 68,
    fanInterest: 63,
    starPower: 56,
    story: "experienced tournament core",
    players: ["Mehdi Taremi", "Sardar Azmoun", "Alireza Jahanbakhsh"],
  },
  "New Zealand": {
    name: "New Zealand",
    flagCode: "nz",
    strength: 48,
    fanInterest: 46,
    starPower: 38,
    story: "lowest-ranked qualifier with spoiler upside",
    players: ["Chris Wood", "Liberato Cacace", "Sarpreet Singh"],
  },
  Belgium: {
    name: "Belgium",
    flagCode: "be",
    strength: 80,
    fanInterest: 78,
    starPower: 82,
    story: "post-golden-generation reinvention",
    players: ["Jeremy Doku", "Kevin De Bruyne", "Charles De Ketelaere"],
  },
  Egypt: {
    name: "Egypt",
    flagCode: "eg",
    strength: 70,
    fanInterest: 82,
    starPower: 84,
    story: "Salah gravity and African knockout danger",
    players: ["Mohamed Salah", "Omar Marmoush", "Mostafa Mohamed"],
  },
  "Saudi Arabia": {
    name: "Saudi Arabia",
    flagCode: "sa",
    strength: 60,
    fanInterest: 62,
    starPower: 49,
    story: "upset memories from Argentina 2022",
    players: ["Salem Al-Dawsari", "Firas Al-Buraikan", "Mohamed Kanno"],
  },
  Uruguay: {
    name: "Uruguay",
    flagCode: "uy",
    strength: 82,
    fanInterest: 78,
    starPower: 82,
    story: "high-wire pressure and elite midfield bite",
    players: ["Federico Valverde", "Darwin Nunez", "Ronald Araujo"],
  },
  Spain: {
    name: "Spain",
    flagCode: "es",
    strength: 91,
    fanInterest: 91,
    starPower: 92,
    story: "Euro champions with generational wing talent",
    players: ["Lamine Yamal", "Nico Williams", "Pedri"],
  },
  "Cape Verde": {
    name: "Cape Verde",
    flagCode: "cv",
    strength: 50,
    fanInterest: 56,
    starPower: 44,
    story: "debutant pride and a nation watching history",
    players: ["Ryan Mendes", "Bebe", "Jovane Cabral"],
  },
  France: {
    name: "France",
    flagCode: "fr",
    strength: 92,
    fanInterest: 94,
    starPower: 96,
    story: "Mbappe-era heavyweight pressure",
    players: ["Kylian Mbappe", "Ousmane Dembele", "Michael Olise"],
  },
  Senegal: {
    name: "Senegal",
    flagCode: "sn",
    strength: 78,
    fanInterest: 76,
    starPower: 76,
    story: "African contender with enough talent to scare a favorite",
    players: ["Sadio Mane", "Nicolas Jackson", "Pape Matar Sarr"],
  },
  Iraq: {
    name: "Iraq",
    flagCode: "iq",
    strength: 53,
    fanInterest: 55,
    starPower: 43,
    story: "long qualification grind and emotional return",
    players: ["Aymen Hussein", "Ali Jasim", "Zidane Iqbal"],
  },
  Norway: {
    name: "Norway",
    flagCode: "no",
    strength: 77,
    fanInterest: 84,
    starPower: 94,
    story: "Haaland finally on the World Cup stage",
    players: ["Erling Haaland", "Martin Odegaard", "Antonio Nusa"],
  },
  Argentina: {
    name: "Argentina",
    flagCode: "ar",
    strength: 90,
    fanInterest: 96,
    starPower: 95,
    story: "defending champions and Messi legacy watch",
    players: ["Lionel Messi", "Julian Alvarez", "Lautaro Martinez"],
  },
  Algeria: {
    name: "Algeria",
    flagCode: "dz",
    strength: 68,
    fanInterest: 70,
    starPower: 67,
    story: "North African intensity and transition threat",
    players: ["Riyad Mahrez", "Ramy Bensebaini", "Amine Gouiri"],
  },
  Austria: {
    name: "Austria",
    flagCode: "at",
    strength: 72,
    fanInterest: 62,
    starPower: 64,
    story: "pressing structure that makes good teams uncomfortable",
    players: ["David Alaba", "Marcel Sabitzer", "Christoph Baumgartner"],
  },
  Jordan: {
    name: "Jordan",
    flagCode: "jo",
    strength: 49,
    fanInterest: 54,
    starPower: 42,
    story: "debutant stage and upset emotion",
    players: ["Mousa Al-Taamari", "Yazan Al-Naimat", "Nizar Al-Rashdan"],
  },
  Portugal: {
    name: "Portugal",
    flagCode: "pt",
    strength: 88,
    fanInterest: 93,
    starPower: 93,
    story: "Ronaldo farewell energy plus elite creators",
    players: ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leao"],
  },
  "DR Congo": {
    name: "DR Congo",
    flagCode: "cd",
    strength: 58,
    fanInterest: 58,
    starPower: 51,
    story: "historic return with physical danger",
    players: ["Yoane Wissa", "Chancel Mbemba", "Cedric Bakambu"],
  },
  Uzbekistan: {
    name: "Uzbekistan",
    flagCode: "uz",
    strength: 55,
    fanInterest: 58,
    starPower: 52,
    story: "first World Cup and a real defensive spine",
    players: ["Eldor Shomurodov", "Abdukodir Khusanov", "Oston Urunov"],
  },
  Colombia: {
    name: "Colombia",
    flagCode: "co",
    strength: 80,
    fanInterest: 82,
    starPower: 82,
    story: "creative form and a traveling crowd that lifts the room",
    players: ["Luis Diaz", "James Rodriguez", "Jhon Duran"],
  },
  Ghana: {
    name: "Ghana",
    flagCode: "gh",
    strength: 63,
    fanInterest: 70,
    starPower: 65,
    story: "high-variance talent and World Cup history",
    players: ["Mohammed Kudus", "Thomas Partey", "Inaki Williams"],
  },
  Panama: {
    name: "Panama",
    flagCode: "pa",
    strength: 54,
    fanInterest: 52,
    starPower: 42,
    story: "regional grit and spoiler potential",
    players: ["Adalberto Carrasquilla", "Jose Fajardo", "Anibal Godoy"],
  },
  England: {
    name: "England",
    flagCode: "gb-eng",
    strength: 89,
    fanInterest: 94,
    starPower: 94,
    story: "Kane, Bellingham, and trophy expectation",
    players: ["Harry Kane", "Jude Bellingham", "Bukayo Saka"],
  },
  Croatia: {
    name: "Croatia",
    flagCode: "hr",
    strength: 79,
    fanInterest: 76,
    starPower: 76,
    story: "tournament muscle and England history",
    players: ["Luka Modric", "Josko Gvardiol", "Mateo Kovacic"],
  },
};

const hostTeams = new Set(["Mexico", "Canada", "United States"]);
const debutantTeams = new Set(["Cape Verde", "Curacao", "Jordan", "Uzbekistan"]);
const returneeTeams = new Set(["Austria", "Czechia", "DR Congo", "Haiti", "Iraq", "New Zealand", "Norway", "Paraguay", "Scotland", "South Africa", "Turkiye"]);
const worldChampions = new Set(["Argentina", "Brazil", "England", "France", "Germany", "Spain", "Uruguay"]);
const titleContenders = new Set(["Argentina", "Brazil", "England", "France", "Germany", "Netherlands", "Portugal", "Spain"]);
const semifinalGlowTeams = new Set(["Croatia", "Morocco"]);
const heavyweightPairs = new Set(["England|Croatia", "France|Norway", "Norway|Senegal", "Spain|Uruguay"]);
const rivalryHeatMap: Record<string, number> = {
  "Argentina|Algeria": 58,
  "Brazil|Morocco": 82,
  "Colombia|Portugal": 78,
  "England|Croatia": 86,
  "France|Norway": 84,
  "France|Senegal": 91,
  "Germany|Ecuador": 74,
  "Netherlands|Japan": 72,
  "Norway|Senegal": 83,
  "Spain|Uruguay": 89,
  "United States|Paraguay": 70,
};
const teamMomentum: Record<string, number> = {
  Argentina: 85,
  Brazil: 82,
  Canada: 68,
  Colombia: 87,
  Croatia: 74,
  Czechia: 61,
  Ecuador: 79,
  England: 84,
  France: 86,
  Germany: 82,
  Ghana: 66,
  Japan: 79,
  Mexico: 76,
  Morocco: 84,
  Netherlands: 80,
  Norway: 83,
  Paraguay: 72,
  Portugal: 84,
  Senegal: 77,
  "South Korea": 73,
  Spain: 90,
  Switzerland: 72,
  Turkiye: 77,
  "United States": 70,
  Uruguay: 81,
};
const teamVolatility: Record<string, number> = {
  Algeria: 68,
  Australia: 64,
  Brazil: 67,
  Canada: 71,
  Colombia: 72,
  Croatia: 60,
  Czechia: 58,
  Ecuador: 73,
  Egypt: 66,
  England: 63,
  France: 61,
  Ghana: 78,
  Haiti: 76,
  Iraq: 72,
  Japan: 64,
  Jordan: 74,
  Mexico: 68,
  Morocco: 69,
  Netherlands: 60,
  Norway: 75,
  Paraguay: 68,
  Portugal: 65,
  Senegal: 74,
  "South Africa": 70,
  "South Korea": 67,
  Spain: 60,
  Turkiye: 77,
  "United States": 72,
  Uruguay: 73,
};
const injuryWatch: Partial<Record<string, string>> = {
  Canada: "Davies' absence changes the ceiling, but not the crowd heat.",
  Scotland: "McTominay's fitness watch adds a little uncertainty.",
};

const pairKey = (a: string, b: string) => [a, b].sort().join("|");

const listTeams = (teams: TeamProfile[]) => {
  if (teams.length === 0) return "";
  if (teams.length === 1) return teams[0].name;
  if (teams.length === 2) return `${teams[0].name} and ${teams[1].name}`;
  return `${teams.slice(0, -1).map((team) => team.name).join(", ")}, and ${teams[teams.length - 1].name}`;
};

const buildStoryBeats = (a: TeamProfile, b: TeamProfile) => {
  const hosts = [a, b].filter((team) => hostTeams.has(team.name));
  const debutants = [a, b].filter((team) => debutantTeams.has(team.name));
  const returnees = [a, b].filter((team) => returneeTeams.has(team.name));
  const champions = [a, b].filter((team) => worldChampions.has(team.name));
  const contenders = [a, b].filter((team) => titleContenders.has(team.name));
  const semifinalGlow = [a, b].filter((team) => semifinalGlowTeams.has(team.name));

  const beats = [
    hosts.length > 0 ? `${listTeams(hosts)} bring host-country pressure` : "",
    debutants.length > 0 ? `${listTeams(debutants)} are living a first World Cup` : "",
    returnees.length > 0 ? `${listTeams(returnees)} return with real occasion value` : "",
    champions.length > 0 ? `${listTeams(champions)} carry major-tournament weight` : "",
    semifinalGlow.length > 0 ? `${listTeams(semifinalGlow)} still have semifinal glow` : "",
    contenders.length === 2 ? "both teams look like serious knockout material" : "",
  ].filter(Boolean);

  return beats.slice(0, 2);
};

const formScore = (team: TeamProfile) => teamMomentum[team.name] ?? 64;

const volatilityScore = (team: TeamProfile) => teamVolatility[team.name] ?? 58;

const rivalryHeat = (a: TeamProfile, b: TeamProfile) => {
  const pair = pairKey(a.name, b.name);
  if (rivalryHeatMap[pair]) {
    return rivalryHeatMap[pair];
  }
  if (a.name === b.name) {
    return 0;
  }
  if (hostTeams.has(a.name) || hostTeams.has(b.name)) {
    return 56;
  }
  if (worldChampions.has(a.name) && worldChampions.has(b.name)) {
    return 70;
  }
  return 42;
};

const fixtures: Fixture[] = [
  { id: "A1", dateISO: "2026-06-11", localDate: "Thu, 11 Jun", teamA: "Mexico", teamB: "South Africa", group: "Group A", stadium: "Estadio Azteca", city: "Mexico City", kickoff: "13:00", matchday: 1, bonus: 17, angles: ["Opening match", "Host pressure", "Underdog upset window"] },
  { id: "A2", dateISO: "2026-06-11", localDate: "Thu, 11 Jun", teamA: "South Korea", teamB: "Czechia", group: "Group A", stadium: "Estadio Akron", city: "Zapopan", kickoff: "20:00", matchday: 1, bonus: 4, angles: ["Prime-time opener", "Style contrast"] },
  { id: "B1", dateISO: "2026-06-12", localDate: "Fri, 12 Jun", teamA: "Canada", teamB: "Bosnia and Herzegovina", group: "Group B", stadium: "BMO Field", city: "Toronto", kickoff: "15:00", matchday: 1, bonus: 15, angles: ["Host pressure", "Home crowd"] },
  { id: "D1", dateISO: "2026-06-12", localDate: "Fri, 12 Jun", teamA: "United States", teamB: "Paraguay", group: "Group D", stadium: "SoFi Stadium", city: "Inglewood", kickoff: "18:00", matchday: 1, bonus: 16, angles: ["Host pressure", "Prime-time opener", "CONMEBOL trap game"] },
  { id: "B2", dateISO: "2026-06-13", localDate: "Sat, 13 Jun", teamA: "Qatar", teamB: "Switzerland", group: "Group B", stadium: "Levi's Stadium", city: "Santa Clara", kickoff: "12:00", matchday: 1, bonus: 1, angles: ["Qualification story", "Tactical test"] },
  { id: "C1", dateISO: "2026-06-13", localDate: "Sat, 13 Jun", teamA: "Brazil", teamB: "Morocco", group: "Group C", stadium: "Gillette Stadium", city: "Foxborough", kickoff: "18:00", matchday: 1, bonus: 15, angles: ["Box-office favorite", "African semifinalist", "Upset danger"] },
  { id: "C2", dateISO: "2026-06-13", localDate: "Sat, 13 Jun", teamA: "Haiti", teamB: "Scotland", group: "Group C", stadium: "MetLife Stadium", city: "East Rutherford", kickoff: "21:00", matchday: 1, bonus: 7, angles: ["Historic returns", "Late-night emotion"] },
  { id: "D2", dateISO: "2026-06-13", localDate: "Sat, 13 Jun", teamA: "Australia", teamB: "Turkiye", group: "Group D", stadium: "BC Place", city: "Vancouver", kickoff: "21:00", matchday: 1, bonus: 5, angles: ["Volatile group", "Physical edge"] },
  { id: "E1", dateISO: "2026-06-14", localDate: "Sun, 14 Jun", teamA: "Ivory Coast", teamB: "Ecuador", group: "Group E", stadium: "Lincoln Financial Field", city: "Philadelphia", kickoff: "19:00", matchday: 1, bonus: 7, angles: ["Dark-horse test", "Athletic duel"] },
  { id: "E2", dateISO: "2026-06-14", localDate: "Sun, 14 Jun", teamA: "Germany", teamB: "Curacao", group: "Group E", stadium: "NRG Stadium", city: "Houston", kickoff: "12:00", matchday: 1, bonus: 6, angles: ["Heavyweight vs fairytale", "Debut story"] },
  { id: "F1", dateISO: "2026-06-14", localDate: "Sun, 14 Jun", teamA: "Netherlands", teamB: "Japan", group: "Group F", stadium: "AT&T Stadium", city: "Arlington", kickoff: "15:00", matchday: 1, bonus: 10, angles: ["Technical chess", "Upset danger"] },
  { id: "F2", dateISO: "2026-06-14", localDate: "Sun, 14 Jun", teamA: "Sweden", teamB: "Tunisia", group: "Group F", stadium: "Estadio BBVA", city: "Guadalupe", kickoff: "20:00", matchday: 1, bonus: 1, angles: ["Physical contrast"] },
  { id: "G1", dateISO: "2026-06-15", localDate: "Mon, 15 Jun", teamA: "Iran", teamB: "New Zealand", group: "Group G", stadium: "SoFi Stadium", city: "Inglewood", kickoff: "18:00", matchday: 1, bonus: 1, angles: ["Qualification grind"] },
  { id: "G2", dateISO: "2026-06-15", localDate: "Mon, 15 Jun", teamA: "Belgium", teamB: "Egypt", group: "Group G", stadium: "Lumen Field", city: "Seattle", kickoff: "12:00", matchday: 1, bonus: 9, angles: ["Salah vs Belgium reset", "Star power"] },
  { id: "H1", dateISO: "2026-06-15", localDate: "Mon, 15 Jun", teamA: "Saudi Arabia", teamB: "Uruguay", group: "Group H", stadium: "Hard Rock Stadium", city: "Miami Gardens", kickoff: "18:00", matchday: 1, bonus: 5, angles: ["Upset memory", "CONMEBOL edge"] },
  { id: "H2", dateISO: "2026-06-15", localDate: "Mon, 15 Jun", teamA: "Spain", teamB: "Cape Verde", group: "Group H", stadium: "Mercedes-Benz Stadium", city: "Atlanta", kickoff: "12:00", matchday: 1, bonus: 7, angles: ["Euro champions", "Debut story"] },
  { id: "I1", dateISO: "2026-06-16", localDate: "Tue, 16 Jun", teamA: "France", teamB: "Senegal", group: "Group I", stadium: "MetLife Stadium", city: "East Rutherford", kickoff: "15:00", matchday: 1, bonus: 12, angles: ["Mbappe spotlight", "African contender", "Upset danger"] },
  { id: "I2", dateISO: "2026-06-16", localDate: "Tue, 16 Jun", teamA: "Iraq", teamB: "Norway", group: "Group I", stadium: "Gillette Stadium", city: "Foxborough", kickoff: "18:00", matchday: 1, bonus: 7, angles: ["Haaland World Cup debut", "Emotional return"] },
  { id: "J1", dateISO: "2026-06-16", localDate: "Tue, 16 Jun", teamA: "Argentina", teamB: "Algeria", group: "Group J", stadium: "Arrowhead Stadium", city: "Kansas City", kickoff: "20:00", matchday: 1, bonus: 12, angles: ["Defending champions", "Messi watch", "Prime-time drama"] },
  { id: "J2", dateISO: "2026-06-16", localDate: "Tue, 16 Jun", teamA: "Austria", teamB: "Jordan", group: "Group J", stadium: "Levi's Stadium", city: "Santa Clara", kickoff: "21:00", matchday: 1, bonus: 2, angles: ["Pressing test", "Debut story"] },
  { id: "K1", dateISO: "2026-06-17", localDate: "Wed, 17 Jun", teamA: "Portugal", teamB: "DR Congo", group: "Group K", stadium: "NRG Stadium", city: "Houston", kickoff: "12:00", matchday: 1, bonus: 10, angles: ["Ronaldo watch", "Historic return"] },
  { id: "K2", dateISO: "2026-06-17", localDate: "Wed, 17 Jun", teamA: "Uzbekistan", teamB: "Colombia", group: "Group K", stadium: "Estadio Azteca", city: "Mexico City", kickoff: "20:00", matchday: 1, bonus: 6, angles: ["Debut story", "Colombia form"] },
  { id: "L1", dateISO: "2026-06-17", localDate: "Wed, 17 Jun", teamA: "Ghana", teamB: "Panama", group: "Group L", stadium: "BMO Field", city: "Toronto", kickoff: "19:00", matchday: 1, bonus: 2, angles: ["Spoiler energy"] },
  { id: "L2", dateISO: "2026-06-17", localDate: "Wed, 17 Jun", teamA: "England", teamB: "Croatia", group: "Group L", stadium: "AT&T Stadium", city: "Arlington", kickoff: "15:00", matchday: 1, bonus: 16, angles: ["Modern rivalry", "Star power", "Group-defining opener"] },
  { id: "A3", dateISO: "2026-06-18", localDate: "Thu, 18 Jun", teamA: "Czechia", teamB: "South Africa", group: "Group A", stadium: "Mercedes-Benz Stadium", city: "Atlanta", kickoff: "12:00", matchday: 2, bonus: 2, angles: ["Survival points"] },
  { id: "A4", dateISO: "2026-06-18", localDate: "Thu, 18 Jun", teamA: "Mexico", teamB: "South Korea", group: "Group A", stadium: "Estadio Akron", city: "Zapopan", kickoff: "19:00", matchday: 2, bonus: 13, angles: ["Host pressure", "Group control", "Prime-time heat"] },
  { id: "B3", dateISO: "2026-06-18", localDate: "Thu, 18 Jun", teamA: "Switzerland", teamB: "Bosnia and Herzegovina", group: "Group B", stadium: "SoFi Stadium", city: "Inglewood", kickoff: "12:00", matchday: 2, bonus: 2, angles: ["European stakes"] },
  { id: "B4", dateISO: "2026-06-18", localDate: "Thu, 18 Jun", teamA: "Canada", teamB: "Qatar", group: "Group B", stadium: "BC Place", city: "Vancouver", kickoff: "15:00", matchday: 2, bonus: 11, angles: ["Host crowd", "Must-win mood"] },
  { id: "C3", dateISO: "2026-06-19", localDate: "Fri, 19 Jun", teamA: "Scotland", teamB: "Morocco", group: "Group C", stadium: "Lincoln Financial Field", city: "Philadelphia", kickoff: "18:00", matchday: 2, bonus: 7, angles: ["Fan noise", "Knockout-path points"] },
  { id: "C4", dateISO: "2026-06-19", localDate: "Fri, 19 Jun", teamA: "Brazil", teamB: "Haiti", group: "Group C", stadium: "Gillette Stadium", city: "Foxborough", kickoff: "21:00", matchday: 2, bonus: 3, angles: ["Box-office favorite", "Late-night upset dream"] },
  { id: "D3", dateISO: "2026-06-19", localDate: "Fri, 19 Jun", teamA: "Turkiye", teamB: "Paraguay", group: "Group D", stadium: "Levi's Stadium", city: "Santa Clara", kickoff: "21:00", matchday: 2, bonus: 6, angles: ["Volatile group", "Attack vs edge"] },
  { id: "D4", dateISO: "2026-06-19", localDate: "Fri, 19 Jun", teamA: "United States", teamB: "Australia", group: "Group D", stadium: "Lumen Field", city: "Seattle", kickoff: "12:00", matchday: 2, bonus: 12, angles: ["Host pressure", "Physical test"] },
  { id: "E3", dateISO: "2026-06-20", localDate: "Sat, 20 Jun", teamA: "Germany", teamB: "Ivory Coast", group: "Group E", stadium: "BMO Field", city: "Toronto", kickoff: "16:00", matchday: 2, bonus: 10, angles: ["Heavyweight test", "Athletic duel"] },
  { id: "E4", dateISO: "2026-06-20", localDate: "Sat, 20 Jun", teamA: "Ecuador", teamB: "Curacao", group: "Group E", stadium: "Arrowhead Stadium", city: "Kansas City", kickoff: "19:00", matchday: 2, bonus: 2, angles: ["Debut story", "Dark-horse points"] },
  { id: "F3", dateISO: "2026-06-20", localDate: "Sat, 20 Jun", teamA: "Netherlands", teamB: "Sweden", group: "Group F", stadium: "NRG Stadium", city: "Houston", kickoff: "12:00", matchday: 2, bonus: 8, angles: ["European power", "Striker danger"] },
  { id: "F4", dateISO: "2026-06-20", localDate: "Sat, 20 Jun", teamA: "Tunisia", teamB: "Japan", group: "Group F", stadium: "Estadio BBVA", city: "Guadalupe", kickoff: "22:00", matchday: 2, bonus: 3, angles: ["Style contrast"] },
  { id: "G3", dateISO: "2026-06-21", localDate: "Sun, 21 Jun", teamA: "Belgium", teamB: "Iran", group: "Group G", stadium: "SoFi Stadium", city: "Inglewood", kickoff: "12:00", matchday: 2, bonus: 4, angles: ["Control vs experience"] },
  { id: "G4", dateISO: "2026-06-21", localDate: "Sun, 21 Jun", teamA: "New Zealand", teamB: "Egypt", group: "Group G", stadium: "BC Place", city: "Vancouver", kickoff: "18:00", matchday: 2, bonus: 5, angles: ["Salah gravity", "Upset window"] },
  { id: "H3", dateISO: "2026-06-21", localDate: "Sun, 21 Jun", teamA: "Uruguay", teamB: "Cape Verde", group: "Group H", stadium: "Hard Rock Stadium", city: "Miami Gardens", kickoff: "18:00", matchday: 2, bonus: 5, angles: ["CONMEBOL edge", "Debut story"] },
  { id: "H4", dateISO: "2026-06-21", localDate: "Sun, 21 Jun", teamA: "Spain", teamB: "Saudi Arabia", group: "Group H", stadium: "Mercedes-Benz Stadium", city: "Atlanta", kickoff: "12:00", matchday: 2, bonus: 6, angles: ["Euro champions", "Upset memory"] },
  { id: "I3", dateISO: "2026-06-22", localDate: "Mon, 22 Jun", teamA: "Norway", teamB: "Senegal", group: "Group I", stadium: "MetLife Stadium", city: "East Rutherford", kickoff: "20:00", matchday: 2, bonus: 11, angles: ["Haaland vs Senegal", "Knockout-path points"] },
  { id: "I4", dateISO: "2026-06-22", localDate: "Mon, 22 Jun", teamA: "France", teamB: "Iraq", group: "Group I", stadium: "Lincoln Financial Field", city: "Philadelphia", kickoff: "17:00", matchday: 2, bonus: 4, angles: ["Mbappe spotlight", "Emotional return"] },
  { id: "J3", dateISO: "2026-06-22", localDate: "Mon, 22 Jun", teamA: "Argentina", teamB: "Austria", group: "Group J", stadium: "AT&T Stadium", city: "Arlington", kickoff: "12:00", matchday: 2, bonus: 9, angles: ["Defending champions", "Pressing test"] },
  { id: "J4", dateISO: "2026-06-22", localDate: "Mon, 22 Jun", teamA: "Jordan", teamB: "Algeria", group: "Group J", stadium: "Levi's Stadium", city: "Santa Clara", kickoff: "20:00", matchday: 2, bonus: 4, angles: ["Debut story", "North African pressure"] },
  { id: "K3", dateISO: "2026-06-23", localDate: "Tue, 23 Jun", teamA: "Portugal", teamB: "Uzbekistan", group: "Group K", stadium: "NRG Stadium", city: "Houston", kickoff: "12:00", matchday: 2, bonus: 8, angles: ["Ronaldo watch", "Debut story"] },
  { id: "K4", dateISO: "2026-06-23", localDate: "Tue, 23 Jun", teamA: "Colombia", teamB: "DR Congo", group: "Group K", stadium: "Estadio Akron", city: "Zapopan", kickoff: "20:00", matchday: 2, bonus: 5, angles: ["Colombia form", "Physical danger"] },
  { id: "L3", dateISO: "2026-06-23", localDate: "Tue, 23 Jun", teamA: "England", teamB: "Ghana", group: "Group L", stadium: "Gillette Stadium", city: "Foxborough", kickoff: "16:00", matchday: 2, bonus: 9, angles: ["Star power", "Upset danger"] },
  { id: "L4", dateISO: "2026-06-23", localDate: "Tue, 23 Jun", teamA: "Panama", teamB: "Croatia", group: "Group L", stadium: "BMO Field", city: "Toronto", kickoff: "19:00", matchday: 2, bonus: 3, angles: ["Tournament muscle", "Spoiler chance"] },
  { id: "A5", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "Czechia", teamB: "Mexico", group: "Group A", stadium: "Estadio Azteca", city: "Mexico City", kickoff: "19:00", matchday: 3, bonus: 12, angles: ["Group finale", "Host pressure"] },
  { id: "A6", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "South Africa", teamB: "South Korea", group: "Group A", stadium: "Estadio BBVA", city: "Guadalupe", kickoff: "19:00", matchday: 3, bonus: 7, angles: ["Group finale", "Qualification tension"] },
  { id: "B5", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "Switzerland", teamB: "Canada", group: "Group B", stadium: "BC Place", city: "Vancouver", kickoff: "12:00", matchday: 3, bonus: 12, angles: ["Group finale", "Host pressure"] },
  { id: "B6", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "Bosnia and Herzegovina", teamB: "Qatar", group: "Group B", stadium: "Lumen Field", city: "Seattle", kickoff: "12:00", matchday: 3, bonus: 4, angles: ["Group finale", "Survival points"] },
  { id: "C5", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "Scotland", teamB: "Brazil", group: "Group C", stadium: "Hard Rock Stadium", city: "Miami Gardens", kickoff: "18:00", matchday: 3, bonus: 12, angles: ["Group finale", "Fan noise", "Box-office favorite"] },
  { id: "C6", dateISO: "2026-06-24", localDate: "Wed, 24 Jun", teamA: "Morocco", teamB: "Haiti", group: "Group C", stadium: "Mercedes-Benz Stadium", city: "Atlanta", kickoff: "18:00", matchday: 3, bonus: 7, angles: ["Group finale", "Historic return"] },
  { id: "D5", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Turkiye", teamB: "United States", group: "Group D", stadium: "SoFi Stadium", city: "Inglewood", kickoff: "19:00", matchday: 3, bonus: 16, angles: ["Group finale", "Host pressure", "Volatile matchup"] },
  { id: "D6", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Paraguay", teamB: "Australia", group: "Group D", stadium: "Levi's Stadium", city: "Santa Clara", kickoff: "19:00", matchday: 3, bonus: 6, angles: ["Group finale", "Physical test"] },
  { id: "E5", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Curacao", teamB: "Ivory Coast", group: "Group E", stadium: "Lincoln Financial Field", city: "Philadelphia", kickoff: "16:00", matchday: 3, bonus: 6, angles: ["Group finale", "Fairytale stakes"] },
  { id: "E6", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Ecuador", teamB: "Germany", group: "Group E", stadium: "MetLife Stadium", city: "East Rutherford", kickoff: "16:00", matchday: 3, bonus: 13, angles: ["Group finale", "Heavyweight test", "Dark-horse danger"] },
  { id: "F5", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Japan", teamB: "Sweden", group: "Group F", stadium: "AT&T Stadium", city: "Arlington", kickoff: "18:00", matchday: 3, bonus: 9, angles: ["Group finale", "Style clash"] },
  { id: "F6", dateISO: "2026-06-25", localDate: "Thu, 25 Jun", teamA: "Tunisia", teamB: "Netherlands", group: "Group F", stadium: "Arrowhead Stadium", city: "Kansas City", kickoff: "18:00", matchday: 3, bonus: 6, angles: ["Group finale", "Upset window"] },
  { id: "G5", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "Egypt", teamB: "Iran", group: "Group G", stadium: "Lumen Field", city: "Seattle", kickoff: "20:00", matchday: 3, bonus: 8, angles: ["Group finale", "Regional edge", "Salah gravity"] },
  { id: "G6", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "New Zealand", teamB: "Belgium", group: "Group G", stadium: "BC Place", city: "Vancouver", kickoff: "20:00", matchday: 3, bonus: 5, angles: ["Group finale", "Upset dream"] },
  { id: "H5", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "Cape Verde", teamB: "Saudi Arabia", group: "Group H", stadium: "NRG Stadium", city: "Houston", kickoff: "19:00", matchday: 3, bonus: 6, angles: ["Group finale", "Debut story"] },
  { id: "H6", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "Uruguay", teamB: "Spain", group: "Group H", stadium: "Estadio Akron", city: "Zapopan", kickoff: "18:00", matchday: 3, bonus: 17, angles: ["Group finale", "Title contender collision", "Star power"] },
  { id: "I5", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "Norway", teamB: "France", group: "Group I", stadium: "Gillette Stadium", city: "Foxborough", kickoff: "15:00", matchday: 3, bonus: 16, angles: ["Group finale", "Haaland vs Mbappe", "Star power"] },
  { id: "I6", dateISO: "2026-06-26", localDate: "Fri, 26 Jun", teamA: "Senegal", teamB: "Iraq", group: "Group I", stadium: "BMO Field", city: "Toronto", kickoff: "15:00", matchday: 3, bonus: 6, angles: ["Group finale", "Survival points"] },
  { id: "J5", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "Algeria", teamB: "Austria", group: "Group J", stadium: "Arrowhead Stadium", city: "Kansas City", kickoff: "21:00", matchday: 3, bonus: 8, angles: ["Group finale", "Pressing vs transition"] },
  { id: "J6", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "Jordan", teamB: "Argentina", group: "Group J", stadium: "AT&T Stadium", city: "Arlington", kickoff: "21:00", matchday: 3, bonus: 10, angles: ["Group finale", "Messi watch", "Debut story"] },
  { id: "K5", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "Colombia", teamB: "Portugal", group: "Group K", stadium: "Hard Rock Stadium", city: "Miami Gardens", kickoff: "19:30", matchday: 3, bonus: 17, angles: ["Group finale", "Ronaldo watch", "Luis Diaz danger"] },
  { id: "K6", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "DR Congo", teamB: "Uzbekistan", group: "Group K", stadium: "Mercedes-Benz Stadium", city: "Atlanta", kickoff: "19:30", matchday: 3, bonus: 5, angles: ["Group finale", "Historic returns"] },
  { id: "L5", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "Panama", teamB: "England", group: "Group L", stadium: "MetLife Stadium", city: "East Rutherford", kickoff: "17:00", matchday: 3, bonus: 8, angles: ["Group finale", "England pressure"] },
  { id: "L6", dateISO: "2026-06-27", localDate: "Sat, 27 Jun", teamA: "Croatia", teamB: "Ghana", group: "Group L", stadium: "Lincoln Financial Field", city: "Philadelphia", kickoff: "17:00", matchday: 3, bonus: 9, angles: ["Group finale", "Tournament muscle", "Upset danger"] },
];

const driverIcons: Record<string, LucideIcon> = {
  "Host pressure": UsersRound,
  "Opening match": Trophy,
  "Prime-time opener": Clock3,
  "Star power": Star,
  "Upset danger": ShieldAlert,
  "Upset window": ShieldAlert,
  "Group finale": Target,
  "Group-defining opener": Target,
  "Ronaldo watch": Sparkles,
  "Messi watch": Sparkles,
  "Mbappe spotlight": Sparkles,
  "Haaland World Cup debut": Flame,
  "Haaland vs Mbappe": Flame,
  "Debut story": Medal,
  "Historic returns": Medal,
  "Title contender collision": Trophy,
  "Modern rivalry": Activity,
};

const scoreLabel = (score: number) => {
  if (score >= 85) return "Must Watch";
  if (score >= 70) return "Worth It";
  if (score >= 55) return "Chaos Potential";
  if (score >= 40) return "Background Game";
  return "Sleep Is Fine";
};

const scoreTone = (score: number): ScoreTone => {
  if (score >= 85) return "must";
  if (score >= 70) return "worth";
  if (score >= 55) return "chaos";
  if (score >= 40) return "background";
  return "sleep";
};

const dateLabel = (dateISO: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateISO}T00:00:00Z`));

const moroccoTimeForFixture = (fixture: Fixture) => {
  const [year, month, day] = fixture.dateISO.split("-").map(Number);
  const [hour, minute] = fixture.kickoff.split(":").map(Number);
  const venueOffset = venueUtcOffsetHours[fixture.city];
  if (venueOffset === undefined) {
    throw new Error(`Missing timezone offset for ${fixture.city}`);
  }

  const localUtcMarker = Date.UTC(year, month - 1, day, hour, minute);
  const moroccoWallClock = new Date(
    localUtcMarker + (MOROCCO_UTC_OFFSET_HOURS - venueOffset) * 60 * 60 * 1000,
  );
  const moroccoDateISO = moroccoWallClock.toISOString().slice(0, 10);
  const moroccoKickoff = `${String(moroccoWallClock.getUTCHours()).padStart(2, "0")}:${String(
    moroccoWallClock.getUTCMinutes(),
  ).padStart(2, "0")}`;

  return {
    dateISO: moroccoDateISO,
    dateLabel: dateLabel(moroccoDateISO),
    kickoff: moroccoKickoff,
  };
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const rankQuality = (team: TeamProfile) => {
  const rank = fifaRank[team.name] ?? 75;
  return clamp(104 - rank * 1.08, 8, 100);
};

const kickoffScore = (kickoff: string) => {
  const hour = Number(kickoff.split(":")[0]);
  if (hour >= 18 && hour <= 21) return 10;
  if (hour >= 15 && hour < 18) return 7;
  if (hour >= 12 && hour < 15) return 5;
  return 3;
};

const buildDrivers = (fixture: Fixture, a: TeamProfile, b: TeamProfile, gap: number): ScoreDriver[] => {
  const moroccoTime = moroccoTimeForFixture(fixture);
  const pair = pairKey(a.name, b.name);
  const heat = rivalryHeat(a, b);
  const labels = [
    ...(fixture.angles ?? []),
    hostTeams.has(a.name) || hostTeams.has(b.name) ? "Host pressure" : "",
    debutantTeams.has(a.name) || debutantTeams.has(b.name) ? "Debut story" : "",
    returneeTeams.has(a.name) || returneeTeams.has(b.name) ? "Historic returns" : "",
    heavyweightPairs.has(pair) || heat >= 78 ? "Modern rivalry" : "",
    (a.starPower + b.starPower) / 2 > 82 ? "Star power" : "",
    gap >= 10 && gap <= 28 ? "Upset danger" : "",
    moroccoTime.kickoff >= "18:00" && moroccoTime.kickoff <= "23:59" ? "Prime-time opener" : "",
  ].filter(Boolean);

  const unique = Array.from(new Set(labels)).slice(0, 3);
  return unique.map((label) => ({
    label,
    icon: driverIcons[label] ?? Radio,
  }));
};

const formatRankProxy = (team: TeamProfile) => `#${fifaRank[team.name] ?? 75}`;

const buildLeadLine = (
  fixture: Fixture,
  a: TeamProfile,
  b: TeamProfile,
  stakes: number,
  rivalry: number,
  starPull: number,
  upsetPotential: number,
) => {
  if (fixture.id === "C1") {
    return "Morocco against Brazil is exactly the kind of group-stage tie this app exists for.";
  }
  if (fixture.matchday === 3 && stakes >= 88) {
    return "This is a proper final-day game, with the whole group table lurking behind every mistake.";
  }
  if (rivalry >= 86) {
    return "There is real edge here, not just two respectable names sharing a kickoff slot.";
  }
  if (starPull >= 90) {
    return "The talent level is so high that the match carries itself before the tactics even start.";
  }
  if (upsetPotential >= 74) {
    return "This has the right kind of instability: the favorite is better, but not remotely comfortable.";
  }
  if (fixture.matchday === 1) {
    return "Opening-round games can be cagey on paper and still feel alive because nobody quite knows the true temperature yet.";
  }
  if (fixture.matchday === 2) {
    return "Matchday two usually strips away the warmup period, and that gives this one more bite.";
  }
  return "This is not a headline fixture, but it has enough tension to reward anyone who gives it ninety minutes.";
};

const buildSwingLine = (
  stronger: TeamProfile,
  underdog: TeamProfile,
  rankGap: number,
  playerWatch: string[],
  balance: number,
) => {
  const starOne = playerWatch[0] ?? stronger.players[0];
  const starTwo = playerWatch[1] ?? underdog.players[0];

  if (rankGap <= 8 || balance >= 78) {
    return `${starOne} and ${starTwo} both have enough weight on the ball to swing the mood of the whole night.`;
  }
  if (rankGap <= 18) {
    return `${stronger.name} probably control more phases, but ${underdog.name} have enough live threat to turn one loose sequence into a very different match.`;
  }
  return `${underdog.name} are unlikely to own the flow, but one hot spell from ${starTwo} is enough to force ${stronger.name} into a nervous game.`;
};

const buildPressureLine = (fixture: Fixture, stage: string) => {
  if (fixture.matchday === 3) {
    return `It is the last group day in ${stage}, so scoreline math and qualification pressure are part of the entertainment.`;
  }
  if (fixture.matchday === 2) {
    return "This is the point in the group where one result can calm everything and one bad result can create real panic.";
  }
  return "First-game uncertainty helps here: plans are cleaner before kickoff than they usually look by full time.";
};

const buildQualityLine = (
  a: TeamProfile,
  b: TeamProfile,
  rankGap: number,
  quality: number,
  upsetPotential: number,
) => {
  if (rankGap <= 10) {
    return `${a.name} and ${b.name} both arrive with a serious enough level that the game should stay honest deep into it.`;
  }
  if (quality >= 78 && upsetPotential >= 70) {
    return `There is a favorite, but the underdog is too competent for this to feel like filler.`;
  }
  if (rankGap >= 28) {
    return `The quality gap is real, so the score leans on whether the outsider can make the favorite uncomfortable early.`;
  }
  return `The level here is solid, and the gap is small enough that the game can stay alive longer than the rankings suggest.`;
};

const buildTimeLine = (moroccoKickoff: string, kickoffWatch: number) => {
  if (kickoffWatch >= 10) {
    return `It lands at ${moroccoKickoff} in Morocco, which is a genuinely friendly hour for a match worth locking into.`;
  }
  if (kickoffWatch >= 7) {
    return `The ${moroccoKickoff} Morocco kickoff is still very watchable, especially if you want one good game without wrecking the rest of the day.`;
  }
  return `The Morocco kickoff is ${moroccoKickoff}, so the score needs to work harder because the slot is doing it no favors.`;
};

const buildInjuryLine = (a: TeamProfile, b: TeamProfile) => injuryWatch[a.name] || injuryWatch[b.name] || "";

const toMatch = (fixture: Fixture): Omit<Match, "rank"> => {
  const a = teamProfiles[fixture.teamA];
  const b = teamProfiles[fixture.teamB];
  const moroccoTime = moroccoTimeForFixture(fixture);
  const rankA = fifaRank[a.name] ?? 75;
  const rankB = fifaRank[b.name] ?? 75;
  const rankGap = Math.abs(rankA - rankB);
  const strengthGap = Math.abs(a.strength - b.strength);
  const quality = clamp((rankQuality(a) + rankQuality(b) + a.strength + b.strength) / 4, 10, 100);
  const qualityGap = clamp(100 - strengthGap * 2.2, 8, 100);
  const balance = clamp((qualityGap * 0.65) + (100 - rankGap * 1.1) * 0.35, 8, 100);
  const starPull = (a.starPower + b.starPower) / 2;
  const fanPull = (a.fanInterest + b.fanInterest) / 2;
  const form = (formScore(a) + formScore(b)) / 2;
  const matchdayPressure = fixture.matchday === 3 ? 98 : fixture.matchday === 2 ? 66 : 36;
  const hostBoost = hostTeams.has(a.name) || hostTeams.has(b.name) ? 9 : 0;
  const contenderClash = titleContenders.has(a.name) && titleContenders.has(b.name) ? 12 : rankA <= 20 && rankB <= 20 ? 8 : rankA <= 35 && rankB <= 35 ? 4 : 0;
  const rivalry = rivalryHeat(a, b);
  const volatility = (volatilityScore(a) + volatilityScore(b)) / 2;
  const upsetPotential = clamp(
    30 +
      (rankGap >= 8 && rankGap <= 28 ? 26 : rankGap > 28 && rankGap <= 42 ? 18 : 6) +
      volatility * 0.22 +
      Math.min(a.strength, b.strength) * 0.12 -
      Math.max(0, rankGap - 32) * 0.5,
    8,
    96,
  );
  const narrative =
    clamp(
      28 +
        (debutantTeams.has(a.name) || debutantTeams.has(b.name) ? 14 : 0) +
        (returneeTeams.has(a.name) || returneeTeams.has(b.name) ? 10 : 0) +
        (semifinalGlowTeams.has(a.name) || semifinalGlowTeams.has(b.name) ? 12 : 0) +
        (hostTeams.has(a.name) || hostTeams.has(b.name) ? 16 : 0) +
        (worldChampions.has(a.name) || worldChampions.has(b.name) ? 8 : 0) +
        (heavyweightPairs.has(pairKey(a.name, b.name)) ? 12 : 0),
      10,
      100,
    );
  const stakes = clamp(matchdayPressure * 0.78 + contenderClash * 3 + rivalry * 0.16 + hostBoost * 1.8 + (fixture.bonus ?? 0) * 1.3, 12, 100);
  const openingBoost = fixture.id === "A1" ? 6 : 0;
  const moroccoMarqueeBonus = fixture.id === "C1" ? 18 : 0;
  const maxScore = fixture.id === "C1" ? 99 : 95;
  const kickoffWatch = kickoffScore(moroccoTime.kickoff);
  const raw =
    14 +
    quality * 0.12 +
    balance * 0.12 +
    starPull * 0.12 +
    fanPull * 0.07 +
    stakes * 0.14 +
    upsetPotential * 0.1 +
    rivalry * 0.05 +
    narrative * 0.04 +
    form * 0.04 +
    kickoffWatch * 1.2 +
    openingBoost * 0.7 +
    moroccoMarqueeBonus * 0.75;
  const score = Math.round(clamp(raw, 22, maxScore));
  const stronger = rankA <= rankB ? a : b;
  const underdog = rankA > rankB ? a : b;
  const playerWatch = Array.from(new Set([...a.players.slice(0, 2), ...b.players.slice(0, 2)])).slice(0, 4);
  const storyBeats = buildStoryBeats(a, b);
  const lead = buildLeadLine(fixture, a, b, stakes, rivalry, starPull, upsetPotential);
  const swingLine = buildSwingLine(stronger, underdog, rankGap, playerWatch, balance);
  const pressureLine = buildPressureLine(fixture, fixture.group);
  const qualityLine = buildQualityLine(a, b, rankGap, quality, upsetPotential);
  const timeLine = buildTimeLine(moroccoTime.kickoff, kickoffWatch);
  const injuryLine = buildInjuryLine(a, b);
  const proxyLine =
    rankGap <= 12
      ? `On ranking proxies this is ${formatRankProxy(a)} against ${formatRankProxy(b)}, so nobody gets to hide behind a soft opponent.`
      : "";
  const storyLine = storyBeats.length > 0 ? `${storyBeats.join(". ")}.` : "";
  const note = [lead, storyLine, swingLine].filter(Boolean).join(" ").trim();
  const explanation = [pressureLine, qualityLine, proxyLine, timeLine, injuryLine].filter(Boolean).join(" ").trim();

  return {
    id: fixture.id,
    dateISO: moroccoTime.dateISO,
    dateLabel: moroccoTime.dateLabel,
    teams: [
      { name: a.name, flagCode: a.flagCode },
      { name: b.name, flagCode: b.flagCode },
    ],
    kickoff: moroccoTime.kickoff,
    stadium: `${fixture.stadium}, ${fixture.city}`,
    stage: `${fixture.group} - Matchday ${fixture.matchday}`,
    group: fixture.group,
    status: "scheduled",
    score,
    scoreLabel: scoreLabel(score),
    tone: scoreTone(score),
    note,
    explanation,
    playerWatch,
    drivers: buildDrivers(fixture, a, b, strengthGap),
    scoreFactors: {
      stakes,
      quality,
      qualityGap,
      balance,
      starPower: starPull,
      fanInterest: fanPull,
      matchdayPressure,
      rankGap,
      hostBoost,
      upsetPotential,
      kickoffWatch,
      moroccoMarqueeBonus,
      rivalryHeat: rivalry,
      narrative,
      form,
    },
  };
};

export const allMatches: Match[] = fixtures
  .map(toMatch)
  .sort((a, b) => b.score - a.score || a.dateISO.localeCompare(b.dateISO))
  .map((match, index) => ({ ...match, rank: index + 1 }));

export const chronologicalMatches: Match[] = [...allMatches].sort(
  (a, b) => a.dateISO.localeCompare(b.dateISO) || a.kickoff.localeCompare(b.kickoff),
);

const openingSlateIds = new Set(fixtures.filter((fixture) => fixture.dateISO <= "2026-06-13").map((fixture) => fixture.id));

export const openingSlateMatches = allMatches.filter((match) => openingSlateIds.has(match.id)).slice(0, 5);

export const today = {
  label: "Opening slate",
  date: "Jun 11-13",
};

export const featuredMatch: Match = openingSlateMatches[0];

export const nextBestMatches: Match[] = openingSlateMatches.slice(1, 5);

export const availableDates = Array.from(
  new Map(chronologicalMatches.map((match) => [match.dateISO, match.dateLabel])).entries(),
).map(([value, label]) => ({ value, label }));

export const matchDataSource = {
  schedule: "Open World Cup 2026 schedule snapshot derived from FIFA's published match schedule and the current 2026 World Cup group pages.",
  rankings: "Team ranking proxies seeded from the November 19, 2025 FIFA Men's World Ranking used for the final draw, with editorial momentum adjustments.",
  updatedAt: "2026-06-12",
};

export const navItems = [
  { label: "Today", icon: Target, href: "/" },
  { label: "Ranked", icon: Activity, href: "/rankings" },
  { label: "Watchlist", icon: Sparkles, href: "/watchlist" },
  { label: "Settings", icon: Goal, href: "/settings" },
];
