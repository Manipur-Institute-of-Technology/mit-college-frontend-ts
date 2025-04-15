import { Calendar, Check, Tag, X } from "lucide-react";
import { useState } from "react";
import DropDownMenus from "~/components/DropDownMenus";
import InputGrp from "~/components/InputGrp";

export type FilterSchema = {
	fromYear: number | undefined;
	endYear: number | undefined;
	pubTypes: string[];
	keywords: string | undefined; // in csv format
};

export const FilterInput: React.FC<{
	setFilters: React.Dispatch<React.SetStateAction<FilterSchema>>;
}> = ({ setFilters }) => {
	const menus = [
		"Journal Articles",
		"Conference Papers",
		"Book Chapters",
		"Patents",
		"Technical Reports",
		"Presentations",
	].map((d) => ({ name: d, value: d.toLowerCase() }));

	const [selectedMenuIndx, setSelectedMenuIndx] = useState<number[]>(
		menus.map((_, i) => i),
	);
	const [keywords, setKeywords] = useState<string | undefined>("");
	const [fromYear, setFromYear] = useState<number | undefined>();
	const [endYear, setEndYear] = useState<number | undefined>();

	return (
		<div className="bg-slate-100 shadow-md w-full p-2 my-2 rounded-md text-sm flex flex-col gap-1 transition-[h]">
			<div className="flex flex-row flex-wrap gap-2">
				<div>
					<label htmlFor="fromYear">From: </label>
					<InputGrp className="bg-slate-50 border-slate-50 w-full md:w-fit">
						<>
							<Calendar size={14} />
							<input
								id="fromYear"
								name="fromYear"
								type="number"
								className="px-1 py-1 outline-0 min-w-[4rem]"
								placeholder="From Year"
								min={1900}
								max={new Date().getFullYear()}
								step={1}
								value={+(fromYear || 0)}
								onChange={(e) => setFromYear(+e.target.value)}
							/>
						</>
					</InputGrp>
				</div>

				<div>
					<label htmlFor="endYear">To: </label>
					<InputGrp className="bg-slate-50 border-slate-50 w-full md:w-fit">
						<>
							<Calendar size={14} />
							<input
								id="endYear"
								name="endYear"
								type="number"
								className="px-1 py-1 outline-0 min-w-[4rem]"
								placeholder="End Year"
								min={1900}
								max={new Date().getFullYear()}
								step={1}
								value={+(endYear || 0)}
								onChange={(e) => setEndYear(+e.target.value)}
							/>
						</>
					</InputGrp>
				</div>
			</div>

			<div className="w-full">
				<DropDownMenus
					className="w-full"
					menuClassName="max-w-[100vw] w-[12rem]"
					menuItemClassName=" text-sm"
					menuItemContainerClassname="w-full"
					selectedIndxs={selectedMenuIndx}
					setSelectedIndxs={setSelectedMenuIndx}
					label="Publication Type: "
					menus={menus}
				/>
			</div>

			<div>
				<label htmlFor="keywords">Keywords: </label>
				<InputGrp className="bg-slate-50 border-slate-50 w-full md:w-fit">
					<>
						<Tag size={14} />
						<textarea
							id="Keywords"
							name="keywords"
							placeholder="Keywords: ML,CV"
							className="px-2 py-1 outline-0 w-full text-sm/4"
							value={keywords}
							onChange={(e) => setKeywords(e.target.value)}
						/>
					</>
				</InputGrp>
			</div>

			<div className="flex flex-row gap-4 my-2">
				<button
					className="inline-flex items-center gap-x-2 px-2 py-1 bg-blue-300 rounded-md hover:cursor-pointer"
					onClick={() =>
						setFilters({
							fromYear,
							endYear,
							pubTypes: menus
								.filter((_, i) => selectedMenuIndx.includes(i))
								.map((d) => d.value),
							keywords: keywords
								?.split(",")
								.filter((d) => d.length > 0)
								.join(","), // remove empty value
						})
					}>
					<Check size={18} />
					<span>Apply Filter</span>
				</button>

				<button
					className="inline-flex items-center gap-x-2 px-2 py-1 bg-rose-300 rounded-md hover:cursor-pointer"
					onClick={() => {
						setFilters({
							fromYear: undefined,
							endYear: undefined,
							pubTypes: [],
							keywords: undefined,
						});
						// reset controlled input
						setFromYear(undefined);
						setEndYear(undefined);
						setKeywords(undefined);
						setSelectedMenuIndx([]);
					}}>
					<X size={18} />
					<span>Clear Filter</span>
				</button>
			</div>
		</div>
	);
};
