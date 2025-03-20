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
import { Calendar, ChevronDown, Fullscreen, RefreshCcw } from "lucide-react";
import { XPreviewEditor } from "./test1";

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
					<CardList cardTitle="Notice" lists={lists} />
					<CardList cardTitle="Notice" lists={lists} />
					<CardList cardTitle="Information" lists={lists} autoScroll={true} />
				</div>
				<div className="col-span-9 min-h-full">
					<XPreviewEditor />
					{/* <XPreviewEditor />
					<XPreviewEditor /> */}
				</div>
			</div>
			{/* MobileView */}
			<div className="md:hidden w-full relative gap-0.5 px-1">
				<div className="h-full">
					<XPreviewEditor />
				</div>
				<div className="space-y-2 space-x-2">
					<CardList cardTitle="Notice" lists={lists} />
					<CardList cardTitle="Notice" lists={lists} />
					<CardList cardTitle="Information" lists={lists} autoScroll={true} />
				</div>
			</div>
		</div>
	);
}

const CardList: React.FC<{
	cardTitle: string;
	lists: {
		href: string;
		linkText: string;
		publishedDate: Date;
		urgency: "high" | "medium" | "low";
	}[];
	autoScroll?: boolean;
}> = ({ cardTitle, lists, autoScroll = false }) => {
	const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);
	const cardBodyRef = useRef<HTMLDivElement | null>(null);
	const lastListRef = useRef<HTMLDivElement | null>(null);
	const animRef = useRef<Animation | null>(null);

	useEffect(() => {
		if (autoScroll) {
			const animation = [
				{ transform: "translateY(0%)" },
				{ transform: "translateY(-100%)" },
			];
			const timing = {
				duration: 9000,
				iterations: Infinity,
			};
			if (cardBodyRef.current) {
				animRef.current = cardBodyRef.current.animate(animation, timing);
				animRef.current.play();
			}
			return () => {
				if (animRef.current) {
					animRef.current.cancel();
				}
			};
		} else {
			let observer: IntersectionObserver;
			const handleIntersect: IntersectionObserverCallback = (
				entries,
				observer,
			) => {
				const entry = entries[0];
				setShowScrollIndicator(entry.isIntersecting);
			};
			if (
				lastListRef &&
				lastListRef.current &&
				cardBodyRef &&
				cardBodyRef.current
			) {
				observer = new IntersectionObserver(handleIntersect, {
					root: cardBodyRef.current,
					rootMargin: "0px",
					threshold: [0.1],
				});
				observer.observe(lastListRef.current);
			}
			return () => {
				if (lastListRef && lastListRef.current) {
					observer.unobserve(lastListRef.current);
				}
			};
		}
	}, []);

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
		<div
			onMouseEnter={() => {
				if (animRef.current && animRef.current.playState === "running") {
					animRef.current.pause();
				}
			}}
			onMouseLeave={() => {
				if (animRef.current && animRef.current.playState === "paused") {
					animRef.current.play();
				}
			}}
			className="relative border border-gray-300 shadow-md rounded-md bg-gray-50 w-full overflow-y-clip">
			<div
				className="bg-gray-50 border border-gray-300 shadow-lg p-2 flex items-center justify-between max-w-[100vw] rounded-t-md z-[99] sticky"
				style={{
					boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
				}}>
				<div className="text-lg font-bold">{cardTitle}</div>
				<div className="flex flex-nowrap w-fit gap-x-2">
					<div
						className="border border-gray-300 rounded-full  hover:bg-gray-300 p-1"
						title="View all Notices">
						<Link to="/xx">
							<Fullscreen
								size={18}
								stroke="gray"
								className="hover:stroke-gray-600"
							/>
						</Link>
					</div>
					<button
						className="hover:cursor-pointer border border-gray-300 hover:bg-gray-300 rounded-full p-1"
						title="Refresh Notices">
						<RefreshCcw
							size={18}
							stroke="gray"
							className="hover:stroke-gray-600"
						/>
					</button>
				</div>
			</div>
			<div
				ref={cardBodyRef}
				className={`relative md:max-h-[30vh] max-h-[50vh] ${autoScroll ? "overflow-y-hidden" : "overflow-y-auto"} z-[0]`}
				style={{ ...scrollbarStyle }}>
				{lists.map((list, i) => (
					<div
						key={i}
						className={`border-b border-gray-300 p-2 w-full ${list.urgency === "high" ? "bg-red-50" : list.urgency === "medium" ? "bg-yellow-50" : "bg-green-50"}`}>
						<div
							className={`hover:underline text-sm font-semibold ${list.urgency === "high" ? "text-red-950" : list.urgency === "medium" ? "text-yellow-950" : "text-green-950"}`}>
							<Link to={list.href}>{list.linkText}</Link>
						</div>

						<div className="inline-flex flex-nowrap items-center justify-between w-full">
							<div className="inline-flex gap-x-1.5 items-center justify-start text-sm font-thin w-fit">
								<Calendar size={14} stroke="grey" /> {}
								{moment(list.publishedDate).fromNow()}
							</div>
							<div className="text-[10px] text-rose-950 bg-rose-100 font-thin font-roboto border border-rose-300 p-0.5 rounded-md animate-pulse">
								New
							</div>
						</div>
					</div>
				))}
				<div
					className="text-md p-2 text-center text-green-950 w-full hover:bg-green-50 hover:cursor-pointer"
					ref={lastListRef}>
					View all notices
				</div>
			</div>
			{!autoScroll && (
				<div
					className={`absolute w-[3rem]  text-center px-0.5 border border-blue-300 bg-blue-200/30 backdrop-blur-md rounded-md ${!showScrollIndicator ? "bottom-2" : "-bottom-10"} animate-bounce transition-all left-[50%] translate-x-[-50%]`}>
					<ChevronDown size={20} className="inline-block stroke-blue-800" />
				</div>
			)}
		</div>
	);
};
