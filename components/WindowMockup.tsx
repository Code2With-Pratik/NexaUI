"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { auraEase, scaleIn } from "@/lib/motion";

type SidebarItem = { label: ViewKey; group: "INPUTS" | "DISPLAY" };
type ViewKey = "Button" | "Input" | "Select" | "Card" | "Table" | "Badge";

const sidebarItems: SidebarItem[] = [
  { label: "Button", group: "INPUTS" },
  { label: "Input", group: "INPUTS" },
  { label: "Select", group: "INPUTS" },
  { label: "Card", group: "DISPLAY" },
  { label: "Table", group: "DISPLAY" },
  { label: "Badge", group: "DISPLAY" },
];

/* How long to wait between auto-tab swaps (ms) */
const AUTO_CYCLE_INTERVAL = 3500;
/* When the user clicks a tab manually, pause auto-cycling for this long
   so we don't fight whatever they're trying to look at. */
const USER_PAUSE_DURATION = 10000;

export default function WindowMockup() {
  const [active, setActive] = useState<ViewKey>("Button");
  const [minimized, setMinimized] = useState(false);
  const reduce = useReducedMotion();

  /* Timestamp until which auto-cycling is paused. Manual clicks bump it. */
  const pausedUntilRef = useRef(0);

  /* Auto-rotate through sidebar tabs. Skipped when:
     - the user just clicked a tab (pausedUntilRef in the future)
     - the window is minimised (no point cycling hidden content)
     - the user has prefers-reduced-motion set */
  useEffect(() => {
    if (reduce || minimized) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      setActive((current) => {
        const idx = sidebarItems.findIndex((i) => i.label === current);
        const next = sidebarItems[(idx + 1) % sidebarItems.length];
        return next.label;
      });
    }, AUTO_CYCLE_INTERVAL);
    return () => window.clearInterval(id);
  }, [reduce, minimized]);

  const selectTab = (label: ViewKey) => {
    setActive(label);
    pausedUntilRef.current = Date.now() + USER_PAUSE_DURATION;
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative"
    >
      {/* Ambient under-glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -bottom-10 -top-6 -z-10 rounded-[40px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, color-mix(in srgb, var(--color-accent-primary) 10%, transparent), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        animate={
          minimized
            ? { scale: 0.85, y: 30, opacity: 0.7, filter: "blur(2px)" }
            : { scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.65, ease: auraEase }}
        style={{ transformOrigin: "50% 100%" }}
        className="aura-stack"
      >
        <div className="aura-window overflow-hidden">
          {/* Title bar */}
          <div className="relative flex items-center border-b border-border-default bg-[var(--color-surface-elevated)]/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <TrafficLight color="#ff5f57" label="Close" onClick={() => setMinimized(false)} />
              <TrafficLight
                color="#febc2e"
                label="Minimize"
                onClick={() => !reduce && setMinimized((m) => !m)}
              />
              <TrafficLight color="#28c840" label="Zoom" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <span className="font-mono text-[12px] text-fg-muted">
                Aura UI &mdash; Component Explorer
              </span>
            </div>
            <div className="ml-auto" />
          </div>

          <div className="flex min-h-[480px]">
            {/* Sidebar — hidden on mobile */}
            <aside className="hidden w-[210px] shrink-0 border-r border-border-default bg-[var(--color-surface-elevated)]/40 p-3 md:block">
              {(["INPUTS", "DISPLAY"] as const).map((group) => (
                <div key={group} className="mb-5">
                  <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-muted">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {sidebarItems
                      .filter((i) => i.group === group)
                      .map((item) => {
                        const isActive = active === item.label;
                        return (
                          <li key={item.label}>
                            <button
                              onClick={() => selectTab(item.label)}
                              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                                isActive
                                  ? "border border-border-hover bg-fg/5 text-accent-primary"
                                  : "border border-transparent text-fg/65 hover:bg-fg/4 hover:text-fg"
                              }`}
                            >
                              <SidebarIcon name={item.label} active={isActive} />
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
            </aside>

            {/* Content — switches per active sidebar item */}
            <div className="flex-1 p-5 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.32, ease: auraEase }}
                >
                  {active === "Button" && <ButtonView />}
                  {active === "Input" && <InputView />}
                  {active === "Select" && <SelectView />}
                  {active === "Card" && <CardView />}
                  {active === "Table" && <TableView />}
                  {active === "Badge" && <BadgeView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="aura-border mt-6 inline-flex items-center gap-2 rounded-full bg-fg/3 px-4 py-2 text-xs text-fg/70 transition-colors hover:text-fg"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          Restore window
        </button>
      )}
    </motion.div>
  );
}

/* -------------------- chrome -------------------- */

function TrafficLight({
  color,
  label,
  onClick,
}: {
  color: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative h-3 w-3 rounded-full transition-transform duration-200 hover:scale-110"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 0 0.5px rgba(0,0,0,0.4) inset, 0 0 8px -2px ${color}`,
      }}
    />
  );
}

function SidebarIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--color-accent-primary)" : "var(--color-fg-muted)";
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 14 14",
    fill: "none",
    stroke,
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "Button":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="10" height="4" rx="2" />
        </svg>
      );
    case "Input":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="10" height="6" rx="1.2" />
          <path d="M4.5 7h2" />
        </svg>
      );
    case "Select":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="10" height="6" rx="1.2" />
          <path d="M9 6.5l1 1 1-1" />
        </svg>
      );
    case "Card":
      return (
        <svg {...common}>
          <rect x="2" y="3" width="10" height="8" rx="1.4" />
          <path d="M4.5 6h5" />
        </svg>
      );
    case "Table":
      return (
        <svg {...common}>
          <rect x="2" y="3" width="10" height="8" rx="1" />
          <path d="M2 6.5h10M2 9h10M5.5 3v8" />
        </svg>
      );
    case "Badge":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* -------------------- preview shell -------------------- */

