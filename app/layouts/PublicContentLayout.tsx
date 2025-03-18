import { Await, Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar/PublicContentNav";
import Footer from "../components/Footer/PublicFooter";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "../components/ImageCarousel/ImageCarrousel";
import type { Route } from "./+types/PublicContentLayout";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Suspense } from "react";

import "./background.css";

export const clientLoader = ({}: Route.ClientLoaderArgs) => {
	const loc = useLocation();
	const { pathname } = loc;
	// TODO: fetch carousel data from api return route lists
	if (pathname === "/") {
		const data = getImageCarouselContent();
		return { data };
	}
	return undefined;
};

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<Navbar />
			<main className="pub-cont-layout-bg">
				{loaderData && (
					<Suspense fallback={<ImageCarouselSkeleton />}>
						<Await resolve={loaderData.data}>
							{(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
						</Await>
					</Suspense>
				)}

				<div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 border border-black min-h-[100vh]">
					<Outlet />
				</div>
			</main>
			<Footer />
		</>
	);
}
