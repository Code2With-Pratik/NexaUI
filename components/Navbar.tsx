"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import LogoMark from "./LogoMark";
import Spotlight from "./Spotlight";

const leftLinks = [
  { label: "Components", href: "/components", icon: "grid" as const },
  { label: "Docs", href: "/docs", icon: "book" as const },
];

const rightLinks = [
  { label: "Fonts", href: "/fonts", icon: "type" as const },
  { label: "Icons", href: "/icons", icon: "icons" as const },
  {
    label: "GitHub",
    href: "https://github.com/Code2With-Pratik/Aura-UI",
    icon: "github" as const,
    external: true,
    tooltip: "⭐ Star this Repository",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Global ⌘K / ⌃K — opens Spotlight from anywhere
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /**
   * Magic-UI-style circular reveal. Anchors a clip-path circle to the
   * click point and uses View Transitions to wipe in the new theme.
   */
  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = resolvedTheme === "dark" ? "light" : "dark";

      // Browsers without View Transitions: instant swap.
      if (typeof document === "undefined" || !("startViewTransition" in document)) {
        setTheme(next);
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const r = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const root = document.documentElement;
      root.style.setProperty("--x", `${x}px`);
      root.style.setProperty("--y", `${y}px`);
      root.style.setProperty("--r", `${r}px`);

      document.startViewTransition(() => {
        setTheme(next);
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-border-default)] bg-[var(--color-bg)]/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-[68px] w-full max-w-[1480px] items-center gap-4 px-5 md:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg">
              <img
                src="/Logo.gif"
                alt="Aura UI Logo"
                className="size-full object-cover mix-blend-multiply dark:invert dark:mix-blend-screen"
              />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-fg">
              Aura UI
            </span>
          </Link>

          <span aria-hidden className="mx-1 hidden h-5 w-px bg-[var(--color-border-default)] md:block" />

          {/* Left links */}
          <ul className="hidden items-center md:flex">
            {leftLinks.map((l) => (
              <NavLink key={l.href} {...l} active={pathname === l.href} />
            ))}
          </ul>

          {/* Search trigger — clicking opens Spotlight */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open spotlight search"
            className="aura-input group ml-auto flex h-10 max-w-[480px] flex-1 items-center gap-2.5 rounded-full px-4 text-left text-[15px] text-fg-muted transition-colors hover:text-fg"
          >
            <SearchIcon />
            <span className="flex-1">Search…</span>
            <kbd className="hidden items-center gap-1 rounded-md border border-border-default bg-fg/5 px-1.5 py-0.5 font-mono text-[11px] text-accent-primary sm:inline-flex">
              <span aria-hidden>⌘</span>K
            </kbd>
          </button>

          {/* Right links */}
          <ul className="ml-auto hidden items-center md:flex">
            {rightLinks.map((l) => (
              <NavLink key={l.href} {...l} active={pathname === l.href} />
            ))}
          </ul>

          {/* Theme toggle — circular reveal via View Transitions */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-fg/3 text-fg-muted transition-colors hover:border-border-hover hover:text-fg"
          >
            {mounted ? (resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />) : <MoonIcon />}
          </button>
        </nav>
      </header>

      <Spotlight open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ---------- pieces ---------- */

function NavLink({
  label,
  href,
  icon,
  external,
  active,
  tooltip,
}: {
  label: string;
  href: string;
  icon: "grid" | "book" | "type" | "icons" | "github";
  external?: boolean;
  active?: boolean;
  tooltip?: string;
}) {
  const className = `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[15px] transition-colors ${
    active
      ? "text-fg"
      : "text-fg-muted hover:bg-fg/5 hover:text-fg"
  }`;
  const inner = (
    <>
      <NavIcon name={icon} />
      {label}
      {tooltip && (
        <span
          role="tooltip"
          className="aura-glass pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium text-fg opacity-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-200 group-hover/navlink:opacity-100 group-hover/navlink:translate-x-[-50%] group-hover/navlink:translate-y-1"
        >
          {tooltip}
        </span>
      )}
    </>
  );

  /* Wrapper li uses `relative` + a named hover group so the absolutely
     positioned tooltip can anchor to the link and only show on hover of
     this specific link (not any other navlink). */
  const wrapperClass = "group/navlink relative";

  if (external) {
    return (
      <li className={wrapperClass}>
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li className={wrapperClass}>
      <Link href={href} className={className}>
        {inner}
      </Link>
    </li>
  );
}

function NavIcon({ name }: { name: "grid" | "book" | "type" | "icons" | "github" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="4" height="4" rx="0.7" />
          <rect x="8" y="2" width="4" height="4" rx="0.7" />
          <rect x="2" y="8" width="4" height="4" rx="0.7" />
          <rect x="8" y="8" width="4" height="4" rx="0.7" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M3 2.5h6a2 2 0 012 2V12H4.5A1.5 1.5 0 013 10.5v-8z" />
          <path d="M3 10.5A1.5 1.5 0 014.5 9H11" />
        </svg>
      );
    case "type":
      return (
        <svg {...common}>
          <path d="M3 4V3h8v1M7 3v9M5.5 12h3" />
        </svg>
      );
    case "icons":
      return (
        <svg {...common}>
          <circle cx="7" cy="3.5" r="1.2" />
          <circle cx="3" cy="9.5" r="1.2" />
          <circle cx="11" cy="9.5" r="1.2" />
          <path d="M7 4.7L3.6 8.4M7 4.7l3.4 3.7M4 9.5h6" />
        </svg>
      );
    case "github":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.49c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.24 1.89.88 2.35.67.07-.52.28-.88.51-1.08-1.78-.2-3.65-.89-3.65-3.96 0-.88.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49v2.21c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      );
  }
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="6" cy="6" r="3.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M12 9.2A4.8 4.8 0 015.8 3a5.5 5.5 0 106.2 6.2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="2.5" />
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3 3l1.1 1.1M10.9 10.9L12 12M3 12l1.1-1.1M10.9 4.1L12 3" />
    </svg>
  );
}
