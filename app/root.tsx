import {
	isRouteErrorResponse,
	Link,
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
import NotFound from "./pages1/NotFound";
import { getPublicNavContent } from "./mock/services/navbar";
import { useEffect, useState } from "react";
import { type FooterData, type NavbarData } from "./types/api/resData.type";
import { getFooterData } from "./mock/services/fetchMockData";
import ErrorPage from "./pages/(common)/error";

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
	// Can be override in another page
	// { rel: "icon", href: "/Manipur_University_Logo.png" },
	{ rel: "icon", href: "/favicon.ico" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
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

// Root Layout
export default function App() {
	return <Outlet />;
}

export function HydrateFallback() {
	return (
		<div className="fixed bg-slate-200/50 backdrop-blur-md w-full h-full">
			<div className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-mono w-fit text-center">
				<div className="relative w-[14rem] h-[14rem] mx-auto">
					<div className="absolute w-[14rem] h-[14rem] rounded-full p-2 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[conic-gradient(from_0deg,transparent_0%_25%,theme(colors.rose.600)_25%_50%,transparent_50%_100%)] animate-[spin_2s_linear_infinite]" />
					<div className="absolute w-[14rem] h-[14rem] rounded-full p-2 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[conic-gradient(from_0deg,transparent_0%_25%,theme(colors.rose.950)_25%_50%,transparent_50%_100%)] animate-[spin_2s_linear_infinite] [animation-direction:reverse]" />
					<div className="absolute w-[14rem] h-[14rem] rounded-full p-2 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[conic-gradient(from_0deg,transparent_0%_25%,theme(colors.yellow.400)_25%_50%,transparent_50%_100%)] animate-[spin_3s_linear_infinite]" />
					<img
						src="/Manipur_University_Logo.png"
						alt="MU Logo"
						className="w-[13rem] h-[13rem] max-w-full max-h-full bg-white rounded-full z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
					/>
				</div>
				<div className="text-sm my-2">
					Welcome to MIT College <br /> Please wait while we load the
					website...
				</div>
			</div>
		</div>
	);
}

// TODO: Make this a generic error displaying page, which catch all error including non 404
// TODO: add catch all route for cms prefix route
// TODO: Create a conditional render on public layout routes with props of outlet or children components | outlet for normal rendering, children for error page rendering
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const [navData, setNavData] = useState<NavbarData>();
	const [footerData, setFooterData] = useState<FooterData>();
	const backgroundImageUrl = "/404_bg.jpg";
	useEffect(() => {
		// TODO: Handle error fetching data
		try {
			(async () => setNavData(await getPublicNavContent()))();
			(async () => setFooterData(await getFooterData()))();
		} catch (err) {
			console.error(err);
			// TODO: catch err properly
			throw err;
		}
	}, []);

	if (isRouteErrorResponse(error) && error.status === 404) {
		return (
			<>
				{navData && <Navbar navigation={navData} />}
				<main>
					<ErrorPage
						errorCode={error.status}
						mainMessage={error.statusText}
						subMessage={
							<>
								It may have moved or may no longer exist. If you
								reached this error from a link on our site,
								please leave us{" "}
								<Link to={"github.com"}> feedback</Link>, so we
								can fix the problem. Regardless, let's help you
								get where you want to go.
							</>
						}
					/>
				</main>
				{/* <main
					className="bg-slate-800  bg-blend-overlay bg-fixed bg-center bg-no-repeat bg-cover"
					style={{ backgroundImage: `url('${backgroundImageUrl}')` }}>
					<div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 border border-black min-h-[100vh]">
						<NotFound />
					</div>
				</main> */}
				{footerData && <Footer footerData={footerData} />}
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
