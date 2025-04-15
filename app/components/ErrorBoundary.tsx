import type React from "react";
import { isRouteErrorResponse } from "react-router";
import { FetchError } from "~/types/api/FetchError";

// const ErrorBoundary: React.FC<{
// 	children: React.JSX.Element;
// 	ErrElement?: React.JSX.Element | ((error: unknown) => React.JSX.Element);
// }> = ({ children, ErrElement }) => {
// 	try {
// 		// If no error occur, just render the pass child
// 		return children;
// 	} catch (error) {
// 		console.log("catching error on error boundary", error);
// 		// If a error boundary elemet is given, used it instead
// 		if (ErrElement) {
// 			if (ErrElement instanceof Function) return ErrElement(error);
// 			else return ErrElement;
// 		}

// 		if (
// 			(import.meta.env.DEV || import.meta.env.VITE_ENV === "dev") &&
// 			error &&
// 			error instanceof Error
// 		) {
// 			const details = error.message;
// 			const stack = error.stack;
// 			return (
// 				<main className="pt-16 p-4 container mx-auto">
// 					<h1>{"Oops!"}</h1>
// 					<p>{details}</p>
// 					{stack && (
// 						<pre className="w-full p-4 overflow-x-auto">
// 							<code>{stack}</code>
// 						</pre>
// 					)}
// 				</main>
// 			);
// 		} else if (import.meta.env.PROD || import.meta.env.VITE_ENV === "prod") {
// 			console.log("An error occur", error);
// 			if (error instanceof Error)
// 				return (
// 					<main className="pt-16 p-4 container mx-auto">
// 						<h1>{"Oops!"}</h1>
// 						<p>{error.message}</p>
// 					</main>
// 				);
// 			else
// 				return (
// 					<main className="pt-16 p-4 container mx-auto">
// 						<h1>{"Oops!"}</h1>
// 						<p>{"An unknown Error occur"}</p>
// 					</main>
// 				);
// 		} else {
// 			return (
// 				<main className="pt-16 p-4 container mx-auto">
// 					<h1>{"Oops!"}</h1>
// 					<p>{"An unknown Error occur"}</p>
// 				</main>
// 			);
// 		}
// 	}
// };

const ErrorComponent: React.FC<{ error: unknown; detail?: boolean }> = ({
	error,
	detail = false,
}) => {
	if (error instanceof FetchError) {
		return (
			<div className="text-center w-full h-[40vh] md:h-[40vh] border border-gray-400 bg-gray-50 rounded-md p-2 overflow-y-hidden flex flex-col justify-center">
				<div className="font-bold text-xl text-rose-600">Error</div>
				<div className="font-bold text-4xl text-rose-600 drop-shadow-[0_1.2px_1.2px_rgba(220,38,38,0.8)]">
					{error.getStatusCode()}
				</div>
				<div className="font-semibold text-md text-rose-600">
					{error.getStatusText()}
				</div>
				<div className="text-sm text-rose-600">{error.message}</div>
				{detail && error.stack && (
					<div className="text-sm overflow-x-auto w-full flex justify-center mt-6">
						<pre className="w-fit text-left">{error.stack}</pre>
					</div>
				)}
			</div>
		);
	} else if (isRouteErrorResponse(error)) {
		// Note: RouteErrorResponse = error that is created when there is an error related to routing like 404, response throw from action, loader
		// TODO: Implement err boundary page
		return <>Error</>;
	} else if (
		error instanceof Object &&
		Object.keys(error).includes("error")
	) {
		const err = (error as any).error;
		if (err) {
			return (
				<main className="pt-16 p-4 container mx-auto font-mono">
					<h1>{"Error"}</h1>
					<p> {err?.message || "An error occurred"}</p>
					{detail && err?.stack && (
						<div className="text-sm overflow-x-auto w-full flex justify-center mt-6">
							<pre className="w-fit text-left">{err?.stack}</pre>
						</div>
					)}
				</main>
			);
		}
	}
	return (
		<main className="pt-16 p-4 container mx-auto font-mono">
			<h1>{"Oops!"}</h1>
			<p>{"An unknown error occurred"}</p>
			{detail && Object(error)?.stack && (
				<div className="text-sm overflow-x-auto w-full flex justify-center mt-6">
					<pre className="w-fit text-left">
						{Object(error)?.stack}
					</pre>
				</div>
			)}
		</main>
	);
};

const ErrorBoundaryComponent: React.FC<{ error: unknown }> = ({ error }) => {
	if (import.meta.env.DEV || import.meta.env.VITE_ENV === "dev") {
		// Error message in dev environment
		return <ErrorComponent error={error} detail={true} />;
	} else if (import.meta.env.PROD || import.meta.env.VITE_ENV === "prod") {
		// Error message in production environment
		return <ErrorComponent error={error} detail={false} />;
	} else {
		// Unknown environment, used error message similar to prod environment
		return <ErrorComponent error={error} detail={false} />;
	}
};

export default ErrorBoundaryComponent;
