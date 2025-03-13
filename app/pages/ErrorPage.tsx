import type { JSX } from "react";
import { Link } from "react-router";

type ErrorPageProps = {
	status: number;
	statusText: string;
	errorMessage: JSX.Element;
	errorDescription: JSX.Element;
};
export default function Error({
	status,
	statusText,
	errorMessage,
	errorDescription,
}: ErrorPageProps) {
	return (
		<div className="relative w-full min-h-[80vh] text-center text-gray-100 flex items-center">
			<div className="m-auto w-full backdrop-blur-sm">
				<div className="relative m-auto max-w-fit w-[32rem] p-4  shadow-lg rounded-lg">
					<div className="text-[2rem] font-bold ">ERROR</div>
					<div className="text-[8rem] font-bold ">{status}</div>
					<div className="text-[2rem]">{errorMessage}</div>
					<div className="my-2">{errorDescription}</div>
					<div className="my-2 mt-8">
						<Link
							to={"/"}
							className="p-3 font-bold bg-blue-500 rounded-lg text-blue-50 text-lg">
							Go to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
