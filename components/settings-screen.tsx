"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ArrowUpRight, BookmarkX, CalendarDays, Clock3, Github, Info, Moon, Search, SlidersHorizontal } from "lucide-react";
import { navItems } from "@/lib/matches";
import { type ScorePreference, useVibeScoutSettings } from "@/lib/settings";
import { useWatchlist } from "@/lib/watchlist";

const scoreOptions: Array<{ value: ScorePreference; label: string; description: string }> = [
  { value: "balanced", label: "Balanced", description: "Best all-around watchability model." },
  { value: "stars", label: "Star power", description: "Favors elite players and box-office names." },
  { value: "upsets", label: "Upsets", description: "Boosts underdog danger and volatile matchups." },
  { value: "stakes", label: "Stakes", description: "Prioritizes group pressure and qualification tension." },
];

export function SettingsScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { settings, update } = useVibeScoutSettings();
  const watchlist = useWatchlist();

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
        ".js-settings-in",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power4.out" },
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
      <a className="skip-link" href="#settings-content">
        Skip to settings
      </a>
      <div className="screen-shell settings-shell">
        <header className="topbar" aria-label="VibeScout settings header">
          <Link className="brand-lockup js-settings-in" href="/" aria-label="VibeScout 2026 home">
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
          <div className="header-actions" aria-label="Settings actions">
            <Link className="icon-button js-settings-in" href="/rankings" aria-label="Search rankings">
              <Search aria-hidden="true" size={23} strokeWidth={2.35} />
            </Link>
          </div>
        </header>

        <main id="settings-content" className="settings-main">
          <section className="settings-hero js-settings-in" aria-labelledby="settings-title">
            <div className="date-row">
              <SlidersHorizontal aria-hidden="true" size={20} />
              <span>Settings</span>
              <span className="date-dot" aria-hidden="true" />
              <span>Local only</span>
            </div>
            <h1 id="settings-title">Tune The Scout.</h1>
            <p>Keep the app aligned with how you actually watch: Morocco time, fewer late games, calmer motion, and a scoring bias that fits your taste.</p>
          </section>

          <section className="settings-panel js-settings-in" aria-labelledby="timezone-title">
            <div className="settings-panel-heading">
              <Clock3 aria-hidden="true" size={20} />
              <div>
                <h2 id="timezone-title">Time Zone</h2>
                <p>Locked for this version.</p>
              </div>
            </div>
            <div className="locked-setting">
              <span>Morocco time</span>
              <strong>Africa/Casablanca</strong>
            </div>
          </section>

          <section className="settings-panel js-settings-in" aria-labelledby="score-pref-title">
            <div className="settings-panel-heading">
              <SlidersHorizontal aria-hidden="true" size={20} />
              <div>
                <h2 id="score-pref-title">Score Preferences</h2>
                <p>Choose what matters more in rankings and visible scores.</p>
              </div>
            </div>
            <div className="score-preference-list" role="radiogroup" aria-label="Score preference">
              {scoreOptions.map((option) => (
                <button
                  key={option.value}
                  className={settings.scorePreference === option.value ? "score-pref active" : "score-pref"}
                  type="button"
                  role="radio"
                  aria-checked={settings.scorePreference === option.value}
                  onClick={() => update({ scorePreference: option.value })}
                >
                  <span>{option.label}</span>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="settings-panel js-settings-in" aria-label="Playback and schedule preferences">
            <ToggleRow
              title="Hide overnight games"
              description="Hide games before 07:00 Morocco time across Home, Rankings, and Watchlist."
              checked={settings.hideOvernight}
              onChange={() => update({ hideOvernight: !settings.hideOvernight })}
              icon={<Moon aria-hidden="true" size={20} />}
            />
            <ToggleRow
              title="Hide passed games"
              description="Hide matches whose Morocco kickoff time has already passed."
              checked={settings.hidePassedGames}
              onChange={() => update({ hidePassedGames: !settings.hidePassedGames })}
              icon={<CalendarDays aria-hidden="true" size={20} />}
            />
            <ToggleRow
              title="Reduced motion"
              description="Use calmer transitions and skip dramatic entrance motion."
              checked={settings.reduceMotion}
              onChange={() => update({ reduceMotion: !settings.reduceMotion })}
              icon={<SlidersHorizontal aria-hidden="true" size={20} />}
            />
          </section>

          <section className="settings-panel js-settings-in" aria-labelledby="watchlist-settings-title">
            <div className="settings-panel-heading">
              <BookmarkX aria-hidden="true" size={20} />
              <div>
                <h2 id="watchlist-settings-title">Watchlist</h2>
                <p>{watchlist.count === 1 ? "1 saved match" : `${watchlist.count} saved matches`}</p>
              </div>
            </div>
            <button className="danger-setting-button" type="button" disabled={watchlist.count === 0} onClick={watchlist.clear}>
              Clear watchlist
            </button>
          </section>

          <section className="settings-panel about-score js-settings-in" aria-labelledby="about-score-title">
            <div className="settings-panel-heading">
              <Info aria-hidden="true" size={20} />
              <div>
                <h2 id="about-score-title">About Vibe Score</h2>
                <p>What the number means.</p>
              </div>
            </div>
            <p>
              Vibe Score is a watchability score, not a prediction. It weighs team quality, competitive balance,
              star power, fan interest, kickoff time in Morocco, host pressure, group-stage stakes, upset potential,
              and mismatch penalties.
            </p>
          </section>

          <section className="settings-panel settings-credit js-settings-in" aria-labelledby="credit-title">
            <div className="settings-panel-heading">
              <Github aria-hidden="true" size={20} />
              <div className="settings-credit-copy">
                <h2 id="credit-title">Built by eybiwon (Abdelouahed)</h2>
                <p>Follow the build, ideas, and updates on GitHub.</p>
              </div>
            </div>
            <a
              className="settings-credit-inline"
              href="https://github.com/Abdelouahedb/vibescout-world-cup-2026"
              target="_blank"
              rel="noreferrer"
              aria-label="Open the VibeScout World Cup 2026 GitHub repository"
            >
              <span>View project on GitHub</span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </section>
        </main>
      </div>

      <PrimaryNav activeLabel="Settings" />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="toggle-row">
      <div className="toggle-copy">
        {icon}
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <button
        className={checked ? "toggle-switch active" : "toggle-switch"}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
      >
        <span />
      </button>
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

          return (
            <Link
              key={item.label}
              className={active ? "nav-item active" : "nav-item"}
              href={item.href ?? "/"}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
