import { useState } from "react";

type XFetcher<T> = {
	data: T | undefined;
	state: "loading" | "idle";
	error: string | undefined;
	load: (url: string, init?: RequestInit) => Promise<void>;
	xFetch: (cb: () => Promise<T>) => Promise<void>;
};

/**
 * Custom hook for handling asynchronous data fetching operations with state management.
 *
 * @template T - The type of data to be fetched (defaults to any)
 *
 * @returns {Object} An object containing:
 * - data: The fetched data of type T
 * - state: Current state of the fetch operation ('idle' | 'loading')
 * - error: Error message if any error occurred during fetching
 * - load: Function to fetch JSON data from a URL
 * - xFetch: Function to execute custom fetch callbacks
 *
 * @example
 * ```typescript
 * const { data, state, error, load, xFetch } = useXFetcher<UserData>();
 *
 * // Using load to fetch JSON
 * await load('https://api.example.com/users');
 *
 * // Using xFetch with custom callback
 * await xFetch(async () => {
 *   const response = await getPetLists();
 *   return await response.json()
 * });
 * ```
 */
export const useXFetcher = <T = any>(): XFetcher<T> => {
	const [data, setData] = useState<T>();
	const [error, setError] = useState<string>();
	const [state, setState] = useState<"idle" | "loading">("idle");

	/**
	 * Write your fetch function as callback
	 * error handling, loading state will be internally manage
	 * @param cb
	 */
	const xFetch = async (cb: () => Promise<T>): Promise<void> => {
		try {
			setState("loading");
			const d = cb();
			setData(await d);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("unknown error occured");
			}
		} finally {
			setState("idle");
		}
	};

	/**
	 * Use for fetching JSON response
	 * @param url
	 */
	const load = async (url: string, init?: ResponseInit): Promise<void> => {
		try {
			setState("loading");
			const res = await fetch(url, init);
			const d = (await res.json()) as T;
			setData(d);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("unknown error occured");
			}
		} finally {
			setState("idle");
		}
	};

	return { data, state, error, load, xFetch };
};
