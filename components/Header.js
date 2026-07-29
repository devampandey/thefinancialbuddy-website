import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CategoryNav from "@/components/CategoryNav";
import CategoryPills from "@/components/CategoryPills";

const X_URL = "https://x.com/financialbudd";

export default function Header() {
  return (
    <>
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <img
              src="/logo-icon.svg"
              alt=""
              width={36}
              height={36}
              className="h-7 w-7 shrink-0 sm:h-9 sm:w-9"
            />
            <span
              className="truncate text-base font-bold tracking-tight text-navy dark:text-white sm:text-2xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The Financial Buddy
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:h-9 sm:w-9"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <ThemeToggle />

            <Link
              href="/admin/login"
              aria-label="Staff sign in"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:h-9 sm:w-9"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <CategoryNav />
      <CategoryPills />
    </>
  );
}
