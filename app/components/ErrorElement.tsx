import { useAsyncError } from "react-router";
import { FetchError } from "~/types/api/FetchError";

const ErrorElement = () => {
	const err = useAsyncError();

	if (err instanceof FetchError) {
		return (
			<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
				<div className="font-bold text-xl text-rose-600">Error</div>
				<div className="font-bold text-4xl text-rose-600 drop-shadow-[0_1.2px_1.2px_rgba(220,38,38,0.8)]">
					{err.getStatusCode()}
				</div>
				<div className="font-semibold text-md text-rose-600">
					{err.getStatusText()}
				</div>
				<div className="text-sm text-rose-600">{err.message}</div>
			</div>
		);
	} else if (err instanceof Error) {
		return (
			<div className="text-center">
				<div className="font-bold">Error </div>
				<div>{err.message}</div>
			</div>
		);
	} else {
		return (
			<div className="text-center">
				<div className="font-bold">Error</div>
			</div>
		);
	}
};

export default ErrorElement;

// const ErrorBoundary = () => {
// 	const err = useAsyncError();
// 	if (err instanceof FetchError) {
// 		return (
// 			<div className="text-center">
// 				<div className="font-bold">Error</div>
// 				<div className="text-lg font-bold">{err.getStatusCode()}</div>
// 				<div className="text-md">{err.getStatusText()}</div>
// 			</div>
// 		);
// 	} else if (err instanceof Error) {
// 		return (
// 			<div className="text-center">
// 				<div className="font-bold">Error </div>
// 				<div>{err.message}</div>
// 			</div>
// 		);
// 	} else {
// 		return (
// 			<div className="text-center">
// 				<div className="font-bold">Error</div>
// 				<div>An unknown error occur</div>
// 			</div>
// 		);
// 	}
// };
