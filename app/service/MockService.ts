import type {
	FooterData,
	ImageCarouselData,
	NavbarData,
	NoticeData,
	Weather,
} from "~/types/api/resData.type";
import type { IService, ServiceType } from "./IService";
import { createFetchError, FetchError } from "~/types/api/FetchError";
import type {
	FacultyBasicProfile,
	FacultyDetailProfile,
	FacultyStudents,
	PublicationDetail,
} from "~/types/api/faculty.type";
import { data } from "react-router";

/**
 * MockService is a mock implementation of the IService interface.
 * It provides methods to fetch mock data for various components of the application,
 * such as navigation bar content, image carousel, notices, footer, weather, and faculty-related data.
 *
 * This service is primarily used for testing and development purposes
 * by simulating API responses with static JSON files.
 */
export default class MockService implements IService {
	getServiceType(): ServiceType {
		return "mock";
	}

	async getPublicNavContent(): Promise<NavbarData> {
		try {
			const res = await fetch("/mock/pubNavbar.json");
			return (await res.json()) satisfies NavbarData;
		} catch (err) {
			console.log("navbar fetch error", err);
			throw err;
		}
	}

	async getImageCarouselContent(): Promise<ImageCarouselData[]> {
		try {
			// Add delay
			await new Promise((res) => setTimeout(res, 2000));
			const res = await fetch("/mock/imageCarousel.json");
			if (!res.ok) {
				throw createFetchError(
					"Error fetching image carousel data",
					res,
				);
			}

			const data = await res.json();
			return data satisfies ImageCarouselData[];
		} catch (error) {
			console.error("Image Carousel fetch error:", error);
			throw error;
		}
	}

	async getNoticeList(
		length: number = 10,
		offset: number = 0,
	): Promise<NoticeData[]> {
		try {
			// Add delay
			// await new Promise((res) => setTimeout(res, 5000));
			const res = await fetch("/mock/notice.json");
			if (!res.ok) {
				throw createFetchError("Error fetching notice  data", res);
			}
			const data = res.json();
			return data satisfies Promise<NoticeData[]>;
		} catch (error) {
			console.error("Notice list fetch error:", error);
			throw error;
		}
	}

	async getFooterData(): Promise<FooterData> {
		try {
			await new Promise((res) => setTimeout(res, 5000));
			const res = await fetch("/mock/footer.json");
			if (!res.ok) {
				throw createFetchError("Error fetching footer data", res);
			}
			const data = res.json();
			return data satisfies Promise<FooterData>;
		} catch (error) {
			console.error("Footer data fetch error:", error);
			throw error;
		}
	}

	async getWeatherData(): Promise<Weather & { cacheDate: Date }> {
		try {
			const res = await fetch("/mock/weather.json");
			let data = {
				...((await res.json()) as Weather),
				cacheDate: new Date(),
			};
			return data satisfies Weather & { cacheDate: Date };
		} catch (err) {
			console.error("Error fetching weather data");
			throw err;
		}
	}

	async getPublicationDetail(pubId: string): Promise<PublicationDetail> {
		try {
			await new Promise((res) => setTimeout(res, 3000));
			const res = await fetch("/mock/publication/pubId.json");
			if (!res.ok)
				throw createFetchError("Error fetching publication data", res);
			return res.json() satisfies Promise<PublicationDetail>;
		} catch (err) {
			console.error("Error fetching publication detail");
			throw err;
		}
	}

	async getFacultyBasicProfile(
		facultyId: string,
	): Promise<FacultyBasicProfile> {
		try {
			const res = await fetch("/mock/faculty/basicProfile.json");
			if (!res.ok)
				throw createFetchError("Error fetching profile data", res);
			return res.json() satisfies Promise<FacultyBasicProfile>;
		} catch (err) {
			console.error("Error fetching faculty profile");
			throw err;
		}
	}

	async getFacultyDetailProfile(
		facultyId: string,
	): Promise<FacultyDetailProfile> {
		try {
			const res = await fetch("/mock/faculty/profileDetail.json");
			return res.json() satisfies Promise<FacultyDetailProfile>;
		} catch (err) {
			console.error("Error fetching faculty profile");
			throw err;
		}
	}

	async getFacultyStudents(facultyId: string): Promise<FacultyStudents> {
		try {
			const res = await fetch("/mock/faculty/student.json");
			return res.json() satisfies Promise<FacultyStudents>;
		} catch (err) {
			console.error("Error fetching faculty profile");
			throw err;
		}
	}
}
