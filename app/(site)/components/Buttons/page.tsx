import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Gallery, { type Variant } from "./Gallery";

export const metadata: Metadata = {
  title: "Buttons — Aura UI",
  description: "Eight animated button variants, ready to drop in.",
};

const NAMES = [
  "Aura Gradient",
  "Retro 3D",
  "Glass Morphic",
  "Gradient Border",
  "Overlay Reveal",
  "Bento Icon",
  "Claymorphism",
  "Liquid Ghost",
];

import { codeToHtml } from "shiki";

/* Only metadata + source text crosses the server-to-client boundary;
   the actual React components are imported inside Gallery (client) so
   framer-motion's proxy resolves in the client bundle. */
async function loadVariants(): Promise<Variant[]> {
  const dir = path.join(
    process.cwd(),
    "app",
    "(site)",
    "components",
    "Buttons",
  );

  const variants = await Promise.all(
    Array.from({ length: 8 }, async (_, i) => {
      const fileName = `Button${i + 1}.tsx`;
      const code = fs.readFileSync(path.join(dir, fileName), "utf8");
      
      // Generate syntax-highlighted HTML on the server
      const highlightedCode = await codeToHtml(code, {
        lang: "tsx",
        theme: "github-dark", // High-fidelity VS Code-like theme
      });

      const importPath = `@/app/(site)/components/Buttons/Button${i + 1}`;
      const snippet = `import Buttons${i + 1} from "${importPath}";\n\nexport default function Demo() {\n  return <Buttons${i + 1} />;\n}`;
      const highlightedSnippet = await codeToHtml(snippet, {
        lang: "tsx",
        theme: "github-dark",
      });

      return {
        id: i + 1,
        name: NAMES[i],
        fileName,
        componentName: `Buttons${i + 1}`,
        code,
        highlightedCode,
        highlightedSnippet,
      };
    })
  );

  return variants;
}

export default async function ButtonsCategoryPage() {
  const variants = await loadVariants();
  return <Gallery slug="Buttons" title="Buttons" variants={variants} />;
}
