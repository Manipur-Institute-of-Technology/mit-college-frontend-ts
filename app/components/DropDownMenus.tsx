import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "lucide-react";
import { memo, useState } from "react";

/**
 * A dropdown menu component that allows users to select multiple options from a list.
 *
 * @param {string} label - The label for the dropdown menu.
 * @param {Array<{ name: string; value: string }>} menus - An array of menu items, each with a name and a value.
 * @param {number[]} selectedIndxs - An array of indices representing the currently selected menu items.
 * @param {React.Dispatch<React.SetStateAction<number[]>>} setSelectedIndxs - A function to update the selected indices.
 *
 * @returns {React.ReactElement} A dropdown menu component.
 *
 * @example
 * ```tsx
 * <DropDownMenus
 *   label="Options"
 *   menus={[
 *     { name: "Option 1", value: "1" },
 *     { name: "Option 2", value: "2" },
 *     { name: "Option 3", value: "3" },
 *   ]}
 *   selectedIndxs={[0, 2]}
 *   setSelectedIndxs={setSelectedIndxs}
 * />
 * ```
 */
const DropDownMenus: React.FC<{
	label: string;
	menus: { name: string; value: string }[];
	selectedIndxs: number[];
	setSelectedIndxs: React.Dispatch<React.SetStateAction<number[]>>;
	includeAllSelection?: boolean;
	menuItemClassName?: string;
	menuItemContainerClassname?: string;
	menuClassName?: string;
	className?: string;
}> = ({
	selectedIndxs,
	setSelectedIndxs,
	label,
	menus,
	includeAllSelection = true,
	menuClassName = "",
	menuItemClassName = "",
	menuItemContainerClassname = "",
	className = "",
}) => {
	const [openDropDown, setOpenDropDown] = useState(false);
	return (
		<div className="hover:cursor-pointer">
			<div
				className={
					"inline-flex flex-wrap flex-row items-center gap-x-2 " +
					className
				}>
				<label
					className="block text-sm/6 font-medium text-gray-900 capitalize text-nowrap"
					onClick={() => setOpenDropDown(true)}>
					{label}
				</label>
				<div className="relative">
					<div
						onClick={() => setOpenDropDown((s) => !s)}
						className={
							"grid w-[8rem] cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 " +
							menuClassName
						}>
						<span
							className={
								"col-start-1 row-start-1 flex items-center gap-3 pr-6 "
							}>
							<span className="block truncate">
								{selectedIndxs.length === 0
									? "Select..."
									: selectedIndxs.length < 3
										? selectedIndxs.reduce(
												(acc, d, i) =>
													`${acc}${i !== 0 ? "," : ""} ${menus[d].name}`,
												"",
											)
										: `${selectedIndxs.length} selected`}
							</span>
						</span>
						<ChevronUpDownIcon
							aria-hidden="true"
							className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
						/>
					</div>

					<div
						className={
							`${!openDropDown && "opacity-0 h-[0]"} transition-[height] absolute z-10 mt-1 mr-0 max-h-56 w-[8rem] overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm ` +
							menuItemContainerClassname
						}>
						{includeAllSelection && (
							<div
								onClick={() =>
									setSelectedIndxs((s) => {
										// TODO: Toggle all selection
										if (s.length === menus.length)
											return [];
										else return menus.map((_, i) => i);
									})
								}
								className={`group  relative cursor-default p-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden max-w-[18rem] border-b border-b-slate-300 hover:bg-slate-100 ${selectedIndxs.length === menus.length && "bg-slate-200"}`}>
								<div
									className={`inline-flex items-center ${selectedIndxs.length === menus.length ? "justify-between" : "justify-start"} w-full`}>
									<div
										className={`${selectedIndxs.length === menus.length ? "font-semibold" : "font-normal"}`}>
										All
									</div>
									{selectedIndxs.length === menus.length && (
										<CheckIcon
											aria-hidden="true"
											className="size-5"
										/>
									)}
								</div>
							</div>
						)}
						{menus.map((menu, i) => (
							<div
								key={i}
								onClick={() =>
									setSelectedIndxs((s) => {
										if (s.includes(i))
											return s.filter((d) => d !== i);
										return [...s, i];
									})
								}
								className={`group relative cursor-default p-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden max-w-[18rem] border-b border-b-slate-300 hover:bg-slate-100 ${selectedIndxs.includes(i) && "bg-slate-200 "} ${menuItemClassName}`}>
								<div
									className={`inline-flex items-center ${selectedIndxs.includes(i) ? "justify-between" : "justify-start"} w-full`}>
									<div
										className={`text-sm ${selectedIndxs.includes(i) ? "font-semibold" : "font-normal"}`}>
										{menu.name}
									</div>
									{selectedIndxs.includes(i) && (
										<CheckIcon
											aria-hidden="true"
											className="size-5"
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(DropDownMenus);
