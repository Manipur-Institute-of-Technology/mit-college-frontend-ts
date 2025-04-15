import { ChevronDown, ChevronUp, Search, Tag, X } from "lucide-react";
import React, { useState } from "react";
import InputGrp from "~/components/InputGrp";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import Pagination from "./Pagination";
import DropDownMenu from "~/components/DropDownMenu";
import PublicationLists from "./PublicationLists";
import DropDownMenus from "~/components/DropDownMenus";
import { FilterInput, type FilterSchema } from "./Filter";

const PublicationListContainer: React.FC<FacultyDetailProfile> = (props) => {
	const [selectedPaginationIndx, setSelectedPaginationIndx] = useState(0);
	const [selectedSortIndx, setSelectedSortIndx] = useState(0);
	const sortByMenus = [
		"title - (A-Z)",
		"title - (Z-A)",
		"type",
		"date (Newest First)",
		"date (Oldest First)",
	].map((d) => ({ name: d, value: d.toLowerCase() }));

	const [advFilterActive, setAdvFilterActive] = useState(false);
	const [searchFilter, setSearchFilter] = useState<FilterSchema>({
		fromYear: undefined,
		endYear: undefined,
		pubTypes: [],
		keywords: undefined,
	});

	const containValidFilter = (filter: FilterSchema): boolean => {
		return filter.fromYear ||
			filter.endYear ||
			filter.pubTypes.length > 0 ||
			(filter.keywords && filter.keywords.length > 0)
			? true
			: false;
	};

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md bg-slate-50 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg">
					Publications
				</h1>
				<div>
					<div className="flex md:flex-nowrap flex-wrap items-center gap-1 my-2">
						<InputGrp className="w-full my-0.5">
							<>
								<Search size={18} className="w-fit" />
								<input
									type="text"
									className="px-2 py-1 outline-none w-full"
									placeholder="Search by title"
								/>
							</>
						</InputGrp>
						<button className="hover:cursor-pointer rounded-md bg-slate-200 w-full md:w-fit px-2 py-1 hover:bg-slate-300 hover:shadow-md">
							Search
						</button>
					</div>

					{containValidFilter(searchFilter) && (
						<div className="text-sm font-roboto my-2 p-2">
							<div className="text-md">Filters:</div>
							<div className="text-sm ">
								<div className="flex flex-row flex-wrap gap-2">
									{searchFilter.fromYear && (
										<div className="px-2 py-0.5 border border-slate-400 bg-slate-200 rounded-full">
											From: {searchFilter.fromYear}
										</div>
									)}
									{searchFilter.endYear && (
										<div className="px-2 py-0.5 border border-slate-400 bg-slate-200 rounded-full">
											To: {searchFilter.endYear}
										</div>
									)}
								</div>
								{searchFilter.pubTypes.length > 0 && (
									<div className="inline-flex items-start gap-2 my-1">
										<span className="py-1">
											Publication Type:
										</span>
										<div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
											{searchFilter.pubTypes.map(
												(d, i) => (
													<div
														key={i}
														className="px-2 py-0.5 capitalize border border-slate-400 bg-slate-200 rounded-full">
														{d}
													</div>
												),
											)}
										</div>
									</div>
								)}
								{searchFilter.keywords &&
									searchFilter.keywords.length > 0 && (
										<div className="inline-flex items-start gap-2 my-1">
											<span className="py-1">
												Keywords:
											</span>
											<div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
												{searchFilter.keywords
													.split(",")
													.map((d, i) => (
														<div
															key={i}
															className="capitalize py-0.5 px-2 border border-slate-400 bg-slate-200 rounded-full">
															{d}
														</div>
													))}
												{Array.from(
													{ length: 12 },
													(_, i) => (
														<div
															key={i}
															className="capitalize py-0.5 px-2 border border-slate-400 bg-slate-200 rounded-full">
															Neuroscience
														</div>
													),
												)}
											</div>
										</div>
									)}
							</div>
						</div>
					)}

					<button
						className="bg-slate-200 text-sm font-roboto p-2 rounded-md inline-flex items-center gap-x-2"
						onClick={() => setAdvFilterActive((s) => !s)}>
						<span>Filter By</span>
						{advFilterActive ? (
							<ChevronUp size={18} />
						) : (
							<ChevronDown size={18} />
						)}
					</button>

					{advFilterActive && (
						<FilterInput setFilters={setSearchFilter} />
					)}

					<div className="my-2">
						<Pagination firstPage={1} lastPage={10} currPage={5} />
					</div>
					<div className="my-2">
						<DropDownMenu
							label="sort by:"
							menus={sortByMenus}
							selectedIndx={selectedSortIndx}
							setSelectedIndx={setSelectedSortIndx}
							menuClassName="w-[18rem] text-sm"
							menuItemClassName=" text-sm"
						/>
					</div>
				</div>

				<PublicationLists lists={props.researchDetail.publications} />

				<div className="my-2">
					<Pagination firstPage={1} lastPage={10} currPage={5} />
				</div>
			</div>
		</div>
	);
};

export default PublicationListContainer;
