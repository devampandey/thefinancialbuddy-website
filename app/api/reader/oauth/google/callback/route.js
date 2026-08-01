import { NextResponse } from "next/server";
import { SITE_URL, OAUTH_STATE_COOKIE, decodeOAuthState } from "@/lib/oauth";
import { createReaderSessionToken, READER_SESSION_COOKIE, READER_SESSION_MAX_AGE_SECONDS } from "@/lib/readerAuth";
import { findOrCreateOAuthReader } from "@/lib/readers";

function failureRedirect(request, message) {
  const url = new URL("/account/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const decoded = decodeOAuthState(stateCookie || "");

  if (!code || !state || !decoded || decoded.nonce !== state) {
    return failureRedirect(request, "Google sign-in failed. Please try again.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failureRedirect(request, "Google sign-in isn't configured yet.");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${SITE_URL}/api/reader/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return failureRedirect(request, "Google sign-in failed. Please try again.");
    const tokenData = await tokenRes.json();

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileRes.ok) return failureRedirect(request, "Google sign-in failed. Please try again.");
    const profile = await profileRes.json();

    if (!profile.email) {
      return failureRedirect(request, "Your Google account didn't share an email address.");
    }

    const account = await findOrCreateOAuthReader({
      email: profile.email,
      name: profile.name || profile.email,
      provider: "google",
    });

    const token = await createReaderSessionToken(account);
    const res = NextResponse.redirect(new URL(decoded.next, request.url));
    res.cookies.set(READER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: READER_SESSION_MAX_AGE_SECONDS,
    });
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch {
    return failureRedirect(request, "Google sign-in failed. Please try again.");
  }
}
