import "./Image_slider.css";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
      <div className="items">
        <img className="img_1" src="./images/Main_page/img_1.jpg" alt=""></img>
        <p className="legend">
          MIT WEEK 2018 OPENING CEREMONY (12th NOV, 2018)
        </p>
      </div>
      <div className="items">
        <img className="img_1" src="./images/Main_page/img_2.jpg" alt=""></img>
        <p className="legend">
          DIGNITARIES AT THE VALEDICTORY FUNCTION OF MIT WEEK 2018 ON 17th NOV,
          2018
        </p>
      </div>
      <div className="items">
        <img className="img_1" src="./images/Main_page/img_3.jpg" alt=""></img>
        <p className="legend">
          11TH GB Meeting MIT. With Prof. A.P. Pandey, Hon'ble V.C. M.U. Prof.
          A.K. Saxena, Mentor (AICTE-NEQIP) and other Members.
        </p>
      </div>
      <div className="items">
        <img className="img_1" src="./images/Main_page/img_4.jpg" alt=""></img>
        <p className="legend">
          SPEECH FROM SHRI JARNAIL SINGH, ADMINISTRATOR, MANIPUR UNIVERSITY AT
          THE VALEDICTORY FUNCTION OF MIT WEEK 2018
        </p>
      </div>
      <div className="items">
        <img className="img_1" src="./images/Main_page/img_5.jpg" alt=""></img>
        <p className="legend">
          Inauguration of AICTE sponsored 3-days Faculty Development Programme
          on “Universal Human Values
        </p>
      </div>
    </Carousel>
  );
}
