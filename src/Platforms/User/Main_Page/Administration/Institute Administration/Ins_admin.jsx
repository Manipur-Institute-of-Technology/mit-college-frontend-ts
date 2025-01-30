import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Administration.css";

function Ins_admin() {
  return (
    <div className="Administration_container">
      <Navbar />
      <div className="Administration_align">
        <div className="Administration_Tittle">
          <h1 className="">Administration</h1>
        </div>
        <div className="Administration_wrapper">
          <div className="Administration_Header_container">
            <h2 className="Administration_Header">Institute Administration</h2>
          </div>
          <div className="Administration_body">
            <div className="Administration_main">
              <h1>Administration of the Institute</h1>
              <h3>
                The Institute is managed by a Governing Body headed by the
                Hon’ble Vice Chancellor, Manipur University. The structure of
                the Governing Body is as below:
              </h3>
              <div className="Administration_table">
                <ol>
                  <li>Vice-Chancellor (Ex-officio)</li>
                  <li>Registrar (Ex-officio)</li>
                  <li>One member nominated by the Vice-Chancellor</li>
                  <li> Finance Officer (Ex-officio)</li>
                  <li>Two members of the Executive Council nominated by it</li>
                  <li>Dean School of Engineering</li>
                  <li>
                    One member not connected with the University nominated by
                    the Executive Council
                  </li>
                  <li>
                    One Professor of the Institute, by rotation according to
                    seniority, for a period of one year
                  </li>
                  <li>
                    {" "}
                    One Associate Professor of the Institute, by rotation
                    according to seniority, for a period of one year
                  </li>
                  <li>One nominee of the AICTE</li>
                  <li>The Director of the Institute (Ex-officio)</li>
                </ol>
                <ul>
                  <li>- Chairman</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member Secy</li>
                </ul>
              </div>
              <h3>
                Name & Professional Background of Governing Body members of
                Manipur Institute of Technology as on 26/10/2021
              </h3>
              <div className="Administration_table">
                <ol>
                  <li>
                    Prof. N. Lokendra Singh, Vice-Chancellor, Manipur University
                  </li>
                  <li>
                    Prof. W. Chandbabu Singh, Registrar, Manipur University
                  </li>
                  <li>
                    Prof. A. RajmaniSingha, Finance Officer, Manipur University
                  </li>
                  <li>
                    Prof. S. Ibotombi Singh, Dean, School of Human &
                    Environmental Science, Manipur University
                  </li>
                  <li>
                    Prof. K. Yugindro Singh, Dean, School of Mathematical &
                    Physical Sciences, Manipur University
                  </li>
                  <li>
                    Prof. R.K. Hemakumar Singh, Dean, School of Engineering,
                    Manipur University
                  </li>
                  <li>
                    Prof. N.C. Shivaprakash, Department of Instrumentation and
                    Applied Physics, Indian Institute of Science, Bangalore
                    560012
                  </li>
                  <li>
                    {" "}
                    Dr. Th. Suresh Singh, Associate Professor, CE Deptt., MIT,
                    Imphal
                  </li>
                  <li>
                    Dr. S. Jitu Singh, Assistant Professor(S3), CSE Deptt., MIT,
                    Imphal
                  </li>
                  <li> Prof. N. Basanta Singh, Principal i/c, MIT, Imphal</li>
                </ol>
                <ul>
                  <li>- Chairman</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member</li>
                  <li>- Member Secy</li>
                </ul>
              </div>
              <h3>Proceedings of the BoG/GB meetings of MIT :</h3>
              <ul className="Administration_table_links">
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 5th GB meeting held on 08-05-2013
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of Special GB meeting held on 06-09-2014
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 6th GB meeting held on 25-06-2015
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 7th GB meeting held on 07-12-2015
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 8th GB meeting held on 16-02-2016
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 9th GB meeting held on 22-03-2016
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 10th GB meeting held on 15-07-2016
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of 11th GB meeting held on 02-12-2016
                </a>
                <a
                  onClick={() => alert("Under Maintenance")}
                  target="_blank"
                >
                  Proceedings of Emergency GB meeting held on 28-01-2017
                </a>
              </ul>
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

export default Ins_admin;
