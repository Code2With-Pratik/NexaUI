"use client";

import {
  BookOpen,
  Github,
  LayoutGrid,
  Search,
  Shapes,
  Type,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { useSpotlight } from "@/contexts/spotlight-context";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "/components", label: "Components", icon: LayoutGrid },
  { href: "/docs", label: "Docs", icon: BookOpen },
] as const;

const rightLinks = [
  { href: "/fonts", label: "Fonts", icon: Type },
  { href: "/icons", label: "Icons", icon: Shapes },
] as const;

function linkClass(active: boolean) {
  return cn(
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-zinc-950/10 text-ink dark:bg-white/15 dark:text-white"
      : "text-ink-muted hover:bg-black/[0.05] hover:text-ink dark:hover:bg-white/[0.08] dark:hover:text-white",
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { setOpen } = useSpotlight();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
      <nav
        className={cn(
          "glass-panel pointer-events-auto flex w-full max-w-6xl flex-wrap items-center gap-3 rounded-full px-4 py-2.5 pl-4 sm:gap-4",
          "border border-black/[0.06] dark:border-white/[0.08]",
        )}
        aria-label="Primary"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none lg:shrink-0">
          <Link href="/" className="shrink-0">
            <BrandLogo />
          </Link>
          <div className="hidden items-center gap-1 sm:flex lg:gap-2">
            {leftLinks.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={linkClass(active)}
                >
                  <l.icon className="h-4 w-4 opacity-90" aria-hidden />
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="order-last flex w-full min-w-0 flex-[1_1_320px] justify-center px-0 md:order-none md:max-w-xl md:flex-1 lg:max-w-2xl">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "relative flex h-10 w-full cursor-pointer items-center gap-2 rounded-full border border-zinc-200/90 bg-white/75 px-4 text-left text-sm text-ink shadow-sm outline-none backdrop-blur-md",
              "transition hover:border-indigo-400/50 hover:bg-white/95 dark:border-white/12 dark:bg-zinc-950/65 dark:text-zinc-50 dark:hover:border-indigo-400/35",
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-ink-muted">
              Search for features…
            </span>
            <kbd className="ml-auto hidden shrink-0 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-ink-muted dark:border-white/12 dark:bg-zinc-900 dark:text-zinc-400 sm:inline">
              ⌃K
            </kbd>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:shrink-0">
          <div className="hidden items-center gap-1 sm:flex lg:gap-2">
            {rightLinks.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={linkClass(active)}
                >
                  <l.icon className="h-4 w-4 opacity-90" aria-hidden />
                  {l.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-black/[0.05] hover:text-ink dark:hover:bg-white/[0.06] dark:hover:text-white sm:flex"
          >
            <Github className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
