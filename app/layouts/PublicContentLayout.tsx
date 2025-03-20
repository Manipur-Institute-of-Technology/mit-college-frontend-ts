import { Await, Outlet, useAsyncError, useLocation } from "react-router";
import Navbar from "../components/Navbar/PublicContentNav";
import Footer from "../components/Footer/PublicFooter";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "../components/ImageCarousel/ImageCarrousel";
import type { Route } from "./+types/PublicContentLayout";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Suspense } from "react";

import "./background.css";
import { getPublicNavContent } from "~/mock/services/navbar";
import { FetchError } from "~/types/api/FetchError";

export const clientLoader = async ({}: Route.ClientLoaderArgs) => {
	// TODO: fetch carousel data from api return route lists
	const imgCarouselData = getImageCarouselContent();
	const navData = getPublicNavContent();
	return { imgCarouselData, navData } as const;
};

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
	const loc = useLocation();
	return (
		<>
			{loaderData && (
				<Suspense fallback={<>Loading navbar...</>}>
					<Await resolve={loaderData.navData} errorElement={<>Navbar Error</>}>
						{(val) => <Navbar navigation={val} />}
					</Await>
				</Suspense>
			)}
			<main className="pub-cont-layout-bg">
				{/* {loc.pathname === "/" && (
					<Suspense fallback={<ImageCarouselSkeleton />}>
						<Await
							resolve={loaderData.imgCarouselData}
							errorElement={<ErrorBoundary />}>
							{(val) => {
								return val.length > 0 ? <ImageCarousel data={val} /> : null;
							}}
						</Await>
					</Suspense>
				)} */}

				<div className="mx-auto max-w-7xl px-0 py-6 lg:px-0 min-h-[100vh] relative">
					<Outlet />
				</div>
			</main>
			<Footer />
		</>
	);
}

const ErrorBoundary = () => {
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
