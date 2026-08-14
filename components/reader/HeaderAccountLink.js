"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Public-facing account icon in the masthead — links to reader sign-in if
// no one's logged in, or the account dashboard if they are. Separate from
// staff sign-in, which lives at /admin/login (linked from the footer).
export default function HeaderAccountLink() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/reader/session")
      .then((res) => res.json())
      .then((data) => setSignedIn(data.signedIn))
      .catch(() => {});
  }, []);

  return (
    <Link
      href={signedIn ? "/account" : "/account/login"}
      aria-label={signedIn ? "Your account" : "Sign in"}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:h-9 sm:w-9"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    </Link>
  );
}
