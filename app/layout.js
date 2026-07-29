import "./globals.css";
import MarketTicker from "@/components/MarketTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://thefinancialbuddy.com"),
  title: {
    default: "The Financial Buddy — Practical Money Guides & Free Calculators",
    template: "%s | The Financial Buddy",
  },
  description:
    "Free budgeting, debt payoff, and savings calculators paired with plain-English guides to help you take control of your money.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: noZoomScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-[#1a1a1a] dark:bg-gray-900 dark:text-gray-100">
        <MarketTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
