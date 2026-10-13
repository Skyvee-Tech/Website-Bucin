"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// ---------------------------------------------------------------------------
// SectionReveal — animasi "muncul saat di-scroll".
// ---------------------------------------------------------------------------
// Dipakai berulang oleh banyak bagian (DRY). Hanya memakai opacity + transform.
// Ketika pengguna memilih "kurangi gerak", konten langsung tampil tanpa animasi.
export default function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
