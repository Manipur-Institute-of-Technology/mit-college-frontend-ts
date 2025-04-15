import { DialogTitle } from "@headlessui/react";
import { Calendar, Filter, Loader2, Scroll } from "lucide-react";
import React, { useMemo, useState } from "react";
import WideBarChart from "~/components/WideBarChart";
import { PublicationListItem } from "./PublicationLists";

const LargePublicationChart: React.FC<{
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsOpen }) => {
	const [filterYear, setFilterYear] = useState(false);

	const len = 10;
	const y = Array.from({ length: len }, () => Math.ceil(Math.random() * 30));
	const x = Array.from({ length: len }, (_, i) => String(2000 + i));

	const containerWidth = 720 > window.innerWidth ? window.innerWidth : 720,
		containerHeight = 420;

	const barProps: React.ComponentProps<typeof WideBarChart> = useMemo(
		() => ({
			x,
			y,
			xLabel: "Years",
			yLabel: "Number of publication",
			containerHeight,
			containerWidth,
		}),
		[containerHeight, containerWidth],
	);

	const papers = [
		{
			paperTitle:
				"SecureFL: A Robust Framework for Privacy-Preserving Federated Learning",
			type: "journal",
			doi: "10.1109/tnnls.2024.1234567",
			publicationDate: "2024-02-15",
			link: "https://google.com",
			authors: [
				{
					name: "Nicolas Papernot",
					profileLink: "https://www.papernot.fr/",
				},
				{
					name: "Sarah Chen",
					profileLink: "https://example.com/schen",
				},
			],
		},
		{
			paperTitle:
				"Differential Privacy in Deep Learning: An Empirical Study",
			type: "conference",
			doi: "10.1145/3567890.1234567",
			publicationDate: "2023-10-10",
			authors: [
				{
					name: "Nicolas Papernot",
					profileLink: "https://www.papernot.fr/",
				},
				{
					name: "Michael Ross",
					profileLink: "https://example.com/mross",
				},
			],
		},
	];

	return (
		<div className="mt-2 max-w-full w-7xl">
			<DialogTitle
				as="h3"
				className="text-lg font-medium leading-6 text-gray-800 inline-flex justify-between w-full items-center my-2">
				<div className="text-xl">Publication Statistics</div>

				<button
					type="button"
					className="bg-slate-200 px-2 py-1 rounded-md hover:cursor-pointer text-sm"
					onClick={() => setIsOpen(false)}>
					Close
				</button>
			</DialogTitle>

			<div className="bg-slate-50 w-fit max-w-full mx-auto">
				<button
					className={`text-sm p-1 rounded-md border border-slate-300 w-fit hover:cursor-pointer ${
						!filterYear ? "bg-slate-50" : "bg-slate-300"
					}`}
					title="Filter Year with no paper published"
					onClick={() => setFilterYear((s) => !s)}>
					<Filter size={18} />
				</button>

				<WideBarChart {...barProps} />
			</div>

			<div className="py-4">
				<div className="text-lg">
					Papers{" "}
					<span className="text-sm text-slate-700">
						({papers.length}/20)
					</span>
				</div>
				<div>
					Year: <span className="text-sm text-slate-700">2001</span>
				</div>
				<div className="bg-slate-50 rounded-md w-full flex flex-col gap-y-1 font-roboto">
					{papers.map((paper, i) => {
						return (
							<PublicationListItem
								{...{ ...paper, link: paper.link || null }}
							/>
						);
					})}
				</div>
				<div className="bg-slate-50 rounded-md w-full h-[10rem] flex flex-col gap-2 items-center justify-center text-center font-roboto text-sm text-slate-600 my-1">
					<Loader2
						size={24}
						className="stroke-slate-600 animate-spin origin-center"
					/>
					<div>
						Hang on ! <br /> We are getting the data for you...
					</div>
				</div>

				<div className="bg-slate-50 rounded-md w-full h-[10rem] flex flex-col gap-2 items-center justify-center text-center font-roboto text-sm text-slate-600 my-1">
					<Scroll
						size={24}
						className="stroke-slate-600 animate-pulse origin-center"
					/>
					<div>
						No paper ! <br />
						No paper is found published in this year by this author.{" "}
						<br />
						Check other year ...
					</div>
				</div>

				<div className="bg-slate-50 rounded-md w-full h-[10rem] flex flex-col gap-2 items-center justify-center text-center font-roboto text-sm text-slate-600 my-1">
					<Calendar
						size={24}
						className="stroke-slate-600 animate-bounce origin-center"
					/>
					<div>
						Select a year ! <br />
						Click on a bar to see the paper published in that year.
					</div>
				</div>
			</div>
		</div>
	);
};

export default LargePublicationChart;
