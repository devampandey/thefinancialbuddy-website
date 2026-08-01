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
    return failureRedirect(request, "Facebook sign-in failed. Please try again.");
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failureRedirect(request, "Facebook sign-in isn't configured yet.");
  }

  try {
    const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set(
      "redirect_uri",
      `${SITE_URL}/api/reader/oauth/facebook/callback`
    );

    const tokenRes = await fetch(tokenUrl);
    if (!tokenRes.ok) return failureRedirect(request, "Facebook sign-in failed. Please try again.");
    const tokenData = await tokenRes.json();

    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.searchParams.set("fields", "id,name,email");
    profileUrl.searchParams.set("access_token", tokenData.access_token);

    const profileRes = await fetch(profileUrl);
    if (!profileRes.ok) return failureRedirect(request, "Facebook sign-in failed. Please try again.");
    const profile = await profileRes.json();

    if (!profile.email) {
      return failureRedirect(
        request,
        "Your Facebook account didn't share an email address. Try email/password sign-up instead."
      );
    }

    const account = await findOrCreateOAuthReader({
      email: profile.email,
      name: profile.name || profile.email,
      provider: "facebook",
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
    return failureRedirect(request, "Facebook sign-in failed. Please try again.");
  }
}
