"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// How long each slide stays up before auto-advancing, and how long the
// crossfade between slides takes. Kept short enough that the homepage feels
// alive but long enough that a visitor can actually read the headline.
const ROTATE_MS = 6000;
const FADE_MS = 500;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Rotating hero for the homepage's top slot. Cycles through the most recent
// posts automatically instead of pinning a single article there until the
// next publish. Pauses on hover so it doesn't yank the page out from under
// someone mid-read, and still renders as a plain link for anyone/anything
// without JS (first slide only, since that's what's in the initial HTML).
export default function HeroCarousel({ posts }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const pausedRef = useRef(false);
  const fadeTimeoutRef = useRef(null);

  const count = posts.length;

  // Preload every slide's image up front so switching slides never shows a
  // blank/loading flash while a fresh image fetches — that flash was the
  // main thing making the rotation look like a "blink" instead of a fade.
  useEffect(() => {
    posts.forEach((p) => {
      if (!p.image) return;
      const img = new Image();
      img.src = p.image;
    });
  }, [posts]);

  // Swaps content while faded out, then waits two animation frames before
  // fading back in. That gap matters: if the content swap and the fade-in
  // happen in the same React commit, the browser never actually paints the
  // opacity:0 frame, so there's nothing to transition FROM — it just pops.
  // Two rAFs guarantee a real paint happens in between.
  const swapTo = (nextIndex) => {
    setIndex(nextIndex);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  };

  const goTo = (nextIndex) => {
    if (count <= 1 || nextIndex === index) return;
    setVisible(false);
    clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => swapTo(nextIndex), FADE_MS);
  };

  useEffect(() => {
    if (count <= 1) return undefined;
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setVisible(false);
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        swapTo((i) => (i + 1) % count);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeoutRef.current);
    };
  }, [count]);

  if (count === 0) return null;
  const post = posts[index];

  return (
    <div
      className="group relative"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
      >
        {post.image ? (
          <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <img
              src={post.image}
              alt=""
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:aspect-[21/9]"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {post.category}
            </span>
          </div>
        ) : (
          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand dark:bg-gray-800">
            {post.category}
          </span>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 sm:mt-4">
          <span>{formatDate(post.date)}</span>
          {post.author && <span>By {post.author}</span>}
        </div>
        <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-navy group-hover:underline dark:text-white sm:text-3xl md:text-4xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-2 max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:mt-3 sm:text-lg">
            {post.description}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand sm:mt-4">
          Continue reading
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => goTo((index - 1 + count) % count)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 sm:block"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => goTo((index + 1) % count)}
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
                onClick={() => goTo(i)}
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
