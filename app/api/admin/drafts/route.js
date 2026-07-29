import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFile, putFile } from "@/lib/github";
import { stringifyFrontmatter, slugify } from "@/lib/frontmatter";
import { listDrafts, DRAFTS_DIR, POSTS_DIR } from "@/lib/drafts";

// Lists every pending draft (metadata only). Used both by a writer's "my
// submissions" view and the admin review queue — the frontend decides what
// subset to show based on the logged-in user's role.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const drafts = await listDrafts();
    return NextResponse.json({ drafts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Creates a new draft, submitted by whichever writer/admin is logged in.
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

  const { title, category, description, content, imageUrl } = body || {};
  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const baseSlug = slugify(title);
  if (!baseSlug) {
    return NextResponse.json(
      { error: "Couldn't generate a URL from that title — try adding more words." },
      { status: 400 }
    );
  }

  try {
    let slug = baseSlug;
    let n = 2;
    // eslint-disable-next-line no-await-in-loop
    while ((await getFile(`${DRAFTS_DIR}/${slug}.md`)) || (await getFile(`${POSTS_DIR}/${slug}.md`))) {
      slug = `${baseSlug}-${n}`;
      n += 1;
    }

    let body_ = content.trim();
    if (imageUrl && imageUrl.trim()) {
      body_ = `![${title.trim()}](${imageUrl.trim()})\n\n${body_}`;
    }

    const markdown = stringifyFrontmatter(
      {
        title: title.trim(),
        category: (category || "General").trim(),
        description: (description || "").trim(),
        author: session.name,
        submittedAt: new Date().toISOString().slice(0, 10),
      },
      body_
    );

    await putFile(`${DRAFTS_DIR}/${slug}.md`, markdown, `Draft: ${title.trim()} (by ${session.name})`);
    return NextResponse.json({ slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