function PreviewCard({
  label,
  span = 1,
  height = 120,
  children,
}: {
  label: string;
  span?: 1 | 2 | 3;
  height?: number;
  children: React.ReactNode;
}) {
  const spanClass =
    span === 3 ? "sm:col-span-2 lg:col-span-3" : span === 2 ? "sm:col-span-2" : "";
  return (
    <div
      className={`aura-tile group flex flex-col p-3 ${spanClass}`}
      style={{ minHeight: height }}
    >
      <p className="mb-2 text-center font-mono text-[10px] lowercase tracking-[0.18em] text-fg-muted">
        {label}
      </p>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

function ViewGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

/* ============================================================
   VIEW: Button
============================================================ */

function ButtonView() {
  return (
    <ViewGrid>
      <PreviewCard label="primary">
        <button
          className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-fg transition-all duration-300 hover:scale-[1.03]"
          style={{
            background:
              "color-mix(in srgb, var(--color-accent-primary) 28%, transparent)",
            backdropFilter: "blur(14px) saturate(180%)",
            WebkitBackdropFilter: "blur(14px) saturate(180%)",
            border:
              "1px solid color-mix(in srgb, var(--color-accent-primary) 55%, transparent)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px -10px color-mix(in srgb, var(--color-accent-primary) 55%, transparent)",
          }}
        >
          Click me
        </button>
      </PreviewCard>

      <PreviewCard label="outline">
        <button className="rounded-full border border-border-hover bg-transparent px-4 py-1.5 text-[13px] font-semibold text-fg transition-colors hover:bg-fg/5">
          Outline
        </button>
      </PreviewCard>

      <PreviewCard label="ghost">
        <button className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-fg/80 transition-colors hover:bg-fg/5 hover:text-fg">
          Ghost
        </button>
      </PreviewCard>

      <PreviewCard label="destructive">
        <button
          className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
          style={{ backgroundColor: "#ff5774", boxShadow: "0 0 14px -4px #ff5774" }}
        >
          Delete
        </button>
      </PreviewCard>

      <PreviewCard label="loading">
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-full border border-border-hover bg-fg/5 px-4 py-1.5 text-[13px] font-semibold text-fg/70"
        >
          <Spinner /> Loading…
        </button>
      </PreviewCard>

      <PreviewCard label="icon">
        <div className="flex items-center gap-2">
          <button
            aria-label="Like"
            className="grid h-9 w-9 place-items-center rounded-full border border-border-default bg-fg/4 text-fg transition-colors hover:bg-fg/8"
          >
            <HeartIcon />
          </button>
          <button
            aria-label="Add"
            className="grid h-9 w-9 place-items-center rounded-full bg-accent-primary text-black transition-transform hover:scale-105"
          >
            <PlusIcon />
          </button>
        </div>
      </PreviewCard>
    </ViewGrid>
  );
}

/* ============================================================
   VIEW: Input
============================================================ */

function InputView() {
  const [pwVisible, setPwVisible] = useState(false);
  return (
    <ViewGrid>
      <PreviewCard label="text">
        <div className="aura-input flex w-full items-center px-3 py-2">
          <input
            placeholder="Your name"
            className="w-full bg-transparent text-[13px] text-fg placeholder:text-fg/40 focus:outline-none"
          />
        </div>
      </PreviewCard>

      <PreviewCard label="search">
        <div className="aura-input flex w-full items-center gap-2 px-2.5 py-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-fg/45">
            <circle cx="5" cy="5" r="3.25" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7.5 7.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search…"
            className="w-full bg-transparent text-[13px] text-fg placeholder:text-fg/40 focus:outline-none"
          />
        </div>
      </PreviewCard>

      <PreviewCard label="password">
        <div className="aura-input flex w-full items-center gap-2 px-2.5 py-2">
          <input
            type={pwVisible ? "text" : "password"}
            defaultValue="aurapass"
            className="w-full bg-transparent text-[13px] text-fg focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setPwVisible((v) => !v)}
            aria-label={pwVisible ? "Hide" : "Show"}
            className="text-fg/45 hover:text-fg"
          >
            {pwVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </PreviewCard>

      <PreviewCard label="otp" height={140}>
        <OtpInput />
      </PreviewCard>

      <PreviewCard label="textarea" height={140}>
        <div className="aura-input w-full px-2.5 py-2">
          <textarea
            rows={3}
            defaultValue="Quiet defaults, loud results."
            className="w-full resize-none bg-transparent text-[13px] leading-snug text-fg placeholder:text-fg/40 focus:outline-none"
          />
        </div>
      </PreviewCard>

      <PreviewCard label="with label">
        <div className="w-full">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
            Email
          </label>
          <div className="aura-input flex w-full items-center px-3 py-2">
            <input
              type="email"
              placeholder="you@aura.ui"
              className="w-full bg-transparent text-[13px] text-fg placeholder:text-fg/40 focus:outline-none"
            />
          </div>
        </div>
      </PreviewCard>
    </ViewGrid>
  );
}

function OtpInput() {
  const [vals, setVals] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(i: number, v: string) {
    const ch = v.slice(-1).replace(/[^0-9]/g, "");
    setVals((prev) => {
      const next = [...prev];
      next[i] = ch;
      return next;
    });
    if (ch && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !vals[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`aura-input h-10 w-8 text-center text-[15px] font-semibold text-fg focus:outline-none ${
            v ? "text-accent-primary" : ""
          }`}
        />
      ))}
    </div>
  );
}

/* ============================================================
   VIEW: Select
============================================================ */

function SelectView() {
  return (
    <ViewGrid>
      <PreviewCard label="single">
        <SelectDropdown
          options={["Sonnet 4.6", "Opus 4.7", "Haiku 4.5"]}
          defaultValue="Opus 4.7"
        />
      </PreviewCard>

      <PreviewCard label="with icon">
        <SelectDropdown
          leading="◴"
          options={["UTC", "PST (-8)", "IST (+5:30)"]}
          defaultValue="IST (+5:30)"
        />
      </PreviewCard>

      <PreviewCard label="multi">
        <div className="flex w-full flex-wrap items-center gap-1.5">
          {["React", "TS", "Tailwind"].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-border-hover bg-fg/5 px-2 py-0.5 text-[11px] text-fg"
            >
              {tag}
              <span className="cursor-pointer text-fg/40 hover:text-fg">×</span>
            </span>
          ))}
          <span className="text-[11px] text-fg/40">+ add</span>
        </div>
      </PreviewCard>

      <PreviewCard label="combobox">
        <div className="aura-input flex w-full items-center gap-2 px-2.5 py-2">
          <span className="text-fg/40">⌕</span>
          <input
            defaultValue="Aura"
            className="w-full bg-transparent text-[13px] text-fg focus:outline-none"
          />
          <span className="font-mono text-[10px] text-fg/40">↓</span>
        </div>
      </PreviewCard>

      <PreviewCard label="native">
        <select
          defaultValue="medium"
          className="aura-input w-full appearance-none px-3 py-2 text-[13px] text-fg focus:outline-none"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </PreviewCard>

      <PreviewCard label="segmented">
        <Segmented options={["Day", "Week", "Month"]} />
      </PreviewCard>
    </ViewGrid>
  );
}

