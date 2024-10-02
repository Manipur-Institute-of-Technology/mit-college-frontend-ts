import React from "react";
import "./ContactUs.css";
import { Navbar } from "../../Navbar/Navbar";
import { Footer } from "../../Footer/Footer";
import { LeftNotification } from "../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { LeftInformation } from "../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftDownload } from "../MainContent/LocalNavigation/Left_Download/LeftDownload";

function ContactUs() {
  return (
    <div className="ContactUs">
      <Navbar />
      <div className="ContactUs_Tittle">
        <h1>Contact Us</h1>
      </div>
      <div className="ContactUs_Wrapper">
        <div className="ContactUs_body">
          <div className="ContactUs_body_align">
            <div className="ContactUs_left">
              <div className="ContactUs_left_align">
                <div className="ContactUs_text">
                  <p>Manipur Institute of Technology</p>
                  <p>(A Constituent College of Manipur University)</p>
                  <p>Takyelpat, Imphal - 795001, Manipur , India</p>
                </div>
                <iframe
                  className="map_edit"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57949.59763967092!2d93.82756590843199!3d24.800594410110584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374925ce7ee0c749%3A0x4e577411f1653a2d!2sManipur%20Institute%20of%20Technology%2C%20Manipur%20University!5e0!3m2!1sen!2sin!4v1723535190220!5m2!1sen!2sin"
                  title="Example Map"
                  style={{ width: "550px", height: "450px" }} // The value must be an object
                ></iframe>
              </div>
            </div>
            <div className="ContactUs_mid">
              <div className="ContactUs_form">
                <div className="elements">
                  <strong>Your Name</strong> :
                  <input
                    id="yourname"
                    type="text"
                    name="NAME"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong> Your Email Address</strong> :
                  <input
                    id="email"
                    type="text"
                    name="EMAIL"
                    style={{ width: "95%", height: "28px", border: "0px" }}
                  />
                </div>
                <div className="elements">
                  <strong> Message</strong> :
                  <textarea
                    id="message"
                    type="text"
                    name="MESSAGE"
                    style={{ width: "95%", height: "72px", border: "0px" }}
                  />
                </div>
                <button className="submit_btn" type="submit" value="Submit">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="ContactUs_right">
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

export default ContactUs;
