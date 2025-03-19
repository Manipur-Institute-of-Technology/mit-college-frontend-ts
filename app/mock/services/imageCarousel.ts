import { FetchError } from "~/types/api/FetchError";
import type { ImageCarouselData } from "~/types/api/imageCarousel";

export const getImageCarouselContent = async (): Promise<
	ImageCarouselData[]
> => {
	try {
		// Add delay
		await new Promise((res) => setTimeout(res, 2000));
		const res = await fetch("/mock/imageCarousel.json");
		if (!res.ok) {
			throw createFetchError("Error fetching image carousel data", res);
		}

		const data = await res.json();
		return data satisfies ImageCarouselData[];
	} catch (error) {
		console.error("Image Carousel fetch error:", error);
		throw error;
	}
};

const createFetchError = (errMsg: string, response: Response): FetchError =>
	new FetchError(errMsg, response.status, response.statusText);
