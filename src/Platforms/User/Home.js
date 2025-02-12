import "./Home.css";
import React from "react";
import ImageCarousel, {
	Image_slider,
} from "./Main_Page/Image_slider/Image_slider";
import { LeftNotification } from "./Main_Page/MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { LeftInformation } from "./Main_Page/MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftDownload } from "./Main_Page/MainContent/LocalNavigation/Left_Download/LeftDownload";
import { MainContent } from "./Main_Page/MainContent/Main_body";
import TopNavbar, { Top_Navbar } from "./Navbar/TopNavbar/Top_Navbar";
import { Footer } from "./Footer/Footer";
import { Navbar as OrigNavbar } from "./Navbar/Navbar";
import Navbar from "./Navbar/Navbar1";

function Home() {
	return (
		<div className="HomePage">
			<div className="HomePage_align">
				<TopNavbar />
				<Navbar />
				{/* <div className="HomePage_Nav">
					<OrigNavbar />
				</div> */}

				<div className="HomePage_wrapper">
					{/* <Image_slider /> */}
					<ImageCarousel />
					<div className="HomePage_container">
						<div className="HomePage_top_link">
							<a
								href="https://mitimphal.in/uploads/media/m1592044423.pdf"
								target="_blank"
								rel="noreferrer">
								Civil Engineering (UG Program) accredited by NBA under Tier-II
								for the Academic Year 2020-2021 to 2022-2023 i.e. upto
								30-06-2023
							</a>
						</div>
						<div className="flex flex-col sm:flex-row">
							<div className="w-full sm:w-[30vw] my-1 flex flex-col gap-y-2 ">
								<LeftNotification />
								<LeftInformation />
								<LeftDownload />
							</div>
							{/* <div className="left_Side">
                <LeftNotification />
                <LeftInformation />
                <LeftDownload />
              </div> */}
							<div className="overflow-auto w-full">
								<MainContent />
							</div>
							{/* <div className="Right_Side">
								<MainContent />
							</div> */}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}

export default Home;
