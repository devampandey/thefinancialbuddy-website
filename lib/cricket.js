// Live IND vs SL score, sourced from ESPN's public (undocumented) cricket
// scoreboard JSON — no API key required. This is the one file that talks to
// the upstream source; everything else on the site (the API route, the
// widget) only ever talks to our own /api/cricket/live, so if ESPN ever
// changes shape or needs replacing, this is the only place that has to
// change.
//
// LEAGUE_ID is ESPN's internal id for the "India tour of Sri Lanka 2026"
// series (2 Tests, Aug 2026) — found via ESPN's search API, unrelated to
// Cricinfo's own numbering. Update this if/when a new India series starts.
const LEAGUE_ID = "24567";
const SCOREBOARD_URL = `https://site.api.espn.com/apis/site/v2/sports/cricket/${LEAGUE_ID}/scoreboard`;
const SUMMARY_URL = `https://site.api.espn.com/apis/site/v2/sports/cricket/${LEAGUE_ID}/summary`;

// Pulls out whichever players are actually out in the middle right now.
// ESPN's per-event summary tags every player in each team's roster with an
// "activeName" — "striker" / "non-striker" for the two batters currently
// facing, "current bowler" for whoever's bowling this over — alongside a
// flat, alphabetically-ordered array of named stats (runs, balls, fours,
// sixes, strikeRate for batters; overs, maidens, conceded, wickets,
// economyRate for bowlers). Everyone else on the roster carries the same
// stat keys zeroed out, so filtering by activeName is what separates "on
// the field right now" from "the rest of the squad".
async function getCurrentPlay(eventId) {
  try {
    const res = await fetch(`${SUMMARY_URL}?event=${eventId}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    const rosters = json?.rosters || [];

    const batters = [];
    let bowler = null;

    for (const teamRoster of rosters) {
      for (const entry of teamRoster.roster || []) {
        if (!["striker", "non-striker", "current bowler"].includes(entry.activeName)) continue;

        const stats = {};
        for (const s of entry.statistics || []) stats[s.name] = s.value;
        const name = entry.athlete?.displayName;
        if (!name) continue;

        if (entry.activeName === "current bowler") {
          bowler = {
            name,
            overs: stats.overs ?? 0,
            maidens: stats.maidens ?? 0,
            conceded: stats.conceded ?? 0,
            wickets: stats.wickets ?? 0,
            economyRate: stats.economyRate ?? 0,
          };
        } else {
          batters.push({
            name,
            onStrike: entry.activeName === "striker",
            runs: stats.runs ?? 0,
            balls: stats.balls ?? 0,
            fours: stats.fours ?? 0,
            sixes: stats.sixes ?? 0,
            strikeRate: stats.strikeRate ?? 0,
          });
        }
      }
    }

    if (batters.length === 0 && !bowler) return null;
    // Striker first, so the widget always shows the batter on strike on top.
    batters.sort((a, b) => (b.onStrike ? 1 : 0) - (a.onStrike ? 1 : 0));
    return { batters, bowler };
  } catch {
    return null;
  }
}

function mapTeam(competitor) {
  if (!competitor) return null;
  return {
    id: competitor.team?.id,
    name: competitor.team?.displayName,
    abbreviation: competitor.team?.abbreviation,
    logo: competitor.team?.logo,
    score: competitor.score || "",
    homeAway: competitor.homeAway,
    innings: (competitor.linescores || []).map((l) => ({
      runs: l.runs,
      wickets: l.wickets,
      overs: l.overs,
      isBatting: !!l.isBatting,
      description: l.description,
    })),
  };
}

// Picks the event most relevant to show right now: an in-progress match if
// there is one, otherwise the next upcoming match, otherwise the most
// recently completed one. ESPN returns every match in the series in one
// call, so this is just picking which one to surface.
function pickEvent(events) {
  if (!events || events.length === 0) return null;
  const inProgress = events.find((e) => e.status?.type?.state === "in");
  if (inProgress) return inProgress;
  const upcoming = events
    .filter((e) => e.status?.type?.state === "pre")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  if (upcoming) return upcoming;
  return events[events.length - 1];
}

export async function getLiveMatch() {
  try {
    const res = await fetch(SCOREBOARD_URL, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    const event = pickEvent(json?.events);
    if (!event) return null;

    const competition = event.competitions?.[0];
    const status = competition?.status || event.status;
    const competitors = competition?.competitors || [];
    // ESPN orders competitors by "order", not consistently home-then-away —
    // sort so the widget always renders the same team first.
    const teams = [...competitors]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(mapTeam)
      .filter(Boolean);

    const state = status?.type?.state || "pre"; // "pre" | "in" | "post"
    // Who's-batting/who's-bowling detail only exists (and only matters)
    // while a match is actually in progress — skip the extra request
    // otherwise.
    const currentPlay = state === "in" ? await getCurrentPlay(event.id) : null;

    return {
      id: event.id,
      description: competition?.description || event.name,
      venue: competition?.venue?.fullName || null,
      startDate: event.date,
      endDate: event.endDate,
      state,
      statusSummary: status?.summary || status?.type?.shortDetail || "",
      teams,
      currentPlay,
    };
  } catch {
    return null;
  }
}
