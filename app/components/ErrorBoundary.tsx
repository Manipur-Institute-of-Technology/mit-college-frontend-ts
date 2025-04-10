import type React from "react";

const ErrorBoundary: React.FC<{
	children: React.JSX.Element;
	ErrElement?: React.JSX.Element | ((error: unknown) => React.JSX.Element);
}> = ({ children, ErrElement }) => {
	try {
		// If no error occur, just render the pass child
		return children;
	} catch (error) {
		// If a error boundary elemet is given, used it instead
		if (ErrElement) {
			if (ErrElement instanceof Function) return ErrElement(error);
			else return ErrElement;
		}

		if (
			(import.meta.env.DEV || import.meta.env.VITE_ENV === "dev") &&
			error &&
			error instanceof Error
		) {
			const details = error.message;
			const stack = error.stack;
			return (
				<main className="pt-16 p-4 container mx-auto">
					<h1>{"Oops!"}</h1>
					<p>{details}</p>
					{stack && (
						<pre className="w-full p-4 overflow-x-auto">
							<code>{stack}</code>
						</pre>
					)}
				</main>
			);
		} else if (
			import.meta.env.PROD ||
			import.meta.env.VITE_ENV === "prod"
		) {
			console.log("An error occur", error);
			if (error instanceof Error)
				return (
					<main className="pt-16 p-4 container mx-auto">
						<h1>{"Oops!"}</h1>
						<p>{error.message}</p>
					</main>
				);
			else
				return (
					<main className="pt-16 p-4 container mx-auto">
						<h1>{"Oops!"}</h1>
						<p>{"An unknown Error occur"}</p>
					</main>
				);
		}
	}
};

export default ErrorBoundary;
