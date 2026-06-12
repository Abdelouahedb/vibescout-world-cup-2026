"use client";

import { useMemo } from "react";
import type { DisplayMatch } from "@/lib/preference-scoring";
import { getScoreBreakdown, type ScoreBreakdownItem } from "@/lib/match-intelligence";

export function ScoreBreakdown({ match }: { match: DisplayMatch }) {
  const factors = useMemo(() => getScoreBreakdown(match), [match]);
  const sorted = useMemo(() => [...factors].sort((a, b) => b.value - a.value), [factors]);
  const boosts = sorted.slice(0, 2);
  const drawback = sorted[sorted.length - 1];

  return (
    <div className="score-breakdown score-breakdown-verdict" aria-label="Why this score">
      <div className="verdict-lede">
        <span>Scout verdict</span>
        <p>
          The score leans on what gives this match lift, then subtracts the one thing that makes it less
          convenient or less volatile than the top-tier must-watch games.
        </p>
      </div>

      <div className="verdict-strip">
        {boosts.map((factor, index) => (
          <VerdictCard
            key={factor.id}
            factor={factor}
            tone="boost"
            title={index === 0 ? "Biggest boost" : "Second boost"}
          />
        ))}
        <VerdictCard factor={drawback} tone="drawback" title="Main drag" />
      </div>
    </div>
  );
}

function VerdictCard({
  factor,
  title,
  tone,
}: {
  factor: ScoreBreakdownItem;
  title: string;
  tone: "boost" | "drawback";
}) {
  return (
    <article className={tone === "drawback" ? "verdict-card drawback" : "verdict-card boost"}>
      <span>{title}</span>
      <div className="verdict-card-main">
        <strong>{factor.label}</strong>
        <small>{factor.value}</small>
      </div>
      <p>{factor.hint}</p>
    </article>
  );
}
