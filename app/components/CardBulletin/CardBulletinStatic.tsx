import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { CardBulletinProps, ListItem } from "./CardBulletin";
import { useXFetcher } from "~/hooks/useXFetcher";
import { throttle } from "~/utils/util";
import { ChevronDown, Fullscreen, RefreshCcw } from "lucide-react";
import { Link } from "react-router";
import CardList from "./CardList";

const CardBulletinStatic: React.FC<CardBulletinProps> = ({
	cardTitle,
	lists,
	refreshFetcher,
	moreViewLink,
}) => {
	const [listItems, setListItems] = useState<ListItem[]>(lists);
	const { data, state, error, xFetch } = useXFetcher<ListItem[]>();

	const [showScrollIndicator, setShowScrollIndicator] =
		useState<boolean>(true);

	const cardBodyRef = useRef<HTMLDivElement | null>(null);
	const lastListRef = useRef<HTMLDivElement | null>(null);

	const tRefFetcher =
		refreshFetcher &&
		useCallback(throttle(refreshFetcher, 2000), [refreshFetcher]); // Throttle function for 2sec

	useEffect(() => {
		if (state === "idle" && data && data.length > 0) {
			setListItems(data);
		}
	}, [data]);

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
		<div className="relative border border-gray-300 shadow-md rounded-md bg-gray-50 w-full overflow-y-clip">
			<div
				className="bg-gray-50 border border-gray-300 shadow-lg p-2 flex items-center justify-between max-w-[100vw] rounded-t-md z-5 sticky"
				style={{
					boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
				}}>
				<div className="text-lg text-slate-600 font-bold">
					{cardTitle}
				</div>
				<div className="flex flex-nowrap w-fit gap-x-2">
					{moreViewLink && (
						<div
							className="border border-gray-300 rounded-full  hover:bg-gray-300 p-1"
							title="View all Notices">
							<Link to={moreViewLink}>
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
							onClick={() => {
								xFetch(tRefFetcher);
							}}
							disabled={state === "loading"}
							className="hover:cursor-pointer border border-gray-300 hover:bg-gray-300 rounded-full p-1 disabled:cursor-progress"
							title="Refresh Notices">
							<RefreshCcw
								size={18}
								stroke="gray"
								className={`hover:stroke-gray-600 ${state === "loading" ? "animate-spin [animation-direction:reverse]" : ""}`}
							/>
						</button>
					)}
				</div>
			</div>
			<div
				ref={cardBodyRef}
				className={`relative md:max-h-[30vh] max-h-[50vh] overflow-y-auto z-[0]`}
				style={{ ...scrollbarStyle }}>
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
						<div
							className="text-md p-2 text-center text-green-950 w-full hover:bg-green-50 hover:cursor-pointer"
							ref={lastListRef}>
							View all{" "}
							<span className="capitalize">{cardTitle}</span>
						</div>
					</>
				)}
			</div>

			{!error && (
				<div
					className={`absolute w-[3rem]  text-center px-0.5 border border-blue-300 bg-blue-200/30 backdrop-blur-md rounded-md ${!showScrollIndicator ? "bottom-2" : "-bottom-10"} animate-bounce transition-all left-[50%] translate-x-[-50%]`}>
					<ChevronDown
						size={20}
						className="inline-block stroke-blue-800"
					/>
				</div>
			)}
		</div>
	);
};

export default memo(CardBulletinStatic);
