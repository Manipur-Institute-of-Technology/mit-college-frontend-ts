import Section from "~/components/Section";
import { Stats } from "./Stats";
import { SupervisedStudents } from "./SprvsdStdntSection";
import type { FacultyStudents } from "~/types/api/faculty.type";
import { stats } from "~/utils/stats";
import { useMemo } from "react";

const Students: React.FC<{ students: FacultyStudents }> = ({ students }) => {
	const studentStats = useMemo(() => stats(students), [students]);

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-2">
				<Stats studentStats={studentStats} />
			</div>

			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg">
					Current Students
				</h1>
			</div>
			<Section header="current students">
				<>Students</>
			</Section>
			<SupervisedStudents students={students} />

			<Section
				header="publications"
				accordion={false}
				internalLink={false}>
				<>Publications</>
			</Section>
		</div>
	);
};
export default Students;
