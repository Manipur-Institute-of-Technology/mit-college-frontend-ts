import type React from "react";
import "./shared/anim.css";

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
	return (
		<div
			className={
				"w-full h-full border border-gray-300 rounded-md p-2 " +
				className
			}>
			<div className="w-full bg-gray-300 my-1 rounded-md .animate-gradient-skel-bg skel-bg" />
		</div>
	);
};
export default Skeleton;
