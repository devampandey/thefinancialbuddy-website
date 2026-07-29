import { NextResponse } from "next/server";
import {
  checkCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { verifyFileUser } from "@/lib/users";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username, password } = body || {};

  try {
    // Env-configured accounts (admin + up to 4 fixed writer slots) first,
    // then fall back to self-service accounts created via /admin/signup.
    let account = checkCredentials(username, password);
    if (!account) {
      account = await verifyFileUser(username, password);
    }
    if (!account) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    const token = await createSessionToken(account);
    const res = NextResponse.json({ role: account.role, name: account.name });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
