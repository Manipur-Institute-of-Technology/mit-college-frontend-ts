import type { ImageCarouselData } from "~/types/api/imageCarousel";

export const getImageCarouselContent = async (): Promise<
	ImageCarouselData[]
> => {
	try {
		const res = await fetch("/mock.imageCarousel.json");
		return (await res.json()) satisfies ImageCarouselData[];
	} catch (err) {
		console.log("navbar fetch error", err);
		throw err;
	}
};
