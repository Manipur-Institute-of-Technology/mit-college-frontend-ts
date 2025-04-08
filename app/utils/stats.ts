import type { FacultyStudents } from "~/types/api/faculty.type";
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
const stats = (students: FacultyStudents) => {
	const curYear = new Date().getFullYear();
	const studentMap = new Map<string, number>();
	students.forEach((d, i) => studentMap.set(d.fullName.toLowerCase(), i));

	const activeStudents = unique(
		students.filter(
			(d) =>
				d.startYear >= curYear ||
				(d.startYear < curYear && (d.endYear ? d.endYear >= curYear : true)),
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
				(d.startYear < curYear && (d.endYear ? d.endYear >= curYear : true)),
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

export default stats;

/**
 *
 * @param array
 * @param uniqueExtractorCb
 * @returns
 *
 * @example
 * ```
 * const arr = [12, 3, 34, 12, 34]
 * unique(arr, d => d) // [12, 3, 34]
 * ```
 */
export const unique = <T = any>(
	array: T[],
	uniqueFieldExtractorCb: (d: T, i: number, array: T[]) => string,
): T[] => {
	const uniqArr: T[] = [];
	const mp = array.reduce((acc, d, i) => {
		acc.set(uniqueFieldExtractorCb(d, i, array), i);
		return acc;
	}, new Map<string, number>());

	array.forEach((d, i) => {
		const val = mp.get(uniqueFieldExtractorCb(d, i, array));
		if (val !== undefined) {
			uniqArr.push(array[val]);
		}
	});
	return uniqArr;
};

export const continuous = (
	array: number[],
	increment: number = 1,
): number[] => {
	array
		.sort((a, b) => a - b)
		.reduce((acc, d, i) => {
			if (i > 0) {
				for (let j = acc.at(-1)!; j < d; j += increment) acc.push(j);
			}
			return acc;
		}, Array<number>());
	return array;
};

export const groupBy = <T = any>(
	array: T[],
	groupByFieldExtractor: (d: T) => string,
): [string, T[]][] => {
	const mp = new Map<string, T[]>();
	array.forEach((elm) => {
		const field = groupByFieldExtractor(elm);
		if (mp.has(field)) {
			const val = mp.get(field)!;
			val.push(elm);
		} else {
			mp.set(field, [elm]);
		}
	});

	return Array.from(mp);
};
