const SmallPie: React.FC<{ size: number; percent?: number }> = ({
	size,
	percent = 0.8,
}) => {
	const radius = size / 2;
	const startAngle = 0;
	const endAngle = percent * 2 * Math.PI;
	const x1 = radius + radius * Math.cos(startAngle);
	const y1 = radius + radius * Math.sin(startAngle);
	const x2 = radius + radius * Math.cos(endAngle);
	const y2 = radius + radius * Math.sin(endAngle);
	const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			<path
				d={`M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
				className="fill-slate-600"
			/>
			<circle cx={size / 2} cy={size / 2} r={size / 4} fill="white" />
		</svg>
	);
};

export default SmallPie;
