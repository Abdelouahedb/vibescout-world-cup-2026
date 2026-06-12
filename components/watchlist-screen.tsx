"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { Bookmark, CalendarDays, Clock3, MapPin, Search, Trash2 } from "lucide-react";
import { navItems, type Match, type ScoreTone } from "@/lib/matches";
import { useWorldCupMatches } from "@/lib/live-world-cup";
import { applyMatchSettings, type DisplayMatch } from "@/lib/preference-scoring";
import { useVibeScoutSettings } from "@/lib/settings";
import { useWatchlist } from "@/lib/watchlist";

const scoreToneClass: Record<ScoreTone, string> = {
  must: "score-must",
  worth: "score-worth",
  chaos: "score-chaos",
  background: "score-background",
  sleep: "score-sleep",
};

export function WatchlistScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watchlist = useWatchlist();
  const { settings } = useVibeScoutSettings();
  const { matches: worldCupMatches } = useWorldCupMatches();
  const savedMatches = useMemo(
    () => {
      const savedRaw = watchlist.savedIds
        .map((id) => worldCupMatches.find((match) => match.id === id))
        .filter((match): match is Match => Boolean(match));

      return applyMatchSettings(savedRaw, settings).sort(
        (a, b) => a.dateISO.localeCompare(b.dateISO) || a.kickoff.localeCompare(b.kickoff),
      );
    },
    [settings, watchlist.savedIds, worldCupMatches],
  );

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
        ".js-watch-in",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.055, ease: "power4.out" },
      );
    }, rootRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [settings.reduceMotion]);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-hidden bg-[var(--vs-bg)] text-[var(--vs-ink)]">
      <a className="skip-link" href="#watchlist-content">
        Skip to saved matches
      </a>
      <div className="screen-shell watchlist-shell">
        <header className="topbar" aria-label="VibeScout watchlist header">
          <Link className="brand-lockup js-watch-in" href="/" aria-label="VibeScout 2026 home">
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
          <div className="header-actions" aria-label="Watchlist actions">
            <Link className="icon-button js-watch-in" href="/rankings" aria-label="Search rankings">
              <Search aria-hidden="true" size={23} strokeWidth={2.35} />
            </Link>
          </div>
        </header>

        <main id="watchlist-content" className="watchlist-main">
          <section className="watchlist-hero js-watch-in" aria-labelledby="watchlist-page-title">
            <div className="date-row">
              <Bookmark aria-hidden="true" size={20} />
              <span>{settings.hideOvernight || settings.hidePassedGames ? `${savedMatches.length} visible` : `${watchlist.count} saved`}</span>
              <span className="date-dot" aria-hidden="true" />
              <span>Morocco time</span>
            </div>
            <h1 id="watchlist-page-title">Your Must Watches.</h1>
            <p>Matches you saved, ordered by Moroccan kickoff time so you can plan the nights that matter.</p>
          </section>

          {savedMatches.length > 0 ? (
            <section className="saved-section js-watch-in" aria-label="Saved matches">
              <div className="saved-toolbar">
                <span>{savedMatches.length === 1 ? "1 saved match" : `${savedMatches.length} saved matches`}</span>
                <button type="button" onClick={watchlist.clear}>
                  Clear all
                </button>
              </div>
              <div className="saved-list" role="list">
                {savedMatches.map((match) => (
                  <SavedMatchCard key={match.id} match={match} onRemove={() => watchlist.remove(match.id)} />
                ))}
              </div>
            </section>
          ) : (
            <section className="watchlist-empty js-watch-in" aria-label="Empty watchlist">
              <div className="watchlist-empty-icon" aria-hidden="true">
                <Bookmark size={28} />
              </div>
              <h2>{watchlist.count > 0 ? "Saved games hidden" : "No matches saved yet"}</h2>
              <p>
                {watchlist.count > 0
                  ? "Your saved overnight games are hidden by the current settings."
                  : "Start from the full ranking and save the games that deserve your evening."}
              </p>
              <Link href={watchlist.count > 0 ? "/settings" : "/rankings"}>
                {watchlist.count > 0 ? "Adjust settings" : "Browse rankings"}
              </Link>
            </section>
          )}
        </main>
      </div>

      <PrimaryNav activeLabel="Watchlist" />
    </div>
  );
}

function SavedMatchCard({ match, onRemove }: { match: DisplayMatch; onRemove: () => void }) {
  return (
    <article className="saved-card js-watch-in" role="listitem">
      <div className="saved-card-top">
        <span>#{match.rank}</span>
        <button
          className="remove-save-button"
          type="button"
          aria-label={`Remove ${match.teams[0].name} versus ${match.teams[1].name}`}
          onClick={onRemove}
        >
          <Trash2 aria-hidden="true" size={17} />
        </button>
      </div>
      <div className="saved-card-body">
        <div className="ranking-teams">
          <TeamLine team={match.teams[0]} />
          <TeamLine team={match.teams[1]} />
        </div>
        <ScoreBox match={match} />
      </div>
      <div className="ranking-meta">
        <span>
          <CalendarDays aria-hidden="true" size={16} />
          {match.dateLabel}
        </span>
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
      <p className="ranking-explanation">{match.explanation}</p>
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
