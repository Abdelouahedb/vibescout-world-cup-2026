import { useEffect, useState } from "react";
import type { DisplayMatch } from "@/lib/preference-scoring";
import { getMatchStatus } from "@/lib/match-intelligence";

const statusClassName: Record<ReturnType<typeof getMatchStatus>["window"], string> = {
  soon: "match-status is-soon",
  tonight: "match-status is-tonight",
  late: "match-status is-late",
  later: "match-status is-later",
  passed: "match-status is-passed",
};

export function MatchStatePill({ match }: { match: Pick<DisplayMatch, "dateISO" | "kickoff" | "status"> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (match.status === "live") {
    return (
      <span className="match-status is-soon" title="Match is currently in progress">
        Live
      </span>
    );
  }

  if (match.status === "played") {
    return (
      <span className="match-status is-passed" title="Match has finished">
        Played
      </span>
    );
  }

  const status = getMatchStatus(match);

  return (
    <span className={statusClassName[status.window]} title={status.detail}>
      {status.label}
    </span>
  );
}
