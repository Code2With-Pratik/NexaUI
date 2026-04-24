"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Star,
  Pencil,
  List,
  Grid2X2,
  ChevronDown,
} from "lucide-react";
import {
  MarkBox,
  MarkBrush,
  MarkCircle,
  MarkSparkle,
  Sparkle,
} from "@/components/HandMarkers";
import { auraEase } from "@/lib/motion";

const families = [
  {
    name: "Arima",
    role: "Body & UI",
    cssVar: "--font-arima",
    sample: "The quiet fundamentals carry the loudest interfaces.",
    weights: [400, 500, 600, 700],
    fontFamily: "var(--font-sans)",
  },
  {
    name: "Instrument Serif",
    role: "Display · italic",
    cssVar: "--font-instrument-serif",
    sample: "Interfaces with aura.",
    weights: [400],
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
  },
  {
    name: "Geist Mono",
    role: "Code & numerics",
    cssVar: "--font-geist-mono",
    sample: "const aura = (system) => system.feels.alive;",
    weights: [400, 500, 600],
    fontFamily: "var(--font-mono)",
  },
  {
    name: "Switzer",
    role: "Neo-Grotesk",
    cssVar: "sans-serif",
    sample: "Switzer",
    weights: [300, 400, 500, 600, 700, 800, 900],
    fontFamily: "sans-serif",
  }
];

