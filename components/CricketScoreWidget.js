"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 60000;

function InningsLine({ innings }) {
  if (!innings || innings.length === 0) return null;
  // Tests can have up to 2 innings per side — join them the way scorecards
  // conventionally display multi-innings totals, e.g. "312 & 87/3".
  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {innings
        .map((i) => `${i.runs}${i.wickets < 10 ? `/${i.wickets}` : ""}${i.overs ? ` (${i.overs} ov)` : ""}`)
        .join(" & ")}
    </span>
  );
}

function TeamRow({ team }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        {team.logo && (
          <img src={team.logo} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
        )}
        <span className="truncate font-semibold text-black dark:text-white">{team.name}</span>
      </div>
      <div className="shrink-0 text-right">
        {team.score ? (
          <span className="font-bold text-black dark:text-white">{team.score}</span>
        ) : (
          <InningsLine innings={team.innings} />
        )}
      </div>
    </div>
  );
}

// Live IND vs SL Test score card. Fails quietly (renders nothing) if the
// upstream data isn't available, rather than showing a broken widget — same
// convention as MarketTicker.
export default function CricketScoreWidget() {
  const [match, setMatch] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/cricket/live");
        if (!res.ok) throw new Error("bad response");
        const json = await res.json();
        if (!cancelled) {
          setMatch(json.match);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!loaded || !match) return null;

  const isLive = match.state === "in";

  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {match.description}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600 dark:bg-red-400" />
            LIVE
          </span>
        )}
      </div>

      <div className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
        {match.teams.map((team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </div>

      {match.statusSummary && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
          {match.statusSummary}
        </p>
      )}

      {match.venue && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{match.venue}</p>
      )}
    </div>
  );
}
