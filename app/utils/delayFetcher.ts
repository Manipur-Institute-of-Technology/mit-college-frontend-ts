/**
 * Fetch data using the provided data accessor callback function with added delay.
 * Use this for simulate network delay while fetching data in test environment
 * @param dataAccessorCb
 * @param delay
 * @returns
 */
export default async function delayFetcher<T = any>(
	dataAccessorCb: () => Promise<T>,
	delay: number,
) {
	const dataAccessorPrm: Promise<T> = new Promise((res, rej) => {
		res(dataAccessorCb());
	});
	const delayer = new Promise((res, rej) => {
		return window.setTimeout(() => res, delay);
	});

	try {
		const res = await Promise.allSettled([dataAccessorPrm, delayer]);
		if (res[0].status === "fulfilled") {
			return res[0].value;
		} else
			throw new Error("Data Accessor Promise rejected: " + res[0].reason);
	} catch (err) {
		throw err;
	}
}
