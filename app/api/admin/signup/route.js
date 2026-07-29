import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { createUser, isUsernameTaken } from "@/lib/users";

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,32}$/;

// Self-service signup for writers — creates the account and logs them in
// immediately (no admin approval step). Always assigns the "writer" role;
// the admin account stays fixed to the env-configured credentials.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = (body?.username || "").trim();
  const password = body?.password || "";
  const name = (body?.name || "").trim();

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-32 characters: letters, numbers, - or _ only." },
      { status: 400 }
    );
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
    if (await isUsernameTaken(username)) {
      return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
    }

    const account = await createUser({ username, password, name });
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
