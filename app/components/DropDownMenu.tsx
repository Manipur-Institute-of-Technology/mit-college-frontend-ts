// TODO: Refactor this compoenent, remove the avatar from the menu lists and pass props similar to DropDownMenus ComponentProps
// TODO: Refactor this components to used as similar to DropDownMenus component
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import React, { memo, useState } from "react";

const DropDownMenu: React.FC<{
	label: string;
	menus: { name: string; value: string }[];
	selectedIndx: number;
	setSelectedIndx: React.Dispatch<React.SetStateAction<number>>;
	menuItemClassName?: string;
	menuClassName?: string;
	className?: string;
}> = ({
	selectedIndx,
	setSelectedIndx,
	label,
	menus,
	className = "",
	menuItemClassName = "",
	menuClassName = "",
}) => {
	const [openDropDown, setOpenDropDown] = useState(false);

	return (
		<div className={className}>
			<div className="inline-flex flex-row items-center gap-x-2">
				{label && label.length !== 0 && (
					<label className="block text-sm/6 font-medium text-gray-800 capitalize">
						{label}
					</label>
				)}
				<div className="relative">
					<div
						onClick={() => setOpenDropDown((s) => !s)}
						className="w-fit min-w-[4rem] rounded-md bg-white text-gray-900 outline-1 outline-slate-400 sm:text-sm/6">
						<span
							className={`inline-flex items-center justify-between w-full px-1 ${menuClassName}`}>
							<span className="block truncate w-full capitalize">
								{selectedIndx < 0 ? "Select" : menus[selectedIndx].name}
							</span>
							<ChevronUpDownIcon
								aria-hidden="true"
								className="size-5 text-gray-500 sm:size-4 w-fit"
							/>
						</span>
					</div>

					<div
						className={`${!openDropDown && "opacity-0 h-[0]"} transition-[height] absolute z-10 mt-1 mr-0 max-h-56 w-fit min-w-[4rem] overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm`}>
						{menus.map((menu, i) => (
							<div
								key={i}
								onClick={() =>
									setSelectedIndx((s) => {
										if (s === i) return -1;
										return i;
									})
								}
								className={`relative cursor-default p-2 text-gray-900 select-none  data-focus:outline-hidden max-w-[18rem] border-b border-b-slate-300 hover:bg-slate-100 ${selectedIndx === i ? "bg-slate-200 font-semibold" : "bg-slate-50"} text-sm ${menuItemClassName} text-nowrap text-left capitalize`}>
								{menu.name}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(DropDownMenu);
