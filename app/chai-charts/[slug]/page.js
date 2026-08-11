import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/articleMeta";
import ArticleBody from "@/components/ArticleBody";

// Individual issues stay reachable at their own URL even while the
// /chai-charts landing page itself is paused (see app/chai-charts/page.js) —
// same as before the redesign, just under the new category-based path.
export function generateStaticParams() {
  return getPostsByCategory("Newsletter").map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  return buildArticleMetadata(params.slug);
}

export default function NewsletterArticlePage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.category !== "Newsletter") notFound();
  return <ArticleBody post={post} />;
}
