import { useState, useRef, useEffect } from "react";

const ImageCarousel1 = ({
	images,
	slideInterval = 3000,
}: {
	images: any[];
	slideInterval?: number;
}) => {
	const [curIndx, setCurIndx] = useState(0);
	const imgCont = useRef(null);

	const nextSlide = () => {
		setCurIndx((s) => {
			const nxtIndx = (s + 1) % images.length;
			// const elm = document.querySelector(`#slide-${nxtIndx}`);
			// if (elm) {
			// 	elm.scrollIntoView();
			// 	console.log("scroll", curIndx);
			// }

			return nxtIndx;
		});
	};
	const prevSlide = () => {
		setCurIndx((s) => (s - 1 < 0 ? images.length - 1 : s - 1));
	};

	const goToSlide = (indx: number) => {
		setCurIndx(indx);
	};

	useEffect(() => {
		setInterval(() => {
			nextSlide();
		}, slideInterval);
	}, []);

	return (
		<div className="relative w-full max-h-[100vh] md:h-[600px] h-[60vh] overflow-hidden rounded-lg border border-rose-700">
			<div
				ref={imgCont}
				style={{
					// left: `-${100 * curIndx}%`,
					transform: `translateX(${-100 * curIndx}%)`,
				}}
				className="relative flex flex-row flex-nowrap items-center w-full [&>div]:flex-shrink-0 overflow-x-hidden-auto border border-green-500 transition-all">
				{images.map((d, i) => {
					return (
						<div
							key={i}
							className="relative w-full bg-rose-800 border border-yellow-400">
							<img src={d.images} alt="12" className="w-full" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ImageCarousel1;
