import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/articleMeta";
import ArticleBody from "@/components/ArticleBody";

export function generateStaticParams() {
  return getPostsByCategory("IPO").map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  return buildArticleMetadata(params.slug);
}

export default function IpoArticlePage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.category !== "IPO") notFound();
  return <ArticleBody post={post} />;
}
