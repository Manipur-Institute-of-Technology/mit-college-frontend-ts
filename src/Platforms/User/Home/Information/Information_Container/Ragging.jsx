import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function Ragging() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>Ragging : </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h2>Information about Ragging </h2>
                <p className="info_text">
                  Ragging in any form is totally banned in the entire
                  institution, including its departments, constituent units, all
                  its premises (academic, residential, sports, canteen, etc.)
                  whether located within the campus or outside and in all means
                  of transportation of students whether public or private. The
                  institution shall take strict action against those found
                  guilty of ragging and/or abetting ragging. A student seeking
                  admission to the Institute shall have to submit the
                  undertaking in the prescribed formats of <a href="/" className="inside_Links" target="_blank">Annexure-I &
                  Annexure-II</a> with his/her Application Form under Clause No.
                  6.1.7 of the “AICTE/UGC Regulations on Curbing Menace of
                  Ragging in Higher Educational Institutions, 2009”.
                </p>
              </div>
            </div>
            <div className="Information_right">
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
export default Ragging;
