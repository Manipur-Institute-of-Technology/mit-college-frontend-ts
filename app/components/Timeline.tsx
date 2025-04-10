import { memo } from "react";

const Timeline: React.FC<{ children: React.JSX.Element[] }> = ({
	children,
}) => {
	return (
		<>
			{children.map((d, i) => (
				<div
					className="group/timelineItem relative py-3 pl-8 border-b border-dashed border-b-slate-400 rounded-md hover:bg-slate-100 transition-all"
					key={i}>
					<div className="mb-2 flex flex-col items-start before:z-[9] after:z-[9] before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3.5 before:self-start before:bg-slate-300 before:px-px after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-3.5 after:rounded-full after:border-4 after:border-slate-50 after:bg-slate-600 after:ring-1 hover:after:ring-blue-700 group-hover/timelineItem:after:bg-blue-700 group-last/timelineItem:before:hidden">
						{d}
					</div>
				</div>
			))}
		</>
	);
};

export default memo(Timeline);
