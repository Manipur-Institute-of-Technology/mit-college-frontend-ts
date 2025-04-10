import type {
	FacultyBasicProfile,
	FacultyDetailProfile,
	FacultyStudents,
} from "~/types/api/faculty.type";
import type {
	NavbarData,
	ImageCarouselData,
	NoticeData,
	FooterData,
	Weather,
} from "~/types/api/resData.type";
import type { IService, ServiceType } from "./IService";

export default class ProdService implements IService {
	getPublicNavContent(): Promise<NavbarData> {
		throw new Error("Method not implemented.");
	}
	getImageCarouselContent(): Promise<ImageCarouselData[]> {
		throw new Error("Method not implemented.");
	}
	getNoticeList(length?: number, offset?: number): Promise<NoticeData[]> {
		throw new Error("Method not implemented.");
	}
	getFooterData(): Promise<FooterData> {
		throw new Error("Method not implemented.");
	}
	getWeatherData(): Promise<Weather & { cacheDate: Date }> {
		throw new Error("Method not implemented.");
	}
	getFacultyBasicProfile(facultyId: string): Promise<FacultyBasicProfile> {
		throw new Error("Method not implemented.");
	}
	getFacultyDetailProfile(facultyId: string): Promise<FacultyDetailProfile> {
		throw new Error("Method not implemented.");
	}
	getFacultyStudents(facultyId: string): Promise<FacultyStudents> {
		throw new Error("Method not implemented.");
	}
	getServiceType(): ServiceType {
		return "prod";
	}
}
