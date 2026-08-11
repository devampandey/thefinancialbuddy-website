import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/articleMeta";
import ArticleBody from "@/components/ArticleBody";

// "Technology" is the stored category value; /ai is its URL prefix
// (CATEGORY_LINKS.Technology.href), matching the existing /ai category page.
export function generateStaticParams() {
  return getPostsByCategory("Technology").map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  return buildArticleMetadata(params.slug);
}

export default function TechnologyArticlePage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.category !== "Technology") notFound();
  return <ArticleBody post={post} />;
}
