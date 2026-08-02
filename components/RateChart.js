"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const RANGES = [
  { key: "1w", label: "1W" },
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "9m", label: "9M" },
  { key: "1y", label: "1Y" },
  { key: "2y", label: "2Y" },
  { key: "3y", label: "3Y" },
  { key: "5y", label: "5Y" },
  { key: "all", label: "ALL" },
];

const WIDTH = 800;
const HEIGHT = 280;
const PAD = { top: 16, right: 12, bottom: 28, left: 64 };

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function formatDate(ms, withYear) {
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: withYear ? "numeric" : undefined,
  });
}

// Self-contained SVG line/area chart — no charting library dependency.
// Fetches daily closes from /api/market/history for whichever range button
// is active and redraws. Hover shows the nearest point's date + price via
// SVG text rather than an HTML tooltip overlay, which keeps the coordinate
// math simple (no need to measure the container for positioning).
export default function RateChart({ metal, unit }) {
  const [range, setRange] = useState("1y");
  const [rows, setRows] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setHoverIndex(null);
    fetch(`/api/market/history?metal=${metal}&range=${range}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRows(data.rows || []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [metal, range]);

  const chart = useMemo(() => {
    if (!rows || rows.length < 2) return null;

    const prices = rows.map((r) => r.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;

    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const x = (i) => PAD.left + (i / (rows.length - 1)) * innerW;
    const y = (price) => PAD.top + (1 - (price - min) / span) * innerH;

    const points = rows.map((r, i) => [x(i), y(r.price)]);
    const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px},${py}`).join(" ");
    const baseline = PAD.top + innerH;
    const areaPath = `${linePath} L${points[points.length - 1][0]},${baseline} L${points[0][0]},${baseline} Z`;

    const up = rows[rows.length - 1].price >= rows[0].price;

    return { points, linePath, areaPath, min, max, baseline, up };
  }, [rows]);

  function handleMove(e) {
    if (!chart || !svgRef.current || !rows) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    chart.points.forEach(([px], i) => {
      const dist = Math.abs(px - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const trendColor = chart?.up ? "#16A34A" : "#DC2626";
  const hovered = hoverIndex != null && rows ? rows[hoverIndex] : null;
  const withYear = range === "5y" || range === "all" || range === "3y" || range === "2y";

  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:p-5">
      <div className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              range === r.key
                ? "bg-brand text-white"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {rows === null && (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
            Loading chart…
          </div>
        )}
        {rows && rows.length < 2 && (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
            Chart data isn&apos;t available right now.
          </div>
        )}
        {chart && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="h-[280px] w-full cursor-crosshair"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={`chartFill-${metal}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal gridlines + y-axis min/max labels */}
            <line
              x1={PAD.left}
              y1={PAD.top}
              x2={WIDTH - PAD.right}
              y2={PAD.top}
              stroke="currentColor"
              strokeOpacity="0.1"
              className="text-gray-500"
            />
            <line
              x1={PAD.left}
              y1={chart.baseline}
              x2={WIDTH - PAD.right}
              y2={chart.baseline}
              stroke="currentColor"
              strokeOpacity="0.1"
              className="text-gray-500"
            />
            <text x={4} y={PAD.top + 4} className="fill-gray-400 text-[10px]">
              ₹{formatNumber(chart.max)}
            </text>
            <text x={4} y={chart.baseline} className="fill-gray-400 text-[10px]">
              ₹{formatNumber(chart.min)}
            </text>

            <path d={chart.areaPath} fill={`url(#chartFill-${metal})`} />
            <path d={chart.linePath} fill="none" stroke={trendColor} strokeWidth="2" />

            {/* First/last date labels */}
            <text x={PAD.left} y={HEIGHT - 6} className="fill-gray-400 text-[10px]">
              {formatDate(rows[0].date, withYear)}
            </text>
            <text
              x={WIDTH - PAD.right}
              y={HEIGHT - 6}
              textAnchor="end"
              className="fill-gray-400 text-[10px]"
            >
              {formatDate(rows[rows.length - 1].date, withYear)}
            </text>

            {hovered && hoverIndex != null && (
              <>
                <line
                  x1={chart.points[hoverIndex][0]}
                  y1={PAD.top}
                  x2={chart.points[hoverIndex][0]}
                  y2={chart.baseline}
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeDasharray="3,3"
                  className="text-gray-500"
                />
                <circle
                  cx={chart.points[hoverIndex][0]}
                  cy={chart.points[hoverIndex][1]}
                  r="4"
                  fill={trendColor}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <g>
                  <rect
                    x={Math.min(Math.max(chart.points[hoverIndex][0] - 55, PAD.left), WIDTH - PAD.right - 110)}
                    y={PAD.top}
                    width="110"
                    height="34"
                    rx="6"
                    className="fill-navy dark:fill-gray-800"
                  />
                  <text
                    x={Math.min(Math.max(chart.points[hoverIndex][0] - 55, PAD.left), WIDTH - PAD.right - 110) + 8}
                    y={PAD.top + 14}
                    className="fill-white text-[10px] font-semibold"
                  >
                    ₹{formatNumber(hovered.price)}
                  </text>
                  <text
                    x={Math.min(Math.max(chart.points[hoverIndex][0] - 55, PAD.left), WIDTH - PAD.right - 110) + 8}
                    y={PAD.top + 27}
                    className="fill-gray-300 text-[9px]"
                  >
                    {formatDate(hovered.date, true)}
                  </text>
                </g>
              </>
            )}
          </svg>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {unit} · international spot price converted to INR at today&apos;s exchange rate.
      </p>
    </div>
  );
}
