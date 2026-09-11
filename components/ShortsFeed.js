"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPostUrl } from "@/lib/categories";

// Cycled by index rather than category, purely for visual variety card to
// card (an Inshorts-style feed reads as "colorful" precisely because
// consecutive cards don't share a background) — not tied to category
// meaning, so it stays stable even as new categories get added later.
const CARD_THEMES = [
  "bg-navy dark:bg-navy",
  "bg-[#0F3D3E] dark:bg-[#0F3D3E]", // deep teal
  "bg-[#5C3A21] dark:bg-[#5C3A21]", // warm brown
  "bg-[#2C2A4A] dark:bg-[#2C2A4A]", // indigo
  "bg-[#7A2E2E] dark:bg-[#7A2E2E]", // deep maroon
  "bg-[#1F4B3F] dark:bg-[#1F4B3F]", // forest green
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

// Full-screen, swipe-through card feed in the Inshorts mould. Deliberately
// built on plain CSS scroll-snap (snap-y snap-mandatory + snap-start on each
// card) rather than a JS touch/gesture library — native momentum scrolling
// already gives the swipe feel on mobile, and scroll-snap does the
// "settle on one card" behavior for free on both touch and mouse-wheel.
//
// The container's height is measured at runtime (viewport height minus
// wherever it sits below the header/nav) instead of a hardcoded calc(), so
// it stays exactly full-"screen" whether the header is at its 2-row mobile
// height or the wider desktop layout, without duplicating those
// breakpoints here.
export default function ShortsFeed({ posts }) {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const top = containerRef.current.getBoundingClientRect().top;
      setHeight(window.innerHeight - top);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const cards = Array.from(container.children);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = cards.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.5] }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [posts.length]);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      style={{ height: height ? `${height}px` : "100dvh" }}
    >
      {posts.map((post, i) => {
        const theme = CARD_THEMES[i % CARD_THEMES.length];
        return (
          // Outer slide is a neutral, full-height snap stop — it's what
          // scroll-snap grabs onto. The colored card lives INSET inside it
          // (rounded corners, shadow, margin all round) so what the user
          // sees is a card sitting on the page rather than a wall-to-wall
          // color block, which read as a rendering bug rather than design.
          <section
            key={post.slug}
            className="relative flex h-full w-full shrink-0 snap-start items-center justify-center bg-gray-100 px-4 py-6 dark:bg-gray-950 sm:px-8 sm:py-10"
          >
            <div
              className={`flex h-full w-full max-w-2xl flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-2xl sm:p-10 ${theme}`}
            >
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-white/70">
                <span className="rounded-full border border-white/30 px-3 py-1">{post.category}</span>
                <span>
                  {i + 1} / {posts.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col items-start justify-center py-8">
                <Link href={getPostUrl(post)} className="group">
                  <h2
                    className="text-2xl font-bold leading-tight sm:text-4xl"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">{post.shortSummary}</p>

                {i === 0 && activeIndex === 0 && posts.length > 1 && (
                  <div className="pointer-events-none mt-8 flex w-full animate-bounce flex-col items-center text-white/70">
                    <span className="text-xs">Swipe up for more</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1">
                      <path d="M2 6l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-white/60">
                  {formatDate(post.date)}
                  {post.author ? ` · ${post.author}` : ""}
                </span>
                <Link
                  href={getPostUrl(post)}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
                >
                  Read full story →
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
