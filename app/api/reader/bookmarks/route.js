import { NextResponse } from "next/server";
import { getReaderSession } from "@/lib/readerSession";
import { listBookmarks, addBookmark, removeBookmark } from "@/lib/bookmarks";

export async function GET() {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  try {
    const bookmarks = await listBookmarks(session.userId);
    return NextResponse.json({ bookmarks });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = (body?.slug || "").trim();
  const title = (body?.title || "").trim();
  if (!slug || !title) {
    return NextResponse.json({ error: "Missing article slug or title." }, { status: 400 });
  }

  try {
    await addBookmark(session.userId, slug, title);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = (body?.slug || "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing article slug." }, { status: 400 });
  }

  try {
    await removeBookmark(session.userId, slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
