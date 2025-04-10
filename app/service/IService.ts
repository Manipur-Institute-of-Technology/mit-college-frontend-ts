import type {
	FacultyBasicProfile,
	FacultyDetailProfile,
	FacultyStudents,
} from "~/types/api/faculty.type";
import type {
	FooterData,
	ImageCarouselData,
	NavbarData,
	NoticeData,
	Weather,
} from "~/types/api/resData.type";

export type ServiceType = "dev" | "prod" | "mock";

/**
 * Interface representing a service for interacting with various application data.
 */
export interface IService {
	/**
	 * Retrieves the type of service being used (e.g., development, production, or mock).
	 * @returns The current service type.
	 */
	getServiceType(): ServiceType;

	/**
	 * Fetches the navigation content for the public-facing part of the application.
	 * @returns A promise that resolves to the navigation data.
	 */
	getPublicNavContent(): Promise<NavbarData>;

	/**
	 * Fetches the content for the image carousel.
	 * @returns A promise that resolves to an array of image carousel data.
	 */
	getImageCarouselContent(): Promise<ImageCarouselData[]>;

	/**
	 * Retrieves a list of notices.
	 * @param length - Optional. The number of notices to retrieve.
	 * @param offset - Optional. The starting point for retrieving notices.
	 * @returns A promise that resolves to an array of notice data.
	 */
	getNoticeList(length?: number, offset?: number): Promise<NoticeData[]>;

	/**
	 * Fetches the footer data for the application.
	 * @returns A promise that resolves to the footer data.
	 */
	getFooterData(): Promise<FooterData>;

	/**
	 * Retrieves weather data, including a cache date.
	 * @returns A promise that resolves to the weather data with a cache date.
	 */
	getWeatherData(): Promise<Weather & { cacheDate: Date }>;

	/**
	 * Fetches the basic profile information for a faculty member.
	 * @param facultyId - The unique identifier of the faculty member.
	 * @returns A promise that resolves to the faculty's basic profile data.
	 */
	getFacultyBasicProfile(facultyId: string): Promise<FacultyBasicProfile>;

	/**
	 * Fetches detailed profile information for a faculty member.
	 * @param facultyId - The unique identifier of the faculty member.
	 * @returns A promise that resolves to the faculty's detailed profile data.
	 */
	getFacultyDetailProfile(facultyId: string): Promise<FacultyDetailProfile>;

	/**
	 * Retrieves a list of students associated with a specific faculty member.
	 * @param facultyId - The unique identifier of the faculty member.
	 * @returns A promise that resolves to the list of students.
	 */
	getFacultyStudents(facultyId: string): Promise<FacultyStudents>;
}
