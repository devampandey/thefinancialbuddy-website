"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reader/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-navy dark:text-white">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Access your saved articles and comments.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        New here?{" "}
        <Link href="/account/signup" className="font-medium text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function ReaderLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
