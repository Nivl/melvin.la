import { useCallback, useEffect, useRef } from "react";

/**
 * Manages a collection of animation timeouts with automatic cleanup on unmount.
 * Returns `schedule` to queue a callback and `cancelAll` to clear all pending timeouts.
 */
export const useAnimationTimeouts = () => {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = useCallback((cb: () => void, delay: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      cb();
    }, delay);
    timeoutsRef.current.push(id);
  }, []);

  const cancelAll = useCallback(() => {
    const toCancel = [...timeoutsRef.current];
    timeoutsRef.current = [];
    for (const id of toCancel) {
      clearTimeout(id);
    }
  }, []);

  useEffect(
    () => () => {
      cancelAll();
    },
    [cancelAll],
  );

  return { cancelAll, schedule };
};
