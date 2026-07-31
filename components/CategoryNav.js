import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Latest" },
  { href: "/business", label: "Business" },
  { href: "/politics", label: "Politics" },
  { href: "/markets", label: "Markets" },
  { href: "/ai", label: "Tech" },
  { href: "/sports", label: "Sports" },
];

// The main site navigation, styled as a bold full-width bar (rather than
// links tucked into the white masthead) — scrolls horizontally on narrow
// screens instead of collapsing into a hamburger menu.
export default function CategoryNav() {
  return (
    <nav className="bg-navy">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-200 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:py-3 sm:text-sm"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
