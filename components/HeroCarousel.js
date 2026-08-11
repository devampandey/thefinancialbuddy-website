"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPostUrl } from "@/lib/categories";

// How long each slide stays up before auto-advancing, and how long the
// crossfade between slides takes.
const ROTATE_MS = 6000;
const FADE_MS = 700;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Rotating hero for the homepage's top slot. Every slide stays mounted in
// the DOM at all times, stacked on top of each other (image stage) or
// overlapping in the same grid cell (text stage) — only the opacity of the
// active slide changes. That's deliberate: an earlier version swapped one
// element's content in and out, which meant the fade-in had to be
// hand-synchronized with content changes via requestAnimationFrame, and any
// timing slip made it "blink" instead of crossfade. With every slide always
// present, there's nothing to synchronize — the browser just animates the
// opacity change on its own, the same way any real carousel does it.
export default function HeroCarousel({ posts }) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const count = posts.length;

  useEffect(() => {
    if (count <= 1) return undefined;
    const interval = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* Image stage: fixed aspect ratio so nothing shifts as slides change,
          every slide's image stacked in the same box via absolute
          positioning, crossfaded purely by opacity. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 sm:aspect-[21/9]">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={getPostUrl(post)}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className="group/img absolute inset-0 block overflow-hidden"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              pointerEvents: i === index ? "auto" : "none",
            }}
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
              />
            )}
            <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {post.category}
            </span>
          </Link>
        ))}
      </div>

      {/* Text stage: same overlap trick via CSS Grid — every slide's text
          block placed in the same grid cell, so the container's height
          tracks the tallest one instead of collapsing between slides of
          different lengths. */}
      <div className="mt-3 grid w-full sm:mt-4">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={getPostUrl(post)}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className="group/text block min-w-0 [grid-area:1/1]"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              pointerEvents: i === index ? "auto" : "none",
            }}
          >
            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>{formatDate(post.date)}</span>
              {post.author && <span>By {post.author}</span>}
            </div>
            <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-black group-hover/text:text-navy group-hover/text:underline dark:text-white dark:group-hover/text:text-navy-light sm:text-3xl md:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-2 max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:mt-3 sm:text-lg">
                {post.description}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand sm:mt-4">
              Continue reading
              <span aria-hidden className="transition-transform group-hover/text:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => setIndex((index - 1 + count) % count)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 sm:block"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => setIndex((index + 1) % count)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 sm:block"
          >
            ›
          </button>
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {posts.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Show story ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
