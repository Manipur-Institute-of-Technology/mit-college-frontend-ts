import moment from "moment";
import React from "react";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import { ResearchSections } from "./Sections";

const Research: React.FC<FacultyDetailProfile> = (props) => {
	return (
		<div className="relative w-full font-roboto">
			<div className="grid grid-cols-12 relative">
				<div className="col-span-12 lg:col-span-9">
					<ResearchSections {...props} />
				</div>
				<div className="hidden lg:col-span-3 lg:block overflow-y-auto h-fit max-h-[100vh] sticky top-[9%]">
					<div className="font-roboto py-4 px-1 w-auto">
						<div>
							<img
								src="/mock/image.png"
								className="w-full h-auto"
							/>
						</div>
						<PublicationChart {...props} />
					</div>
				</div>
			</div>
		</div>
	);
};
export default Research;

const PublicationChart: React.FC<FacultyDetailProfile> = (props) => {
	const data = React.useMemo(() => {
		const publications = props.researchDetail.publications;
		const countByYear = publications.reduce(
			(acc, pub) => {
				const year = moment(pub.publicationDate).format("YYYY");
				acc[year] = (acc[year] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(countByYear)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([year, count]) => ({ year, count }));
	}, [props.researchDetail.publications]);

	return (
		<div className="p-2 rounded-md bg-slate-200 shadow-md font-roboto">
			<div className="relative w-fit text-wrap font-semibold">
				Publication Statistics
			</div>

			<div className="w-full overflow-x-auto">
				<div className="min-w-[600px] h-[300px] p-4">
					<div className="relative h-full flex items-end gap-2">
						{data.map(({ year, count }, i) => (
							<div
								key={i}
								className="group flex-1 flex flex-col items-center border"
								style={{ height: "100%" }}>
								<div
									className="w-2 bg-blue-500 hover:bg-blue-600 transition-all duration-200 rounded-t-md relative border"
									style={{
										height: `${(count / Math.max(...data.map((d) => d.count))) * 80}%`,
									}}>
									<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white px-2 py-1 rounded text-sm transition-opacity">
										{count} papers
									</div>
								</div>
								<div className="mt-2 text-sm text-slate-600">
									{year}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
