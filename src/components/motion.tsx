"use client";

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/** Fade-in + slide-up on mount, staggered by `delay` (seconds). */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.21, 0.68, 0.32, 0.99] }}
    >
      {children}
    </motion.div>
  );
}

/** Animated number that counts up on mount. */
export function Counter({
  value,
  render,
}: {
  value: number;
  render: (v: number) => string;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(reduced ? value : 0);
  const text = useTransform(mv, v => render(v));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [mv, value]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}
