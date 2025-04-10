/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every `wait` milliseconds.
 *
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns A throttled version of the function. If the function is called during throttling, a cache return value of the previous called is returned
 *
 */

import { createRef } from "react";

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T => {
  let timeoutId = createRef<number | null>();
  let cache = createRef<ReturnType<T> | null>();

  return function (...args: Parameters<T>) {
    if (timeoutId.current === null) {
      timeoutId.current = window.setTimeout(() => {
        timeoutId.current = null;
      }, wait);
      cache = func(...args);
      return cache as ReturnType<T>;
    } else {
      return cache as ReturnType<T>;
    }
  } as T;
};
