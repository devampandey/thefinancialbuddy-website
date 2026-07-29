import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFile, deleteFile } from "@/lib/github";
import { parseFrontmatter } from "@/lib/frontmatter";
import { DRAFTS_DIR } from "@/lib/drafts";

// Full draft content, for the review page or for a writer re-opening their
// own submission.
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

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
    content,
  });
}

// Discards a draft. Writers may only discard their own; admins may discard
// any.
export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const path = `${DRAFTS_DIR}/${params.slug}.md`;
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

  try {
    await deleteFile(path, `Discard draft: ${data.title || params.slug}`, file.sha);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
