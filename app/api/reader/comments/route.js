import { NextResponse } from "next/server";
import { getReaderSession } from "@/lib/readerSession";
import { listComments, addComment } from "@/lib/comments";

// Reading comments is public — no sign-in required.
export async function GET(request) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });

  try {
    const comments = await listComments(slug);
    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Posting a comment requires a signed-in reader account.
export async function POST(request) {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Sign in to comment." }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = (body?.slug || "").trim();
  if (!slug) return NextResponse.json({ error: "Missing article slug." }, { status: 400 });

  try {
    await addComment(session.userId, slug, body?.body);
    const comments = await listComments(slug);
    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
