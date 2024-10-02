import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function MD() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>Mandatory Disclosures : </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h2>
                  Information about Mandatory Disclosures{" "}
                </h2>
                <a
                  href="https://mitimphal.in/uploads/media/m1645779721.pdf"
                  target="_blank"
                  className="info_link"
                >
                  Click to download
                </a>
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

export default MD;