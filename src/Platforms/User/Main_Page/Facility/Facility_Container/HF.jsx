import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Facility.css";
function HF() {
  return (
    <div className="Facility_container">
      <Navbar />

      <div className="Facility_align">
        <div className="Facility_Tittle">
          <h1 className="">Facility</h1>
        </div>
        <div className="Facility_wrapper">
          <div className="Facility_Header_container">
            <h2 className="Facility_Header">Hostel Facility : </h2>
          </div>
          <div className="Facility_body">
            <div className="Facility_main">
              <div className="text_box facility_text_box">
                <h2>Information about Hostel Facility </h2>
                <p className="facility_text">
                  The Institute has one Boys’ Hostel having capacity of 100
                  students and one Girls' Hostel at M.U. Campus, Canchipur
                  having capacity of 100 students and are managed by two
                  wardens.
                </p>
                <div>
                  <table >
                    <tbody>
                      <tr>
                        <td>
                          <p>
                            i) <strong>Dr.&nbsp;S Jitu&nbsp;Singh</strong>
                            <br /> Asst.Professor, CSE Dept&nbsp;
                          </p>
                        </td>
                        <td>Warden Boys' Hostel&nbsp;&nbsp;</td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            i) <strong>Dr.&nbsp;N. Ashalata Devi</strong>
                            <br /> Asst.Professor, Basic Sciences &amp;
                            Humanities Dept&nbsp;
                          </p>
                        </td>
                        <td>&nbsp;Warden Girls' Hostel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h3>HOSTEL FEE</h3>
                <p>As per the Hostel Fee Structure of Manipur University.</p>
              </div>
            </div>
            <div className="Facility_right">
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

export default HF;