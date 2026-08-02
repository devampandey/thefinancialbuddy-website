"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "fb_notif_dismissed";
const PROMPT_DELAY_MS = 4000;

// Converts the VAPID public key (base64url, from lib/metals.js-style env
// config) into the raw Uint8Array format the Push API's applicationServerKey
// expects.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// A quiet, dismissible prompt asking visitors to enable browser push
// notifications. Doesn't send anything yet — see public/sw.js — this phase
// is just building the opt-in list. Never nags: once a visitor has either
// decided (browser permission granted/denied) or dismissed the banner once,
// it stays hidden for that browser.
export default function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | working | error

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return; // feature not configured yet
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      return; // unsupported browser (e.g. iOS Safari in some versions)
    }
    if (Notification.permission !== "default") return; // already decided
    if (localStorage.getItem(DISMISSED_KEY)) return; // already dismissed once

    const timer = setTimeout(() => setVisible(true), PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function enable() {
    setStatus("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setVisible(false);
    } catch {
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:right-4 sm:left-auto">
      <p className="text-sm font-semibold text-navy dark:text-white">Stay in the loop?</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Turn on browser notifications from The Financial Buddy so you don&apos;t miss updates.
      </p>
      {status === "error" && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Something went wrong enabling notifications — you can try again anytime from your
          browser&apos;s site settings.
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={enable}
          disabled={status === "working"}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
        >
          {status === "working" ? "Enabling…" : "Enable notifications"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          disabled={status === "working"}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
