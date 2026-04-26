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
import Card1 from "./Card1";
import Card2 from "./Card2";
import Card3 from "./Card3";
import Card4 from "./Card4";
import Card5 from "./Card5";
import Card6 from "./Card6";
import Card7 from "./Card7";
import Card8 from "./Card8";

export interface Variant {
  id: number;
  name: string;
  fileName: string;
  componentName: string;
  code: string;
  highlightedCode: string;
  highlightedSnippet: string;
}

const PREVIEWS: Record<number, ComponentType> = {
  1: Card1,
  2: Card2,
  3: Card3,
  4: Card4,
  5: Card5,
  6: Card6,
  7: Card7,
  8: Card8,
};

function Preview({ id }: { id: number }) {
  const Component = PREVIEWS[id];
  if (!Component) return null;
  
  return (
    <div className="flex h-full w-full items-center justify-center pointer-events-none">
      <div className="flex items-center justify-center origin-center scale-[0.45] sm:scale-[0.5] md:scale-[0.55] transition-transform duration-300">
         <Component />
      </div>
    </div>
  );
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
            <CategoryNav slug={slug} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {variants.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  role="button"
                  tabIndex={0}
                  className="aura-card group flex flex-col overflow-hidden p-4 outline-none"
                >
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex h-[340px] w-full items-center justify-center rounded-lg bg-black/5 dark:bg-black/40 p-4 overflow-hidden relative">
                      <Preview id={v.id} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between px-0.5">
                    <span className="text-[13px] font-medium text-fg">{v.name}</span>
                    <span className="text-[11px] font-medium text-fg-muted/50">
                      {v.fileName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Detail({ variant, onBack }: { variant: Variant; onBack: () => void }) {
  const installCmd = "npx aura-ui add " + variant.fileName.replace(".tsx", "");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to grid
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-[15px] font-medium text-fg">{variant.name}</h2>
          <div className="h-4 w-px bg-border-default" />
          <span className="text-[12px] text-fg-muted">{variant.fileName}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel label="Preview">
          <div className="grid h-[480px] place-items-center rounded-lg bg-black/5 dark:bg-black/40 p-6">
            <div className="flex items-center justify-center w-full h-full transform scale-[0.85] sm:scale-100">
               <PreviewDetail id={variant.id} />
            </div>
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

      <Panel label="Snippet">
        <CodeBlock value={variant.highlightedSnippet} isHtml />
      </Panel>

      <Panel label="Full code">
        <CodeBlock value={variant.highlightedCode} isHtml expandable />
      </Panel>
    </div>
  );
}

function PreviewDetail({ id }: { id: number }) {
  const Component = PREVIEWS[id];
  if (!Component) return null;
  return <Component />;
}

function Panel({
  label,
  children,
  icon,
}: {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <section className="aura-tile p-3 md:p-4">
      <header className="mb-3 flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
          {icon}
          {label}
        </p>
      </header>
      {children}
    </section>
  );
}

function CodeBlock({
  value,
  language,
  isHtml,
  expandable,
}: {
  value: string;
  language?: string;
  isHtml?: boolean;
  expandable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!expandable);

  const onCopy = () => {
    const textToCopy = isHtml
      ? value.replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      : value;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div
        data-lenis-prevent
        className={`relative w-full overflow-x-auto rounded-lg border border-border-default transition-all duration-500 ease-aura ${
          !expanded ? "max-h-[220px] overflow-hidden" : "max-h-[800px] overflow-y-auto"
        } bg-[#0d1117] dark:bg-[#0d1117]`}
      >
        {isHtml ? (
          <div
            data-lenis-prevent
            className="shiki-wrapper p-4 md:p-5 pr-12 md:pr-20 font-mono text-[12px] md:text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!overflow-visible [&_code]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <pre
            data-lenis-prevent
            className="p-4 md:p-5 pr-12 md:pr-20 font-mono text-[12px] md:text-[13px] leading-relaxed text-gray-300"
            data-lang={language}
          >
            <code data-lenis-prevent>{value}</code>
          </pre>
        )}

        {/* Gradient Mask + Expand Button */}
        {expandable && !expanded && (
          <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none flex h-24 items-end justify-center bg-gradient-to-t from-black/95 to-transparent pb-4">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="aura-glass pointer-events-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-medium text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-105"
            >
              Expand Code <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20 flex gap-2">
        {expandable && expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-[11px] font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronUp className="h-3.5 w-3.5" /> Hide code
          </button>
        )}
        <button
          onClick={onCopy}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
