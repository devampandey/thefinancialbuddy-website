// The fixed set of article categories — shared by the admin editor's
// category dropdown and the public Latest News filter bar, so they never
// drift apart. Kept in its own file (no fs/Node dependency) so it's safe
// to import from client components too.
export const CATEGORIES = [
  "News",
  "Politics",
  "Technology",
  "Business",
  "Markets",
  "Sports",
  "IPO",
  "Lifestyle",
];

// Maps each stored category value to the URL of its category page. Used by
// the article breadcrumb (and anywhere else that needs to link a category
// name to its page) so the mapping only lives in one place.
export const CATEGORY_LINKS = {
  News: { href: "/news", label: "News" },
  Politics: { href: "/politics", label: "Politics" },
  Technology: { href: "/ai", label: "Technology" },
  Business: { href: "/business", label: "Business" },
  Markets: { href: "/markets", label: "Markets" },
  Sports: { href: "/sports", label: "Sports" },
  IPO: { href: "/ipo", label: "IPO" },
  Lifestyle: { href: "/lifestyle", label: "Lifestyle" },
};
