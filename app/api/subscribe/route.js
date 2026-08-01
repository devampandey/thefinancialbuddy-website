import { NextResponse } from "next/server";

// Subscribes a reader to the newsletter via Buttondown's REST API directly
// from our own server, so the subscribe box on the site never has to
// redirect or pop up a window to buttondown.com — it all happens in-page.
export async function POST(request) {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Newsletter signup isn't configured yet." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body?.email || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Buttondown returns 400 with a per-field error object for things like
    // "this email is already subscribed" — surface that message directly
    // rather than a generic failure.
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      const fieldError = data?.email_address?.[0] || data?.detail;
      if (fieldError) detail = fieldError;
    } catch {
      // fall through to the generic message
    }

    // A duplicate subscriber isn't really an error from the reader's
    // perspective — treat it as a success so they still see confirmation.
    if (/already/i.test(detail)) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    return NextResponse.json({ error: detail }, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the newsletter service. Please try again." },
      { status: 502 }
    );
  }
}
