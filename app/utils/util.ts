/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every `wait` milliseconds.
 *
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns A throttled version of the function. If the function is called during throttling, a cache return value of the previous called is returned
 *
 */
// TODO: Remove react dependencies
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

// TODO: need check
export const debounce = (func: Function, wait: number) => {
	let timeoutId: number | null = null;
	return function (...args: any[]) {
		if (timeoutId) {
			window.clearTimeout(timeoutId); // cancel currently running callback
			timeoutId = window.setTimeout(() => func(...args), wait); // start new timeout callback
		} else {
			timeoutId = window.setTimeout(() => {
				func(...args);
				timeoutId = null;
			}, wait);
		}
	} satisfies Function;
};

/**
 *
 * @param timeMs millisencods to sleep
 * @returns a void promise
 * @example
 * ```js
 * 	const mockCompute = async (): number => {
 * 		const a = 9999
 * 		await sleep(4000) // sleep for 4sec
 * 		return a
 * }
 * ```
 */
export const sleep = (timeMs: number): Promise<void> => {
	return new Promise((res, _) => window.setTimeout(() => res(), timeMs));
};
