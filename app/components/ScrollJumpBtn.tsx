import { ChevronUp } from "lucide-react";
import { useScrollPosition } from "~/hooks/useScrollPosition";

export default function ScrollJumpBtn() {
	const { isAtTop, isAtMiddle } = useScrollPosition(400);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			onClick={scrollToTop}
			className={`fixed right-4 z-20 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-[bottom] hover:cursor-pointer ${!isAtTop ? "bottom-4" : "-bottom-14"}`}>
			<ChevronUp size={18} />
			{/* TODO: Jump top and bottom of page at middle height of page */}
			{/* {!isAtMiddle ? (
				<ChevronUp size={18} />
			) : (
				<>
					<ChevronUp size={18} />
					<ChevronDown size={18} />
				</>
			)} */}
		</button>
	);
}
