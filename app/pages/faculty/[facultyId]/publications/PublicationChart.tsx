import moment from "moment";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Fullscreen, Loader2 } from "lucide-react";
import { useModal } from "~/hooks/useModal";

// import BarChart from "~/components/BarChart";
import ModalBody from "./LargePublicationChart";

const PublicationChart: React.FC<FacultyDetailProfile> = (props) => {
	const { setIsOpen, ModalComponent } = useModal();

	useEffect(() => {
		setIsOpen(true);
	}, []);

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

	const width = 290,
		height = 200;
	const barProps: React.ComponentProps<typeof BarChart> = useMemo(
		() => ({
			y: Array.from({ length: 8 }, () => Math.ceil(Math.random() * 30)),
			x: Array.from({ length: 8 }, (_, i) => String(2000 + i)),
			xLabel: "Years",
			yLabel: "Number of publication",
			width,
			height,
		}),
		[width, height],
	);

	const BarChart = lazy(() => import("~/components/BarChart"));

	return (
		<div className="p-2 rounded-md bg-slate-100 shadow-md font-roboto w-full border border-slate-300">
			<div className="inline-flex items-center justify-between w-full px-2 py-1">
				<div className="relative w-fit text-wrap text-md font-semibold font-roboto text-slate-600">
					Publication Statistics
				</div>
				<button
					className="border border-slate-400 rounded-md p-0.5 hover:bg-slate-100 hover:cursor-pointer"
					onClick={() => setIsOpen(true)}>
					<Fullscreen size={18} />
				</button>
			</div>

			{/* TODO: Dynamic import of d3 chart */}
			<div
				className="relative overflow-x-auto my-2 max-w-full"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#cbd5e1 #f1f5f9",
				}}>
				<Suspense fallback={<>Loading Chart</>}>
					<svg
						className="bg-slate-100 rounded-md mx-auto"
						width={width}
						height={height}>
						<BarChart {...barProps} />
					</svg>
				</Suspense>
			</div>

			<div
				className="relative overflow-x-auto my-2"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#cbd5e1 #f1f5f9",
				}}>
				<div className="bg-slate-50 rounded-md w-full h-[200px] flex justify-center items-center flex-col">
					<Loader2 size={18} className="animate-spin origin-center" />
					<div className="font-roboto text-sm text-slate-600 text-center">
						Crunching, the latest data for you. <br />
						Hang, tight ...
					</div>
				</div>
			</div>

			<ModalComponent>
				<ModalBody setIsOpen={setIsOpen} />
			</ModalComponent>
		</div>
	);
};

export default PublicationChart;
