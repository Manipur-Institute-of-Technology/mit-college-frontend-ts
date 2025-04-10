import type { FacultyStudents } from "~/types/api/faculty.type";
import { unique } from "./array";
/**
 * Stats - Total Students suprervised, num of project (active project, completed project),
 * degrees type count for students that are supervised
 * research topic stats (num of paper/project published in each research topics)
 *
 * Current students - students: startYear < 2025 <= endYear || (startYear < 2025  && endYear === null)
 * (each section for different degrees types)
 * Supervised Students
 */

/**
 * Calculates and returns various statistics based on the provided student data.
 *
 * @param students - An array of student objects, each containing information such as full name,
 * start year, end year, project name, degree, and research topics.
 *
 * @returns An object containing the calculated statistics:
 *   - `totalStudents`: The total number of unique students.
 *   - `totalActiveStudents`: The number of currently active students.
 *   - `totalGraduateStudent`: The number of graduated students.
 *   - `totalProjectCount`: The total number of unique projects.
 *   - `activeProjectCount`: The number of currently active projects.
 *   - `completedProjectCount`: The number of completed projects.
 *   - `researchTopicStats`: A map containing the count of each research topic.
 *   - `phdStudenCount`: The number of unique PhD students.
 *   - `masterStudenCount`: The number of unique Master's students.
 *   - `bachelorStudenCount`: The number of unique Bachelor's students.
 *   - `otherStudenCount`: The number of unique students with other degrees.
 */
export const stats = (students: FacultyStudents) => {
	const curYear = new Date().getFullYear();
	const studentMap = new Map<string, number>();
	students.forEach((d, i) => studentMap.set(d.fullName.toLowerCase(), i));

	const activeStudents = unique(
		students.filter(
			(d) =>
				d.startYear >= curYear ||
				(d.startYear < curYear &&
					(d.endYear ? d.endYear >= curYear : true)),
		),
		(d) => d.fullName.toLowerCase(),
	);
	// Student whose projects has beeen completed
	const graduatedStudents = unique(
		students.filter((d) => d.endYear && d.endYear < curYear),
		(d) => d.fullName.toLowerCase(),
	);
	//  Count by project name
	const totalProjects = unique(students, (d) => d.projectName.toLowerCase());

	// Active Projects -
	const activeProjects = unique(
		students.filter(
			(d) =>
				d.startYear >= curYear ||
				(d.startYear < curYear &&
					(d.endYear ? d.endYear >= curYear : true)),
		),
		(d) => d.projectName.toLowerCase(),
	);

	const completeProjects = unique(
		students.filter((d) => d.endYear && d.endYear < curYear),
		(d) => d.projectName.toLowerCase(),
	);

	const [
		phdStudenCount,
		masterStudenCount,
		bachelorStudenCount,
		otherStudenCount,
	] = ["phd", "master", "bachelor", "other"].map((sType) => {
		const st = students.filter((s) => s.degree === sType);
		return unique(st, (d) => d.fullName.toLowerCase());
	});

	// Research topics stats
	// Calculate by counting the researchTopics field for each unique project name
	const researchTopicStats = totalProjects.reduce((acc, d) => {
		d.researchTopics.forEach((topic) => {
			if (acc.has(topic.toLowerCase()))
				acc.set(topic.toLowerCase(), acc.get(topic.toLowerCase())! + 1);
			else acc.set(topic.toLowerCase(), 1);
		});
		return acc;
	}, new Map<string, number>());

	return {
		totalStudents: studentMap.size,
		totalActiveStudents: activeStudents.length,
		totalGraduateStudent: graduatedStudents.length,
		totalProjectCount: totalProjects.length,
		activeProjectCount: activeProjects.length,
		completedProjectCount: completeProjects.length,
		researchTopicStats,
		phdStudenCount: phdStudenCount.length,
		masterStudenCount: masterStudenCount.length,
		bachelorStudenCount: bachelorStudenCount.length,
		otherStudenCount: otherStudenCount.length,
	};
};
