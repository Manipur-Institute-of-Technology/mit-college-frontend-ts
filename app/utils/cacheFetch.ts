/**
 * Fetches data from URL with caching support in localStorage/sessionStorage
 * @param url - The URL to fetch data from
 * @param cacheKey - Unique key for storing in cache
 * @param cacheInterval - Cache validity in minutes (default: 30)
 * @param store - Storage type to use (default: localStorage)
 * @returns Promise with fetched/cached data or null on failure
 */
export const cacheFetch = async <T = any>(
	url: string,
	cacheKey: string,
	cacheInterval: number = 30,
	store: "localStorage" | "sessionStorage" | Storage = "localStorage",
): Promise<(T & { cacheDate: Date }) | null> => {
	if (cacheKey.length === 0) throw new Error("key cache cannot be empty");
	const storeref =
		store === "localStorage"
			? window.localStorage
			: store === "sessionStorage"
				? window.sessionStorage
				: store;

	const val = storeref.getItem(cacheKey);
	// Check val already exist
	if (val) {
		const parsed = JSON.parse(val);
		if (
			parsed &&
			typeof parsed === "object" &&
			"cacheDate" in parsed &&
			parsed.cacheDate
		) {
			const cacheVal = parsed as T & { cacheDate: Date };
			// Check Cache Validity
			if (
				cacheVal.cacheDate.getTime() + cacheInterval * 60 * 1000 >
				Date.now()
			) {
				return cacheVal;
			}
		} else console.warn("cache val cannot be parse, refetching", val);
	}

	// Fetch resource from server
	try {
		const res = await fetch(url);
		const data = (await res.json()) as T;
		const cacheVal = { ...data, cacheDate: new Date() };
		// Update Cache Store
		storeref.setItem(cacheKey, JSON.stringify(cacheVal));
		return cacheVal;
	} catch (err) {
		console.error(`Error fetching resource: ${url}`, err);
		if (val) return (JSON.parse(val) as T & { cacheDate: Date }) || null;
		return null;
	}
};
