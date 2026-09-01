// The fixed set of article categories — shared by the admin editor's
// category dropdown and the public Latest News filter bar, so they never
// drift apart. Kept in its own file (no fs/Node dependency) so it's safe
// to import from client components too.
export const CATEGORIES = [
  "News",
  "World",
  "Politics",
  "Technology",
  "Business",
  "Markets",
  "Sports",
  "IPO",
  "Lifestyle",
  "MarketPulse",
];

// Maps each stored category value to the URL of its category page. Used by
// the article breadcrumb (and anywhere else that needs to link a category
// name to its page) so the mapping only lives in one place.
export const CATEGORY_LINKS = {
  News: { href: "/news", label: "News" },
  World: { href: "/world", label: "World" },
  // Category value stays "Politics" so existing published/drafted articles
  // don't need a frontmatter migration — only the display label changed to
  // reflect that this section now covers policy stories at both the India
  // and world level, not just India politics.
  Politics: { href: "/politics", label: "Politics & Policy" },
  Technology: { href: "/ai", label: "Technology" },
  Business: { href: "/business", label: "Business" },
  Markets: { href: "/markets", label: "Markets" },
  Sports: { href: "/sports", label: "Sports" },
  IPO: { href: "/ipo", label: "IPO" },
  Lifestyle: { href: "/lifestyle", label: "Lifestyle" },
  // Monthly markets digest — one long-form issue a month tying every asset
  // class (global markets, currency, commodities, Indian indices, flows)
  // back to a single dominant narrative thread, modeled on the "Leveraged
  // Growth" monthly report pattern.
  MarketPulse: { href: "/market-pulse", label: "Market Pulse" },
};

// Builds an article's canonical URL from its category, e.g. a Business post
// becomes /business/my-slug instead of /blog/my-slug. Falls back to /blog if
// a post's category somehow isn't in CATEGORY_LINKS, so nothing 404s outright
// for stale or mistyped category values.
export function getPostUrl(post) {
  const base = CATEGORY_LINKS[post.category]?.href || "/blog";
  return `${base}/${post.slug}`;
}
