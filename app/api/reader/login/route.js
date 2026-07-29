import { NextResponse } from "next/server";
import { createReaderSessionToken, READER_SESSION_COOKIE, READER_SESSION_MAX_AGE_SECONDS } from "@/lib/readerAuth";
import { verifyReader } from "@/lib/readers";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = body || {};

  try {
    const account = await verifyReader(email, password);
    if (!account) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
