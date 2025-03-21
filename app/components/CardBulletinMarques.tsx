import { useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router";
import { Calendar, Clock, Fullscreen, RefreshCcw } from "lucide-react";

const CardBulletinMarques: React.FC<{
	cardTitle: string;
	lists: {
		href: string;
		linkText: string;
		publishedDate: Date;
		urgency: "high" | "medium" | "low";
	}[];
	animeIntervalDelay?: number;
}> = ({ cardTitle, lists, animeIntervalDelay = 2000 }) => {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const animRef = useRef<Animation | null>(null);
	const tOutId = useRef<number | null>(null);

	useEffect(() => {
		const animDuration = 9000 / (lists.length * 0.05);
		const animation = [
			{ transform: "translateY(0%)" },
			{ transform: "translateY(-100%)" },
		];
		const timing = {
			duration: animDuration,
			iterations: 1,
		};
		if (scrollRef.current) {
			animRef.current = scrollRef.current.animate(animation, timing);
			animRef.current.play();
			animRef.current.addEventListener("finish", () => {
				tOutId.current = window.setTimeout(() => {
					animRef.current?.play();
				}, animeIntervalDelay);
			});
		}
		return () => {
			if (animRef.current) {
				animRef.current.cancel();
				animRef.current.removeEventListener("finish", () => {});
			}
			if (tOutId.current) {
				window.clearTimeout(tOutId.current);
			}
		};
	}, []);

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
			className="relative md:max-h-[30vh] max-h-[50vh] overflow-y-hidden border border-gray-300 shadow-md rounded-md bg-gray-50 w-full">
			<div
				className="bg-gray-50 border border-gray-300 shadow-lg p-2 flex items-center justify-between max-w-[100vw] rounded-t-md w-full z-[10] sticky top-0"
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

			<div className="w-full relative z-[3]" ref={scrollRef}>
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
				<div className="text-md p-2 text-center text-green-950 w-full hover:bg-green-50 hover:cursor-pointer">
					View all notices
				</div>
			</div>
		</div>
	);
};

export default CardBulletinMarques;
