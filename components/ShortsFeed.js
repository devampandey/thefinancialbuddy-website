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

// Full-screen, swipe-through card feed in the Inshorts mould — left/right
// paging (swipe left for next, right for previous), like Tinder or
// Instagram Stories. Deliberately built on plain CSS scroll-snap (snap-x
// snap-mandatory + snap-start on each card) rather than a JS touch/gesture
// library — native momentum scrolling already gives the swipe feel on
// mobile/trackpad, and scroll-snap does the "settle on one card" behavior
// for free. Left/Right arrow keys are wired up separately below purely for
// desktop convenience (a plain scroll container has no built-in keyboard
// paging), scrolling by exactly one card width so it lands on the next
// snap point instead of an arbitrary scroll offset.
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

  function scrollByCard(direction) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction * container.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") scrollByCard(1);
      else if (e.key === "ArrowLeft") scrollByCard(-1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // A plain mouse wheel only ever reports vertical motion (deltaY) — there's
  // no drag-to-pan on a native overflow container either, which is what
  // made left/right feel "broken" to a mouse user with no trackpad. This
  // redirects normal wheel scrolling into horizontal movement so spinning
  // the wheel pages through cards the same way it used to page down them.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    function handleWheel(e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="relative w-full" style={{ height: height ? `${height}px` : "100dvh" }}>
      <div
        ref={containerRef}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-scroll scroll-smooth"
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
                  <div className="pointer-events-none mt-8 flex w-full items-center justify-center gap-1.5 text-white/70">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0 animate-[bounce-left_1.4s_infinite]"
                    >
                      <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs">Swipe for more</span>
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

      {/* Explicit click targets — a native overflow container has no
          drag-to-pan for mouse users (only touch/trackpad swipe and, now,
          the wheel handler above actually move it), so anyone without a
          trackpad had no way to advance by clicking. Hidden on small
          screens, where touch swipe is the primary — and sufficient —
          interaction.

          This overlay is itself capped at max-w-2xl and centered exactly
          like the card (same mx-auto + matching horizontal padding as the
          section below), with pointer-events disabled on the wrapper and
          re-enabled only on the buttons — otherwise `right-3`/`left-3`
          against the full-width outer div plants the buttons at the true
          screen edge, nowhere near the card on a wide desktop viewport. */}
      <div className="pointer-events-none absolute inset-0 z-10 mx-auto hidden max-w-2xl items-center justify-between px-2 sm:flex sm:px-4">
        {activeIndex > 0 ? (
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous story"
            className="pointer-events-auto flex items-center justify-center rounded-full bg-white/90 p-2 text-navy shadow-lg transition-opacity hover:opacity-90"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span />
        )}
        {activeIndex < posts.length - 1 ? (
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next story"
            className="pointer-events-auto flex items-center justify-center rounded-full bg-white/90 p-2 text-navy shadow-lg transition-opacity hover:opacity-90"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