function SelectDropdown({
  options,
  defaultValue,
  leading,
}: {
  options: string[];
  defaultValue: string;
  leading?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="aura-input flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] text-fg"
      >
        <span className="flex items-center gap-2">
          {leading && <span className="text-fg/45">{leading}</span>}
          {value}
        </span>
        <span className="text-fg/40">▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: auraEase }}
            className="aura-glass absolute left-0 right-0 top-[calc(100%+4px)] z-10 overflow-hidden rounded-lg p-1"
          >
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(o);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12px] transition-colors hover:bg-fg/8 ${
                    value === o ? "text-accent-primary" : "text-fg/80"
                  }`}
                >
                  {o}
                  {value === o && <span>✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Segmented({ options }: { options: string[] }) {
  const [active, setActive] = useState(options[1]);
  return (
    <div className="aura-input flex w-full p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setActive(o)}
          className={`flex-1 rounded-md px-2 py-1 text-[12px] font-medium transition-colors ${
            active === o
              ? "bg-fg/10 text-fg"
              : "text-fg/55 hover:text-fg"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   VIEW: Card
============================================================ */

function CardView() {
  return (
    <ViewGrid>
      <PreviewCard label="basic" height={150}>
        <div className="aura-card w-full p-3">
          <h4 className="text-[13px] font-semibold text-fg">Aura Card</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">
            Soft surface, themed border, lives anywhere.
          </p>
        </div>
      </PreviewCard>

      <PreviewCard label="stats" height={150}>
        <div className="aura-card w-full p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-fg-muted">MRR</p>
          <p className="mt-1 text-[22px] font-bold leading-none text-fg">$48.2k</p>
          <p className="mt-1 text-[11px] text-accent-primary">+12.4% this week</p>
        </div>
      </PreviewCard>

      <PreviewCard label="profile" height={150}>
        <div className="aura-card flex w-full items-center gap-3 p-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-primary text-[14px] font-bold text-black">
            P
          </span>
          <div>
            <p className="text-[13px] font-semibold text-fg">Pratik G.</p>
            <p className="text-[11px] text-fg-muted">Founder · Aura UI</p>
          </div>
        </div>
      </PreviewCard>

      <PreviewCard label="action" height={150}>
        <div className="aura-card flex w-full flex-col gap-2 p-3">
          <p className="text-[12px] leading-snug text-fg">Pro plan unlocks unlimited themes.</p>
          <button className="self-start rounded-full bg-accent-primary px-3 py-1 text-[11px] font-semibold text-black hover:scale-[1.03]">
            Upgrade
          </button>
        </div>
      </PreviewCard>

      <PreviewCard label="image" height={150}>
        <div className="aura-card w-full overflow-hidden p-2">
          <div
            className="h-14 w-full rounded-md"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-tertiary))",
            }}
          />
          <p className="mt-2 text-[11px] font-semibold text-fg">Aurora 01</p>
          <p className="text-[10px] text-fg-muted">Generative · 2026</p>
        </div>
      </PreviewCard>

      <PreviewCard label="hover" height={150}>
        <div className="aura-card group relative w-full p-3 transition-all hover:-translate-y-1">
          <p className="text-[12px] font-semibold text-fg">Hover me</p>
          <p className="mt-1 text-[11px] text-fg-muted">Lifts on the same easing curve.</p>
          <span className="absolute right-3 top-3 text-fg/40 transition-colors group-hover:text-accent-primary">
            ↗
          </span>
        </div>
      </PreviewCard>
    </ViewGrid>
  );
}

