import { isRouteErrorResponse, useAsyncError } from "react-router";
import { FetchError } from "~/types/api/FetchError";

const ErrorElementAsync = () => {
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
				{import.meta.env.VITE_ENV === "dev" && (
					<div className="text-sm w-full flex justify-center mt-6">
						<pre className="w-fit text-left overflow-x-auto">
							{err.stack}
						</pre>
					</div>
				)}
			</div>
		);
	} else if (err instanceof Error) {
		return (
			<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
				<div className="font-bold text-xl text-rose-600">Error</div>
				<div className="text-sm text-rose-600">{err.message}</div>
				{import.meta.env.VITE_ENV === "dev" && (
					<div className="text-sm w-full flex justify-center mt-6">
						<pre className="w-fit text-left overflow-x-auto">
							{err.stack}
						</pre>
					</div>
				)}
			</div>
		);
	} else if (isRouteErrorResponse(err)) {
		// TODO: error component page
		return <>Error1: {JSON.stringify(err)}</>;
	} else if (
		err instanceof Object &&
		(Object.keys(err).includes("error") ||
			Object.keys(err).includes("data"))
	) {
		//  catch error throw with data
		return <>Error</>;
	} else {
		return (
			<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
				<div className="font-bold text-xl text-rose-600">Error</div>
				<div className="font-bold text-4xl text-rose-600 drop-shadow-[0_1.2px_1.2px_rgba(220,38,38,0.8)]">
					{"An unknown error occur!"}
				</div>
				{import.meta.env.VITE_ENV === "dev" && (
					<div className="text-sm w-full flex justify-center mt-6">
						<pre className="w-fit text-left overflow-x-auto">
							{JSON.stringify(err)}
						</pre>
					</div>
				)}
			</div>
		);
	}
};

export default ErrorElementAsync;

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
