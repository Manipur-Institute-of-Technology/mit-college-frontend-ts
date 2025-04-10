const InputGrp: React.FC<{
	children: React.JSX.Element;
	className?: string;
}> = ({ children, className }) => {
	return (
		<div
			className={`inline-flex items-center border border-slate-500 rounded-md px-1 ${className || ""}`}>
			{children}
		</div>
	);
};
export default InputGrp;
