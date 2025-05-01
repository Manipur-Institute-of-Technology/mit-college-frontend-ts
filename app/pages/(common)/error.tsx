import type React from "react";
import { Link } from "react-router";

type ErrorProps = {
	errorCode: number;
	mainMessage: string | React.JSX.Element;
	subMessage: string | React.JSX.Element;
};

const Error: React.FC<ErrorProps> = ({
	errorCode,
	mainMessage,
	subMessage,
}) => {
	return (
		<div className="relative w-full min-h-[100vh] text-center text-gray-100 flex items-center bg-slate-800 bg-[url('/404_bg.jpg')] bg-blend-overlay bg-fixed bg-center bg-no-repeat bg-cover">
			<div className="m-auto w-full backdrop-blur-sm mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0">
				<div className="relative m-auto max-w-fit w-[32rem] p-4  shadow-lg rounded-lg">
					<div className="text-[2rem] font-bold ">ERROR</div>
					<div className="text-[8rem] font-bold ">{errorCode}</div>
					<div className="text-[2rem]">{mainMessage}</div>
					<div className="my-2">{subMessage}</div>
					<div className="flex gap-2 flex-col md:flex-row flex-wrap my-2 mt-8 items-center justify-center">
						<Link
							to={"/"}
							className="p-3 font-bold bg-blue-500 rounded-lg text-blue-50 text-lg">
							Go to Home
						</Link>
						<Link
							to={"http://github.com"}
							className="p-3 font-bold bg-blue-500 rounded-lg text-blue-50 text-lg">
							Report Issue
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Error;
