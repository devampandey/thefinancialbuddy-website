import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFile, putFile, deleteFile } from "@/lib/github";
import { parseFrontmatter, stringifyFrontmatter, stripLeadingImage } from "@/lib/frontmatter";
import { firstImage } from "@/lib/blog";
import { DRAFTS_DIR } from "@/lib/drafts";

// Full draft content, for the review page or for a writer re-opening their
// own submission. The cover image is stored as the first line of the body
// rather than a separate field, so it's split out here into its own `image`
// value and stripped from `content` — matches how the published-post edit
// endpoint shapes its response, so the same ArticleEditorForm works for both.
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const file = await getFile(`${DRAFTS_DIR}/${params.slug}.md`);
    if (!file) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    const { data, content } = parseFrontmatter(file.content);
    return NextResponse.json({
      slug: params.slug,
      title: data.title || params.slug,
      category: data.category || "General",
      description: data.description || "",
      author: data.author || "",
      submittedAt: data.submittedAt || "",
      image: firstImage(content),
      content: stripLeadingImage(content),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Saves an edit to a pending draft. Writers may only edit their own; admins
// may edit any. Keeps the original author and submittedAt untouched — this
// is a content edit, not a resubmission.
export async function PUT(request, { params }) {
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

  const path = `${DRAFTS_DIR}/${params.slug}.md`;

  try {
    const existing = await getFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }
    const { data: existingData } = parseFrontmatter(existing.content);

    if (session.role !== "admin" && existingData.author !== session.name) {
      return NextResponse.json(
        { error: "You can only edit your own drafts." },
        { status: 403 }
      );
    }

    let body_ = content.trim();
    if (imageUrl && imageUrl.trim()) {
      body_ = `![${title.trim()}](${imageUrl.trim()})\n\n${body_}`;
    }

    const markdown = stringifyFrontmatter(
      {
        title: title.trim(),
        category: (category || existingData.category || "General").trim(),
        description: (description || "").trim(),
        author: existingData.author || session.name,
        submittedAt: existingData.submittedAt || new Date().toISOString().slice(0, 10),
      },
      body_
    );

    await putFile(path, markdown, `Edit draft: ${title.trim()} (by ${session.name})`, existing.sha);
    return NextResponse.json({ ok: true, slug: params.slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Discards a draft. Writers may only discard their own; admins may discard
// any.
export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const path = `${DRAFTS_DIR}/${params.slug}.md`;

  try {
    const file = await getFile(path);
    if (!file) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    const { data } = parseFrontmatter(file.content);
    if (session.role !== "admin" && data.author !== session.name) {
      return NextResponse.json(
        { error: "You can only discard your own drafts." },
        { status: 403 }
      );
    }

    await deleteFile(path, `Discard draft: ${data.title || params.slug}`, file.sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
