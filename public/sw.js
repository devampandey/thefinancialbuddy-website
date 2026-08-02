// Minimal push service worker. Right now nothing actually sends push
// messages yet (that's a deliberate next phase, once we decide what
// notifications are for) — this just makes sure that once we do start
// sending, subscribed browsers already have a worker in place to receive
// and display them, and handles the click-through in the meantime.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "The Financial Buddy", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "The Financial Buddy";
  const options = {
    body: data.body || "",
    icon: "/logo-icon.svg",
    badge: "/logo-icon.svg",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url === url);
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
