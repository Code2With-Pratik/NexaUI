import type { Metadata } from "next";
import {
  MarkBrush,
  MarkCircle,
  MarkSparkle,
  Sparkle,
} from "@/components/HandMarkers";

export const metadata: Metadata = {
  title: "Icons — Aura UI",
  description: "A small, hand-tuned icon set drawn on a 16px grid with a 1.4px stroke.",
};

const stroke = "currentColor";
const sw = 1.4;
const cap = "round" as const;
const join = "round" as const;

const icons: { name: string; path: React.ReactNode }[] = [
  {
    name: "home",
    path: <path d="M3 8l5-4.5L13 8v4.5a1 1 0 01-1 1h-2v-3.5H6v3.5H4a1 1 0 01-1-1V8z" />,
  },
  {
    name: "grid",
    path: (
      <>
        <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.8" />
        <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.8" />
        <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" />
        <rect x="9" y="9" width="4.5" height="4.5" rx="0.8" />
      </>
    ),
  },
  {
    name: "book",
    path: (
      <>
        <path d="M3 3h6a2 2 0 012 2v9H4.5A1.5 1.5 0 013 12.5V3z" />
        <path d="M3 12.5A1.5 1.5 0 014.5 11H11" />
      </>
    ),
  },
  {
    name: "search",
    path: (
      <>
        <circle cx="7" cy="7" r="4" />
        <path d="M10 10l3 3" />
      </>
    ),
  },
  {
    name: "sparkle",
    path: (
      <path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" />
    ),
  },
  {
    name: "bolt",
    path: <path d="M9 1.5L3.5 9h3l-.5 5.5L12 7H9l.5-5.5z" />,
  },
  {
    name: "moon",
    path: <path d="M12.5 9.2A4.8 4.8 0 016.3 3a5.5 5.5 0 106.2 6.2z" />,
  },
  {
    name: "sun",
    path: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M3.3 12.7l1.1-1.1M11.6 4.4l1.1-1.1" />
      </>
    ),
  },
  {
    name: "settings",
    path: (
      <>
        <circle cx="8" cy="8" r="2" />
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
      </>
    ),
  },
  {
    name: "type",
    path: <path d="M3 4V3h10v1M8 3v10M6 13h4" />,
  },
  {
    name: "code",
    path: <path d="M5 4L1.5 8 5 12M11 4l3.5 4-3.5 4M9.5 3l-3 10" />,
  },
  {
    name: "palette",
    path: (
      <>
        <path d="M8 1.5a6.5 6.5 0 100 13c1.2 0 1.5-.9 1.5-1.6 0-.4-.2-.7-.6-1-.3-.3-.4-.5-.4-.8 0-.6.4-1.1 1-1.1H11a3.5 3.5 0 003.5-3.5A6.5 6.5 0 008 1.5z" />
        <circle cx="4.5" cy="7" r="0.6" fill={stroke} />
        <circle cx="6.5" cy="4.5" r="0.6" fill={stroke} />
        <circle cx="10" cy="4.5" r="0.6" fill={stroke} />
        <circle cx="11.5" cy="7.5" r="0.6" fill={stroke} />
      </>
    ),
  },
  {
    name: "layers",
    path: (
      <>
        <path d="M8 2L2 5l6 3 6-3-6-3z" />
        <path d="M2 8l6 3 6-3M2 11l6 3 6-3" />
      </>
    ),
  },
  {
    name: "command",
    path: (
      <path d="M5 5h6v6H5V5zm0 0a1.5 1.5 0 11-1.5-1.5M11 5a1.5 1.5 0 111.5-1.5M5 11a1.5 1.5 0 11-1.5 1.5M11 11a1.5 1.5 0 111.5 1.5" />
    ),
  },
  {
    name: "circle-dot",
    path: (
      <>
        <circle cx="8" cy="8" r="6" />
        <circle cx="8" cy="8" r="1.5" fill={stroke} />
      </>
    ),
  },
  {
    name: "arrow-right",
    path: <path d="M3 8h10m0 0L9 4m4 4l-4 4" />,
  },
  {
    name: "arrow-up-right",
    path: <path d="M5 11L11 5m0 0H6m5 0v5" />,
  },
  {
    name: "github",
    path: (
      <path
        fill={stroke}
        stroke="none"
        d="M8 1a7 7 0 00-2.2 13.6c.35.07.48-.15.48-.34v-1.2c-1.95.43-2.36-.94-2.36-.94-.32-.81-.78-1.03-.78-1.03-.64-.43.05-.42.05-.42.7.05 1.08.73 1.08.73.63 1.08 1.66.77 2.06.59.06-.46.25-.77.45-.95-1.55-.18-3.18-.78-3.18-3.46 0-.77.27-1.39.72-1.88-.07-.18-.31-.9.07-1.86 0 0 .58-.18 1.92.71a6.7 6.7 0 013.5 0c1.34-.89 1.92-.71 1.92-.71.38.96.14 1.68.07 1.86.45.49.72 1.11.72 1.88 0 2.69-1.63 3.28-3.19 3.45.26.22.48.66.48 1.32v1.96c0 .19.13.41.49.34A7 7 0 008 1z"
      />
    ),
  },
];

