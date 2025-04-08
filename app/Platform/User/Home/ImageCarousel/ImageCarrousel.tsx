import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import data from "../../../../mock/imageCarousel.json";

export default function ImageCarousel({
  slideInterval = 3000,
}: {
  slideInterval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const imageSlider = data.imageSlider;

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        nextSlide();
      }, slideInterval); // Change slide every x seconds
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageSlider.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageSlider.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full max-h-[100vh] md:h-[600px] h-[60vh] overflow-hidden rounded-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
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
        }}
      ></div>

      {/* Main Image */}
      <div className="absolute h-full w-full bg-gray-600/70 backdrop-blur-sm rounded-lg">
        <img
          src={imageSlider[currentIndex].images}
          alt={imageSlider[currentIndex].title}
          className="w-full h-full object-contain md:object-contain rounded-lg"
        />

        {/* Overlay with text */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md text-white p-6 rounded-md">
          <p className="text-sm md:text-base text-center">
            {imageSlider[currentIndex].description}
          </p>
        </div>
      </div>

      {/* Slide Animation Indicator */}
      {/* <div className="absolute top-4 left-2">
        <div className="bg-gray-500/70 backdrop-blur-sm rounded-full p-1 border border-gray-100">
          {isAutoPlaying ? <Pause size={24} /> : <Play size={24} />}
        </div>
      </div> */}

      {/* <div className="absolute top-4 right-2 p-1 rounded-lg text-slate-300 bg-slate-800/50 backdrop-blur-sm text-sm">
        {imageSlider[currentIndex].time &&
          new Date(imageSlider[currentIndex].time).toLocaleDateString()}
      </div> */}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-24 w-full flex justify-center">
        <div className="w-fit p-1 rounded-full bg-gray-600/50 backdrop-blur-md">
          <div className="flex justify-center gap-2">
            {imageSlider.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-4" : "bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
