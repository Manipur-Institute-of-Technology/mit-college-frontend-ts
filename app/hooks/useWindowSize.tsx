import { useEffect, useState } from "react";

type ScreenLabelType = "sm" | "md" | "lg" | "xl";

const getScreenLabel = (width: number): ScreenLabelType => {
	if (width < 640) return "sm";
	if (width >= 640 && width < 768) return "md";
	if (width >= 768 && width < 1024) return "lg";
	return "xl";
};

export const useWindowSize = (): {
	windowWidth: number;
	windowHeight: number;
	screenLabel: undefined | ScreenLabelType;
} => {
	const [windowWidth, setWindowWidth] = useState(0);
	const [windowHeight, setWindowHeight] = useState(0);
	const [screenLabel, setScreenLabel] = useState<undefined | ScreenLabelType>(
		undefined,
	);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
			setScreenLabel(getScreenLabel(window.innerWidth));
		});
		return () => window.removeEventListener("resize", () => {});
	}, []);

	return {
		windowWidth,
		windowHeight,
		screenLabel,
	};
};
