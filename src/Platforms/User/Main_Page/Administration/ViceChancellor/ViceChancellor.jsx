import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Administration.css";
import data from "../Administration.json";
function ViceChancellor() {
  const vc = data.administration.find((item) => item.id === "Vice-Chancellor");
  return (
    <div className="Administration_container">
      <Navbar />
      <div className="Administration_align">
        <div className="Administration_Tittle">
          <h1>Administration</h1>
        </div>
        <div className="Administration_wrapper">
          <div className="Administration_Header_container">
            <h2>Vice-Chancellor : </h2>
          </div>
          <div className="Administration_body">
            <div className="Administration_main">
              <div className="admin_img align_img">
                <img src="./Images/Vice_Chancellor/VC.jpg" alt=""></img>
              </div>
              <div className="text_box">
                <h1 className="Administration_main_info_text_header">
                  About the the VC{" "}
                </h1>
                <p>{vc.name}</p>
                <p>{vc.info}</p>
                <p>{vc.aboutMIT}</p>
                {/* <p>{vc.description}</p> */}
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

export default ViceChancellor;