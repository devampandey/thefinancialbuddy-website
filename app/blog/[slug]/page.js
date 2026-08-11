import { notFound, permanentRedirect } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import { getPostUrl } from "@/lib/categories";

// Articles used to live at /blog/[slug] regardless of category. They now
// live under their category's own path (e.g. /business/[slug]) — see
// app/business/[slug]/page.js and its siblings. This route stays in place
// purely so every already-published/shared/indexed /blog/... link keeps
// working: it looks up the post and permanently redirects (308) to its new
// category-based URL instead of 404ing or duplicating the article render
// logic here.
export default function LegacyBlogRedirect({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  permanentRedirect(getPostUrl(post));
}
