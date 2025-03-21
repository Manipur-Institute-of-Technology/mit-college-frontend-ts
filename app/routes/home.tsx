import type { Route } from "./+types/home";
import moment from "moment";
import HomePage from "../pages/Home";
import { genPageMetaData } from "~/utils/meta";
import { getImageCarouselContent } from "~/mock/services/imageCarousel";
import { Await, data, Link } from "react-router";
import ImageCarousel, {
	ImageCarouselSkeleton,
} from "~/components/ImageCarousel/ImageCarrousel";
import React, {
	type RefObject,
	createRef,
	Suspense,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Calendar,
	ChevronDown,
	Clock,
	Fullscreen,
	RefreshCcw,
} from "lucide-react";
import { XPreviewEditor } from "./test1";
import CardBulletin from "~/components/CardBulletin";
import CardBulletinMarques from "~/components/CardBulletinMarques";

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

const lists: {
	href: string;
	linkText: string;
	publishedDate: Date;
	urgency: "high" | "medium" | "low";
}[] = [
	{
		href: "/notice/academic-calendar-2024",
		linkText: "Academic Calendar 2024 Released",
		publishedDate: new Date("2024-01-10"),
		urgency: "high",
	},
	{
		href: "/notice/admission-2024",
		linkText: "Admission Open for 2024-25 Academic Session",
		publishedDate: new Date("2024-01-15"),
		urgency: "high",
	},
	{
		href: "/notice/exam-schedule",
		linkText: "End Semester Examination Schedule",
		publishedDate: new Date("2024-01-20"),
		urgency: "medium",
	},
	{
		href: "/notice/scholarship",
		linkText: "Merit Scholarship Applications Now Open",
		publishedDate: new Date("2024-01-25"),
		urgency: "medium",
	},
	{
		href: "/notice/workshop",
		linkText: "Technical Workshop on AI & Machine Learning",
		publishedDate: new Date("2024-02-01"),
		urgency: "low",
	},
	{
		href: "/notice/academic-calendar-2024",
		linkText: "Academic Calendar 2024 Released",
		publishedDate: new Date("2024-01-10"),
		urgency: "high",
	},
	{
		href: "/notice/admission-2024",
		linkText: "Admission Open for 2024-25 Academic Session",
		publishedDate: new Date("2024-01-15"),
		urgency: "high",
	},
	{
		href: "/notice/exam-schedule",
		linkText: "End Semester Examination Schedule",
		publishedDate: new Date("2024-01-20"),
		urgency: "medium",
	},
	{
		href: "/notice/scholarship",
		linkText: "Merit Scholarship Applications Now Open",
		publishedDate: new Date("2024-01-25"),
		urgency: "medium",
	},
	{
		href: "/notice/workshop",
		linkText: "Technical Workshop on AI & Machine Learning",
		publishedDate: new Date("2024-02-01"),
		urgency: "low",
	},
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
		<div className="px-2">
			{/* <Suspense fallback={<ImageCarouselSkeleton />}>
				<Await resolve={data} errorElement={<>An error occured...</>}>
					{(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
				</Await>
			</Suspense> */}

			{/* TODO: Add announcememt here and top of page for very important alert/notice */}
			<div className="w-full bg-violet-100 h-[2rem] my-2"></div>

			{/* Desktop View */}
			<div className="hidden md:grid grid-cols-12 w-full gap-0.5 px-1 relative">
				<div
					className="col-span-3 space-y-1.5 overflow-y-auto sticky top-[4rem] h-[90vh]"
					style={{ ...scrollbarStyle }}>
					<CardBulletin cardTitle="Notice" lists={lists} />
					<CardBulletin cardTitle="Notice" lists={lists} />
					<CardBulletinMarques cardTitle="Information" lists={lists} />
				</div>
				<div className="col-span-9 min-h-full">
					<XPreviewEditor />
				</div>
			</div>
			{/* MobileView */}
			<div className="md:hidden w-full relative gap-0.5 px-1">
				<div className="h-full">
					<XPreviewEditor />
				</div>
				<div className="space-y-2 space-x-2">
					<CardBulletin cardTitle="Notice" lists={lists} />
					<CardBulletin cardTitle="Notice" lists={lists} />
					<CardBulletinMarques cardTitle="Information" lists={lists} />
				</div>
			</div>
		</div>
	);
}
