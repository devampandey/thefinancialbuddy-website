import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

// Removes a push subscription — called when a visitor explicitly turns
// notifications back off, or when the browser reports the subscription has
// expired/changed and we need to drop the stale one before re-subscribing.
export async function DELETE(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { endpoint } = body || {};
  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });
  }

  try {
    await ensureSchema();
    await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint};`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
