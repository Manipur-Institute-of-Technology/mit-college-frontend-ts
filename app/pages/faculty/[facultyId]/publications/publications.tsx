import React from "react";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import PublicationListContainer from "./PublicationListContainer";
import SmallPie from "~/components/SmallPieChart";
import PublicationChart from "./PublicationChart";
import { Link } from "react-router";
import { ChevronRight, Fingerprint, Network, Users } from "lucide-react";

export const Publications: React.FC<FacultyDetailProfile> = (props) => {
	return (
		<div className="relative w-full font-roboto">
			<div className="lg:grid grid-cols-12 relative pt-4 gap-x-0 xl:gap-x-2 space-y-2">
				<div className="col-span-9">
					<PublicationFingerPrint />
					<PublicationListContainer {...props} />
				</div>
				<div
					className="rounded-md col-span-3 overflow-y-auto h-fit lg:max-h-[100vh] sticky top-[9%] md:flex flex-col gap-2 mx-1 sm:mx-2 xl:mx-0 space-y-2 md:space-y-0"
					style={{
						scrollbarWidth: "thin",
					}}>
					{/* <div className="font-roboto py-4 px-1 w-auto">
						<div>
							<img src="/mock/image.png" className="w-full h-auto" />
						</div>
					</div> */}

					<PublicationChart {...props} />
					<Stats />
					<CoAuthors />
				</div>
			</div>
		</div>
	);
};

export default Publications;

// TODO: check for duplicate tag when user input it
// TODO: add non faculty dashboard page and also page for writing its info. role
const PublicationFingerPrint = () => {
	const data = {
		totalPaper: 20,
		keywords: [
			{
				keyword: "artificial intelligence",
				count: 15,
			},
			{
				keyword: "deep learning",
				count: 8,
			},
			{
				keyword: "computer vision",
				count: 6,
			},
			{
				keyword: "neural networks",
				count: 10,
			},
			{
				keyword: "data mining",
				count: 5,
			},
			{
				keyword: "machine learning",
				count: 12,
			},
		],
	};

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md my-2 bg-slate-50 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg inline-flex items-center gap-x-2.5">
					<Fingerprint size={24} />
					<span>Publications Fingerprint</span>
				</h1>
				<div className="flex flex-row gap-2 flex-wrap w-full font-roboto">
					{data.keywords.map((d, i) => {
						return (
							<div
								key={i}
								className="border border-slate-500 rounded-full p-1 px-2 text-md inline-flex items-center gap-x-2 text-sm">
								<span className="capitalize">{d.keyword}</span>
								<span className="text-sm">
									{d.count}/{data.totalPaper}
								</span>
								<SmallPie
									size={18}
									percent={d.count / data.totalPaper}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const Stats = () => {
	return (
		<div className="rounded-md font-roboto bg-slate-100 p-2 shadow-md border border-slate-300">
			<div className="font-roboto text-slate-700 text-md">Stats</div>
			<div className="text-sm w-full bg-slate-50">
				{Array.from({ length: 4 }, (_, i) => i).map((_, i) => (
					<div
						key={i}
						className="inline-flex justify-between w-full capitalize p-1 border-b border-b-slate-300 border-t border-t-slate-300">
						<span>Total Paper Published:</span>
						<span className="font-semibold">12</span>
					</div>
				))}
			</div>
		</div>
	);
};

const CoAuthors = () => {
	return (
		<div className="rounded-md font-roboto bg-slate-100 p-2 shadow-md border border-slate-300">
			<div className="font-roboto text-slate-700 font-md">Co-authors</div>
			<div className="flex flex-col w-full bg-slate-50 rounded-md">
				{Array.from({ length: 8 }, () => 1).map((d, i) => (
					<Link
						to={"xx"}
						key={i}
						className="grid grid-cols-12 items-center hover:bg-slate-200 border-t border-b border-t-slate-200 border-b-slate-200 py-0.5">
						<div className="col-span-2 pl-1 pr-3">
							<img
								src="/avatar.png"
								alt=""
								className="size-[30px] rounded-full object-cover object-center"
							/>
						</div>
						<div className="col-span-9 font-roboto">
							<div className="text-[14px]/5 text-slate-900">
								Franchois Cholette
							</div>
							<div className="text-[12px]/3 text-slate-600">
								Professor at Lavale
							</div>
							<div className="text-[12px]/3 text-slate-600">
								12 papers co-authored
							</div>
						</div>
						<div className="col-span-1">
							<ChevronRight size={26} />
						</div>
					</Link>
				))}

				<div className="flex flex-row w-full text-sm justify-between py-1 text-slate-700">
					<button className="inline-flex items-center gap-x-2 w-max hover:cursor-pointer">
						<span>View All</span>
						<Users size={14} />
					</button>
					<Link
						to={"./network"}
						className="inline-flex items-center gap-x-2">
						<span>View Collab Network</span>
						<Network size={14} />
					</Link>
				</div>
			</div>
		</div>
	);
};
