import { max, scaleBand, scaleLinear } from "d3";
import React, { memo, useMemo } from "react";

// TODO: addd table bar chart togggler
// TODO: used stack bar chart instead, displaying bar for each paper type published in a year
const WideBarChart: React.FC<{
	y: number[];
	x: string[];
	xLabel: string;
	yLabel: string;
	containerWidth: number;
	containerHeight: number;
	margin?: { top: number; bottom: number; left: number; right: number };
	setSelectedBarIndx?: React.Dispatch<React.SetStateAction<number>>;
}> = ({
	xLabel,
	yLabel,
	x,
	y,
	containerWidth,
	containerHeight,
	margin = { top: 20, bottom: 40, left: 40, right: 40 },
	setSelectedBarIndx,
}) => {
	if (x.length !== y.length)
		throw new Error(
			`length of x and y should be same: x-len: ${x.length}, y-len: ${y.length}`,
		);

	let width = y.length * 100;
	containerHeight -= margin.top + margin.bottom;
	width -= margin.left + margin.right;

	const yScale = useMemo(() => {
		return scaleLinear()
			.domain([0, max(y) || 0])
			.range([containerHeight, 0])
			.nice();
	}, [y, containerHeight]);

	const xScale = useMemo(() => {
		return scaleBand()
			.domain(x)
			.range([0, width])
			.paddingInner(0.3)
			.paddingOuter(0.5);
	}, [x, width]);

	const BottomAxes = memo(() => {
		return (
			<g
				transform={`translate(${margin.left + xScale.bandwidth() / 2}, ${margin.top})`}>
				{xScale.domain().map((tickVal, i) => (
					<g
						key={i}
						transform={`translate(${0 + (xScale(tickVal) || 0)}, ${containerHeight})`}>
						<line
							y1={0}
							y2={6}
							x1={0}
							x2={0}
							className="stroke-slate-500"
						/>
						<text
							className="text-[11px] fill-slate-600"
							dy={"1.4em"}
							style={{
								textAnchor: "middle",
							}}>
							{tickVal}
						</text>
					</g>
				))}
			</g>
		);
	});

	const HorizontalTicks = () => {
		return (
			<g transform={`translate(${margin.left}, ${margin.top})`}>
				{yScale.ticks(5).map((tickVal, i) => {
					return (
						<g
							key={i}
							transform={`translate(0, ${yScale(tickVal)})`}>
							<line
								x1={0}
								x2={width}
								y1={0}
								y2={0}
								className="stroke-slate-300"
							/>
						</g>
					);
				})}
			</g>
		);
	};

	const LeftAxes = memo(() => (
		<g transform={`translate(${margin.left - 10}, ${margin.top})`}>
			{yScale.ticks(5).map((tickVal, i) => {
				return (
					<g key={i} transform={`translate(0, ${yScale(tickVal)})`}>
						<text
							className="fill-slate-500 text-sm"
							dx={"-0.4em"}
							dy={".5em"}
							textAnchor="end">
							{tickVal}
						</text>
					</g>
				);
			})}
		</g>
	));

	// TODO: For large view of chart add click handler on each bar and filter display the paper published in each year
	// TODO: Add keyword lists to publication list items
	// Crunchin  the latest data for you
	const Bars = memo(() => (
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			{y.map((yVal, i) => {
				return (
					<g>
						<rect
							key={i}
							className="fill-gray-600 hover:fill-slate-400 hover:cursor-pointer"
							height={containerHeight - yScale(yVal)}
							width={xScale.bandwidth()}
							y={yScale(yVal)}
							x={xScale(x[i]) || 0}
							onClick={() => {
								if (setSelectedBarIndx) setSelectedBarIndx(i);
							}}>
							<title>
								Paper: {x[i]}, Year: {yVal}
							</title>
						</rect>
						<text
							transform={`translate(${(xScale(x[i]) || 0) + xScale.bandwidth() / 2}, ${yScale(yVal)})`}
							textAnchor="middle"
							dy={"-0.2em"}
							className="text-sm fill-slate-700">
							{yVal}
						</text>
					</g>
				);
			})}
		</g>
	));

	const ScrollbarStyle: React.CSSProperties = {
		scrollbarWidth: "thin",
		scrollbarColor: "#cbd5e1 #f1f5f9",
	};

	const YLabel = memo(() => (
		<g
			transform={`translate(${margin.left / 2}, ${margin.top + containerHeight / 2})`}>
			<text
				transform="rotate(-90)"
				dy={"-0.5em"}
				textAnchor="middle"
				className="fill-slate-500 text-[11px]">
				{yLabel}
			</text>
		</g>
	));
	const XLabel = memo(() => (
		<g
			transform={`translate(${(margin.left + width) / 2}, ${margin.top + containerHeight})`}>
			<text className="fill-slate-500 text-[11px]" dy={"2.5em"}>
				{xLabel}
			</text>
		</g>
	));

	return (
		<div
			className="grid grid-cols-12"
			style={{
				width: containerWidth,
				maxWidth: "100%",
			}}>
			<div
				className={`col-span-11 max-w-full overflow-x-auto text-right`}
				style={{ ...ScrollbarStyle }}>
				<svg
					className="inline-block"
					height={containerHeight + margin.top + margin.bottom}
					width={margin.left + margin.right + width}>
					<HorizontalTicks />
					<rect
						rx={8}
						ry={8}
						height={containerHeight}
						width={width}
						transform={`translate(${margin.left}, ${margin.top})`}
						className="fill-sky-100/50"
					/>
					<Bars />
					<BottomAxes />
					<XLabel />
					<YLabel />
				</svg>
			</div>
			<div className="col-span-1 max-w-full">
				<svg
					width={(containerWidth * 1) / 12}
					height={containerHeight + margin.top + margin.bottom}>
					<LeftAxes />
					<g
						transform={`translate(${(containerWidth * 1) / 12 - margin.right / 4}, ${margin.top + containerHeight / 2})`}>
						<text
							transform="rotate(-90)"
							dy={"-0.5em"}
							textAnchor="middle"
							className="fill-slate-500 text-[11px] hidden md:block">
							{yLabel}
						</text>
					</g>
				</svg>
			</div>
		</div>
	);
};

export default memo(WideBarChart);