export default function IconsPage() {
  return (
    <main className="relative mx-auto w-full max-w-[1240px] px-6 pt-6 pb-20 md:pt-10 md:pb-28">
      {/* Centered header — same recipe as Components / Showcase / FAQ */}
      <header className="mb-12 flex flex-col items-center px-2 text-center md:mb-16">
        <p className="eyebrow mb-3">Icon set</p>

        <h1
          className="display-clamp text-balance text-fg"
          style={{ fontSize: "clamp(2rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          Drawn on a
          <br />
          <span className="relative inline-block px-2.5 align-baseline">
            <Sparkle
              className="absolute -left-1 -top-1 h-4 w-4"
              delay="0s"
            />
            <Sparkle
              className="absolute -right-2 top-2 h-3 w-3"
              delay="0.5s"
            />
            <Sparkle
              className="absolute -bottom-1 left-3 h-2.5 w-2.5"
              delay="1s"
            />
            <Sparkle
              className="absolute -right-1 -bottom-2 h-3.5 w-3.5"
              delay="1.4s"
            />
            <span
              className="relative not-italic font-sans font-light"
              style={{ color: "var(--color-accent-primary)" }}
            >
              16px grid.
            </span>
          </span>
        </h1>

        <div aria-hidden className="mt-5 flex items-center gap-2.5">
          <span
            className="h-[2px] w-14 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent-primary) 75%, transparent))",
            }}
          />
          <span
            className="h-1.5 w-1.5 rotate-45"
            style={{
              backgroundColor: "var(--color-accent-primary)",
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--color-accent-primary) 70%, transparent)",
            }}
          />
          <span
            className="h-[2px] w-14 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--color-accent-primary) 75%, transparent), transparent)",
            }}
          />
        </div>

        <p className="mt-7 max-w-[560px] text-pretty text-base leading-relaxed text-fg/70 md:text-lg">
          One <MarkBrush>stroke weight</MarkBrush> (1.4px),{" "}
          <MarkCircle>rounded caps</MarkCircle> and joins, optical alignment to
          a <MarkSparkle>16-unit grid</MarkSparkle>. Designed to sit inside
          Aura UI without ever pulling focus.
        </p>

        {/* Stats moved beneath the header so the centered layout stays clean */}
        <div className="mt-6 flex items-center gap-3 font-mono text-xs text-fg/45">
          <span>{icons.length} icons</span>
          <span className="text-fg/15">·</span>
          <span>1.4 stroke</span>
          <span className="text-fg/15">·</span>
          <span>16 × 16</span>
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {icons.map(({ name, path }) => (
          <li
            key={name}
            className="aura-border group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-fg/[0.02] p-3 text-fg/80 transition-colors hover:text-[var(--color-accent-primary)]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              strokeLinejoin={join}
            >
              {path}
            </svg>
            <span className="font-mono text-[10px] text-fg/40 transition-colors group-hover:text-fg/70">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
