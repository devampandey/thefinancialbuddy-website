import { NextResponse } from "next/server";
import { getLiveMatch } from "@/lib/cricket";

// Refresh the upstream ESPN data at most once a minute, regardless of how
// many visitors hit this route in that window — same pattern as
// app/api/market/route.js.
export const revalidate = 60;

export async function GET() {
  const match = await getLiveMatch();
  return NextResponse.json({ match });
}
