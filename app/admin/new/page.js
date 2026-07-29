"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["News", "Politics", "AI", "Finance"];

// Each button wraps the current selection in Markdown syntax (or inserts a
// placeholder if nothing is selected) rather than requiring writers to type
// the symbols themselves.
const TOOLBAR_BUTTONS = [
  { key: "bold", label: "B", title: "Bold", className: "font-bold" },
  { key: "italic", label: "I", title: "Italic", className: "italic" },
  { key: "h2", label: "H2", title: "Large heading", className: "font-semibold" },
  { key: "h3", label: "H3", title: "Smaller heading", className: "font-semibold" },
  { key: "bullet", label: "• List", title: "Bullet list", className: "" },
  { key: "link", label: "Link", title: "Link", className: "" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("News");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  // A local object-URL preview of the chosen file. The uploaded image is
  // committed to the repo immediately, but it isn't actually servable from
  // the live site until the next deploy finishes — so the real /uploads/...
  // URL would show as broken for a minute or two. Previewing the file the
  // browser already has avoids that confusing flash of a "broken" image.
  const [previewSrc, setPreviewSrc] = useState("");
  const contentRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setUploadError("");
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("That image is too large — please use a file under 4MB.");
      return;
    }

    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(URL.createObjectURL(file));

    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Couldn't read that file."));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err.message);
      setPreviewSrc("");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setPreviewSrc("");
    setImageUrl("");
  }

  function applyFormat(type) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);

    let before = "";
    let after = "";
    let placeholder = "";

    switch (type) {
      case "bold":
        before = "**";
        after = "**";
        placeholder = "bold text";
        break;
      case "italic":
        before = "_";
        after = "_";
        placeholder = "italic text";
        break;
      case "h2":
        before = "\n## ";
        placeholder = "Section heading";
        break;
      case "h3":
        before = "\n### ";
        placeholder = "Subheading";
        break;
      case "bullet":
        before = "\n- ";
        placeholder = "List item";
        break;
      case "link":
        before = "[";
        after = "](https://)";
        placeholder = "link text";
        break;
      default:
        return;
    }

    const text = selected || placeholder;
    const newValue = content.slice(0, start) + before + text + after + content.slice(end);
    setContent(newValue);

    // Re-select the inserted text so writers can immediately type over the
    // placeholder, same as most rich-text toolbars behave.
    requestAnimationFrame(() => {
      el.focus();
      const selStart = start + before.length;
      const selEnd = selStart + text.length;
      el.setSelectionRange(selStart, selEnd);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, content, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      setTimeout(() => router.push("/admin"), 1200);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium text-brand">New article</p>
      <h1 className="mt-1 text-3xl font-bold text-navy dark:text-white">Write an article</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Submitted articles go to the review queue — they won&apos;t appear on the live site
        until an editor approves them.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Short description{" "}
            <span className="font-normal text-gray-400">(shown in previews and search results)</span>
          </span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <div className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover image <span className="font-normal text-gray-400">(optional)</span>
          </span>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              {uploading ? "Uploading…" : "Choose photo…"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {(previewSrc || imageUrl) && (
              <>
                <img
                  src={previewSrc || imageUrl}
                  alt=""
                  className="h-14 w-24 rounded-md border border-gray-200 object-cover dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              </>
            )}
          </div>

          {uploadError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadError}</p>
          )}
          {previewSrc && !uploading && (
            <p className="mt-1 text-xs text-gray-400">
              Uploaded — this preview is from your computer and will show correctly on the live
              site once it deploys.
            </p>
          )}

          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              Or paste an image URL instead
            </summary>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                if (previewSrc) URL.revokeObjectURL(previewSrc);
                setPreviewSrc("");
                setImageUrl(e.target.value);
              }}
              placeholder="https://... (must be a direct link to the image itself)"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </details>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Article content
          </span>
          <p className="mt-1 text-xs text-gray-400">
            Select some text and click a button below to format it (or start typing and select
            after). There&apos;s no free font-size picker — use the H2/H3 heading buttons for
            section titles, which keeps sizing consistent across the site.
          </p>

          <div className="mt-2 flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800">
            {TOOLBAR_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => applyFormat(btn.key)}
                title={btn.title}
                className={`rounded px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 ${btn.className}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <textarea
            ref={contentRef}
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here. Use the toolbar above to format text, or type paragraphs with a blank line between them."
            className="w-full rounded-b-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {done && <p className="text-sm text-brand">Submitted — redirecting…</p>}

        <button
          type="submit"
          disabled={submitting || done}
          className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
