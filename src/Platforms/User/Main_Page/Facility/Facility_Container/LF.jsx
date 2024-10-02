import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Facility.css";
function LF() {
  return (
    <div className="Facility_container">
      <Navbar />

      <div className="Facility_align">
        <div className="Facility_Tittle">
          <h1>Facility</h1>
        </div>
        <div className="Facility_wrapper">
          <div className="Facility_Header_container">
            <h2 className="Facility_Header">Library Facility : </h2>
          </div>
          <div className="Facility_body">
            <div className="Facility_main">
              <div className="text_box facility_text_box">
                <h2>Information about Facility </h2>
                <div className="Library_Facility_img">
                  <img src="./Images/Facility/LF_img_1.jpg"></img>
                </div>
                <p className="facility_text">
                  (i) Ms. N. Ashakiran Devi - Librarian M.L.I.Sc. – Gauhati
                  University
                </p>
                <p>
                  The Library has adequate number of Textbooks, Reference Books
                  and Journals. The Institute is a subscriber of different
                  e-journals of INDEST - Consortium, through which, faculty,
                  staff and students of the Institute can access on-line
                  journals from various Societies.
                </p>
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

export default LF;