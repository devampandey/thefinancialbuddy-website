import { NextResponse } from "next/server";
import { SITE_URL, OAUTH_STATE_COOKIE, randomNonce, encodeOAuthState } from "@/lib/oauth";

// Sends the reader to Facebook's consent screen. FACEBOOK_CLIENT_ID must
// match an app set up in Meta for Developers, with this exact redirect URI
// added under Facebook Login settings:
// https://www.thefinancialbuddy.com/api/reader/oauth/facebook/callback
export async function GET(request) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Facebook sign-in isn't configured yet." },
      { status: 500 }
    );
  }

  const next = request.nextUrl.searchParams.get("next") || "/account";
  const nonce = randomNonce();

  const authorizeUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set(
    "redirect_uri",
    `${SITE_URL}/api/reader/oauth/facebook/callback`
  );
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "email,public_profile");
  authorizeUrl.searchParams.set("state", nonce);

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
