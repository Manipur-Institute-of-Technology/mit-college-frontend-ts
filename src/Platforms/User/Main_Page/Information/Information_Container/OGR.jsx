import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function OGR() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>Online Grievance Redressal : </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h1>Information about Online Grievance Redressal </h1>
                <div className="info_table">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <h3>DEPARTMENTS&nbsp;</h3>
                        </td>
                        <td>
                          <h3>&nbsp;EMAIL ID</h3>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Principal</h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:principal@mitimphal.in">
                            principal@mitimphal.in
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          &nbsp;
                          <h4>Administrative Officer</h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:aomit@mitimphal.in">
                            aomit@mitimphal.in
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          &nbsp;
                          <h4>
                            Department of Computer Science &amp; Engineering
                          </h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:hodcse@mitimphal.in">
                            hodcse@mitimphal.in
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          &nbsp;
                          <h4>
                            Department of&nbsp; Electronics&nbsp;and
                            Communication Engineering
                          </h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:hodcse@mitimphal.in">
                            hodece@mitimphal.in
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          &nbsp;
                          <h4>Department of&nbsp;Civil Engineering</h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:hodcse@mitimphal.in">
                            hodce@mitimphal.in
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          &nbsp;
                          <h4>Department of Basic Sciences and Humanities</h4>
                        </td>
                        <td>
                          &nbsp;
                          <a href="mailto:hodcse@mitimphal.in">
                            hodbsh@mitimphal.in
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
export default OGR;
