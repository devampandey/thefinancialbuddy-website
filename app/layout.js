import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import MarketTicker from "@/components/MarketTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationPrompt from "@/components/NotificationPrompt";

// Both optional — the site works fine without either set. Add
// GSC_VERIFICATION once you create a Search Console property (HTML tag
// method), and NEXT_PUBLIC_GA_MEASUREMENT_ID once you create a GA4
// property, and each turns on automatically without further code changes.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata = {
  metadataBase: new URL("https://thefinancialbuddy.com"),
  title: {
    default: "The Financial Buddy — Practical Money Guides & Free Calculators",
    template: "%s | The Financial Buddy",
  },
  description:
    "Free budgeting, debt payoff, and savings calculators paired with plain-English guides to help you take control of your money.",
  ...(process.env.GSC_VERIFICATION
    ? { verification: { google: process.env.GSC_VERIFICATION } }
    : {}),
};

// Locks the mobile viewport to the device width so the site renders at its
// intended mobile layout instead of the browser's default zoomed-out desktop
// width, and prevents pinch-zoom from scaling the page out further.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

// iOS Safari ignores maximum-scale/user-scalable in the viewport meta tag,
// so pinch and double-tap zoom are blocked here directly at the gesture
// level as a second line of defense.
const noZoomScript = `
(function() {
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('gesturechange', function (e) { e.preventDefault(); });
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function (e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* No manual <head> here on purpose — Next.js's Metadata API (the
          `metadata` export above) generates and de-dupes the real <head>
          automatically. Writing our own <head> alongside it can produce a
          malformed/duplicate <head> in the final HTML, which is what broke
          Google Search Console's verification meta tag check. These two
          scripts still need to run before the page paints, so they're
          placed first inside <body> instead — a render-blocking inline
          script there still executes before anything after it renders. */}
      <body className="flex min-h-screen flex-col bg-white text-[#1a1a1a] dark:bg-gray-900 dark:text-gray-100">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: noZoomScript }} />
        <MarketTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <NotificationPrompt />
        <Analytics />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
