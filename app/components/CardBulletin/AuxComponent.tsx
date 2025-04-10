import React from "react";

export const EmptyList: React.FC<{ mssg: string; detail: string }> = ({
	mssg,
	detail,
}) => {
	return (
		<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
			<div className="text-md font-bold text-gray-600 drop-shadow-[0_1.2px_1.2px_rgba(100,100,100,0.8)]">
				{mssg}
			</div>
			<div className="text-sm text-gray-400">{detail}</div>
		</div>
	);
};

export const Skel = () => {
	return (
		<div className="w-full max-h-[80vh] md:h-[50vh] border border-gray-300 rounded-md p-2 overflow-y-hidden">
			{Array.from({ length: 7 }, (_, i) => (
				<div
					key={i}
					className="w-full h-[4rem] bg-gray-300 my-1 rounded-md animate-bg"
					style={{
						backgroundImage:
							"linear-gradient(90deg, #d1d5dc 0%, #aaa 50%, #d1d5dc 100%)",
					}}
				/>
			))}
		</div>
	);
};
