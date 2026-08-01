import { NextResponse } from "next/server";
import { SITE_URL, OAUTH_STATE_COOKIE, randomNonce, encodeOAuthState } from "@/lib/oauth";

// Sends the reader to Google's consent screen. GOOGLE_CLIENT_ID must match
// an OAuth client set up in Google Cloud Console with this exact redirect
// URI authorized: https://www.thefinancialbuddy.com/api/reader/oauth/google/callback
export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google sign-in isn't configured yet." },
      { status: 500 }
    );
  }

  const next = request.nextUrl.searchParams.get("next") || "/account";
  const nonce = randomNonce();

  const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set(
    "redirect_uri",
    `${SITE_URL}/api/reader/oauth/google/callback`
  );
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("state", nonce);
  authorizeUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set(OAUTH_STATE_COOKIE, encodeOAuthState(nonce, next), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
