import type React from "react";
import "./shared/anim.css";

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
	return (
		<div
			className={
				"w-full h-full bg-gray-300 rounded-md animate-gradient-skel-bg skel-bg border border-slate-300 " +
				className
			}
		/>
		// <div
		// 	className={
		// 		"relative w-full h-full border border-gray-300 rounded-md " + className
		// 	}>
		// </div>
	);
};
export default Skeleton;
