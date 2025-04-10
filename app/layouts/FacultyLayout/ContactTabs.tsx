import { useState } from "react";

export const ContactTabs: React.FC<{
	tabs: ((active: boolean) => React.JSX.Element)[];
	children: React.JSX.Element[];
	activeStyle?: string;
	inActivStyle?: string;
}> = ({
	tabs,
	children,
	activeStyle = "bg-slate-600",
	inActivStyle = "bg-slate-500",
}) => {
	const [activeTabIndx, setActiveTabIndx] = useState<number | null>(null);

	return (
		<div className="w-full md:hidden">
			<div className="flex flex-row flex-nowrap items-center justify-stretch w-full">
				{tabs.map((t, i) => (
					<div
						key={i}
						className={
							"hover:cursor-pointer shadow-xl p-1 w-full inline-flex items-center justify-center " +
							(i === tabs.length - 1
								? ""
								: " border-r border-r-slate-300 ") +
							(i === activeTabIndx ? activeStyle : inActivStyle)
						}
						onClick={() =>
							setActiveTabIndx((s) => (s === i ? null : i))
						}>
						{t(i === activeTabIndx)}
					</div>
				))}
			</div>
			<div
				className={`w-full relative bg-slate-50 px-4 ${activeTabIndx === null ? "h-0" : "py-2 h-fit"}`}>
				{/* {activeTabIndx !== null ? children[activeTabIndx] : <></>} */}
				{activeTabIndx !== null &&
					children.map((d, i) => (
						<div
							key={i}
							className={`w-full top-0 ${i === activeTabIndx ? "h-fit" : "h-0 scale-y-0"} origin-top`}>
							{d}
						</div>
					))}
			</div>
		</div>
	);
};
