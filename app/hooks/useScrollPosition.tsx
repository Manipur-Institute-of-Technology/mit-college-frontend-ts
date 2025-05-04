import { useState, useEffect } from "react";

export const useScrollPosition = (
	offset: number = 0,
): {
	isAtTop: boolean;
	isAtBottom: boolean;
	isAtMiddle: boolean;
	curScrollTop: number;
} => {
	const [isAtTop, setIsAtTop] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const [isAtMiddle, setIsAtMiddle] = useState(false);
	const [curScrollTop, setCurScrollTop] = useState(0);

	useEffect(() => {
		// TODO: add a debounce here
		const scrollHandler = () => {
			const scrollTop = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollMidHeight = scrollTop + Math.floor(windowHeight / 2);

			setCurScrollTop(scrollTop);
			setIsAtTop(scrollTop <= offset + 0);
			setIsAtBottom(scrollTop + windowHeight >= documentHeight);
			setIsAtMiddle(
				scrollMidHeight >=
					Math.floor(documentHeight / 2 - offset / 2) &&
					scrollMidHeight <=
						Math.floor(documentHeight / 2 + offset / 2),
			);
			// setIsAtMiddle(scrollTop > 0 && scrollTop + windowHeight < documentHeight);
		};

		// const debounceSrollHandler = debounce(scrollHandler, 1000);
		// console.log(debounceSrollHandler);

		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	}, []);

	return { isAtTop, isAtBottom, isAtMiddle, curScrollTop } as const;
};
