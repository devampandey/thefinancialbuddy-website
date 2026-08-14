import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CategoryNav from "@/components/CategoryNav";
import CategoryPills from "@/components/CategoryPills";
import HeaderAccountLink from "@/components/reader/HeaderAccountLink";

const X_URL = "https://x.com/financialbudd";

// Masthead styled after classic broadsheet mastheads (WSJ, etc.): a large
// centered serif wordmark with utility icons pinned to the top-right corner,
// rather than the old left-aligned logo + right-aligned icon row. The grid
// (empty spacer / logo / icons) is what keeps the wordmark visually centered
// regardless of how wide the icon cluster ends up being.
export default function Header() {
  return (
    <>
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4 sm:px-6 sm:py-6">
          <div aria-hidden="true" />

          <Link href="/" className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
            <img
              src="/logo-icon.svg"
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
            />
            <span
              className="truncate text-lg font-bold tracking-tight text-navy dark:text-white sm:text-2xl md:text-3xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The Financial Buddy
            </span>
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-3">
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:h-9 sm:w-9"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <ThemeToggle />

            <HeaderAccountLink />
          </div>
        </div>
      </header>

      <CategoryPills />
      <CategoryNav />
    </>
  );
}
