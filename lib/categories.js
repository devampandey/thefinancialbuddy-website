// The fixed set of article categories — shared by the admin editor's
// category dropdown and the public Latest News filter bar, so they never
// drift apart. Kept in its own file (no fs/Node dependency) so it's safe
// to import from client components too.
export const CATEGORIES = ["News", "Politics", "AI", "Business", "Markets", "Sports", "IPO"];
