import type { stats } from "~/utils/stats";

type studentStatsType = ReturnType<typeof stats>;

export const StatCard: React.FC<{ label: string; count: number }> = ({
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

export const Stats: React.FC<{ studentStats: studentStatsType }> = ({
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
				<StatCard
					label="Total Students"
					count={studentStats.totalStudents}
				/>
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
				<StatCard
					label="PhD Students"
					count={studentStats.phdStudenCount}
				/>
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
