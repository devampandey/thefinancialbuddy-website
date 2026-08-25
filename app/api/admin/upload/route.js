import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { putBinaryFile } from "@/lib/github";
import { slugify } from "@/lib/frontmatter";

// Vercel's default request body limit is ~4.5MB, and base64 inflates size
// by roughly a third — a 4MB decoded image is already a ~5.3MB request
// body, past that ceiling. Cap the decoded size at 3MB (client enforces
// the same number) so the encoded request stays well clear of it.
const MAX_BYTES = 3 * 1024 * 1024;

const ALLOWED_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Uploads a cover image, committing it straight to public/uploads/ in the
// site's GitHub repo (same mechanism as articles) — it becomes servable at
// /uploads/<file> once the next deploy finishes, no separate storage or CDN
// needed.
export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { filename, dataUrl } = body || {};
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    return NextResponse.json({ error: "No image data received." }, { status: 400 });
  }

  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) {
    return NextResponse.json({ error: "Couldn't read that image file." }, { status: 400 });
  }

  const [, mimeType, base64] = match;
  const ext = ALLOWED_EXT[mimeType];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image type — use JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  const approxBytes = (base64.length * 3) / 4;
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is too large — please use a file under 3MB." },
      { status: 400 }
    );
  }

  const baseName = slugify((filename || "image").replace(/\.[^.]+$/, "")) || "image";
  const unique = `${baseName}-${Date.now().toString(36)}`;
  const path = `public/uploads/${unique}.${ext}`;

  try {
    await putBinaryFile(path, base64, `Upload image: ${unique}.${ext} (by ${session.name})`);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ url: `/uploads/${unique}.${ext}` });
}
