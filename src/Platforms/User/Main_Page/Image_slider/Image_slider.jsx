import "./Image_slider.css";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import data from "./imageSlider.json";
export function Image_slider() {
  return (
    <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      interval={3000}
      transitionTime={800}
      className="crsl"
    >
      {data.imageSlider.map((item) => (
        <div
          className="items"
          key={item.id}
        >
          <img className="img_1" src={item.images} alt={item.title} />
          <p className="legend">{item.description}</p>
        </div>
      ))}
    </Carousel>
  );
}
