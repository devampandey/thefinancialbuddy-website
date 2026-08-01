// The fixed set of article categories — shared by the admin editor's
// category dropdown and the public Latest News filter bar, so they never
// drift apart. Kept in its own file (no fs/Node dependency) so it's safe
// to import from client components too.
export const CATEGORIES = ["News", "Politics", "AI", "Business", "Markets", "Sports", "IPO"];

// Maps each stored category value to the URL and display label of its
// category page. "AI" is stored as-is in article frontmatter (unchanged,
// so existing/future articles don't need re-tagging) but the nav and page
// heading call that section "Technology" — this is the single place that
// mapping lives, used by the article breadcrumb.
export const CATEGORY_LINKS = {
  News: { href: "/news", label: "News" },
  Politics: { href: "/politics", label: "Politics" },
  AI: { href: "/ai", label: "Technology" },
  Business: { href: "/business", label: "Business" },
  Markets: { href: "/markets", label: "Markets" },
  Sports: { href: "/sports", label: "Sports" },
  IPO: { href: "/ipo", label: "IPO" },
};
