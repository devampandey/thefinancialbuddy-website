"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/politics", label: "Politics" },
  { href: "/ai", label: "AI" },
  { href: "/tools", label: "Tools" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
            FB
          </span>
          <span
            className="text-2xl font-bold tracking-tight text-navy"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            The Financial Buddy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-sm font-medium text-gray-700 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-navy sm:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="flex flex-col border-t border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-gray-100 py-3 last:border-b-0 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
