"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Terminal,
} from "lucide-react";
import { auraEase } from "@/lib/motion";
import CategoryNav from "../_shared/CategoryNav";
import Button1 from "./Button1";
import Button2 from "./Button2";
import Button3 from "./Button3";
import Button4 from "./Button4";
import Button5 from "./Button5";
import Button6 from "./Button6";
import Button7 from "./Button7";
import Button8 from "./Button8";

export interface Variant {
  id: number;
  name: string;
  fileName: string;
  componentName: string;
  code: string;
}

/* Client-side registry. Imported here so the previews are instantiated
   inside the client boundary; passing pre-rendered `<ButtonN />`
   elements from the server component through the RSC payload was
   crashing at runtime on motion.button under React 19. */
const PREVIEWS: Record<number, ComponentType> = {
  1: Button1,
  2: Button2,
  3: Button3,
  4: Button4,
  5: Button5,
  6: Button6,
  7: Button7,
  8: Button8,
};

function Preview({ id }: { id: number }) {
  const Component = PREVIEWS[id];
  return Component ? <Component /> : null;
}

export default function Gallery({
  slug,
  title,
  variants,
}: {
  slug: string;
  title: string;
  variants: Variant[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = variants.find((v) => v.id === selectedId) ?? null;

  return (
    <main className="relative mx-auto w-full max-w-[1240px] px-6 pt-6 pb-20 md:pt-10 md:pb-28">
      <Link
        href="/components"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All components
      </Link>

      <header className="mb-12 flex flex-col items-center text-center">
        <p className="eyebrow mb-3">Category</p>
        <h1
          className="display-clamp text-balance text-fg"
          style={{ fontSize: "clamp(2rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-[520px] text-pretty text-[15px] leading-relaxed text-fg/70">
          {variants.length} hand-built variants. Click any card to preview the
          live demo and copy the code.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={`detail-${selected.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: auraEase }}
          >
            <Detail variant={selected} onBack={() => setSelectedId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: auraEase }}
          >
            <Grid variants={variants} onSelect={setSelectedId} />
            <CategoryNav slug={slug} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ============================================================
   Grid — 8 preview cards
============================================================ */

function Grid({
  variants,
  onSelect,
}: {
  variants: Variant[];
  onSelect: (id: number) => void;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {variants.map((v) => (
        <li key={v.id}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(v.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(v.id);
              }
            }}
            className="aura-tile group relative flex h-[220px] w-full cursor-pointer flex-col overflow-hidden p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <div className="flex flex-1 items-center justify-center">
              {/* Preview surface — neutral slab so each variant's own
                  background pops without competing with the card chrome. */}
              <div className="grid w-full flex-1 place-items-center rounded-lg bg-black/40 p-4">
                <Preview id={v.id} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] font-medium text-fg">{v.name}</span>
              <span className="font-mono text-[10px] text-fg-muted">
                {v.fileName}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   Detail — preview + command + snippet + collapsible source
============================================================ */

function Detail({
  variant,
  onBack,
}: {
  variant: Variant;
  onBack: () => void;
}) {
  const [showFull, setShowFull] = useState(false);

  const importPath = `@/app/(site)/components/Buttons/${variant.fileName.replace(
    /\.tsx$/,
    "",
  )}`;
  const snippet = `import ${variant.componentName} from "${importPath}";\n\nexport default function Demo() {\n  return <${variant.componentName} />;\n}`;
  const installCmd = buildInstallCommand(variant.code);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="aura-border inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-fg/75 transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to grid
        </button>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-fg-muted">{variant.fileName}</span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-accent-primary)" }}
          />
          <span className="font-medium text-fg">{variant.name}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel label="Preview">
          <div className="grid h-[280px] place-items-center rounded-lg bg-black/40 p-6">
            <Preview id={variant.id} />
          </div>
        </Panel>

        <Panel label="Command" icon={<Terminal className="h-3.5 w-3.5" />}>
          <CodeBlock value={installCmd} language="bash" />
          <p className="mt-3 text-[11px] text-fg-muted">
            Install peer dependencies, then drop the component file into your
            project.
          </p>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel label="Snippet">
          <CodeBlock value={snippet} language="tsx" />
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          label="Full code"
          right={
            <button
              type="button"
              onClick={() => setShowFull((s) => !s)}
              className="aura-border inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-fg/80 transition-colors hover:text-fg"
            >
              {showFull ? (
                <>
                  Hide code <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show code <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          }
        >
          <AnimatePresence initial={false}>
            {showFull && (
              <motion.div
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: auraEase }}
                style={{ overflow: "hidden" }}
              >
                <CodeBlock value={variant.code} language="tsx" />
              </motion.div>
            )}
          </AnimatePresence>
          {!showFull && (
            <p className="text-[12px] text-fg-muted">
              Source for{" "}
              <span className="font-mono text-fg/80">{variant.fileName}</span>{" "}
              is hidden &mdash; click <em>Show code</em> to expand.
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}

/* ============================================================
   shared bits
============================================================ */

function Panel({
  label,
  icon,
  right,
  children,
}: {
  label: string;
  icon?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="aura-tile p-4">
      <header className="mb-3 flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
          {icon}
          {label}
        </p>
        {right}
      </header>
      {children}
    </section>
  );
}

function CodeBlock({ value, language }: { value: string; language: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — fail silently */
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-border-default bg-fg/5 px-2 py-1 text-[10px] font-medium text-fg/80 transition-colors hover:bg-fg/10 hover:text-fg"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>
      <pre
        className="max-h-[520px] overflow-auto rounded-lg border border-border-default bg-black/40 p-4 pr-20 font-mono text-[12px] leading-relaxed text-fg/85"
        data-lang={language}
      >
        <code>{value}</code>
      </pre>
    </div>
  );
}

/* Best-effort dependency sniff. Looks for `from 'pkg'` imports of the
   common runtime libs the variants use; React itself doesn't need to
   be installed by the consumer so we skip it. */
function buildInstallCommand(source: string): string {
  const deps = new Set<string>();
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(source)) !== null) {
    const pkg = m[1];
    if (pkg.startsWith(".") || pkg.startsWith("@/") || pkg === "react") continue;
    /* take the package root for scoped/sub-paths */
    const root = pkg.startsWith("@")
      ? pkg.split("/").slice(0, 2).join("/")
      : pkg.split("/")[0];
    deps.add(root);
  }
  if (deps.size === 0) return "# No additional dependencies";
  return `npm install ${[...deps].join(" ")}`;
}
