"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { Bookmark, BookmarkCheck, CalendarDays, ChevronDown, Clock3, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { MatchStatePill } from "@/components/match-state-pill";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { navItems, type Match, type ScoreTone } from "@/lib/matches";
import { useWorldCupMatches } from "@/lib/live-world-cup";
import { applyMatchSettings, type DisplayMatch } from "@/lib/preference-scoring";
import { useVibeScoutSettings } from "@/lib/settings";
import { useWatchlist } from "@/lib/watchlist";

type ScoreStyle = React.CSSProperties & {
  "--score": number;
};

const scoreToneClass: Record<ScoreTone, string> = {
  must: "score-must",
  worth: "score-worth",
  chaos: "score-chaos",
  background: "score-background",
  sleep: "score-sleep",
};

export function RankingsScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const { settings } = useVibeScoutSettings();
  const watchlist = useWatchlist();
  const { matches: worldCupMatches } = useWorldCupMatches();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || settings.reduceMotion;
    if (reducedMotion || !rootRef.current) {
      return;
    }

    const lenis = new Lenis({ duration: 0.82, lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".js-rank-in",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.045, ease: "power4.out" },
      );
    }, rootRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [settings.reduceMotion]);

  const rankedMatches = useMemo(() => applyMatchSettings(worldCupMatches, settings), [settings, worldCupMatches]);
  const availableDates = useMemo(
    () =>
      Array.from(new Map(applyMatchSettings(worldCupMatches, settings).map((match) => [match.dateISO, match.dateLabel])).entries()).map(
        ([value, label]) => ({ value, label }),
      ),
    [settings, worldCupMatches],
  );

  const filteredMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rankedMatches.filter((match) => {
      const matchesDate = dateFilter === "all" || match.dateISO === dateFilter;
      const haystack = [
        match.dateLabel,
        match.group,
        match.stage,
        match.stadium,
        match.displayScoreLabel,
        match.teams[0].name,
        match.teams[1].name,
        ...match.playerWatch,
      ]
        .join(" ")
        .toLowerCase();
      return matchesDate && (!normalized || haystack.includes(normalized));
    });
  }, [dateFilter, query, rankedMatches]);

  const focusSearch = () => {
    const prefersReducedMotion =
      settings.reduceMotion ||
      (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    searchInputRef.current?.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
    searchInputRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-hidden bg-[var(--vs-bg)] text-[var(--vs-ink)]">
      <a className="skip-link" href="#ranking-results">
        Skip to ranked matches
      </a>
      <div className="screen-shell rankings-shell">
        <header className="topbar" aria-label="VibeScout rankings header">
          <Link className="brand-lockup js-rank-in" href="/" aria-label="VibeScout 2026 home">
            <Image
              className="brand-logo"
              src="/brand/vibescout-logo-lockup.png"
              alt=""
              width={1113}
              height={399}
              priority
              unoptimized
            />
          </Link>
          <div className="header-actions" aria-label="Ranking actions">
            <button className="icon-button js-rank-in" type="button" aria-label="Focus ranking search" onClick={focusSearch}>
              <Search aria-hidden="true" size={23} strokeWidth={2.35} />
            </button>
            <Link className="icon-button js-rank-in" href="/settings" aria-label="Open score and schedule settings">
              <SlidersHorizontal aria-hidden="true" size={24} strokeWidth={2.25} />
            </Link>
          </div>
        </header>

        <main className="rankings-main">
          <section className="rankings-hero js-rank-in" aria-labelledby="rankings-title">
            <div className="date-row">
              <CalendarDays aria-hidden="true" size={20} />
              <span>World Cup 2026</span>
              <span className="date-dot" aria-hidden="true" />
              <span>72 group matches</span>
            </div>
            <h1 id="rankings-title">Full Vibe Ranking.</h1>
            <p>
              Search a day or a team. Every group-stage fixture gets a score, a reason, a watch window, and a cleaner editorial read.
            </p>
          </section>

          <section className="ranking-controls js-rank-in" aria-label="Ranking filters">
            <label className="ranking-search">
              <Search aria-hidden="true" size={18} />
              <span className="sr-only">Search by day, team, player, or stadium</span>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search team, day, player..."
                type="search"
              />
            </label>
            <div className="date-filter-row" aria-label="Filter by date">
              <button
                className={dateFilter === "all" ? "date-chip active" : "date-chip"}
                type="button"
                onClick={() => setDateFilter("all")}
              >
                All days
              </button>
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  className={dateFilter === date.value ? "date-chip active" : "date-chip"}
                  type="button"
                  onClick={() => setDateFilter(date.value)}
                >
                  {date.label}
                </button>
              ))}
            </div>
          </section>

          <section id="ranking-results" className="ranking-results" aria-label="Ranked World Cup matches">
            <div className="ranking-count js-rank-in">
              <span>{filteredMatches.length}</span>
              <p>{filteredMatches.length === 1 ? "match found" : "matches found"}</p>
            </div>
            <div className="ranking-list" role="list">
              {filteredMatches.map((match) => (
                <RankingCard
                  key={match.id}
                  match={match}
                  saved={watchlist.isSaved(match.id)}
                  onToggle={() => watchlist.toggle(match.id)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <PrimaryNav activeLabel="Ranked" />
    </div>
  );
}

function RankingCard({
  match,
  saved,
  onToggle,
}: {
  match: DisplayMatch;
  saved: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="ranking-card js-rank-in" role="listitem">
      <div className="ranking-card-top">
        <span className="ranking-position">#{match.displayRank}</span>
        <div className="ranking-card-actions">
          <span className="ranking-date">{match.dateLabel}</span>
          <button
            className={saved ? "card-save-button is-saved" : "card-save-button"}
            type="button"
            aria-pressed={saved}
            aria-label={`${saved ? "Remove" : "Save"} ${match.teams[0].name} versus ${match.teams[1].name}`}
            onClick={onToggle}
          >
            {saved ? <BookmarkCheck aria-hidden="true" size={17} /> : <Bookmark aria-hidden="true" size={17} />}
          </button>
        </div>
      </div>
      <div className="ranking-card-body">
        <div className="ranking-teams">
          <TeamLine team={match.teams[0]} />
          <TeamLine team={match.teams[1]} />
        </div>
        <ScoreBox match={match} />
      </div>
      <div className="ranking-meta">
        <MatchStatePill match={match} />
        {match.scoreline ? <span>{match.scoreline} final</span> : null}
        <span>
          <Clock3 aria-hidden="true" size={16} />
          {match.kickoff} MA time
        </span>
        <span>
          <MapPin aria-hidden="true" size={17} />
          {match.stadium}
        </span>
      </div>
      <p className="ranking-note">{match.note}</p>
      
      <div className="ranking-drivers" aria-label="Score drivers">
        {match.drivers.map((driver) => (
          <span key={driver.label}>
            <driver.icon aria-hidden="true" size={15} />
            {driver.label}
          </span>
        ))}
      </div>
      <button
        className={expanded ? "ranking-detail-button is-open" : "ranking-detail-button"}
        type="button"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Hide" : "Show"} description for ${match.teams[0].name} versus ${match.teams[1].name}`}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{expanded ? "Hide description" : "Show description"}</span>
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      {expanded ? (
        <div className="ranking-expanded">
          <p className="ranking-explanation">{match.explanation}</p>
          <ScoreBreakdown match={match} />
        </div>
      ) : null}
    </article>
  );
}

function ScoreBox({ match }: { match: DisplayMatch }) {
  const isPlayed = match.status === "played" && match.scoreline;

  if (isPlayed) {
    return (
      <div className="ranking-score ranking-result" aria-label={`Final score ${match.scoreline}.`}>
        <strong>{match.scoreline}</strong>
        <span>Final score</span>
      </div>
    );
  }

  return (
    <div
      className={`ranking-score ${scoreToneClass[match.displayTone]}`}
      style={{ "--score": match.displayScore } as ScoreStyle}
      aria-label={`Vibe Score ${match.displayScore} out of 100. ${match.displayScoreLabel}.`}
    >
      <strong>{match.displayScore}</strong>
      <span>{match.displayScoreLabel}</span>
    </div>
  );
}

function TeamLine({ team }: { team: Match["teams"][number] }) {
  return (
    <div className="ranking-team-line">
      <Image
        className="flag"
        src={`https://flagcdn.com/w80/${team.flagCode}.png`}
        width={80}
        height={60}
        sizes="40px"
        alt=""
        aria-hidden="true"
        loading="lazy"
        unoptimized
      />
      <span>{team.name}</span>
    </div>
  );
}

function PrimaryNav({ activeLabel }: { activeLabel: string }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const active = activeLabel === item.label;
          const content = (
            <>
              <span className="nav-icon" aria-hidden="true">
                {item.label === "Today" ? (
                  <Image
                    className="nav-brand-icon"
                    src="/brand/vibescout-icon.png"
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                  />
                ) : (
                  <item.icon size={23} strokeWidth={2.05} />
                )}
              </span>
              <span>{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                className={active ? "nav-item active" : "nav-item"}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button key={item.label} className="nav-item" type="button">
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
