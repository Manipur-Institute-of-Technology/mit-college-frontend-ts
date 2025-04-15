// TODO: Add non faculty user to login dropdown, replace button to dropdown for logon page
// TODO: search by keyword to publications page

import { max, scaleBand, scaleLinear } from "d3";
import React, { memo, useMemo } from "react";

// TODO: mod log function to used with loop and bitwise shift operation
const BarChart: React.FC<{
	y: number[];
	x: string[];
	xLabel: string;
	yLabel: string;
	width: number;
	height: number;
	margin?: { top: number; bottom: number; left: number; right: number };
}> = ({
	xLabel,
	yLabel,
	x,
	y,
	width,
	height,
	margin = { top: 8, bottom: 33, left: 33, right: 10 },
}) => {
	if (x.length !== y.length)
		throw new Error(
			`length of x and y should be same: x-len: ${x.length}, y-len: ${y.length}`,
		);

	height -= margin.top + margin.bottom;
	width -= margin.left + margin.right;

	const yScale = useMemo(() => {
		return scaleLinear()
			.domain([0, max(y) || 0])
			.range([height, 0])
			.nice();
	}, [y, height]);

	const xScale = useMemo(() => {
		return scaleBand().domain(x).range([0, width]).padding(0.5);
	}, [x, width]);

	const BottomAxes = memo(() => {
		return (
			<g
				transform={`translate(${margin.left + xScale.bandwidth() / 2}, ${margin.top})`}>
				{xScale.domain().map((tickVal, i) => (
					<g
						key={i}
						transform={`translate(${0 + (xScale(tickVal) || 0)}, ${height})`}>
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

	const LeftAxes = memo(() => (
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			{yScale.ticks(5).map((tickVal, i) => {
				return (
					<g key={i} transform={`translate(0, ${yScale(tickVal)})`}>
						<line
							x1={0}
							x2={width}
							y1={0}
							y2={0}
							className="stroke-slate-300"
						/>
						<text
							className="fill-slate-500 text-[12px]"
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
					<rect
						key={i}
						className="fill-gray-500 hover:cursor-pointer"
						height={height - yScale(yVal)}
						width={xScale.bandwidth()}
						y={yScale(yVal)}
						x={xScale(x[i]) || 0}>
						<title>
							Paper: {x[i]}, Year: {yVal}
						</title>
					</rect>
				);
			})}
		</g>
	));

	const YLabel = memo(() => (
		<g
			transform={`translate(${margin.left / 2}, ${margin.top + height / 2})`}>
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
			transform={`translate(${(margin.left + width) / 2}, ${margin.top + height})`}>
			<text className="fill-slate-500 text-[11px]" dy={"2.5em"}>
				{xLabel}
			</text>
		</g>
	));

	const BarBg = () => (
		<rect
			className="fill-slate-50"
			width={width}
			height={height}
			x={margin.left}
			y={margin.top}
		/>
	);

	return (
		<g>
			<BarBg />
			<LeftAxes />
			<BottomAxes />
			<Bars />
			<YLabel />
			<XLabel />
		</g>
	);
};

export default memo(BarChart);
