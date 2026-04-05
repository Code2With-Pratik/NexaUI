"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/atoms/brand-logo";

const columns = [
  {
    title: "Components",
    links: [
      { label: "Browse UI", href: "/components" },
      { label: "Bento labs", href: "/components" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Get started", href: "/docs" },
      { label: "Guides", href: "/docs" },
    ],
  },
  {
    title: "Icons",
    links: [
      { label: "Lucide set", href: "/icons" },
      { label: "SVG recipes", href: "/icons" },
    ],
  },
  {
    title: "Fonts",
    links: [
      { label: "Arima", href: "/fonts" },
      { label: "Tokens", href: "/docs" },
      { label: "Changelog", href: "/docs" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/80 bg-[#FFFDF7]/90 dark:border-white/10 dark:bg-zinc-950/90">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="max-w-md space-y-4">
            <BrandLogo />
            <p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
              © {new Date().getFullYear()} NexaUI. All rights reserved.
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              A glass-forward UI surface for product teams who care about
              typography, motion, and the last five percent of polish.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label + link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-200/70 pt-12 dark:border-white/10">
          <p className="select-none text-center font-arima text-[clamp(2.75rem,14vw,7.5rem)] font-bold uppercase leading-[0.95] tracking-tight bg-gradient-to-b from-zinc-950 via-zinc-700 to-white bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-700">
            Nexa UI
          </p>
        </div>
      </div>
    </footer>
  );
}
