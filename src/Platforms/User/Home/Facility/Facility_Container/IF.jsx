import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Facility.css";
function IF() {
  return (
    <div className="Facility_container">
      <Navbar />

      <div className="Facility_align">
        <div className="Facility_Tittle">
          <h1 className="">Facility</h1>
        </div>
        <div className="Facility_wrapper">
          <div className="Facility_Header_container">
            <h2 className="Facility_Header">Internet Facility : </h2>
          </div>
          <div className="Facility_body">
            <div className="Facility_main">
              <div className="text_box facility_text_box">
                <div className="Library_Facility_img">
                  <img src="./Images/Facility/IF_img_1.jpg"></img>
                </div>
                <h2>Information about Internet Facility </h2>
                <ol>
                  <li>
                    High speed Internet access with separate Cable connectivity
                    for academic and browsing centre. All the three Computer
                    Labs. of CSE Dept. of MIT are connected to Internet.
                  </li>
                  <li>Wi-Fi Campus</li>
                </ol>
              </div>
            </div>
            <div className="Facility_right">
              <LeftNotification />
              <LeftInformation />
              <LeftDownload />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default IF;