export default function FontsPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"Word" | "Paragraph">("Word");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [globalSize, setGlobalSize] = useState(190);
  const [customText, setCustomText] = useState("");
  const [likedFonts, setLikedFonts] = useState<string[]>([]);

  // Load liked fonts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aura-liked-fonts");
    if (saved) {
      try {
        setLikedFonts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse liked fonts", e);
      }
    }
  }, []);

  // Save liked fonts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("aura-liked-fonts", JSON.stringify(likedFonts));
  }, [likedFonts]);

  const toggleLike = (name: string) => {
    setLikedFonts((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const filteredFamilies = families.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mode-specific automatic sizing
  const handleModeChange = (newMode: "Word" | "Paragraph") => {
    setMode(newMode);
    if (newMode === "Paragraph") {
      setGlobalSize(24);
    } else {
      setGlobalSize(190);
    }
  };

  return (
    <main className="relative mx-auto w-full max-w-[1280px] px-6 pt-10 pb-28 text-fg">
      {/* Centered header */}
      <header className="mb-20 flex flex-col items-center px-2 text-center">
        <p className="eyebrow mb-3">Type system</p>

        <h1
          className="display-clamp text-balance text-fg"
          style={{ fontSize: "clamp(2rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          Font
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
              Family
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

      {/* 1. TOP TOOLBAR */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-6">
        {/* Left: Search */}
        <div className="group relative flex min-w-[240px] items-center border-b border-border-default pb-2">
          <Search className="mr-3 h-4 w-4 text-fg/40 transition-colors group-focus-within:text-[var(--color-accent-primary)]" />
          <input
            type="text"
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[15px] outline-none placeholder:text-fg/30"
          />
          <div className="absolute bottom-[-1px] left-0 h-[1.5px] w-0 bg-[var(--color-accent-primary)] transition-all duration-300 group-focus-within:w-full" />
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center gap-8">
          {(["Word", "Paragraph"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`relative pb-2 text-[14px] font-medium transition-colors ${
                mode === m ? "text-fg" : "text-fg/40 hover:text-fg/70"
              }`}
            >
              {m}
              {mode === m && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--color-accent-primary)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right: Size + Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-fg/50">{globalSize}px</span>
            <ChevronDown className="h-3.5 w-3.5 text-fg/40" />
            <input
              type="range"
              min="12"
              max="240"
              value={globalSize}
              onChange={(e) => setGlobalSize(parseInt(e.target.value))}
              className="h-1 w-24 accent-[var(--color-accent-primary)] cursor-pointer appearance-none rounded-full bg-fg/10"
            />
          </div>
          <div className="flex items-center gap-2 border-l border-border-default pl-6">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${viewMode === "list" ? "text-fg" : "text-fg/30 hover:text-fg/60"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-fg" : "text-fg/30 hover:text-fg/60"}`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. CUSTOM TEXT INPUT (Bottom-line style) */}
      <section className="mb-12">
        <div className="group relative flex items-center border-b border-border-default pb-4 pt-2">
          <Pencil className="mr-4 h-4 w-4 text-fg/30 transition-colors group-focus-within:text-[var(--color-accent-primary)]" />
          <input
            type="text"
            placeholder="Your Text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-transparent text-[18px] outline-none placeholder:text-fg/20"
          />
          {/* Animated underline - now accent color */}
          <div className="absolute bottom-[-1px] left-1/2 h-[1px] w-0 -translate-x-1/2 bg-[var(--color-accent-primary)] transition-all duration-300 group-focus-within:w-full" />
        </div>
      </section>

      {/* 3. FONT CARDS */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        <AnimatePresence mode="popLayout">
          {filteredFamilies.map((f) => (
            <FontCard
              key={f.name}
              family={f}
              globalSize={globalSize}
              viewMode={viewMode}
              isLiked={likedFonts.includes(f.name)}
              onToggleLike={() => toggleLike(f.name)}
              onExpand={() => setViewMode("list")}
              customText={customText || (mode === "Word" ? f.name : f.sample)}
            />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

function FontCard({
  family,
  globalSize,
  customText,
  viewMode,
  isLiked,
  onToggleLike,
  onExpand,
}: {
  family: any;
  globalSize: number;
  customText: string;
  viewMode: "grid" | "list";
  isLiked: boolean;
  onToggleLike: () => void;
  onExpand: () => void;
}) {
  const [localSize, setLocalSize] = useState(globalSize);
  const [localWeight, setLocalWeight] = useState(family.weights[1] || 400);
  const [isWeightHovered, setIsWeightHovered] = useState(false);
  const [isSizeHovered, setIsSizeHovered] = useState(false);

  // Sync with global size when it changes
  useEffect(() => {
    setLocalSize(globalSize);
  }, [globalSize]);

  return (
    <motion.article
      layout
      onClick={viewMode === "grid" ? onExpand : undefined}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group aura-tile relative flex h-[420px] flex-col overflow-hidden p-8 transition-all ${
        viewMode === "grid" ? "cursor-pointer hover:border-[var(--color-accent-primary)]/50" : "hover:border-[var(--color-accent-primary)]"
      } hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] bg-surface`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-medium text-fg/40 transition-colors group-hover:text-fg">
            {family.name}
          </h2>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
            className={`transition-all hover:scale-110 active:scale-95 cursor-pointer ${isLiked ? "text-[var(--color-accent-primary)]" : "text-fg/20 hover:text-fg/40"}`}
          >
            <Star className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          {viewMode === "grid" && (
            <span className="ml-2 text-[10px] text-fg/20 opacity-0 transition-opacity group-hover:opacity-100 uppercase tracking-widest">
              Click to expand
            </span>
          )}
        </div>

        {/* Technical Controls (Only in List Mode + Hover) */}
        {viewMode === "list" && (
          <div className="flex items-center gap-12 opacity-0 transition-opacity group-hover:opacity-100">
            <div 
              className="flex items-center gap-4"
              onMouseEnter={() => setIsWeightHovered(true)}
              onMouseLeave={() => setIsWeightHovered(false)}
            >
              <span className="min-w-[60px] text-[13px] font-mono text-fg/40 uppercase tracking-tighter">
                {isWeightHovered ? localWeight : "Weight"}
              </span>
              <input
                type="range"
                min="100"
                max="900"
                step="100"
                value={localWeight}
                onChange={(e) => setLocalWeight(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="h-1 w-20 accent-[var(--color-accent-primary)] cursor-pointer appearance-none rounded-full bg-fg/10"
              />
            </div>
            <div 
              className="flex items-center gap-4"
              onMouseEnter={() => setIsSizeHovered(true)}
              onMouseLeave={() => setIsSizeHovered(false)}
            >
              <span className="min-w-[60px] text-[13px] font-mono text-fg/40 uppercase tracking-tighter">
                {isSizeHovered ? `${localSize}px` : "Size"}
              </span>
              <input
                type="range"
                min="12"
                max="240"
                value={localSize}
                onChange={(e) => setLocalSize(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="h-1 w-20 accent-[var(--color-accent-primary)] cursor-pointer appearance-none rounded-full bg-fg/10"
              />
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="aura-border flex items-center gap-2 rounded-lg bg-fg/5 px-3 py-1.5 text-sm font-medium text-fg/60 transition-all hover:bg-fg/10 hover:text-fg cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        )}
      </div>

      {/* MAIN PREVIEW TEXT */}
      <div className="my-auto flex flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={customText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: auraEase }}
            contentEditable
            suppressContentEditableWarning
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent outline-none"
            style={{
              fontFamily: family.fontFamily,
              fontStyle: family.fontStyle || "normal",
              fontSize: `${viewMode === "grid" ? Math.min(localSize, 80) : localSize}px`,
              fontWeight: localWeight,
              lineHeight: 1.2,
              color: "var(--color-accent-primary)",
              textAlign: "center",
            }}
          >
            {customText}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between transition-opacity ${viewMode === "list" ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}>
        <p className="text-sm text-fg/80">Designed By Aura UI</p>
        <p className="text-sm text-fg/80 italic">Click on text to edit</p>
      </div>
    </motion.article>
  );
}
