/**
 *
 * @param array
 * @param uniqueExtractorCb
 * @returns
 *
 * @example
 * ```
 * const arr = [12, 3, 34, 12, 34]
 * unique(arr, d => d) // [12, 3, 34]
 * ```
 */
export const unique = <T = any>(
	array: T[],
	uniqueFieldExtractorCb: (d: T, i: number, array: T[]) => string,
): T[] => {
	const uniqArr: T[] = [];
	const mp = array.reduce((acc, d, i) => {
		acc.set(uniqueFieldExtractorCb(d, i, array), i);
		return acc;
	}, new Map<string, number>());

	array.forEach((d, i) => {
		const val = mp.get(uniqueFieldExtractorCb(d, i, array));
		if (val !== undefined) {
			uniqArr.push(array[val]);
		}
	});
	return uniqArr;
};

export const continuous = (
	array: number[],
	increment: number = 1,
): number[] => {
	array
		.sort((a, b) => a - b)
		.reduce((acc, d, i) => {
			if (i > 0) {
				for (let j = acc.at(-1)!; j < d; j += increment) acc.push(j);
			}
			return acc;
		}, Array<number>());
	return array;
};

export const groupBy = <T = any>(
	array: T[],
	groupByFieldExtractor: (d: T) => string,
): [string, T[]][] => {
	const mp = new Map<string, T[]>();
	array.forEach((elm) => {
		const field = groupByFieldExtractor(elm);
		if (mp.has(field)) {
			const val = mp.get(field)!;
			val.push(elm);
		} else {
			mp.set(field, [elm]);
		}
	});

	return Array.from(mp);
};
