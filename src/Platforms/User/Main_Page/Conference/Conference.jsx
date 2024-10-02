import { Footer } from "../../../User/Footer/Footer";
import { Navbar } from "../../../User/Navbar/Navbar";
import { LeftDownload } from "../../Main_Page/MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../Main_Page/MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../Main_Page/MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "./Conference.css";
function Conference() {
  return (
    <div className="Conference_container">
      <Navbar />

      <div className="Conference_align">
        <div className="Conference_wrapper">
          <div className="Conference_Header_container">
            <h2 className="Conference_Header">Conference : </h2>
          </div>
          <div className="Conference_body">
            <div className="Conference_main">
              <div className="text_box">
                <h1 className="Conference_main_info_text_header">NATIONAL</h1>
                <ol className="Conference_text_box">
                  <li>
                    <a href="#">
                      National Conference on Innovations in Science and
                      Technology 2017, 20-21 March 2017.
                    </a>
                  </li>
                </ol>
                <h2>STATE</h2>
              </div>
            </div>
            <div className="Conference_right">
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

export default Conference;
