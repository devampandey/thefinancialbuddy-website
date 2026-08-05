"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NEWS_SUBSECTIONS = [
  { href: "/news", label: "Top Stories" },
  { href: "/markets", label: "Markets" },
  { href: "/ipo", label: "IPO" },
  { href: "/ai", label: "Technology" },
  { href: "/business", label: "Business" },
  { href: "/politics", label: "Politics" },
  { href: "/sports", label: "Sports" },
];

// Same subsections as the News dropdown, also linked directly in the bar
// so someone who already knows which section they want doesn't have to
// open the dropdown first. "General News" is left out of this flat list —
// the News dropdown button itself covers that entry point.
const FLAT_SUBSECTIONS = NEWS_SUBSECTIONS.filter((item) => item.href !== "/news");

const plainLinks = {
  before: [{ href: "/", label: "Home" }],
  after: [
    { href: "/blog", label: "Latest News" },
    { href: "/chai-charts", label: "Chai & Charts" },
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
//
// The dropdown panel is rendered with position:fixed and its coordinates
// measured from the button directly, rather than being absolutely
// positioned inside the horizontally-scrolling nav row — that row has
// overflow-x-auto, and per the CSS spec, setting overflow on one axis
// forces the other axis to clip too, so an absolutely-positioned dropdown
// hanging below it would get cut off and never actually show.
export default function CategoryNav() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(e) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    // Closes the dropdown on scroll rather than trying to keep it pinned to
    // the button — simpler and avoids it visually drifting away from where
    // it was opened.
    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <nav className="relative bg-navy">
      <div className="flex w-full items-stretch gap-1 overflow-x-auto px-4 [-webkit-overflow-scrolling:touch] [scroll-behavior:smooth] [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] sm:px-6 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent">
        {plainLinks.before.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}

        <button
          ref={buttonRef}
          type="button"
          onClick={toggleOpen}
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
            <path
              d="M1 3l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {FLAT_SUBSECTIONS.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        ))}

        {plainLinks.after.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
      </div>

      {open && (
        <div
          ref={panelRef}
          style={{ position: "fixed", top: coords.top, left: coords.left }}
          className="z-50 min-w-[180px] rounded-b-lg border border-t-0 border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
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
    </nav>
  );
}
