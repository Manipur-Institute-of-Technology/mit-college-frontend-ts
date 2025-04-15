export type Instituion = {
	organisation: string;
	city: string;
	state: string;
	country: string;
};
export type Address = {
	streetAddress: string | null;
	city: string;
	state: string;
	country: string;
	zipCode: string;
};
export type PhoneNumber = {
	countryCode: string;
	number: string;
};
export type FacultyBasicProfile = {
	initial: string;
	firstName: string;
	lastName: string;
	orchidId: string | null;
	avatarUrl: string | null;
	emails: string[];
	personalWebsite: string | null;
	address: Address;
	topicOfResearchInterests: string[];
	positions: {
		academic: {
			position: string;
			department: string | null;
			institution: Instituion;
		}[];
		nonAcademic: {
			position: string;
			department: string | null;
			employer: Instituion;
		}[];
	};
	socialLinks: { platform: string; url: string }[];
	phoneNumbers: (PhoneNumber & { type: string })[];
	updatedAt: string;
	userProfileUrl: string;
};

export type FacultyDetailProfile = {
	initial: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	emails: string[];
	personalWebsite: string | null;
	address: Address;
	bio: string;
	academicDegrees: {
		name: string;
		subject: string;
		institution: Instituion;
		startDate: string;
		endDate: string | null;
	}[];
	academicPositions: {
		position: string;
		department: string | null;
		institution: Instituion;
		startDate: string;
		endDate: string | null;
	}[];
	nonAcademicPositions: {
		employer: Instituion;
		position: string;
		department: string | null;
		startDate: string;
		endDate: string | null;
	}[];
	teachings: {
		teachingInterests: string;
		taughtCourses: {
			courseCode: string;
			courseName: string;
			courseLink: string | null;
			description: string;
		}[];
	};
	researchDetail: ResearchDetail;
	updatedAt: string;
	userProfileUrl: string;
};
export type Publication = {
	paperTitle: string;
	doi: string | null;
	link: string | null;
	type: string;
	publicationDate: string;
	authors: { name: string; profileLink: string }[];
};

export type PublicationDetail = {
	paperTitle: string;
	doi: string | null;
	downloadLink: string | null;
	paperLink: string | null;
	type: string;
	publicationDate: string;
	authors: { name: string; profileLink: string | null }[];
	abstract: string;
};

type ResearchDetail = {
	topicOfResearchInterests: string[];
	researchInterests: string;
	publications: Publication[];
	awards: { date: Date; title: string; by: string }[];
	conferences: { title: string; date: string }[];
};

export type FacultyStudents = {
	fullName: string;
	projectName: string;
	paperLink: string | null;
	avatarUrl: string;
	abstract: string;
	startYear: number;
	endYear: number | null;
	degree: "master" | "phd" | "bachelor" | "other";
	researchTopics: string[];
	socialLinks: { platform: string; href: string }[];
}[];
