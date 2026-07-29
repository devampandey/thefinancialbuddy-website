import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFile, putFile, deleteFile } from "@/lib/github";
import { parseFrontmatter, stringifyFrontmatter, stripLeadingImage } from "@/lib/frontmatter";
import { firstImage } from "@/lib/blog";
import { POSTS_DIR } from "@/lib/drafts";

// Editing and deleting *published* articles is admin-only by design (see
// middleware.js) — writers can create and discard their own drafts, but
// once something is live, only an editor can change or remove it.
function requireAdmin(session) {
  return !!session && session.role === "admin";
}

// Full raw content for the edit form. The cover image is stored as the
// first line of the body rather than a separate field, so it's split out
// here into its own `image` value and stripped from `content` — the edit
// form's image field/textarea then match how /admin/new works.
export async function GET(request, { params }) {
  const session = await getSession();
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  try {
    const path = `${POSTS_DIR}/${params.slug}.md`;
    const file = await getFile(path);
    if (!file) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const { data, content } = parseFrontmatter(file.content);
    return NextResponse.json({
      slug: params.slug,
      title: data.title || params.slug,
      category: data.category || "General",
      description: data.description || "",
      author: data.author || "",
      date: data.date || "",
      image: firstImage(content),
      content: stripLeadingImage(content),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Saves an edit. Keeps the original publish date and byline untouched —
// editing a typo shouldn't change who wrote it or when it first went live.
export async function PUT(request, { params }) {
  const session = await getSession();
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
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

  const path = `${POSTS_DIR}/${params.slug}.md`;

  try {
    const existing = await getFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    const { data: existingData } = parseFrontmatter(existing.content);

    let body_ = content.trim();
    if (imageUrl && imageUrl.trim()) {
      body_ = `![${title.trim()}](${imageUrl.trim()})\n\n${body_}`;
    }

    const markdown = stringifyFrontmatter(
      {
        title: title.trim(),
        date: existingData.date || new Date().toISOString().slice(0, 10),
        category: (category || existingData.category || "General").trim(),
        description: (description || "").trim(),
        author: existingData.author || session.name,
      },
      body_
    );

    await putFile(path, markdown, `Edit: ${title.trim()} (by ${session.name})`, existing.sha);
    return NextResponse.json({ ok: true, slug: params.slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const path = `${POSTS_DIR}/${params.slug}.md`;

  try {
    const existing = await getFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    await deleteFile(path, `Delete article: ${params.slug} (by ${session.name})`, existing.sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
