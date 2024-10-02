import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Administration.css";
function Principal() {
  return (
    <div className="Administration_container">
      <Navbar />

      <div className="Administration_align">
        <div className="Administration_Tittle">
          <h1 className="">Administration</h1>
        </div>
        <div className="Administration_wrapper">
          <div className="Administration_Header_container">
            <h2 className="Administration_Header">Principal : </h2>
          </div>
          <div className="Administration_body">
            <div className="Administration_main">
              <div className="admin_img align_img">
                <img
                  className="P_img"
                  style={{ width: "25%" }}
                  src="./Images/Principal/principal.jpeg"
                  alt=""
                ></img>
              </div>
              <div className="text_box">
                <h1 className="Administration_main_info_text_header">
                  About the the Principal{" "}
                </h1>
                <p>Professor N Basanta Singh</p>
                <p>Principal i/c (w.e.f: 1st July, 2020)</p>
                <p>Member Secretary, Governing Body of MIT</p>
                <p>
                  <strong>Prof. N. Basanta Singh </strong>
                  was born in Imphal, Manipur, India. He received B-Tech degree
                  from T.K.M. College of Engineering, Kerala, M.E from Thapar
                  Institute of Engineering & Technology, Patiala and the Ph.D
                  Degree from National Institute of Technology, Durgapur. He is
                  a Professor in Department of Electronics & Communication
                  Engineering, Manipur Institute of Technology, Manipur
                  University, Manipur, India. He was the Head of the Department
                  of Electronics & Communication Engineering, Manipur Institute
                  of Technology during 2002-2008 and 2010-2014 and Coordinator
                  of Industry-Institute-Interaction Cell (III Cell) of the
                  institute from 2014. He is Member of IEEE, CSI, IETE and Life
                  fellow of The Institution of Engineers (India). He has
                  successfully organized four Refresher/Short Term Courses and
                  one National Conference as Convener. He has attended more than
                  32 Workshops/ Refresher/Short Term Courses. He has published
                  more than 64 (journal:41 & conference: 23) technical research
                  papers in referred journals and conferences. His current
                  research interest includes Modelling and Simulation of
                  Semiconductor Devices.
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

export default Principal;