"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { auraEase } from "@/lib/motion";

type Item = {
  id: string;
  label: string;
  group: "NAVIGATE" | "THEME";
  icon: React.ReactNode;
  hint?: string;
  href?: string;
  external?: boolean;
  action?: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Spotlight({ open, onClose }: Props) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Theme toggle — go through next-themes so the change persists in
     localStorage and stays in sync with useTheme() everywhere. The
     previous implementation toggled the .dark class directly which
     bypassed next-themes and only flipped half the time (because
     next-themes also juggles a .light class).
     Uses View Transitions API for the circular reveal — same effect
     as the Navbar toggle, but originating from screen center since
     the trigger lives inside a centered modal. */
  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document)
    ) {
      setTheme(next);
      return;
    }

    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
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
  }, [resolvedTheme, setTheme]);

  const items: Item[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        group: "NAVIGATE",
        icon: <HomeIcon />,
        hint: "/",
        href: "/",
      },
      {
        id: "components",
        label: "Components",
        group: "NAVIGATE",
        icon: <GridIcon />,
        hint: "/COMPONENTS",
        href: "/components",
      },
      {
        id: "docs",
        label: "Docs",
        group: "NAVIGATE",
        icon: <BookIcon />,
        hint: "/DOCS",
        href: "/docs",
      },
      {
        id: "fonts",
        label: "Fonts",
        group: "NAVIGATE",
        icon: <TypeIcon />,
        hint: "/FONTS",
        href: "/fonts",
      },
      {
        id: "icons",
        label: "Icons",
        group: "NAVIGATE",
        icon: <IconsIcon />,
        hint: "/ICONS",
        href: "/icons",
      },
      {
        id: "github",
        label: "GitHub",
        group: "NAVIGATE",
        icon: <GitHubIcon />,
        hint: "↗",
        href: "https://github.com/Code2With-Pratik/Aura-UI",
        external: true,
      },
      {
        id: "theme",
        label: "Toggle Theme",
        group: "THEME",
        icon: <SunMoonIcon />,
        action: toggleTheme,
      },
    ],
    [toggleTheme]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<Item["group"], Item[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return map;
  }, [filtered]);

  // Reset selection when query changes
  useEffect(() => setActiveIdx(0), [query]);

  /* Auto-focus input on open.
     useLayoutEffect runs SYNCHRONOUSLY after DOM commit (before paint),
     so by the time it runs, the panel and input are already in the DOM
     and the input ref is populated. We also fire a couple of follow-up
     focus attempts on rAF + a short timeout to defeat any race where
     framer-motion's animation frame steals focus from us. */
  useLayoutEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIdx(0);

    const focusInput = () => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {
        /* setSelectionRange throws on some input types — safe to ignore */
      }
    };

    focusInput();                                          // synchronous, before paint
    const raf = requestAnimationFrame(focusInput);          // next paint
    const t1 = window.setTimeout(focusInput, 80);           // after framer-motion's first frame
    const t2 = window.setTimeout(focusInput, 360);          // after the entry tween settles

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  /* Lock body scroll when open — and compensate for the scrollbar that
     disappears, otherwise the page shifts ~15px on Windows/Linux. */
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  const activate = useCallback(
    (item: Item) => {
      if (item.href) {
        if (item.external) window.open(item.href, "_blank", "noopener");
        else router.push(item.href);
      }
      item.action?.();
      onClose();
    },
    [onClose, router]
  );

  // Keyboard handling
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const item = filtered[activeIdx];
        if (item) {
          e.preventDefault();
          activate(item);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, activate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]"
          aria-modal
          role="dialog"
          aria-label="Spotlight"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.96, y: -8, opacity: 0, filter: "blur(6px)" }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.97, y: -6, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.32, ease: auraEase }}
            onAnimationComplete={() => inputRef.current?.focus()}
            className="relative z-10 w-full max-w-[600px] overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)]/85 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[var(--color-border-default)] px-4 py-3.5">
              <input
                /* Plain object ref — STABLE across renders so React
                   doesn't run a ref-cleanup + ref-setup cycle on every
                   keystroke. The earlier inline arrow-function ref was
                   re-focusing the input on every render, which was
                   eating the user's keystrokes. Focus is now handled
                   exclusively by the useLayoutEffect above. */
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages and actions…"
                className="flex-1 bg-transparent text-[14px] text-fg placeholder:text-fg/40 focus:outline-none"
              />
              <kbd className="rounded-md border border-[var(--color-border-default)] bg-fg/[0.04] px-2 py-0.5 font-mono text-[11px] text-fg/60">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-fg/40">
                  No matches for &ldquo;{query}&rdquo;
                </div>
              ) : (
                Array.from(grouped.entries()).map(([group, list]) => (
                  <div key={group} className="mb-2">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg/40">
                      {group}
                    </p>
                    <ul>
                      {list.map((item) => {
                        const idx = filtered.indexOf(item);
                        const isActive = idx === activeIdx;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIdx(idx)}
                              onClick={() => activate(item)}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] transition-colors ${
                                isActive
                                  ? "bg-fg/[0.07] text-fg"
                                  : "text-fg/80 hover:bg-fg/[0.04]"
                              }`}
                            >
                              <span
                                className={`grid h-5 w-5 place-items-center ${
                                  isActive ? "text-[var(--color-accent-primary)]" : "text-fg/55"
                                }`}
                              >
                                {item.icon}
                              </span>
                              <span className="flex-1 font-medium uppercase tracking-wide">
                                {item.label}
                              </span>
                              {item.hint && (
                                <span className="font-mono text-[11px] text-fg/40">
                                  {item.hint}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--color-border-default)] px-4 py-2.5 text-[11px] text-fg/45">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-[var(--color-border-default)] bg-fg/[0.04] px-1 py-0.5 font-mono text-[10px]">
                  ⌃
                </kbd>
                <kbd className="rounded border border-[var(--color-border-default)] bg-fg/[0.04] px-1 py-0.5 font-mono text-[10px]">
                  K
                </kbd>
                <span className="ml-1">anywhere</span>
              </span>
              <span>Aura UI spotlight</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Global ⌘K / ⌃K listener — mounted with Spotlight (Navbar already controls open state).
   We use a separate listener so the shortcut works even when the search button isn't focused. */
export function useSpotlightShortcut(setOpen: (b: boolean) => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

/* ---------- icons ---------- */

const baseIconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function HomeIcon() {
  return (
    <svg {...baseIconProps}>
      <path d="M2.5 7.5L8 3l5.5 4.5V13a1 1 0 01-1 1H10v-3.5h-4V14H3.5a1 1 0 01-1-1V7.5z" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...baseIconProps}>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="0.8" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...baseIconProps}>
      <path d="M3 3h6a2 2 0 012 2v9H4.5A1.5 1.5 0 013 12.5V3z" />
      <path d="M3 12.5A1.5 1.5 0 014.5 11H11" />
    </svg>
  );
}
function TypeIcon() {
  return (
    <svg {...baseIconProps}>
      <path d="M3 4.5V3.5h10v1M8 3.5v10M6 13.5h4" />
    </svg>
  );
}
function IconsIcon() {
  return (
    <svg {...baseIconProps}>
      <circle cx="8" cy="3.5" r="1.4" />
      <circle cx="3.5" cy="11" r="1.4" />
      <circle cx="12.5" cy="11" r="1.4" />
      <path d="M8 5L3.7 9.7M8 5l4.3 4.7M4.5 11h7" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.49c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.24 1.89.88 2.35.67.07-.52.28-.88.51-1.08-1.78-.2-3.65-.89-3.65-3.96 0-.88.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49v2.21c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
function SunMoonIcon() {
  return (
    <svg {...baseIconProps}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M3.3 12.7l1.1-1.1M11.6 4.4l1.1-1.1" />
    </svg>
  );
}
