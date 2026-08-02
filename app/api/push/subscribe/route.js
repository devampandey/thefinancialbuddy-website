import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getReaderSession } from "@/lib/readerSession";

// Saves a browser's push subscription so we can send it notifications
// later. Works for anonymous visitors too (user_id stays null) — signed-in
// readers get linked so a future targeted-notification feature has that
// option, but signing in is never required to enable notifications.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { endpoint, keys } = body?.subscription || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
  }

  try {
    await ensureSchema();
    const session = await getReaderSession();

    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (${session?.userId ?? null}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
      ON CONFLICT (endpoint) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth;
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
