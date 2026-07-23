"use client";

import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

/** False during SSR/hydration, true after — without a setState-in-effect. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}