/* ============================================================
   VIEW: Table
============================================================ */

type Row = { name: string; role: string; status: "Active" | "Invited" | "Paused"; mrr: string; initial: string; accent: string };

const TABLE_ROWS: Row[] = [
  { name: "Pratik G.", role: "Owner", status: "Active", mrr: "$2,400", initial: "P", accent: "var(--color-accent-primary)" },
  { name: "Asha M.", role: "Designer", status: "Active", mrr: "$1,820", initial: "A", accent: "var(--color-accent-secondary)" },
  { name: "Ravi K.", role: "Engineer", status: "Invited", mrr: "$0", initial: "R", accent: "var(--color-accent-tertiary)" },
  { name: "Lin S.", role: "Marketing", status: "Paused", mrr: "$640", initial: "L", accent: "#ffb547" },
  { name: "Mateo D.", role: "Support", status: "Active", mrr: "$980", initial: "M", accent: "#57ffb8" },
];

function TableView() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Active" | "Invited" | "Paused">("All");
  const rows = filter === "All" ? TABLE_ROWS : TABLE_ROWS.filter((r) => r.status === filter);

  return (
    <div className="aura-tile p-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="text-[13px] font-semibold text-fg">Team members</h4>
          <p className="text-[11px] text-fg-muted">{rows.length} of {TABLE_ROWS.length}</p>
        </div>
        <Segmented options={["All", "Active", "Invited", "Paused"]} />
      </header>

      <div className="overflow-hidden rounded-lg border border-border-default">
        <table className="w-full text-left text-[12px]">
          <thead className="border-b border-border-default bg-fg/[0.04] text-fg-muted">
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th className="text-right">MRR</Th>
              <Th className="w-10"> </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.name}
                className={`border-t border-border-default transition-colors hover:bg-fg/[0.03] ${
                  i % 2 === 1 ? "bg-fg/[0.015]" : ""
                }`}
              >
                <Td>
                  <div className="flex items-center gap-2">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-black"
                      style={{ backgroundColor: r.accent }}
                    >
                      {r.initial}
                    </span>
                    <span className="font-medium text-fg">{r.name}</span>
                  </div>
                </Td>
                <Td className="text-fg/70">{r.role}</Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td className="text-right font-mono text-fg">{r.mrr}</Td>
                <Td className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === r.name ? null : r.name)}
                    aria-label="Row actions"
                    className="grid h-6 w-6 place-items-center rounded-md text-fg-muted transition-colors hover:bg-fg/8 hover:text-fg"
                  >
                    ⋯
                  </button>
                  <AnimatePresence>
                    {openMenu === r.name && (
                      <motion.ul
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.16 }}
                        className="aura-glass absolute right-2 top-7 z-10 w-32 overflow-hidden rounded-md p-1 text-left"
                      >
                        {["Edit", "Duplicate", "Remove"].map((action) => (
                          <li key={action}>
                            <button
                              onClick={() => setOpenMenu(null)}
                              className={`block w-full rounded-sm px-2 py-1 text-[11px] transition-colors hover:bg-fg/10 ${
                                action === "Remove" ? "text-[#ff7a8a]" : "text-fg/85"
                              }`}
                            >
                              {action}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-3 flex items-center justify-between text-[11px] text-fg-muted">
        <span>Page 1 of 3</span>
        <div className="flex items-center gap-1.5">
          <button className="rounded-md border border-border-default px-2 py-1 text-fg-muted hover:text-fg">‹</button>
          <button className="rounded-md border border-border-hover bg-fg/5 px-2 py-1 text-fg">1</button>
          <button className="rounded-md border border-border-default px-2 py-1 text-fg-muted hover:text-fg">2</button>
          <button className="rounded-md border border-border-default px-2 py-1 text-fg-muted hover:text-fg">3</button>
          <button className="rounded-md border border-border-default px-2 py-1 text-fg-muted hover:text-fg">›</button>
        </div>
      </footer>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const map = {
    Active: { color: "var(--color-accent-primary)", label: "Active" },
    Invited: { color: "var(--color-accent-secondary)", label: "Invited" },
    Paused: { color: "#ffb547", label: "Paused" },
  } as const;
  const { color, label } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
        color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/* ============================================================
   VIEW: Badge
============================================================ */

function BadgeView() {
  return (
    <ViewGrid>
      <PreviewCard label="solid">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge color="var(--color-accent-primary)">New</Badge>
          <Badge color="var(--color-accent-secondary)">Beta</Badge>
          <Badge color="var(--color-accent-tertiary)">Hot</Badge>
        </div>
      </PreviewCard>

      <PreviewCard label="outline">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <OutlineBadge color="var(--color-accent-primary)">Lime</OutlineBadge>
          <OutlineBadge color="var(--color-accent-secondary)">Sky</OutlineBadge>
          <OutlineBadge color="var(--color-accent-tertiary)">Pink</OutlineBadge>
        </div>
      </PreviewCard>

      <PreviewCard label="dot">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <DotBadge color="var(--color-accent-primary)">Online</DotBadge>
          <DotBadge color="#ff5774">Offline</DotBadge>
          <DotBadge color="#ffb547">Idle</DotBadge>
        </div>
      </PreviewCard>

      <PreviewCard label="count">
        <div className="flex items-center gap-3">
          <BellWithCount count={3} />
          <BellWithCount count={12} />
          <BellWithCount count={99} />
        </div>
      </PreviewCard>

      <PreviewCard label="status">
        <div className="flex flex-col items-center gap-2">
          <StatusBadge status="Active" />
          <StatusBadge status="Invited" />
          <StatusBadge status="Paused" />
        </div>
      </PreviewCard>

      <PreviewCard label="icon">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <IconBadge color="var(--color-accent-primary)" icon="✓">Verified</IconBadge>
          <IconBadge color="var(--color-accent-secondary)" icon="↑">Pro</IconBadge>
          <IconBadge color="#ff5774" icon="!">Issue</IconBadge>
        </div>
      </PreviewCard>
    </ViewGrid>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-black"
      style={{ backgroundColor: color, boxShadow: `0 0 14px -4px ${color}` }}
    >
      {children}
    </span>
  );
}

function OutlineBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border bg-transparent px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ borderColor: color, color }}
    >
      {children}
    </span>
  );
}

function DotBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-fg/4 px-2 py-0.5 text-[11px] font-semibold text-fg/85">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {children}
    </span>
  );
}

function IconBadge({ color, icon, children }: { color: string; icon: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-black"
      style={{ backgroundColor: color }}
    >
      <span>{icon}</span>
      {children}
    </span>
  );
}

function BellWithCount({ count }: { count: number }) {
  return (
    <div className="relative">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-border-default bg-fg/4 text-fg/80">
        <BellIcon />
      </span>
      <span
        className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold text-black"
        style={{ backgroundColor: "var(--color-accent-tertiary)" }}
      >
        {count > 99 ? "99+" : count}
      </span>
    </div>
  );
}

/* -------------------- mini icons -------------------- */

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.25" />
      <path
        d="M10.5 6a4.5 4.5 0 00-4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 6 6"
          to="360 6 6"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12s-4.5-2.5-4.5-6A2.5 2.5 0 017 4a2.5 2.5 0 014.5 2c0 3.5-4.5 6-4.5 6z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6.5 2v9M2 6.5h9" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M1.5 7s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4S1.5 7 1.5 7z" />
      <circle cx="7" cy="7" r="1.6" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 2l10 10M3 5.5C2 6.5 1.5 7 1.5 7s2 4 5.5 4c1 0 1.9-.3 2.7-.7M11 8.6c.9-.7 1.5-1.6 1.5-1.6s-2-4-5.5-4c-.4 0-.8.05-1.2.14" />
      <path d="M5.5 5.5a2 2 0 002.9 2.7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 10V6.5a3.5 3.5 0 117 0V10l1 1.5h-9L3.5 10zM5.5 11.5a1.5 1.5 0 003 0" />
    </svg>
  );
}
