import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Link } from "react-router";
import { Fullscreen, RefreshCcw } from "lucide-react";
import CardList from "./CardList";
import type { CardBulletinProps, ListItem } from "./CardBulletin";
import { useXFetcher } from "~/hooks/useXFetcher";
import { throttle } from "~/utils/util";

const CardBulletinMarques: React.FC<CardBulletinProps> = ({
	cardTitle,
	lists,
	moreViewLink,
	refreshFetcher,
	animeIntervalDelay = 2000,
}) => {
	const [listItems, setListItems] = useState<ListItem[]>(lists);
	const { data, error, state, xFetch } = useXFetcher<ListItem[]>();

	const scrollRef = useRef<HTMLDivElement | null>(null);
	const animRef = useRef<Animation | null>(null);
	const tOutId = useRef<number | null>(null);

	const tRefFetcher =
		refreshFetcher &&
		useCallback(throttle(refreshFetcher, 2000), [refreshFetcher]); // Throttle function for 2sec

	useEffect(() => {
		if (state === "idle" && data && data.length > 0) setListItems(data);
	}, [data]);

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
				if (
					animRef.current &&
					animRef.current.playState === "running"
				) {
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
				className="bg-gray-50 border border-gray-300 shadow-lg p-2 flex items-center justify-between max-w-[100vw] rounded-t-md w-full z-5 sticky top-0"
				style={{
					boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
				}}>
				<div className="text-lg font-bold">{cardTitle}</div>
				<div className="flex flex-nowrap w-fit gap-x-2">
					{moreViewLink && (
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
					)}
					{tRefFetcher && (
						<button
							className="hover:cursor-pointer border border-gray-300 hover:bg-gray-300 rounded-full p-1"
							title="Refresh Notices">
							<RefreshCcw
								size={18}
								stroke="gray"
								className="hover:stroke-gray-600"
								onClick={() => xFetch(tRefFetcher)}
							/>
						</button>
					)}
				</div>
			</div>

			<div className="w-full relative z-[3]" ref={scrollRef}>
				{error ? (
					<div className="flex items-center w-full justify-center">
						<span className="font-semibold ">Error: </span>
						{error}
					</div>
				) : (
					<>
						{listItems.map((list, i) => (
							<CardList key={i} list={list} />
						))}
						<div className="text-md p-2 text-center text-green-950 w-full hover:bg-green-50 hover:cursor-pointer">
							View all{" "}
							<span className="capitalize">{cardTitle}</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default CardBulletinMarques;
