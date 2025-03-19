import type { Route } from "./+types/home";
import HomePage from "../pages/Home";
import { genPageMetaData } from "~/utils/meta";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Await, data } from "react-router";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "~/components/ImageCarousel/ImageCarrousel";
import { Suspense } from "react";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({});
	// return [
	// 	{ title: "Manipur Institute of Technology" },
	// 	{
	// 		name: "description",
	// 		content: "Home page for Manipur Institute of Technology",
	// 	},
	// 	{
	// 		name: "og:image",
	// 		itemProp: "image primaryImageOfPage",
	// 		content:
	// 			"https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded",
	// 	},
	// ];
}

export const links: Route.LinksFunction = () => [
	{ rel: "icon", href: "./Manipur_University_Logo.png" },
];

export const clientLoader = () => {
	return { data: getImageCarouselContent() };
	// try {
	// } catch (err) {
	// 	return data({ err });
	// }
};

export default function Home({ loaderData }: Route.ComponentProps) {
	const { data } = loaderData;

	return (
		<div>
			<div>
				<Suspense fallback={<ImageCarouselSkeleton />}>
					<Await resolve={data} errorElement={<>An error occured...</>}>
						{(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
					</Await>
				</Suspense>
			</div>
			<div>This is HOME</div>
		</div>
	);
}
