import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Gallery, { type Variant } from "./Gallery";
import { codeToHtml } from "shiki";

export const metadata: Metadata = {
  title: "Cards — Aura UI",
  description: "Eight high-fidelity card variants with modern hover effects.",
};

const NAMES = [
  "Glassmorphism Project",
  "Dynamic System Status",
  "3D Flip Setup",
  "Rotating Border Glow",
  "Productive Slide Up",
  "Media Expansion",
  "Windows OS Slide",
  "Radial Color Reveal",
];

async function loadVariants(): Promise<Variant[]> {
  const dir = path.join(
    process.cwd(),
    "app",
    "(site)",
    "components",
    "Cards",
  );

  const variants = await Promise.all(
    Array.from({ length: 8 }, async (_, i) => {
      const fileName = `Card${i + 1}.tsx`;
      const code = fs.readFileSync(path.join(dir, fileName), "utf8");
      
      const [highlightedCode, highlightedSnippet] = await Promise.all([
        codeToHtml(code, {
          lang: "tsx",
          theme: "github-dark",
        }),
        codeToHtml(code.slice(0, 400) + "...", {
          lang: "tsx",
          theme: "github-dark",
        }),
      ]);

      return {
        id: i + 1,
        name: NAMES[i],
        fileName,
        componentName: `Card${i + 1}`,
        code,
        highlightedCode,
        highlightedSnippet,
      };
    })
  );

  return variants;
}

export default async function CardsCategoryPage() {
  const variants = await loadVariants();
  return <Gallery slug="Cards" title="Cards" variants={variants} />;
}
