import type { FacultyStudents } from "~/types/api/faculty.type";
import { groupBy } from "~/utils/array";
import { StudentProfileCard } from "./StudentProfileCard";

export const StudentListByYear: React.FC<{
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
			{["PhD", "Master", "Bachelor", "Other"].map((stdntDeg, i) => (
				<StudentByDegree
					grpStdntDeg={grpStdntDeg}
					grpByName={grpByName}
					stdntDeg={stdntDeg}
					allStudents={allStudents}
					key={i}
				/>
			))}
		</div>
	);
};

// TODO: Incomplete implementation: ProjectModal,
export const StudentByDegree: React.FC<{
	grpStdntDeg: ReturnType<typeof groupBy<FacultyStudents[number]>>;
	grpByName: ReturnType<typeof groupBy<FacultyStudents[number]>>;
	allStudents: FacultyStudents;
	stdntDeg: string;
}> = ({ grpStdntDeg, grpByName, stdntDeg, allStudents }) => {
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
			<div>
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
											u[0].toLowerCase() ===
											t.fullName.toLowerCase(),
									);
									if (_projects && _projects[1].length > 0) {
										const projects = _projects[1].map(
											(u) => {
												const teams: {
													avatarUrl: string;
													fullName: string;
												}[] = allStudents.filter(
													(stdnt) => {
														// TODO: Compare working year collide
														// If collide insert as team
														return (
															stdnt.projectName.toLowerCase() ===
															t.projectName.toLowerCase()
														);
													},
												);

												return {
													fullName: u.fullName,
													projectName: u.projectName,
													teams,
													paperLink: u.paperLink,
													startYear: u.startYear,
													endYear: u.endYear,
													degree: u.degree,
													researchTopics:
														u.researchTopics,
													abstract: u.abstract,
												};
											},
										);
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
};
