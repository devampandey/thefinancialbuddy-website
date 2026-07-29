import { NextResponse } from "next/server";
import { createReaderSessionToken, READER_SESSION_COOKIE, READER_SESSION_MAX_AGE_SECONDS } from "@/lib/readerAuth";
import { createReader } from "@/lib/readers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Instant-access signup for readers — creates the account and logs them
// in immediately, no email verification step.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body?.email || "").trim().toLowerCase();
  const password = body?.password || "";
  const name = (body?.name || "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  try {
    const account = await createReader({ email, password, name });
    const token = await createReaderSessionToken(account);

    const res = NextResponse.json({ email: account.email, name: account.name });
    res.cookies.set(READER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: READER_SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
