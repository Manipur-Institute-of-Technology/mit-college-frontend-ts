import React from "react";
import "../shared/anim.css";

function BottomBarSkel() {
	return (
		<div className=" bg-slate-950">
			<div className="text-sm text-slate-300 w-full  py-2 flex flex-wrap flex-col-reverse md:flex-row justify-between items-center  mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center md:text-left">
					Copyright &#169; {new Date().getFullYear()} @ Manipur Institute of
					Technology <br />
					All Rights Reserved
				</div>
				<div className="space-y-1 text-center md:text-right ">
					<div>Follow us on:</div>
					<div className="flex justify-evenly md:justify-start items-center space-x-2 py-1">
						{Array.from({ length: 3 }, (_, i) => (
							<div
								key={i}
								className="rounded-full w-5 h-5  skel-bg animate-gradient-skel-bg"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

const Footer = () => {
	return (
		<>
			<div className="w-full bg-slate-900 text-slate-100 py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center md:items-stretch md:text-left text-center flex-wrap flex-col md:flex-row gap-y-2 gap-x-4">
					<div className="relative w-full md:w-fit py-2 md:self-center lg:border-r lg:border-r-gray-50 lg:pr-2">
						<div className="w-full">
							<div className="w-[100px] h-[100px] rounded-full block m-auto bg-gray-300 my-1 skel-bg animate-gradient-skel-bg" />
						</div>
						<div className="py-1 text-sm text-center">
							<div className="text-slate-50 font-bold text-lg">
								Manipur Institute of Technology
							</div>
							<div>
								<p className="text-slate-100">
									(A Constitute College of Manipur University)
								</p>
								<p className="text-slate-200">
									Takyelpat, Imphal - 795001, Manipur, India
								</p>
							</div>
						</div>
					</div>

					{/* <div className="w-[100px] h-[100px] rounded-full block m-auto bg-gray-300 my-1 skel-bg animate-gradient-skel-bg" /> */}
					{Array.from({ length: 3 }, (_, i) => {
						return (
							<div key={i}>
								<div className="w-50 max-w-[100vw] md:mx-0 mx-auto h-5 rounded-md bg-gray-300 my-1 skel-bg animate-gradient-skel-bg" />
								{Array.from({ length: 5 }, (_, j) => (
									<div
										key={j}
										className="w-30 max-w-[100vw] md:mx-0 mx-auto h-3 rounded-sm bg-gray-300 my-1 skel-bg animate-gradient-skel-bg"
									/>
								))}
							</div>
						);
					})}
					<div className="w-full h-[8rem] bg-slate-700 rounded-md skel-bg animate-gradient-skel-bg" />
				</div>
			</div>
			<BottomBarSkel />
			<div className="w-full h-2 bg-yellow-200 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 animate-gradient-bg"></div>
		</>
	);
};

export default React.memo(Footer);
