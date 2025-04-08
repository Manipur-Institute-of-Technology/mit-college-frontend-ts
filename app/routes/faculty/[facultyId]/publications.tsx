import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/research";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Await, Link } from "react-router";
import React, { Suspense, useState } from "react";
import type {
	FacultyDetailProfile,
	Publication,
} from "~/types/api/faculty.type";
import moment from "moment";
import { Search, User, Users } from "lucide-react";
import DropDownMenu from "~/components/DropDownMenu";
import { unique } from "~/utils/stats";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Research`,
	});
}

export const clientLoader = ({
	params,
	request,
	context,
}: Route.ClientLoaderArgs) => {
	const url = new URL(request.url);
	const searchParams = Object.fromEntries(url.searchParams);
	const { pageSize, pageNum, sortBy } = searchParams;
	console.log(pageSize, pageNum, sortBy);

	const { facultyId } = params;
	try {
		const data = getFacultyDetailProfile(facultyId);
		return { data };
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error || !data) return <div className="text-black">An error occured</div>;

	return (
		<Suspense fallback={<>Loading...</>}>
			<Await resolve={data}>{(val) => <Research {...val} />}</Await>
		</Suspense>
	);
};

const Research: React.FC<FacultyDetailProfile> = (props) => {
	return (
		<div className="relative w-full font-roboto">
			<div className="grid grid-cols-12 relative">
				<div className="col-span-12 lg:col-span-9">
					<Research1 {...props} />
				</div>
				<div className="hidden lg:col-span-3 lg:block overflow-y-auto h-fit max-h-[100vh] sticky top-[9%]">
					<div className="font-roboto py-4 px-1 w-auto">
						<div>
							<img src="/mock/image.png" className="w-full h-auto" />
						</div>
						<PublicationChart {...props} />
					</div>
				</div>
			</div>
		</div>
	);
};

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
								<div className="mt-2 text-sm text-slate-600">{year}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const Pagination: React.FC<{
	firstPage: number;
	lastPage: number;
	currPage: number;
}> = ({ firstPage, lastPage, currPage }) => {
	const menus = Array.from(
		{ length: lastPage - firstPage },
		(_, i) => i + firstPage,
	).map((d) => ({
		name: String(d),
		value: String(d),
	}));
	const [selectedPaginationIndx, setSelectedPaginationIndx] = useState(
		menus.findIndex((d) => d.value === String(currPage)),
	);

	const getPagination = (
		firstPage: number,
		lastPage: number,
		curPage: number,
	): (number | string)[] => {
		let pages: number[] = [];
		if (curPage <= firstPage + 1 || curPage >= lastPage - 1)
			pages = [firstPage, firstPage + 1, lastPage - 1, lastPage];
		else pages = [firstPage, curPage - 1, curPage, curPage + 1, lastPage];

		pages = unique(pages, (d) => String(d)).map((d) => +d);
		return pages
			.sort((a, b) => a - b)
			.reduce(
				(acc, d) => {
					if (acc.length > 0) {
						if (!isNaN(+acc.at(-1)!)) {
							if (acc.at(-1) === d - 1) acc.push(d);
							else {
								acc.push("...");
								acc.push(d);
							}
						} else acc.push(d);
					} else acc.push(d);
					return acc;
				},
				[] as (string | number)[],
			);
	};
	return (
		<div className="grid grid-cols-8 items-center">
			{currPage === firstPage ? (
				<div
					className={`col-span-2 text-sm p-2 hover:cursor-not-allowed text-slate-400 w-fit bg-slate-200 rounded-md hover:bg-slate-300 font-semibold`}>
					Previous
				</div>
			) : (
				<Link
					to={`./${currPage + 1}`}
					className={`col-span-2 text-sm p-2 w-fit bg-slate-200 rounded-md hover:bg-slate-300 text-slate-800 font-semibold`}>
					Previous
				</Link>
			)}

			<div className="col-span-4 text-center text-slate-900 p-2 text-md">
				<div className="hidden md:inline-flex items-center justify-center gap-x-2">
					{getPagination(firstPage, lastPage, currPage).map((d, i) =>
						d !== "..." ? (
							<Link
								to={`./${d}`}
								key={i}
								className={`${d === currPage ? "font-semibold" : "font-normal"} hover:font-semibold`}>
								{d}
							</Link>
						) : (
							<span key={i}>{d}</span>
						),
					)}
				</div>
				<div className="inline-flex md:hidden items-center flex-nowrap justify-center gap-x-1">
					<DropDownMenu
						menus={Array.from(
							{ length: lastPage - firstPage + 1 },
							(_, i) => i + firstPage,
						).map((d) => ({
							name: String(d),
							value: String(d),
						}))}
						label=""
						setSelectedIndx={setSelectedPaginationIndx}
						selectedIndx={selectedPaginationIndx}
					/>
					<div>of {lastPage}</div>
				</div>
			</div>
			{currPage === lastPage ? (
				<div
					className={`col-span-2 text-right text-sm ml-[100%] translate-x-[-100%] p-2 hover:cursor-not-allowed text-slate-400 w-fit bg-slate-200 rounded-md hover:bg-slate-300 font-semibold`}>
					Next
				</div>
			) : (
				<Link
					to={`./${currPage + 1}`}
					className={`col-span-2 text-sm ml-[100%] translate-x-[-100%] p-2 w-fit bg-slate-200 rounded-md hover:bg-slate-300 text-slate-800 font-semibold`}>
					Next
				</Link>
			)}
		</div>
	);
};

const InputGrp: React.FC<{
	children: React.JSX.Element;
	className?: string;
}> = ({ children, className }) => {
	return (
		<div
			className={`inline-flex items-center border border-slate-500 rounded-md px-1 ${className || ""}`}>
			{children}
		</div>
	);
};

const Research1: React.FC<FacultyDetailProfile> = (props) => {
	const [selectedPaginationIndx, setSelectedPaginationIndx] = useState(0);
	const [selectedSortIndx, setSelectedSortIndx] = useState(0);
	const sortByMenus = [
		"title - (A-Z)",
		"title - (Z-A)",
		"type",
		"date (Newest First)",
		"date (Oldest First)",
	].map((d) => ({ name: d, value: d.toLowerCase() }));

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg">Publications</h1>
				<div>
					<InputGrp className="w-full my-2">
						<>
							<Search size={18} className="w-fit" />
							<input
								type="text"
								className="px-2 py-1 outline-none w-full"
								placeholder="Search by title"
							/>
						</>
					</InputGrp>
					<Pagination firstPage={1} lastPage={10} currPage={5} />
					<div className="my-2">
						<DropDownMenu
							label="sort by:"
							menus={sortByMenus}
							selectedIndx={selectedSortIndx}
							setSelectedIndx={setSelectedSortIndx}
							menuClassName="w-[18rem]"
						/>
					</div>
				</div>
				<PublicationList lists={props.researchDetail.publications} />

				<Pagination firstPage={1} lastPage={10} currPage={10} />
			</div>
		</div>
	);
};

const PublicationList: React.FC<{ lists: Publication[] }> = ({ lists }) => {
	return (
		<div className="flex flex-col gap-y-2 font-roboto bg-slate-100">
			{lists.map((d, i) => (
				<div
					key={i}
					className="p-4 rounded-md bg-slate-50 border border-slate-300 shadow-md hover:bg-slate-100 hover:shadow-lg transition-all">
					<div className="uppercase text-[12px] font-semibold text-slate-500 mb-1">
						{d.type}
					</div>
					{d.link ? (
						<Link
							to={d.link}
							className={`text-[1.1rem] text-slate-800 hover:underline`}>
							{d.paperTitle}
						</Link>
					) : (
						<div className={`text-[1.1rem] text-slate-800`}>{d.paperTitle}</div>
					)}
					<div className="text-sm text-slate-400">
						{moment(d.publicationDate).format("D MMMM YYYY")}
					</div>
					{d.doi && (
						<Link to={d.doi} className="text-sm text-slate-600 hover:underline">
							DOI: {d.doi}
						</Link>
					)}
					<div className="mt-2">
						<div className="inline-flex items-center text-sm gap-x-3">
							{d.authors.length > 1 ? <Users size={14} /> : <User size={14} />}
							<div className="inline-flex items-center gap-x-2">
								{d.authors.map((a, i) => (
									<Link
										to={a.profileLink}
										key={i}
										className="capitalize py-0.5 px-1 rounded-md bg-slate-200 font-thin text-[12px]">
										{a.name}
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
