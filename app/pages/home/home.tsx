import { genPageMetaData } from "~/utils/meta";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Await, data, Link, useAsyncError, useLocation } from "react-router";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "~/components/ImageCarousel/ImageCarrousel";

import "./home.css";
import type { ImageCarouselData, NoticeData } from "~/types/api/resData.type";
import { useXFetcher } from "~/hooks/useXFetcher";
import type { Route } from "../../routes/+types/home";
import BulletinSidebar from "~/components/BulletinSidebar";
import { XPreviewEditor } from "~/routes/test1";

// export function meta({}: Route.MetaArgs) {
// 	return genPageMetaData({});
// 	// return [
// 	// 	{ title: "Manipur Institute of Technology" },
// 	// 	{
// 	// 		name: "description",
// 	// 		content: "Home page for Manipur Institute of Technology",
// 	// 	},
// 	// 	{
// 	// 		name: "og:image",
// 	// 		itemProp: "image primaryImageOfPage",
// 	// 		content:
// 	// 			"https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded",
// 	// 	},
// 	// ];
// }

// export const links: Route.LinksFunction = () => [
// 	{ rel: "icon", href: "./Manipur_University_Logo.png" },
// ];

// export const clientLoader = async () => {
// 	// Fetch data separately to handle errors independently
// 	const imageCarouselPromise = getImageCarouselContent().catch((error) => {
// 		console.log("carousel err from loader");
// 		return { error };
// 	});

// 	const noticeListPromise = getNoticeList().catch((error) => {
// 		console.log("notice err from loader");
// 		return { error };
// 	});

// const getHomePageContent = async () => {
// 	await new Promise((res) => setTimeout(res, 7000));
// 	const res = await fetch("/mock/homeContent.json");
// 	return res.text();
// };
// 	const homeContent = getHomePageContent().catch((error) => {
// 		console.log("home content fetch error");
// 		return { error };
// 	});

// 	return {
// 		imageCarouseldata: imageCarouselPromise,
// 		noticeListData: noticeListPromise,
// 		homeContentData: homeContent,
// 	};
// 	// // Wait for both promises to resolve
// 	// const [imageCarouselResult, noticeListResult] = await Promise.all([
// 	// 	imageCarouselPromise,
// 	// 	noticeListPromise,
// 	// ]);

// 	// // Return the data and errors using react-router's data utility
// 	// return data({
// 	// 	imageCarouseldata: imageCarouselResult.data ?? imageCarouselResult.error,
// 	// 	noticeListData: noticeListResult.data ?? noticeListResult.error,
// 	// });
// };

export default function Home({
	loaderData,
}: Pick<Route.ComponentProps, "loaderData">) {
	const { imageCarouseldata, noticeListData, homeContentData } = loaderData;
	const { state, error, xFetch } = useXFetcher<string>();

	const getHomePageContent = async () => {
		await new Promise((res) => setTimeout(res, 7000));
		const res = await fetch("/mock/homeContent.json");
		const d = await res.json();
		return JSON.stringify(d);
	};

	const scrollbarStyle = {
		scrollbarWidth: "thin",
		scrollbarColor: "#CBD5E0 transparent",
		"&::WebkitScrollbar": {
			width: "6px",
			borderRadius: "20px",
		},
		"&::WebkitScrollbarTrack": {
			background: "transparent",
		},
		"&::WebkitScrollbarThumb": {
			backgroundColor: "#CBD5E0",
			borderRadius: "20px",
		},
	} as const;

	return (
		<div className="px-0 md:px-2 max-w-7xl mx-auto">
			{/* <Suspense fallback={<ImageCarouselSkeleton />}>
                <Await resolve={data} errorElement={<>An error occured...</>}>
                    {(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
                </Await>
            </Suspense> */}

			{/* TODO: Add announcememt here and top of page for very important alert/notice */}
			<div className="w-full px-1">
				<div className="w-full bg-blue-500 text-blue-50 p-1 my-2 text-center font-semibold rounded-md shadow-sm shadow-blue-400">
					<Link to={"/xx"} className="inline-block">
						Civil Engineering (UG Program) accredited by NBA under
						Tier-II for the Academic Year 2020-2021 to 2022-2023
						i.e. upto 30-06-2023
					</Link>
				</div>
			</div>

			{/* Desktop View */}
			<div className="hidden lg:grid grid-cols-12 w-full gap-0.5 px-1 relative">
				<div
					className="col-span-3 space-y-1.5 overflow-y-auto sticky top-[4rem] h-[90vh]"
					style={{ ...scrollbarStyle }}>
					<BulletinSidebar
						noticeListData={noticeListData}
						informationListData={noticeListData}
						newsListData={noticeListData}
					/>
				</div>
				<div className="col-span-9 min-h-full">
					<XPreviewEditor loadSaveText={getHomePageContent} />
				</div>
			</div>
			{/* MobileView */}
			<div className="lg:hidden w-full relative space-y-2 px-1">
				<div className="h-full">
					<XPreviewEditor loadSaveText={getHomePageContent} />
				</div>
				<div className="space-y-2">
					<div className="flex flex-row flex-wrap gap-1">
						<BulletinSidebar
							noticeListData={noticeListData}
							informationListData={noticeListData}
							newsListData={noticeListData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// TODO: Create powerSuspense with feature of error boundary to catch all error from a children component and display a readble error message
// Integrate ErrorBoundary component to this PowerSuspense
// const PowerSuspenser: React.FC<{
// 	children: React.JSX.Element;
// 	fallBack?: React.JSX.Element;
// 	errorFallback?: React.JSX.Element;
// }> = ({
// 	children,
// 	fallBack = <>Loading ...</>,
// 	errorFallback = <>Error...</>,
// }) => {
// 	// return <React.Suspense fallback={<></>}>{children}</React.Suspense>;
// };
