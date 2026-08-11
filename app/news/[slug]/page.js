import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/articleMeta";
import ArticleBody from "@/components/ArticleBody";

export function generateStaticParams() {
  return getPostsByCategory("News").map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  return buildArticleMetadata(params.slug);
}

export default function NewsArticlePage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.category !== "News") notFound();
  return <ArticleBody post={post} />;
}
