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

    return {
      id: event.id,
      description: competition?.description || event.name,
      venue: competition?.venue?.fullName || null,
      startDate: event.date,
      endDate: event.endDate,
      state: status?.type?.state || "pre", // "pre" | "in" | "post"
      statusSummary: status?.summary || status?.type?.shortDetail || "",
      teams,
    };
  } catch {
    return null;
  }
}
