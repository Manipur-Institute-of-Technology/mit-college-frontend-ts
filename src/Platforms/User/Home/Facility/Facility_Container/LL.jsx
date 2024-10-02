import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Facility.css";
function LL() {
  return (
    <div className="Facility_container">
      <Navbar />

      <div className="Facility_align">
        <div className="Facility_Tittle">
          <h1 className="">Facility</h1>
        </div>
        <div className="Facility_wrapper">
          <div className="Facility_Header_container">
            <h2 className="Facility_Header">LANGUAGE LAB. : </h2>
          </div>
          <div className="Facility_body">
            <div className="Facility_main">
              <div className="text_box facility_text_box">
                <h2>Information about LANGUAGE LAB. </h2>
                <p className="facility_text">
                  The Institute has a Language Lab. under the funding of
                  AICTE-NEQIP to improve the communication as well as writing
                  skill particularly for the students of this Institute. There
                  are 20 clients/terminals with one Workstation Server. This
                  Laboratory provides facilities for the faculties also to
                  improve their teaching methods and techniques
                </p>
                <div className="Library_Facility_img">
                  <img src="./Images/Facility/LL_img_1.jpg"></img>
                </div>
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

export default LL;