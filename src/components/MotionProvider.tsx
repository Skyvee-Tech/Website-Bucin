"use client";

import { MotionConfig } from "motion/react";

// ---------------------------------------------------------------------------
// MotionProvider
// ---------------------------------------------------------------------------
// Pembungkus global untuk Framer Motion (`motion`).
// `reducedMotion="user"` membuat semua animasi otomatis dinonaktifkan ketika
// pengguna mengaktifkan "kurangi gerak" di HP-nya (aksesibilitas).
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
