
import { Administration_drop } from "../Home/Administration/Administration_drop";
import { Department_drop } from "../Home/Department/Department_drop";
import { Facility_drop } from "../Home/Facility/Facility_drop";
import { FeePayment_Drop } from "../Home/Fee_Payment/FeePayment_Drop";
import { Information_drop } from "../Home/Information/Information_drop";

import "./Navbar.css";
export function Navbar() {
  return (
    <div className="Navbar">
      <div className="Navbar_align">
        <div className="home_btn Link_2">
          <a className="nonDrop" href="/">
            Home
          </a>
        </div>
        <div className="Link_2">
          Administration
          <div className="dropDown1">
            <Administration_drop />
          </div>
        </div>
        <div className="department_btn Link_2">
          Department
          <div className="dropDown1">
            <Department_drop />
          </div>
        </div>
        <div className="facility_btn Link_2">
          Facility
          <div className="dropDown1">
            <Facility_drop />
          </div>
        </div>
        <div className="information_btn Link_2">
          Information
          <div className="dropDown1">
            <Information_drop />
          </div>
        </div>
        <div className="fee_Payment_btn Link_2">
          Fee Payment
          <div className="dropDown1">
            <FeePayment_Drop />
          </div>
        </div>
        <div className="exam_btn Link_2">
          <a
            className="nonDrop"
            href="https://www.manipuruniv.ac.in/examform2021/"
            target="_blank"
          >
            Exam
          </a>
        </div>
        <div className="conference_btn Link_2">
          <a className="nonDrop" href="Conference">
            Conference
          </a>
        </div>
        <div className="nirf_btn Link_2">
          <a className="nonDrop" href="NIRF">NIRF</a>
        </div>
        <div className="gallery_btn Link_2">Gallery</div>
        <div className="contact_Us_btn Link_2">
          <a className="nonDrop" href="Contact_Us">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

// export default ;