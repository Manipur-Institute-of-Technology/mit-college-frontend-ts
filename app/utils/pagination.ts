import { unique } from "./array";

export const getPagination = (
	firstPage: number,
	lastPage: number,
	curPage: number,
): (number | string)[] => {
	let pages: number[] = [];
	if (curPage <= firstPage + 1 || curPage >= lastPage - 1)
		pages = [firstPage, firstPage + 1, lastPage - 1, lastPage];
	else pages = [firstPage, curPage - 1, curPage, curPage + 1, lastPage];

	pages = unique(pages, (d) => String(d)).map((d) => +d);
	return pages
		.sort((a, b) => a - b)
		.reduce(
			(acc, d) => {
				if (acc.length > 0) {
					if (!isNaN(+acc.at(-1)!)) {
						if (acc.at(-1) === d - 1) acc.push(d);
						else {
							acc.push("...");
							acc.push(d);
						}
					} else acc.push(d);
				} else acc.push(d);
				return acc;
			},
			[] as (string | number)[],
		);
};
