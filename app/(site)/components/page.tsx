import type { Metadata } from "next";
import {
  MarkBrush,
  MarkCircle,
  MarkSparkle,
  Sparkle,
} from "@/components/HandMarkers";

export const metadata: Metadata = {
  title: "Components — Aura UI",
  description: "Every primitive that ships with Aura UI today.",
};

const groups = [
  {
    name: "Inputs",
    items: [
      { name: "Button", desc: "Primary / secondary / ghost variants", accent: "primary" },
      { name: "Input", desc: "Text, search, with leading/trailing icons", accent: "secondary" },
      { name: "Select", desc: "Native + custom dropdown", accent: "tertiary" },
      { name: "Toggle", desc: "Animated switch with tactile snap", accent: "primary" },
      { name: "Checkbox", desc: "Lime check on dark surface", accent: "primary" },
    ],
  },
  {
    name: "Display",
    items: [
      { name: "Card", desc: "Surface + subtle border + hover-lift", accent: "secondary" },
      { name: "Badge", desc: "Pill in any of three accents", accent: "tertiary" },
      { name: "Table", desc: "Dense, ruled, with header sort", accent: "primary" },
      { name: "Avatar Stack", desc: "Overlapping circles with overflow chip", accent: "secondary" },
      { name: "Progress", desc: "Animated linear bar with gradient", accent: "secondary" },
    ],
  },
  {
    name: "Overlays",
    items: [
      { name: "Spotlight", desc: "⌘K command palette with keyboard nav", accent: "primary" },
      { name: "Toast", desc: "Anchored stack with auto-dismiss", accent: "tertiary" },
      { name: "Tooltip", desc: "Floating label, glass surface", accent: "secondary" },
      { name: "Window", desc: "macOS chrome with traffic lights + genie", accent: "primary" },
    ],
  },
];

export default function ComponentsPage() {
  return (
    <main className="relative mx-auto w-full max-w-[1240px] px-6 pt-6 pb-20 md:pt-10 md:pb-28">
      {/* Centered header — same recipe as Showcase / Composable primitives /
          FAQ: eyebrow, two-line title with sparkles around the accent
          phrase, gradient + diamond accent line, then the lede paragraph
          with hand-drawn markers on key words. */}
      <header className="mb-16 flex flex-col items-center px-2 text-center md:mb-20">
        <p className="eyebrow mb-3">The library</p>

        <h1
          className="display-clamp text-balance text-fg"
          style={{ fontSize: "clamp(2rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          Components, ready to
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
              drop in.
            </span>
          </span>
        </h1>

        {/* Bottom accent line — gradient strokes flanking a glowing diamond */}
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
          A small, opinionated set of{" "}
          <MarkCircle>primitives</MarkCircle> — every one styled with the same{" "}
          <MarkBrush>tokens</MarkBrush>, animated on the same{" "}
          <MarkSparkle>easing curve</MarkSparkle>.
        </p>
      </header>

      <div className="space-y-16">
        {groups.map((g) => (
          <section key={g.name}>
            <div className="mb-6 flex items-end justify-between border-b border-[var(--color-border-default)] pb-3">
              <h2 className="font-display text-2xl italic text-fg">{g.name}</h2>
              <span className="font-mono text-xs text-fg/40">
                {g.items.length} {g.items.length === 1 ? "component" : "components"}
              </span>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  className="aura-card group relative overflow-hidden p-5"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, var(--color-accent-${item.accent}), transparent)`,
                      opacity: 0.4,
                    }}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-medium text-fg">{item.name}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-fg/55">
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                      style={{
                        backgroundColor: `var(--color-accent-${item.accent})`,
                        boxShadow: `0 0 14px var(--color-accent-${item.accent})`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
