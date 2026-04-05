"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function BrandLogo({ className }: Props) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <motion.span
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-[#FFFDF7] shadow-inner dark:bg-zinc-100 dark:text-zinc-900"
        whileHover={{ scale: 1.04, rotate: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        aria-hidden
      >
        N
      </motion.span>
      <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        NexaUI
      </span>
    </div>
  );
}
