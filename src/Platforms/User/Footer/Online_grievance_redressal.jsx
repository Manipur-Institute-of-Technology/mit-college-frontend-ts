import "./Online_grievance_redressal.css";
import React from "react";
import { Navbar } from "../../User/Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { LeftNotification } from "../Main_Page/MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { LeftInformation } from "../Main_Page/MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftDownload } from "../Main_Page/MainContent/LocalNavigation/Left_Download/LeftDownload";

function OGR_footer() {
  return (
    <div className="OGR_footer">
      <Navbar />
      <div className="OGR_footer_Tittle">
        <h1>Online Grievance Redressal Portal-</h1>
      </div>
      <div className="OGR_footer_Wrapper">
        <div className="OGR_footer_body">
          <div className="OGR_footer_body_align">
            <div className="OGR_footer_left">
              <div className="OGR_footer_left_align">
                <div className="OGR_footer_text">
                  <h2>Token No. :</h2>
                  <input type="text" className="OGR_footer_input"></input>
                  <button
                    className="token_submit_btn"
                    type="submit"
                    value="Submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div className="OGR_footer_mid">
              <div className="OGR_footer_form">
                <div className="elements">
                  <strong>Your Name</strong> :
                  <input
                    id="yourname"
                    type="text"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong>Your Mobile No. </strong> :
                  <input
                    id="phone_no."
                    type="number"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong> Your Email Address</strong> :
                  <input
                    id="email"
                    type="text"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong>Tell About Yourself</strong> :
                  <input
                    id="yourname"
                    type="text"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong>Grievance Subject </strong> :
                  <textarea
                    id="message"
                    type="text"
                    style={{ width: "95%", height: "72px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong> Your Grievance</strong> :
                  <textarea
                    id="message"
                    type="text"
                    style={{ width: "95%", height: "72px", border: "0px" }}
                  />
                </div>
                <button className="submit_btn" type="submit" value="Submit">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="OGR_footer_right">
            <LeftNotification />
            <LeftInformation />
            <LeftDownload />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OGR_footer;
