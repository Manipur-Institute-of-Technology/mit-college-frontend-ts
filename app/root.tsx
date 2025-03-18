import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navbar from "./components/Navbar/PublicContentNav";
import Footer from "./components/Footer/PublicFooter";
import NotFound from "./pages/NotFound";
import { getPublicNavContent } from "./mock/services/navbar";
import { useEffect, useState } from "react";
import type { NavbarData } from "./types/api/navbar";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function HydrateFallback() {
	return (
		<div className="fixed bg-slate-700/50 backdrop-blur-md w-[100vw] h-[100vh]">
			<div className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-mono w-fit">
				This is some hydration...
			</div>
		</div>
	);
}

// TODO: Make this a generic error displaying page, which catch all error including non 404
// TODO: add catch all route for cms prefix route
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const [navData, setNavData] = useState<NavbarData>();
	const backgroundImageUrl = "/404_bg.jpg";
	useEffect(() => {
		(async () => setNavData(await getPublicNavContent()))();
	}, []);

	if (isRouteErrorResponse(error) && error.status === 404) {
		return (
			<>
				{navData && <Navbar navigation={navData} />}
				<main
					className="bg-slate-800  bg-blend-overlay bg-fixed bg-center bg-no-repeat bg-cover"
					style={{ backgroundImage: `url('${backgroundImageUrl}')` }}>
					<div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 border border-black min-h-[100vh]">
						<NotFound />
					</div>
				</main>
				<Footer />
			</>
		);
	} else if (import.meta.env.DEV && error && error instanceof Error) {
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
	} else {
		console.log("Non 404 error occur: ", error);
	}
}

export function _ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
