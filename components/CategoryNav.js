"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NEWS_SUBSECTIONS = [
  { href: "/news", label: "General News" },
  { href: "/markets", label: "Markets" },
  { href: "/ipo", label: "IPO" },
  { href: "/ai", label: "Technology" },
  { href: "/business", label: "Business" },
  { href: "/politics", label: "Politics" },
  { href: "/sports", label: "Sports" },
];

const plainLinks = {
  before: [{ href: "/", label: "Home" }],
  after: [
    { href: "/blog", label: "Latest News" },
    { href: "/lifestyle", label: "Lifestyle" },
    { href: "/tools", label: "Tools" },
  ],
};

const linkClass =
  "shrink-0 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-200 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:py-3 sm:text-sm";

// The main site navigation, styled as a bold full-width bar. "News" opens a
// dropdown of its subsections (Markets, IPO, Technology, Business, Politics,
// Sports) — click-to-toggle rather than hover-only so it works the same on
// touch devices as it does with a mouse. Everything else scrolls
// horizontally on narrow screens instead of collapsing into a hamburger.
export default function CategoryNav() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <nav className="bg-navy">
      <div className="mx-auto flex max-w-6xl items-stretch gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {plainLinks.before.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}

        <div ref={wrapperRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
            className={`${linkClass} flex items-center gap-1`}
          >
            News
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div className="absolute left-0 top-full z-20 min-w-[180px] rounded-b-lg border border-t-0 border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {NEWS_SUBSECTIONS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {plainLinks.after.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
