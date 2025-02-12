import "./Image_slider.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import data from "./imageSlider.json";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export default function ImageCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const imageSlider = data.imageSlider;

	useEffect(() => {
		let interval;
		if (isAutoPlaying) {
			interval = setInterval(() => {
				nextSlide();
			}, 3000); // Change slide every 3 seconds
		}
		return () => clearInterval(interval);
	}, [currentIndex, isAutoPlaying]);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === imageSlider.length - 1 ? 0 : prevIndex + 1,
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? imageSlider.length - 1 : prevIndex - 1,
		);
	};

	const goToSlide = (index) => {
		setCurrentIndex(index);
	};

	return (
		<div
			className="relative w-full max-h-[100vh] h-[600px] overflow-hidden rounded-lg"
			onMouseEnter={() => setIsAutoPlaying(false)}
			onMouseLeave={() => setIsAutoPlaying(true)}>
			{/* Blur Background */}
			<div
				className="absolute w-full h-[100%] border border-green-400 rounded-lg"
				style={{
					backgroundColor: `rgba(0, 0, 0, 0.9)`,
					backgroundImage: `url("${imageSlider[currentIndex].images}")`,
					backgroundAttachment: "scroll",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					backgroundBlendMode: "luminosity",
					backgroundPosition: "50% 50%",
				}}></div>

			{/* Main Image */}
			<div className="absolute h-full w-full bg-gray-600/70 backdrop-blur-sm rounded-lg">
				<img
					src={imageSlider[currentIndex].images}
					alt={imageSlider[currentIndex].title}
					className="w-full h-full object-contain md:object-contain rounded-lg"
				/>

				{/* Overlay with text */}
				<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md text-white p-6 rounded-md">
					{/* <h2 className="text-2xl font-semibold mb-2">
						{imageSlider[currentIndex].title}
					</h2> */}
					<p className="text-sm md:text-base text-center">
						{imageSlider[currentIndex].description}
					</p>
				</div>
			</div>
			{/* Slide Animation Indicator */}
			<div className="absolute top-4 left-2">
				<div className="bg-gray-500/70 backdrop-blur-sm rounded-full p-1 border border-gray-100">
					{isAutoPlaying ? <Pause size={24} /> : <Play size={24} />}
				</div>
			</div>
			{/* Navigation Arrows */}
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all">
				<ChevronLeft className="h-6 w-6" />
			</button>

			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all">
				<ChevronRight className="h-6 w-6" />
			</button>

			{/* Dots Navigation */}
			<div className="absolute bottom-24 left-0 right-0">
				<div className="flex justify-center gap-2">
					{imageSlider.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`h-2 w-2 rounded-full transition-all ${
								currentIndex === index ? "bg-white w-4" : "bg-white/50"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function Image_slider() {
	return (
		<Carousel
			showArrows={true}
			autoPlay={true}
			infiniteLoop={true}
			showThumbs={false}
			interval={3000}
			transitionTime={800}
			className="crsl">
			{data.imageSlider.map((item) => (
				<div className="items" key={item.id}>
					<img className="img_1" src={item.images} alt={item.title} />
					<p className="legend">{item.description}</p>
				</div>
			))}
		</Carousel>
	);
}
