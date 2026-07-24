"use client";

import { motion, animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/** Fade-in + slide-up on mount, staggered by `delay` (seconds).
 *  Under prefers-reduced-motion the same element snaps straight to its final
 *  state (keeping motion.div so Framer clears the SSR-baked initial styles). */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.45, delay, ease: [0.21, 0.68, 0.32, 0.99] }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated number that counts up on mount.
 * The real value is rendered into the prerendered HTML (never 0), then the
 * count-up runs client-side by writing to the DOM node directly.
 */
export function Counter({
  value,
  render,
}: {
  value: number;
  render: (v: number) => string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => {
        el.textContent = renderRef.current(v);
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {render(value)}
    </span>
  );
}
