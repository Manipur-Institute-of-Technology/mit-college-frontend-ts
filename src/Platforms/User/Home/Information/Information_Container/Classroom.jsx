import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function Classroom() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>CLASSROOM : </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h2>Information about CLASSROOM </h2>
                <p className="info_text">
                  The classrooms are provided with audio visual aids to avail
                  the facility of e-learning and latest teaching methods using
                  overhead projectors under the funding of AICTE-NEQIP. There is
                  also one Digital Classroom in addition to the above facility.
                </p>
                <div className="classroom_img">
                  <img
                    src="./Images/Classroom/class_1.jpg"
                    className="C_img"
                    alt=""
                  ></img>
                  <img
                    src="./Images/Classroom/class_2.jpg"
                    className="C_img"
                    alt=""
                  ></img>
                  <img
                    src="./Images/Classroom/class_3.jpg"
                    className="C_img"
                    alt=""
                  ></img>
                </div>
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

export default Classroom;