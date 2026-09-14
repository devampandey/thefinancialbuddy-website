"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPostUrl } from "@/lib/categories";

// How long each slide stays up before auto-advancing, and how long the
// crossfade between slides takes.
const ROTATE_MS = 6000;
const FADE_MS = 700;

// The image stage went through two earlier versions: a flat navy block,
// then a rotating color palette (dropped — a serious story could land on a
// cheerful gradient purely by chance), then a neutral gray "no photo" tile.
// That tile fixed the tone problem but introduced a new one: since no
// auto-drafted article currently has a cover photo (that's added manually
// by a human reviewer, and in practice hasn't been happening), the tile was
// rendering for every single slide — a large, mostly-empty gray box at the
// very top of the homepage, every time. Rather than keep inventing new
// filler for a box that's usually empty, the image stage is now skipped
// entirely when none of the current slides have a real photo — the hero
// falls back to a clean, text-only headline treatment (see "text stage"
// below), the same pattern already used successfully elsewhere on the site
// (the homepage's own "Latest" grid just omits the image box when a post
// has none). If a slide DOES have a real photo, it still displays normally.

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
  const hasAnyImage = posts.some((post) => post.image);

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
          positioning, crossfaded purely by opacity. Skipped entirely when
          no slide has a real photo — see the note above the component. */}
      {hasAnyImage && (
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
              {post.image ? (
                <img
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
                />
              ) : (
                // A photo-less post can still land in the rotation alongside
                // ones that do have a photo — this neutral tile (same
                // muted gray/border treatment used for cards elsewhere on
                // the site, no color or badge) covers that one slide
                // without implying anything about the story's tone.
                <div className="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">
                    The Financial Buddy
                  </span>
                </div>
              )}
              <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {post.category}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Text stage: same overlap trick via CSS Grid — every slide's text
          block placed in the same grid cell, so the container's height
          tracks the tallest one instead of collapsing between slides of
          different lengths. */}
      <div className={`grid w-full ${hasAnyImage ? "mt-3 sm:mt-4" : ""}`}>
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
              {/* Without an image stage, the category badge has nowhere
                  else to live, so it moves up here instead of being
                  dropped entirely. */}
              {!hasAnyImage && (
                <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {post.category}
                </span>
              )}
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

      {/* These floating arrow/dot controls are styled to sit on top of a
          photo (semi-transparent black pill, white dots) — they only make
          sense when the image stage is actually showing. Without it, the
          same multi-story navigation is given a plain, non-overlapping row
          of dots below the text instead, so it doesn't float on top of and
          obscure the headline. */}
      {count > 1 && hasAnyImage && (
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

      {count > 1 && !hasAnyImage && (
        <div className="mt-4 flex gap-1.5">
          {posts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Show story ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-navy dark:bg-white" : "w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
