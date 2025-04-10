import { useEffect, useMemo, useState } from "react";
import DropDownMenus from "~/components/DropDownMenus";
import Section from "~/components/Section";
import type { FacultyStudents } from "~/types/api/faculty.type";
import { StudentListByYear } from "./StudentListByYear";

export const SupervisedStudents: React.FC<{ students: FacultyStudents }> = ({
	students,
}) => {
	const [yearMenus, setYearMenus] = useState<
		{ name: string; value: string }[]
	>([]);
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
									s.startYear <= +d &&
									(s.endYear ? s.endYear >= +d : true),
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
