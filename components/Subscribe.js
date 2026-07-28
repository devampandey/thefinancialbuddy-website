"use client";

const BUTTONDOWN_USERNAME = "thefinancialbuddy";

export default function Subscribe() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-bold">Get new posts by email</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-200">
          News, politics, and AI articles — sent to your inbox the moment
          they're published. No spam, unsubscribe any time.
        </p>
        <form
          action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`}
          method="post"
          target="popupwindow"
          onSubmit={() =>
            window.open(
              `https://buttondown.com/${BUTTONDOWN_USERNAME}`,
              "popupwindow"
            )
          }
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input type="hidden" value="1" name="embed" />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-light"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
