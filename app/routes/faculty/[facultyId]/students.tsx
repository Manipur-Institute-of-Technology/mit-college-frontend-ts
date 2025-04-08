import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/students";
import { getFacultyStudents } from "~/mock/services/fetchMockData";
import React, {
	Suspense,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Await } from "react-router";
import type { FacultyStudents } from "~/types/api/faculty.type";
import Section from "~/components/Section";
import stats, { continuous, groupBy, unique } from "~/utils/stats";
import DropDownMenus from "~/components/DropDownMenus";
import { socialIconMap } from "~/constants/socialIconMap";
import { ArrowRight, Link } from "lucide-react";
import { Link as LinkTo } from "react-router";
import { useModal } from "~/hooks/useModal";
import { DialogTitle } from "@headlessui/react";
import { FacultyBasicProfileDataContext } from "~/context/FacultyBasicProfileDataContext";
import { ArrowLeft } from "lucide-react";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Students`,
	});
}

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
	const { facultyId } = params;
	try {
		const data = getFacultyStudents(facultyId);
		return { data };
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error || !data) return <div className="text-black">An error occured</div>;

	return (
		<Suspense fallback={<>Loading...</>}>
			<Await resolve={data}>{(val) => <Students students={val} />}</Await>
		</Suspense>
	);
};

type studentStatsType = ReturnType<typeof stats>;

const Students: React.FC<{ students: FacultyStudents }> = ({ students }) => {
	const studentStats = useMemo(() => stats(students), [students]);

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-2">
				<Stats studentStats={studentStats} />
			</div>

			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg">Current Students</h1>
			</div>
			<Section header="current students">
				<>Students</>
			</Section>
			<SupervisedStudents students={students} />

			<Section header="publications" accordion={false} internalLink={false}>
				<>Publications</>
			</Section>
		</div>
	);
};

const SupervisedStudents: React.FC<{ students: FacultyStudents }> = ({
	students,
}) => {
	const [yearMenus, setYearMenus] = useState<{ name: string; value: string }[]>(
		[],
	);
	const [selectedMenuIndxs, setSelectecMenuIndxs] = useState([0]);
	const years = useMemo(() => {
		return Array.from(
			students
				.reduce((acc, d) => {
					for (
						let i = Math.floor(d.startYear);
						d.endYear
							? i <= Math.ceil(d.endYear)
							: i <= new Date().getFullYear();
						i++
					)
						acc.set(i, 0);
					return acc;
				}, new Map<number, number>())
				.entries(),
		).map((d) => d[0]);
	}, [students]);

	useEffect(
		() =>
			setYearMenus(() => {
				const menus = years
					.sort((a, b) => b - a)
					.map((d) => ({ name: String(d), value: String(d) }));
				return menus;
			}),
		[years],
	);
	return (
		<Section header="Supervised students" bodyClassName="p-0">
			<>
				<div className="w-full text-right">
					{yearMenus.length > 0 && (
						<DropDownMenus
							selectedIndxs={selectedMenuIndxs}
							setSelectedIndxs={setSelectecMenuIndxs}
							label="year: "
							menus={yearMenus}
						/>
					)}
				</div>
				{yearMenus.length > 0 && selectedMenuIndxs.length > 0 ? (
					selectedMenuIndxs
						.map((d) => yearMenus[d].name)
						.sort((a, b) => +b - +a)
						.map((d, i) => {
							const studntsByYr = students.filter(
								(s) =>
									s.startYear <= +d && (s.endYear ? s.endYear >= +d : true),
							);

							return studntsByYr.length > 0 ? (
								<StudentListByYear
									year={d}
									key={i}
									students={studntsByYr}
									allStudents={students}
								/>
							) : null;
						})
				) : (
					<div className="text-center w-full font-thin text-md font-roboto min-h-20 shadow-md rounded-md bg-slate-100 text-slate-800 inline-flex items-center justify-center p-2">
						Please, select a year to view students
					</div>
				)}
			</>
		</Section>
	);
};

const StudentListByYear: React.FC<{
	students: FacultyStudents;
	allStudents: FacultyStudents;
	year: string;
}> = ({ students, year, allStudents }) => {
	const grpStdntDeg = groupBy(students, (d) => d.degree);
	const grpByName = groupBy(allStudents, (d) => d.fullName.toLowerCase());

	// TODO: Move this function to stats util file and used memo to called it
	// const getAllProject = (
	// 	studentFullName: string,
	// 	students: FacultyStudents,
	// ): string[] => {
	// 	const projects: string[] = [];
	// 	return projects;
	// };

	return (
		<div className="w-full my-2 border border-slate-100 rounded-md shadow-md">
			<div className="w-full p-1 px-4 md:px-2 bg-slate-300 rounded-t-md">
				<h1 className="w-fit text-2xl font-semibold font-roboto rounded-md">
					{year}
				</h1>
			</div>
			{["PhD", "Master", "Bachelor", "Other"].map((stdntDeg, i) => {
				const stdnts = grpStdntDeg.find(
					(d) => d[0].toLowerCase() === stdntDeg.toLowerCase(),
				)?.[1];
				if (stdnts && stdnts?.length > 0) {
					// Display Student who done same project adjacent in ascending order
					// Sort grp Student by project name alphabetically
					const grpByPrj = groupBy(stdnts, (d) =>
						d.projectName.toLowerCase(),
					).sort((a, b) => a[0].localeCompare(b[0]));

					// Sort by student name alphabetically
					const srt = grpByPrj.map((d) => [
						d[0],
						d[1].sort((a, b) => a.fullName.localeCompare(b.fullName)),
					]) satisfies [string, FacultyStudents][];

					return (
						<div key={i}>
							<div className="text-xl font-roboto font-semibold text-slate-700 py-4 px-4 md:px-2 inline-flex items-center gap-x-2 w-full">
								<h2 className="capitalize">{stdntDeg}</h2>
								<div className="bg-slate-500 h-1 w-full" />
							</div>
							<div className="bg-white rounded-b-md px-1 py-2 flex flex-wrap flex-row justify-center items-center gap-2">
								{srt.map((s, i) => {
									return (
										<div
											key={i}
											className="flex flex-wrap  items-center w-fit justify-center gap-1.5">
											{s[1].map((t, j) => {
												// TODO: Make component clean by creating a generic function for this and move to util file under stats function file

												const _projects = grpByName.find(
													(u) =>
														u[0].toLowerCase() === t.fullName.toLowerCase(),
												);
												if (_projects && _projects[1].length > 0) {
													const projects = _projects[1].map((u) => {
														const teams: {
															avatarUrl: string;
															fullName: string;
														}[] = allStudents.filter((stdnt) => {
															// TODO: Compare working year collide
															// If collide insert as team
															return (
																stdnt.projectName.toLowerCase() ===
																t.projectName.toLowerCase()
															);
														});

														return {
															fullName: u.fullName,
															projectName: u.projectName,
															teams,
															paperLink: u.paperLink,
															startYear: u.startYear,
															endYear: u.endYear,
															degree: u.degree,
															researchTopics: u.researchTopics,
															abstract: u.abstract,
														};
													});
													return (
														<StudentProfileCard
															profile={t}
															key={j}
															projects={projects}
														/>
													);
												} else {
													return (
														<StudentProfileCard
															profile={t}
															key={j}
															projects={[]}
														/>
													);
												}
											})}
										</div>
									);
								})}
							</div>
						</div>
					);
				}
				return null;
			})}
		</div>
	);
};

const StudentProfileCard: React.FC<{
	profile: FacultyStudents[number];
	projects: {
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
	}[];
}> = ({ profile, projects }) => {
	const facultyBasicProfile = useContext(FacultyBasicProfileDataContext);
	const Icons = Object.entries(socialIconMap);
	const { setIsOpen, ModalComponent } = useModal();

	const Modal = (
		<ModalComponent>
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
								<div className="font-semibold text-4xl">{profile.fullName}</div>
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
								<div className="text-sm">Start Year: {profile.startYear}</div>
								<div className="text-sm">
									End Year: {profile.endYear ? profile.endYear : "Present"}
								</div>
							</div>
							<div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center md:justify-start border-dashed border-b border-t py-2">
								{[...profile.socialLinks, ...profile.socialLinks]
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
												<div className="capitalize text-sm ">{s.platform}</div>
											</LinkTo>
										);
									})}
							</div>
						</div>
					</div>
					{facultyBasicProfile && (
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
												<ArrowRight size={16} className="mr-2 text-slate-600" />
												<span className="capitalize">
													{project.projectName} - ({project.degree})
												</span>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
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
				{profile.socialLinks
					.sort((a, b) =>
						a.platform.toLowerCase().localeCompare(b.platform.toLowerCase()),
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
			</div>
			{Modal}
		</div>
	);
};

const StatCard: React.FC<{ label: string; count: number }> = ({
	label,
	count,
}) => {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
			<h3 className="text-lg font-bold capitalize">{label}</h3>
			<p className="text-2xl">{count}</p>
		</div>
	);
};

const Stats: React.FC<{ studentStats: studentStatsType }> = ({
	studentStats,
}) => {
	// const studentStats = useMemo(() => stats(students), [students]);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
				<StatCard
					label="Total Projects"
					count={studentStats.totalProjectCount}
				/>
				<StatCard
					label="Active projects"
					count={studentStats.activeProjectCount}
				/>
				<StatCard
					label="Completed Projects"
					count={studentStats.completedProjectCount}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
				<StatCard label="Total Students" count={studentStats.totalStudents} />
				<StatCard
					label="Current Students"
					count={studentStats.totalActiveStudents}
				/>
				<StatCard
					label="Graduated Students"
					count={studentStats.totalGraduateStudent}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
				<StatCard label="PhD Students" count={studentStats.phdStudenCount} />
				<StatCard
					label="Master Students"
					count={studentStats.masterStudenCount}
				/>
				<StatCard
					label="Bachelor Students"
					count={studentStats.bachelorStudenCount}
				/>
				<StatCard
					label="Other Students"
					count={studentStats.otherStudenCount}
				/>
			</div>
			<div className="p-2 rounded-md my-2 shadow-md bg-white">
				<div className="text-xl font-semibold my-2">Project Areas</div>
				<div className="inline-flex flex-wrap flex-direction gap-2">
					{Array.from(studentStats.researchTopicStats.entries())
						.sort((a, b) => b[1] - a[1])
						.map((d, i) => (
							<div
								key={i}
								className="border border-slate-600 rounded-full p-1 px-2 capitalize text-slate-700 text-sm">
								{d[0]}
							</div>
						))}
				</div>
			</div>
		</>
	);
};
