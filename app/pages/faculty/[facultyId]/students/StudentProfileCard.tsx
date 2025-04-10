import { socialIconMap } from "~/constants/socialIconMap";
import { useModal } from "~/hooks/useModal";
import type { FacultyStudents } from "~/types/api/faculty.type";
import { Link } from "lucide-react";
import { ModalBody } from "./StudentModal";
import { Link as LinkTo } from "react-router";

export type Project = {
	fullName: string;
	projectName: string;
	teams: {
		avatarUrl: string;
		fullName: string;
	}[];
	paperLink: string | null;
	startYear: number;
	endYear: number | null;
	degree: "master" | "phd" | "bachelor" | "other";
	researchTopics: string[];
	abstract: string;
};
export const StudentProfileCard: React.FC<{
	profile: FacultyStudents[number];
	projects: Project[];
}> = ({ profile, projects }) => {
	const { setIsOpen, ModalComponent } = useModal();

	const Modal = (
		<ModalComponent>
			<ModalBody
				setIsOpen={setIsOpen}
				profile={profile}
				projects={projects}
			/>
		</ModalComponent>
	);

	return (
		<div className="w-[18rem] max-w-[100vw] rounded-lg bg-slate-100 text-slate-700 shadow-md p-2 relative hover:shadow-xl transition duration-700 hover:bg-slate-200">
			<img
				// src={profile.avatarUrl}
				src="/avatar.png"
				alt={`${profile.fullName}'s profile picture`}
				className="object-cover size-[8rem] mx-auto rounded-full border border-slate-300 bg-slate-500 my-1 mb-2"
			/>

			<div
				className="text-center text-md font-semibold text-slate-800 underline hover:cursor-pointer"
				onClick={() => setIsOpen(true)}>
				{profile.fullName}
			</div>
			<div className="text-center text-sm">
				Start Year:{" "}
				<span className="font-semibold text-sm text-slate-700">
					{profile.startYear}
				</span>
			</div>
			<div className="text-center text-sm">
				End Year:{" "}
				<span className="font-semibold text-sm text-slate-700">
					{profile.endYear ? profile.endYear : "Present"}
				</span>
			</div>
			<div className="text-[12px] text-center font-thin font-roboto underline">
				Project: {profile.projectName}
			</div>
			<div className="inline-flex gap-x-1 justify-center items-center w-full my-2">
				<SocialLinks
					socialLinks={profile.socialLinks}
					profile={profile}
				/>
			</div>
			{Modal}
		</div>
	);
};

const SocialLinks: React.FC<
	Pick<FacultyStudents[number], "socialLinks"> & {
		profile: FacultyStudents[number];
	}
> = ({ socialLinks, profile }) => {
	const Icons = Object.entries(socialIconMap);
	return (
		<>
			{socialLinks
				.sort((a, b) =>
					a.platform
						.toLowerCase()
						.localeCompare(b.platform.toLowerCase()),
				)
				.map((sl, indx) => {
					const IconElm = Icons.find((di) => di[0] === sl.platform);
					const Icon = IconElm ? IconElm[1] : Link;
					return (
						<LinkTo
							to={sl.href}
							target="_blank"
							key={indx}
							title={`${profile.fullName}'s ${sl.platform} profile`}>
							<Icon size={18} />
						</LinkTo>
					);
				})}
		</>
	);
};
