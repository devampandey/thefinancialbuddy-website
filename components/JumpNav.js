// "On this page" jump navigation — a set of anchor links to the sections
// already present on the page (chart, calculator, city table, history,
// etc). Adds zero new written content, so there's no duplicate-content
// risk; it's purely a navigation aid that lets a visitor skip straight to
// the section they want, which is the "clear, easy-to-use navigation"
// signal AdSense's own site-readiness guidance calls out. Relies on the
// site-wide `html { scroll-behavior: smooth }` in globals.css for the
// smooth-scroll — no client JS needed here.
export default function JumpNav({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        On this page
      </span>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm font-medium text-brand hover:underline dark:text-brand-light"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
