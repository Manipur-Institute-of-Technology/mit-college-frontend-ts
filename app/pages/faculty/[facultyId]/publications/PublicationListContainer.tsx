import { Search } from "lucide-react";
import { useState } from "react";
import InputGrp from "~/components/InputGrp";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import Pagination from "./Pagination";
import DropDownMenu from "~/components/DropDownMenu";
import PublicationLists from "./PublicationLists";

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

	return (
		<div className="relative w-full font-roboto">
			<div className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative border-t-6 border-t-slate-500 p-4">
				<h1 className="uppercase font-semibold text-lg">
					Publications
				</h1>
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
				<PublicationLists lists={props.researchDetail.publications} />

				<Pagination firstPage={1} lastPage={10} currPage={10} />
			</div>
		</div>
	);
};

export default PublicationListContainer;
