import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Administration.css";

function Hostel_admin() {
  return (
    <div className="Administration_container">
      <Navbar />
      <div className="Administration_align">
        <div className="Administration_Tittle">
          <h1 className="">Administration</h1>
        </div>
        <div className="Administration_wrapper">
          <div className="Administration_Header_container">
            <h2 className="Administration_Header">Hostel Administration</h2>
          </div>
          <div className="Administration_body">
            <div className="Administration_main">
              <div className="text_box">
                <h1 className="Administration_main_info_text_header">Administration of Hostels</h1>
                <p>
                  The Institute has one Boys’ Hostel and one Girls' Hostel for a
                  total capacity of 100 and 100 respectively and are managed by
                  two wardens.
                </p>
                <p>
                  <strong>Dr. S. Jitu Singh,</strong> Asst. Prof. of CSE Dept.
                  is the present warden of Boys' Hostel .
                </p>
                <p>
                  <strong>Dr. N. Ashalata Devi,</strong> Asst. Prof. of Basic
                  Sciences & Humanities Dept. is the current warden of Girls'
                  Hostel.
                </p>
              </div>
            </div>
            <div className="Administration_right">
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

export default Hostel_admin;