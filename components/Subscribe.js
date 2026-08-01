"use client";

import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already subscribed — thanks for being here!"
          : "You're subscribed! Check your inbox to confirm."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the newsletter service. Please try again.");
    }
  }

  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-bold">Get new posts by email</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-200">
          News, politics, and AI articles — sent to your inbox the moment
          they're published. No spam, unsubscribe any time.
        </p>

        {status === "success" ? (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-white/10 px-4 py-3 text-sm font-medium text-white">
            {message}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mx-auto mt-3 max-w-md text-sm text-red-300">{message}</p>
        )}
      </div>
    </section>
  );
}
