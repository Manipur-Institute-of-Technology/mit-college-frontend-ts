import { useState } from "react";
import { Link } from "react-router";
import DropDownMenu from "~/components/DropDownMenu";
import { getPagination } from "~/utils/pagination";

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

export default Pagination;
