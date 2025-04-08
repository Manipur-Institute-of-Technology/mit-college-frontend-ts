import type {
	FacultyBasicProfile,
	FacultyDetailProfile,
	FacultyStudents,
} from "~/types/api/faculty.type";
import { createFetchError } from "~/types/api/FetchError";
import type { FooterData, NoticeData, Weather } from "~/types/api/resData.type";

export const getNoticeList = async (
	length: number = 10,
	offset: number = 0,
): Promise<NoticeData[]> => {
	try {
		// Add delay
		await new Promise((res) => setTimeout(res, 5000));
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
};

export const getFooterData = async (): Promise<FooterData> => {
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
};

export const getWeatherData = async (): Promise<
	Weather & { cacheDate: Date }
> => {
	try {
		const res = await fetch("/mock/weather.json");
		let data = { ...((await res.json()) as Weather), cacheDate: new Date() };
		return data satisfies Weather & { cacheDate: Date };
	} catch (err) {
		console.error("Error fetching weather data");
		throw err;
	}
};

export const getFacultyBasicProfile = async (
	facultyId: string,
): Promise<FacultyBasicProfile> => {
	try {
		const res = await fetch("/mock/faculty/basicProfile.json");
		if (!res.ok) throw createFetchError("Error fetching notice data", res);
		return res.json() satisfies Promise<FacultyBasicProfile>;
	} catch (err) {
		console.error("Error fetching faculty profile");
		throw err;
	}
};

export const getFacultyDetailProfile = async (
	facultyId: string,
): Promise<FacultyDetailProfile> => {
	try {
		const res = await fetch("/mock/faculty/profileDetail.json");
		return res.json() satisfies Promise<FacultyDetailProfile>;
	} catch (err) {
		console.error("Error fetching faculty profile");
		throw err;
	}
};

export const getFacultyStudents = async (
	facultyId: string,
): Promise<FacultyStudents> => {
	try {
		const res = await fetch("/mock/faculty/student.json");
		return res.json() satisfies Promise<FacultyStudents>;
	} catch (err) {
		console.error("Error fetching faculty profile");
		throw err;
	}
};
