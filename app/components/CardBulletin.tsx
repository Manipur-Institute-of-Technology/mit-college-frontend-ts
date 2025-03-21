import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Link } from "react-router";
import {
	Calendar,
	ChevronDown,
	Clock,
	Fullscreen,
	RefreshCcw,
} from "lucide-react";

const CardBulletin: React.FC<{
	cardTitle: string;
	lists: {
		href: string;
		linkText: string;
		publishedDate: Date;
		urgency: "high" | "medium" | "low";
	}[];
}> = ({ cardTitle, lists }) => {
	const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);
	const cardBodyRef = useRef<HTMLDivElement | null>(null);
	const lastListRef = useRef<HTMLDivElement | null>(null);
	const animRef = useRef<Animation | null>(null);

	useEffect(() => {
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
				className={`relative md:max-h-[30vh] max-h-[50vh] overflow-y-auto z-[0]`}
				style={{ ...scrollbarStyle }}>
				{lists.map((list, i) => (
					<div
						key={i}
						className={`border-b border-gray-300 p-2 w-full ${list.urgency === "high" ? "bg-red-50" : list.urgency === "medium" ? "bg-yellow-50" : "bg-white"}`}>
						<div
							className={`hover:underline text-sm font-semibold ${list.urgency === "high" ? "text-red-950" : list.urgency === "medium" ? "text-yellow-950" : "text-green-950"}`}>
							<Link to={list.href}>{list.linkText}</Link>
						</div>

						<div className="inline-flex flex-nowrap items-center justify-between w-full">
							<div className="flex flex-col">
								<div className="inline-flex gap-x-1.5 items-center justify-start text-sm font-thin w-fit">
									<Calendar size={12} stroke="grey" />
									<div className="text-[12px] font-thin">
										{list.publishedDate.toLocaleDateString()}
									</div>
								</div>
								<div className="inline-flex gap-x-1.5 items-center justify-start text-sm font-thin w-fit">
									<Clock size={12} stroke="grey" />
									<div className="text-[12px] font-thin">
										{list.publishedDate.toLocaleTimeString()}
									</div>
								</div>
							</div>
							<div className="flex flex-col items-end">
								<div className="text-[12px] font-thin text-gray-700">
									({moment(list.publishedDate).fromNow()})
								</div>
								<div className="text-[10px] text-rose-950 bg-rose-100 font-thin font-roboto border border-rose-300 p-0.5 w-fit rounded-md animate-pulse">
									New
								</div>
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

			<div
				className={`absolute w-[3rem]  text-center px-0.5 border border-blue-300 bg-blue-200/30 backdrop-blur-md rounded-md ${!showScrollIndicator ? "bottom-2" : "-bottom-10"} animate-bounce transition-all left-[50%] translate-x-[-50%]`}>
				<ChevronDown size={20} className="inline-block stroke-blue-800" />
			</div>
		</div>
	);
};

export default CardBulletin;
