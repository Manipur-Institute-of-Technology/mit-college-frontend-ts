import { Await, Link, Outlet, useAsyncError, useLocation } from "react-router";
import Navbar from "../components/Navbar/PublicContentNav";
import Footer from "../components/Footer/PublicFooter";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "../components/ImageCarousel/ImageCarrousel";
import type { Route } from "./+types/PublicContentLayout";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Suspense, useEffect, useState } from "react";

import "./background.css";
import { getPublicNavContent } from "~/mock/services/navbar";
import { FetchError } from "~/types/api/FetchError";
import { getFooterData } from "~/mock/services/fetchMockData";
import PublicFooterSkel from "~/components/Footer/PublicFooterSkel";
import CustomRoutesProvider from "~/context/CustomRoutesProvider";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import generateService from "~/service/Service";
import ErrorPage from "~/pages/(common)/error";

export const links: Route.LinksFunction = () => {
	return [{ rel: "icon", href: "./Manipur_University_Logo.png" }];
};

export const clientLoader = async ({}: Route.ClientLoaderArgs) => {
	// TODO: fetch carousel data from api return route lists
	// TODO: Fetch footer data here
	const imgCarouselData = generateService().getImageCarouselContent();
	const navData = generateService().getPublicNavContent();
	const footerData = generateService().getFooterData();
	return { imgCarouselData, navData, footerData } as const;
};

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
	const loc = useLocation();

	const routeUrl = import.meta.env.VITE_ROUTE_API_URL;
	const [online, setOnline] = useState<boolean>(true);

	useEffect(() => {
		window.addEventListener("online", () => {
			setOnline(navigator.onLine);
		});
		return () => window.removeEventListener("online", () => {});
	}, []);

	return (
		<CustomRoutesProvider routeSrcUrl={routeUrl!}>
			<>
				{!online && (
					<div className="w-full bg-rose-200 text-center">
						Offline!
					</div>
				)}
				{loaderData && (
					<Suspense fallback={<>Loading navbar...</>}>
						<Await
							resolve={loaderData.navData}
							// errorElement={<>Navbar Error</>}
							errorElement={
								<Navbar
									navigation={{
										logoURL: "",
										navbarTitle: "",
										menus: [],
									}}
								/>
							}>
							{(val) => <Navbar navigation={val} />}
						</Await>
					</Suspense>
				)}
				<main className="pub-cont-layout-bg">
					{/* {loc.pathname === "/" && (
					<Suspense fallback={<ImageCarouselSkeleton />}>
						<Await
							resolve={loaderData.imgCarouselData}
							errorElement={<ImageCarouselErrorElement />}>
							{(val) => {
								return val.length > 0 ? <ImageCarousel data={val} /> : null;
							}}
						</Await>
					</Suspense>
				)} */}

					{/* <div className="mx-auto max-w-7xl px-0 py-2 md:py-4 lg:px-0 min-h-[100vh] relative"> */}
					<div className="mx-auto w-full min-h-[100vh] relative">
						{online ? (
							<Outlet />
						) : (
							<ErrorPage
								errorCode={503}
								mainMessage="Network Disconnected"
								subMessage="It seems you are offline. Please reconnect to the internet and try again."
							/>
						)}
					</div>
				</main>
				{loaderData && (
					<Suspense fallback={<PublicFooterSkel />}>
						<Await
							resolve={loaderData.footerData}
							errorElement={<>Footer Error</>}>
							{(val) => <Footer footerData={val} />}
						</Await>
					</Suspense>
				)}
			</>
		</CustomRoutesProvider>
	);
}

const ImageCarouselErrorElement = () => {
	const err = useAsyncError();
	if (err instanceof FetchError) {
		return (
			<div className="text-center">
				<div className="font-bold">Error</div>
				<div className="text-lg font-bold">{err.getStatusCode()}</div>
				<div className="text-md">{err.getStatusText()}</div>
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
				<div>An unknown error occur</div>
			</div>
		);
	}
};

export const ErrorBoundary = (error: Route.ErrorBoundaryProps) => {
	return <ErrorBoundaryComponent error={error} />;
};
