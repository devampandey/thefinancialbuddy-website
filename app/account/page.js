"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reader/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.signedIn) {
          router.push("/account/login?next=/account");
          return;
        }
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/reader/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading || !session) {
    return <div className="mx-auto max-w-3xl px-6 py-16" />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand">Your account</p>
          <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">
            Hi {session.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{session.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8">
        <Link
          href="/account/saved"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
        >
          View saved articles →
        </Link>
      </div>
    </div>
  );
}
