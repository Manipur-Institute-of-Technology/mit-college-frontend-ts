import type {
	FacultyBasicProfile,
	FacultyStudents,
} from "~/types/api/faculty.type";
import { Link as LinkTo } from "react-router";
import type { Project } from "./StudentProfileCard";
import { FacultyBasicProfileDataContext } from "~/context/FacultyBasicProfileDataContext";
import React, { useContext } from "react";
import { DialogTitle } from "@headlessui/react";
import { ArrowRight, Link } from "lucide-react";
import { socialIconMap } from "~/constants/socialIconMap";

export const ModalBody: React.FC<{
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	profile: FacultyStudents[number];
	projects: Project[];
}> = ({ setIsOpen, profile, projects }) => {
	const facultyBasicProfile = useContext(FacultyBasicProfileDataContext);

	return (
		<div className="max-w-2xl">
			<div className="text-right">
				<button
					type="button"
					className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-sate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
					onClick={() => setIsOpen(false)}>
					Close
				</button>
			</div>
			<DialogTitle
				as="h3"
				className="text-lg font-medium leading-6 text-gray-900">
				{/* Student */}
			</DialogTitle>
			<div className="mt-0">
				<div className="text-gray-500 md:grid md:grid-cols-2 gap-x-2">
					<div className="col-span-1">
						<img
							// src={profile.avatarUrl}
							src="/avatar.png"
							alt={`${profile.fullName}'s profile picture`}
							className="object-cover max-w-[100vw] md:size-[18rem] size-[14rem] mx-auto rounded-full border border-slate-300 bg-slate-500 my-1 mb-2"
						/>
					</div>
					<div className="col-span-1 text-center md:text-left flex flex-col flex-nowrap justify-evenly h-full">
						<div>
							<div className="font-semibold text-4xl">
								{profile.fullName}
							</div>
							<div className="text-lg font-semibold capitalize">
								{profile.degree} Student
							</div>
						</div>
						{facultyBasicProfile && (
							<div className="text-md capitalize py-1">
								Supervised By -{" "}
								<span className="font-semibold">
									{facultyBasicProfile.firstName}{" "}
									{facultyBasicProfile.lastName}
								</span>
							</div>
						)}
						<div className="py-2">
							<div className="text-sm">
								Start Year: {profile.startYear}
							</div>
							<div className="text-sm">
								End Year:{" "}
								{profile.endYear ? profile.endYear : "Present"}
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center md:justify-start border-dashed border-b border-t py-2">
							<SocialLinks socialLinks={profile.socialLinks} />
						</div>
					</div>
				</div>
				{facultyBasicProfile && (
					<Projects
						facultyBasicProfile={facultyBasicProfile}
						projects={projects}
					/>
				)}
			</div>
		</div>
	);
};

const Projects: React.FC<{
	projects: Project[];
	facultyBasicProfile: FacultyBasicProfile;
}> = ({ projects, facultyBasicProfile }) => {
	return (
		<div className="mt-4 text-md text-slate-600">
			Projects work under{" "}
			<span className="font-semibold">
				{facultyBasicProfile.firstName} {facultyBasicProfile.lastName}:
			</span>
			<div className="mt-2">
				<ul className="list-none space-y-2">
					{projects.map((project, i) => {
						return (
							<li key={i} className="flex items-center">
								<ArrowRight
									size={16}
									className="mr-2 text-slate-600"
								/>
								<span className="capitalize">
									{project.projectName} - ({project.degree})
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

const SocialLinks: React.FC<Pick<FacultyStudents[number], "socialLinks">> = ({
	socialLinks,
}) => {
	const Icons = Object.entries(socialIconMap);

	return (
		<>
			{socialLinks
				.sort((a, b) =>
					a.platform
						.toLowerCase()
						.localeCompare(b.platform.toLowerCase()),
				)
				.map((s, i) => {
					const IconElm = Icons.find((di) => di[0] === s.platform);
					const Icon = IconElm ? IconElm[1] : Link;
					return (
						<LinkTo
							to={s.href}
							target="_blank"
							className="inline-flex flex-row items-center rounded-full bg-slate-500 text-slate-100 px-2 py-1 gap-x-1 hover:bg-slate-200 transition duration-400 hover:text-slate-600 group"
							key={i}>
							<Icon
								size={18}
								className="fill-slate-100 group-hover:fill-slate-600"
							/>
							<div className="capitalize text-sm ">
								{s.platform}
							</div>
						</LinkTo>
					);
				})}
		</>
	);
};
