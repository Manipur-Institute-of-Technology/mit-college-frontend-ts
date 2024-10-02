import { Footer } from "../../Footer/Footer";
import { Navbar } from "../../Navbar/Navbar";
import { LeftDownload } from "../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "./NIRF.css";
function NIRF() {
  return (
    <div className="NIRF_container">
      <Navbar />

      <div className="NIRF_align">
        <div className="NIRF_wrapper">
          <div className="NIRF_Header_container">
            <h2 className="NIRF_Header">NIRF : </h2>
          </div>
          <div className="NIRF_body">
            <div className="NIRF_main">
              <div className="text_box NIRF_text_box">
                <h2>Data for NIRF 2023 Engineering</h2>
                <a
                  href="https://mitimphal.in/uploads/media/m1676654925.pdf"
                  target="_break"
                >
                  Data submitted for NIRF 2023 Engineering
                </a>
                <h2>Data for NIRF 2020 Engineering</h2>
                <a
                  href="https://mitimphal.in/uploads/media/m1578840005.pdf"
                  target="_break"
                >
                  Data submitted for NIRF 2020 Engg
                </a>
                <h2>Data for NIRF 2019 Engineering</h2>
                <a
                  href="https://mitimphal.in/uploads/media/m1578840005.pdf"
                  target="_break"
                >
                  Data submitted for NIRF 2019 Engg
                </a>
                <h2>Data for NIRF 2019 Overall</h2>
                <a
                  href="https://mitimphal.in/uploads/media/m1546416159.pdf"
                  target="_break"
                >
                  Data submitted for NIRF 2019 Overall
                </a>
              </div>
            </div>
            <div className="NIRF_right">
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

export default NIRF;
