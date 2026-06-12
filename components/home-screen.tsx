"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { MatchStatePill } from "@/components/match-state-pill";
import { ScoreBreakdown } from "@/components/score-breakdown";
import {
  navItems,
  today,
  type Match,
  type ScoreTone,
} from "@/lib/matches";
import { useWorldCupMatches } from "@/lib/live-world-cup";
import { getHomeSlate, getTodayPulse, getWindowCounts } from "@/lib/match-intelligence";
import { useVibeScoutSettings } from "@/lib/settings";
import { useWatchlist } from "@/lib/watchlist";
import { applyMatchSettings, type DisplayMatch } from "@/lib/preference-scoring";

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

export function HomeScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const watchlist = useWatchlist();
  const { settings } = useVibeScoutSettings();
  const { matches: worldCupMatches } = useWorldCupMatches();
  
  const displayMatches = useMemo(
    () => applyMatchSettings(worldCupMatches, settings),
    [settings, worldCupMatches]
  );

  const homeSlate = useMemo(() => getHomeSlate(displayMatches), [displayMatches]);
  const fallbackMatches = useMemo(
    () => applyMatchSettings(worldCupMatches, { ...settings, hideOvernight: false, hidePassedGames: false }),
    [settings, worldCupMatches],
  );
  const fallbackUpcomingMatches = useMemo(
    () => fallbackMatches.filter((match) => match.status !== "played"),
    [fallbackMatches],
  );
  const activeHomeMatches = homeSlate.matches.length > 0 ? homeSlate.matches : fallbackUpcomingMatches;
  const displayFeaturedMatch = activeHomeMatches[0] || fallbackMatches[0];
  const displayNextBest = activeHomeMatches.slice(1, 4);
  const windowCounts = useMemo(() => getWindowCounts(homeSlate.matches), [homeSlate.matches]);
  const todayPulse = useMemo(() => getTodayPulse(displayMatches), [displayMatches]);

  if (!displayFeaturedMatch) {
    return null;
  }

  const [score, setScore] = useState(displayFeaturedMatch.displayScore);
  const [showFeaturedWhy, setShowFeaturedWhy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const saved = watchlist.isSaved(displayFeaturedMatch.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches || settings.reduceMotion;
  }, [settings.reduceMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setScore(displayFeaturedMatch.displayScore);
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.85,
      lerp: 0.08,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".js-logo, .js-action",
        { autoAlpha: 0, y: -10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.06,
          ease: "power4.out",
        },
      );
      gsap.fromTo(
        ".js-hero-line",
        { yPercent: 105, rotate: 1.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "expo.out",
          delay: 0.08,
        },
      );
      gsap.fromTo(
        ".js-fade",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.16,
        },
      );
      gsap.fromTo(
        ".js-ticket",
        { autoAlpha: 0, y: 28, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.68,
          stagger: 0.07,
          ease: "expo.out",
          delay: 0.24,
        },
      );
      gsap.fromTo(
        ".js-image-drift",
        { y: 0, scale: 1.015 },
        {
          y: -10,
          scale: 1.03,
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      );

      const counter = { value: 0 };
      gsap.to(counter, {
        value: displayFeaturedMatch.displayScore,
        duration: 1.25,
        ease: "power4.out",
        delay: 0.42,
        onUpdate: () => setScore(Math.round(counter.value)),
      });
    }, root);

    return () => {
      ctx.revert();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [displayFeaturedMatch.displayScore, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const target = scoreRef.current;
    if (!target) {
      return;
    }
    gsap.fromTo(
      target,
      { scale: 0.985 },
      { scale: 1, duration: 0.2, ease: "power3.out" },
    );
  }, [score, reducedMotion]);

  const toggleSaved = () => {
    watchlist.toggle(displayFeaturedMatch.id);
  };

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-hidden bg-[var(--vs-bg)] text-[var(--vs-ink)]">
      <a className="skip-link" href="#main-content">
        Skip to match recommendations
      </a>
      <div className="screen-shell">
        <header className="topbar" aria-label="VibeScout header">
          <Link className="brand-lockup js-logo" href="/" aria-label="VibeScout 2026 home">
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
          <div className="header-actions" aria-label="Home actions">
            <Link className="icon-button js-action" href="/rankings" aria-label="Search matches">
              <Search aria-hidden="true" size={23} strokeWidth={2.35} />
            </Link>
            <Link className="icon-button js-action" href="/settings" aria-label="Open score and schedule settings">
              <SlidersHorizontal aria-hidden="true" size={24} strokeWidth={2.25} />
            </Link>
          </div>
        </header>

        <main id="main-content" className="main-content">
          <section className="hero-section" aria-labelledby="home-title">
            <div className="date-row js-fade" aria-label={`${today.label}, ${homeSlate.dateLabel || today.date}`}>
              <CalendarDays aria-hidden="true" size={20} />
              <span>{today.label}</span>
              <span className="date-dot" aria-hidden="true" />
              <span>{homeSlate.dateLabel || today.date}</span>
            </div>

            <div className="hero-rule js-fade" aria-hidden="true" />

            <h1 id="home-title" className="hero-title" aria-label="Watch Wisely.">
              <span className="hero-line-wrap">
                <span className="js-hero-line">Watch</span>
              </span>
              <span className="hero-line-wrap">
                <span className="js-hero-line">Wisely.</span>
              </span>
            </h1>

            <p className="hero-tagline js-fade">
              A World Cup schedule ranked by <em>drama</em>, not date.
            </p>

            <div className="fan-proof js-fade" aria-label="Today watch windows">
              <span suppressHydrationWarning>{mounted ? windowCounts.soon : "-" } soon</span>
              <span aria-hidden="true"> / </span>
              <span suppressHydrationWarning>{mounted ? windowCounts.tonight : "-" } tonight</span>
              <span aria-hidden="true"> / </span>
              <span suppressHydrationWarning>{mounted ? windowCounts.late : "-" } late</span>
            </div>

            <figure className="archival-frame js-fade">
              <Image
                className="archival-image js-image-drift"
                src="/images/archival-football-hero.png"
                alt="Archival black-and-white footballer raising an arm inside a packed stadium."
                width={1024}
                height={1792}
                sizes="100vw"
                unoptimized
              />
              <span className="archival-gold" aria-hidden="true" />
              <span className="archival-ring ring-one" aria-hidden="true" />
              <span className="archival-ring ring-two" aria-hidden="true" />
            </figure>
          </section>

          <section className="featured-ticket js-ticket" aria-labelledby="featured-match-title">
            <div className="ticket-label">
              <Star aria-hidden="true" size={17} fill="currentColor" />
              <span>Best Match Tonight</span>
            </div>

            <div className="featured-grid">
              <div className="match-info">
                <h2 id="featured-match-title" className="sr-only">
                  {displayFeaturedMatch.teams[0].name} versus {displayFeaturedMatch.teams[1].name}
                </h2>
                <TeamStack match={displayFeaturedMatch} size="large" />

              <div className="match-meta" aria-label="Kickoff and stadium">
                  <MatchStatePill match={displayFeaturedMatch} />
                  {displayFeaturedMatch.scoreline ? (
                    <>
                      <span className="stage-pill">{displayFeaturedMatch.scoreline} final</span>
                    </>
                  ) : null}
                  <span>
                    <CalendarDays aria-hidden="true" size={18} />
                    {displayFeaturedMatch.dateLabel}
                  </span>
                  <span className="meta-separator" aria-hidden="true" />
                  <span>
                    <Clock3 aria-hidden="true" size={18} />
                    {displayFeaturedMatch.kickoff} MA time
                  </span>
                  <span className="meta-separator" aria-hidden="true" />
                  <span>
                    <MapPin aria-hidden="true" size={20} />
                    {displayFeaturedMatch.stadium}
                  </span>
                </div>

                <span className="stage-pill">{displayFeaturedMatch.stage}</span>
                <p className="single-watch-call">If you only watch one, make it this.</p>
                <p className="scout-note">{displayFeaturedMatch.note}</p>
              </div>

              <div
                ref={scoreRef}
                className={`score-orbit ${scoreToneClass[displayFeaturedMatch.displayTone]}`}
                style={{ "--score": score } as ScoreStyle}
                aria-label={`Vibe Score ${score} out of 100. ${displayFeaturedMatch.displayScoreLabel}.`}
              >
                <div className="score-core">
                  <span className="score-kicker">Vibe Score</span>
                  <strong>{score}</strong>
                  <span>{displayFeaturedMatch.displayScoreLabel}</span>
                  <small>Vibe Score /100</small>
                </div>
                <div className="score-gauge" aria-hidden="true">
                  <span className="score-gauge-label">Drama reading</span>
                  <span className="score-track">
                    <span className="score-fill" />
                    <span className="score-pin" />
                  </span>
                  <span className="score-scale">
                    <span>Skip</span>
                    <span>Worth it</span>
                    <span>Must</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="drivers-row" aria-label="Score drivers">
              <span className="drivers-title">Score Drivers</span>
              <div className="drivers-list">
                {displayFeaturedMatch.drivers?.map((driver) => (
                  <span key={driver.label} className="driver-chip">
                    <driver.icon aria-hidden="true" size={24} strokeWidth={1.9} />
                    {driver.label}
                  </span>
                ))}
              </div>
              <button
                className="why-button"
                type="button"
                aria-expanded={showFeaturedWhy}
                onClick={() => setShowFeaturedWhy((current) => !current)}
              >
                {showFeaturedWhy ? "Hide score read" : "Why this score?"}
                <ChevronRight aria-hidden="true" size={19} />
              </button>
              <p className="featured-explanation">{displayFeaturedMatch.explanation}</p>
              {showFeaturedWhy ? <ScoreBreakdown match={displayFeaturedMatch} /> : null}
            </div>
          </section>

          {mounted && todayPulse.length > 0 ? (
            <section className="pulse-panel js-ticket" aria-labelledby="pulse-title">
              <div className="section-heading">
                <h2 id="pulse-title">What changed today</h2>
              </div>
              <div className="pulse-list">
                {todayPulse.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="next-section js-ticket" aria-labelledby="next-title">
            <div className="section-heading">
              <h2 id="next-title">Next Best Matches</h2>
              <Link href="/rankings">View full schedule</Link>
            </div>
            <div className="match-list" role="list">
              {displayNextBest.map((match) => (
                <MatchRow key={match.id} match={match} saved={watchlist.isSaved(match.id)} onToggleSaved={() => watchlist.toggle(match.id)} />
              ))}
            </div>
          </section>

          <section className="watchlist-cta js-ticket" aria-labelledby="watchlist-title">
            <div className="watchlist-icon" aria-hidden="true">
              <Bookmark size={26} />
            </div>
            <div>
              <h2 id="watchlist-title">Save your must watches</h2>
              <p>Never miss a match worth your time.</p>
            </div>
            <button
              className={saved ? "watchlist-button is-saved" : "watchlist-button"}
              type="button"
              aria-pressed={saved}
              onClick={toggleSaved}
            >
              {saved ? "Saved to Watchlist" : "Save Top Match"}
            </button>
          </section>
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Primary">
        <div className="bottom-nav-inner">
          {navItems.map((item) => (
            item.href ? (
              <Link
                key={item.label}
                className={item.label === "Today" ? "nav-item active" : "nav-item"}
                href={item.href}
                aria-current={item.label === "Today" ? "page" : undefined}
              >
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
              </Link>
            ) : (
            <button key={item.label} className="nav-item" type="button">
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
            </button>
            )
          ))}
        </div>
      </nav>
    </div>
  );
}

function TeamStack({ match, size }: { match: Match | DisplayMatch; size: "large" | "compact" }) {
  return (
    <div className={size === "large" ? "team-stack large" : "team-stack compact"}>
      {match.teams.map((team) => (
        <div className="team-line" key={team.name}>
          <Flag code={team.flagCode} label={team.name} />
          <span>{team.name}</span>
        </div>
      ))}
    </div>
  );
}

function MatchRow({
  match,
  saved,
  onToggleSaved,
}: {
  match: DisplayMatch;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="match-row" role="listitem" aria-label={`${match.teams[0].name} versus ${match.teams[1].name}`}>
      <div className="row-rank" aria-label={`Rank ${match.displayRank}`}>
        {match.displayRank}
      </div>
      <TeamStack match={match} size="compact" />
      <div className="row-meta">
        <strong>{match.dateLabel}</strong>
        {match.scoreline ? <span>{match.scoreline} final</span> : null}
        <span>{match.kickoff} MA time</span>
        <span>{match.stadium}</span>
        <small>{match.stage}</small>
        <MatchStatePill match={match} />
      </div>
      <div className="row-score-wrap">
        <MiniScoreBox match={match} />
        <div className="row-actions">
          <button
            className={saved ? "row-save is-saved" : "row-save"}
            type="button"
            aria-pressed={saved}
            aria-label={`${saved ? "Remove" : "Save"} ${match.teams[0].name} versus ${match.teams[1].name}`}
            onClick={onToggleSaved}
          >
            {saved ? <BookmarkCheck aria-hidden="true" size={18} /> : <Bookmark aria-hidden="true" size={18} />}
          </button>
          <button
            className={expanded ? "row-expand is-open" : "row-expand"}
            type="button"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Hide" : "Show"} explanation for ${match.teams[0].name} versus ${match.teams[1].name}`}
            onClick={() => setExpanded((current) => !current)}
          >
            <ChevronDown aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
      {expanded ? (
        <div className="row-explanation">
          <p>{match.explanation}</p>
          <span>{match.note}</span>
          <ScoreBreakdown match={match} />
        </div>
      ) : null}
    </article>
  );
}

function MiniScoreBox({ match }: { match: DisplayMatch }) {
  const isPlayed = match.status === "played" && match.scoreline;

  if (isPlayed) {
    return (
      <div className="mini-score mini-result" aria-label={`Final score ${match.scoreline}.`}>
        <strong>{match.scoreline}</strong>
        <span>Final score</span>
      </div>
    );
  }

  return (
    <div
      className={`mini-score ${scoreToneClass[match.displayTone]}`}
      style={{ "--score": match.displayScore } as ScoreStyle}
      aria-label={`Vibe Score ${match.displayScore} out of 100. ${match.displayScoreLabel}.`}
    >
      <strong>{match.displayScore}</strong>
      <span>{match.displayScoreLabel}</span>
    </div>
  );
}

function Flag({ code, label }: { code: string; label: string }) {
  return (
    <Image
      className="flag"
      src={`https://flagcdn.com/w80/${code}.png`}
      width={80}
      height={60}
      sizes="(min-width: 390px) 42px, 35px"
      alt=""
      aria-hidden="true"
      loading="lazy"
      unoptimized
      data-flag-label={`${label} flag`}
    />
  );
}
