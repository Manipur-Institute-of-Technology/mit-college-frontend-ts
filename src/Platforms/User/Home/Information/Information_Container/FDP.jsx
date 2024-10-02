import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function FDP() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>
              Faculty Development Program :{" "}
            </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h2>
                  Information about Faculty Development Program{" "}
                </h2>
                <p className="info_text">
                  The Institute is actively involved in upgradation of its human
                  resources by deputing faculty and staff members for higher
                  studies and to attend Staff Development Programme in different
                  fields at NITTTR, Kolkata, Manipur University, Imphal ,and
                  other reputed Institutes. Faculty and staff members are also
                  encouraged to pursue higher studies in order to improve the
                  quality of Education.
                </p>
                <h2>RESEARCH & DEVELOPMENT</h2>
                <p className="info_text">
                  The Faculty members and students of this Institute are
                  actively involved in many Research Works and Consultancy
                  works. Many research papers are published in the highly rated
                  National & International Journals.
                </p>
                <h3>Some of the major publications are:-</h3>
                <h3>International Journals:</h3>
                <ol>
                  <li>
                    International Journal of Pavement Engineering, Taylor and
                    Francis Publications.
                  </li>
                  <li>
                    International Journal of Road Materials and Pavement Design,
                    Taylor and Francis Publications.
                  </li>
                  <li>Geosciences Journal, South Korea</li>
                  <li>Engineering Optimization, U.K.</li>
                  <li>ASCE Journal of Hydrology Engineering, USA</li>
                  <li>
                    International Journal of Geotechnical, Maney Publication
                  </li>
                  <li>
                    International Journal of Earth Science & Engineering,
                    Geo-Ref Information Services, USA
                  </li>
                  <li>
                    International Journal of Engineering Research & Technology,
                    ESRSA Publication
                  </li>
                  <li>
                    Journal of Civil Engineering & Management, Taylor & Francis
                    Publications
                  </li>
                  <li>Canadian Journal of Civil Engineering, NRC Press</li>
                  <li>
                    Arabian Journal for Science & Engineering, SPRINGER
                    Publication
                  </li>
                  <li>Wulfenia Journal, Austria</li>
                  <li>Journal of Engineering Science & Technology Review</li>
                  <li>IEEE Transaction of Nano Technology</li>
                  <li>Journal of Computational Electronics, SPRINGER</li>
                  <li>Optical & Quantum Electronics, SPRINGER</li>
                  <li>Solid State Electronics, ELSEVIER</li>
                  <li>Journal of Computational & Theoretical Nano Science</li>
                  <li>Micro Electronics Reliability, ELSEVIER</li>
                  <li>Journal of Nano-Electronics & Opto-Electronics</li>
                  <li>Physica B Condensed Matter, ELSEVIER</li>
                  <li>Expert System with Application, ELSEVIER</li>
                  <li>
                    International Journal of Electronics, Taylor & Francis
                  </li>
                  <li>
                    nternational Journal of Computer Science and Network
                    Security, Korea
                  </li>
                  <li>International Journal on Natural Language Computing</li>
                </ol>
                <h3>National Journals:</h3>
                <ol>
                  <li>Indian Highways, Indian Road Congress, New Delhi</li>
                  <li>Journal of Indian Geotechnical Society, SPRINGER</li>
                  <li>
                    Journal of Earth System Science, Indian Academy of Science
                  </li>
                </ol>
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

export default FDP;