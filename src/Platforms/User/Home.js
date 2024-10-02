import "./Home.css";
import React from "react";
import { Navbar } from "./Navbar/Navbar";
import { Image_slider } from "./Main_Page/Image_slider/Image_slider";
import { LeftNotification } from "./Main_Page/MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { LeftInformation } from "./Main_Page/MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftDownload } from "./Main_Page/MainContent/LocalNavigation/Left_Download/LeftDownload";
import { MainContent } from "./Main_Page/MainContent/Main_body";
import { Top_Navbar } from "./Navbar/TopNavbar/Top_Navbar";
import { Footer } from "./Footer/Footer";

function Home() {
  return (
    <div className="HomePage">
      <div className="HomePage_align">
        <Top_Navbar />
        <div className="HomePage_Nav">
          <Navbar />
        </div>

        <div className="HomePage_wrapper">
          <Image_slider />
          <div className="HomePage_top_link">
            <a
              href="https://mitimphal.in/uploads/media/m1592044423.pdf"
              target="_blank"
            >
              Civil Engineering (UG Program) accredited by NBA under Tier-II for
              the Academic Year 2020-2021 to 2022-2023 i.e. upto 30-06-2023
            </a>
          </div>
          <div className="Home_Align">
            <div className="left_Side">
              <LeftNotification />
              <LeftInformation />
              <LeftDownload />
            </div>
            <div className="Right_Side">
              <MainContent />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
