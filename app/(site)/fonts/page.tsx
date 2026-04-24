import type { Metadata } from "next";
import {
  MarkBox,
  MarkBrush,
  MarkCircle,
  MarkSparkle,
  Sparkle,
} from "@/components/HandMarkers";

export const metadata: Metadata = {
  title: "Fonts — Aura UI",
  description: "The type system behind Aura UI — Arima for body, Instrument Serif for display, Geist Mono for code.",
};

const families = [
  {
    name: "Arima",
    role: "Body & UI",
    cssVar: "--font-arima",
    sample: "The quiet fundamentals carry the loudest interfaces.",
    weights: [400, 500, 600, 700],
    style: { fontFamily: "var(--font-sans)" } as const,
  },
  {
    name: "Instrument Serif",
    role: "Display · italic",
    cssVar: "--font-instrument-serif",
    sample: "Interfaces with aura.",
    weights: [400],
    style: { fontFamily: "var(--font-display)", fontStyle: "italic" } as const,
  },
  {
    name: "Geist Mono",
    role: "Code & numerics",
    cssVar: "--font-geist-mono",
    sample: "const aura = (system) => system.feels.alive;",
    weights: [400, 500, 600],
    style: { fontFamily: "var(--font-mono)" } as const,
  },
];

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 — • ⌘ ↗";

export default function FontsPage() {
  return (
    <main className="relative mx-auto w-full max-w-[1240px] px-6 pt-6 pb-20 md:pt-10 md:pb-28">
      {/* Centered header — same recipe as Components / Icons / Showcase */}
      <header className="mb-12 flex flex-col items-center px-2 text-center md:mb-16">
        <p className="eyebrow mb-3">Type system</p>

        <h1
          className="display-clamp text-balance text-fg"
          style={{ fontSize: "clamp(2rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          Three families,
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
              one voice.
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

        <p className="mt-7 max-w-[620px] text-pretty text-base leading-relaxed text-fg/70 md:text-lg">
          <MarkCircle>Arima</MarkCircle> holds the body and UI.{" "}
          <MarkBrush>Instrument Serif</MarkBrush> handles display moments —
          the place where the system{" "}
          <MarkSparkle>breathes</MarkSparkle>.{" "}
          <MarkBox>Geist Mono</MarkBox> carries code, shortcuts, and tabular
          numerics.
        </p>
      </header>

      <div className="space-y-6">
        {families.map((f) => (
          <article
            key={f.name}
            className="aura-card relative overflow-hidden p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--color-border-default)] pb-4">
              <div>
                <h2 className="text-[22px] font-semibold text-fg">{f.name}</h2>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-fg/40">
                  {f.role}
                </p>
              </div>
              <code className="rounded-md border border-[var(--color-border-default)] bg-black/40 px-2 py-1 font-mono text-[11px] text-[var(--color-accent-primary)]">
                var({f.cssVar})
              </code>
            </div>

            <p
              className="mt-8 text-balance leading-[1] text-fg"
              style={{
                ...f.style,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {f.sample}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <p
                className="text-pretty text-fg/55"
                style={{ ...f.style, fontSize: "15px", lineHeight: 1.6 }}
              >
                {characters}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {f.weights.map((w) => (
                  <li
                    key={w}
                    className="rounded-full border border-[var(--color-border-default)] bg-fg/[0.03] px-2.5 py-1 font-mono text-[11px] text-fg/60"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
