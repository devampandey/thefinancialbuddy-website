import { getAllPosts } from "@/lib/blog";
import { getPostUrl } from "@/lib/categories";

// Matches the site's actual canonical host (thefinancialbuddy.com redirects
// to www) — same host registered and verified in Search Console.
const BASE_URL = "https://www.thefinancialbuddy.com";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/news", priority: 0.8, changeFrequency: "daily" },
  { path: "/world", priority: 0.8, changeFrequency: "daily" },
  { path: "/politics", priority: 0.8, changeFrequency: "daily" },
  { path: "/ai", priority: 0.8, changeFrequency: "daily" },
  { path: "/business", priority: 0.8, changeFrequency: "daily" },
  { path: "/markets", priority: 0.8, changeFrequency: "daily" },
  { path: "/ipo", priority: 0.8, changeFrequency: "daily" },
  { path: "/sports", priority: 0.8, changeFrequency: "daily" },
  { path: "/lifestyle", priority: 0.8, changeFrequency: "daily" },
  { path: "/market-pulse", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools", priority: 0.7, changeFrequency: "weekly" },
  { path: "/tools/budget-calculator", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/debt-payoff", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/emi-calculator", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/gold-rate", priority: 0.7, changeFrequency: "hourly" },
  { path: "/tools/silver-rate", priority: 0.7, changeFrequency: "hourly" },
  { path: "/guides", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  const posts = getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${BASE_URL}${getPostUrl(post)}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...postEntries];
}
