import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/politics", label: "Politics" },
  { href: "/ai", label: "AI" },
  { href: "/tools", label: "Tools" },
];

// The main site navigation, styled as a bold full-width bar (rather than
// links tucked into the white masthead) — scrolls horizontally on narrow
// screens instead of collapsing into a hamburger menu.
export default function CategoryNav() {
  return (
    <nav className="bg-navy">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
