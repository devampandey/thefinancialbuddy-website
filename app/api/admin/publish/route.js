import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFile, putFile, deleteFile } from "@/lib/github";
import { parseFrontmatter, stringifyFrontmatter } from "@/lib/frontmatter";
import { DRAFTS_DIR, POSTS_DIR } from "@/lib/drafts";

// Approves a draft: copies it into content/blog (so it appears on the live
// site after the next deploy) and removes it from content/drafts. Also
// enforced admin-only at the middleware level; re-checked here too.
export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { slug } = body || {};
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const draftPath = `${DRAFTS_DIR}/${slug}.md`;

  try {
    const draft = await getFile(draftPath);
    if (!draft) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    const existingPublished = await getFile(`${POSTS_DIR}/${slug}.md`);
    if (existingPublished) {
      return NextResponse.json(
        { error: "A published post already exists at this URL. Rename the draft first." },
        { status: 409 }
      );
    }

    const { data, content } = parseFrontmatter(draft.content);
    const published = stringifyFrontmatter(
      {
        title: data.title,
        date: new Date().toISOString().slice(0, 10),
        category: data.category,
        description: data.description,
        author: data.author,
      },
      content
    );

    await putFile(
      `${POSTS_DIR}/${slug}.md`,
      published,
      `Publish: ${data.title} (by ${data.author})`
    );
    await deleteFile(draftPath, `Remove published draft: ${data.title}`, draft.sha);

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
