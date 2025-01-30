import { Navbar } from "../../../Navbar/Navbar";
import "../Department_Style.css";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { Footer } from "../../../Footer/Footer";
function CE_dept() {
  return (
    <div className="Dept_Container">
      <Navbar />
      <div className="Dept_align">
        <div className="Dept_Tittle">
          <h1>Department</h1>
        </div>
          <div className="Dept_name">
            <h1 className="DeptName_header">Department of Civil Engineering</h1>
          </div>
        <div className="Dept_Wrapper">
          <div className="Dept_main_Wrapper">
            <div className="Dept_main">
              <div className="Dept_info">
                <h2>
                  Civil Engineering department presently offers the following
                  programmes:
                </h2>
                <div className="Dept_info_align">
                  <ol>
                    <li>B.E. in Civil Engineering</li>
                    <li>M. Tech. in the following specialisations</li>
                    <ul>
                      <li>Structural Engineering</li>
                      <li>Geotechnical Engineering</li>
                      <li>Water Resources Engineering</li>
                      <li>Transportation Engineering</li>
                      <li>Environmental Engineering</li>
                    </ul>
                    <li>Ph. D. in Civil Engineering</li>
                  </ol>
                </div>
              </div>
              <div className="Dept_moreInfo">
                <h3>Vision:</h3>
                <p>
                  To be a leader in Civil Engineering education by imparting
                  quality technical knowledge to achieve excellence in academic
                  research, industry and entrepreneurship.
                </p>
                <br />
                <h3>Mission:</h3>
                <ol>
                  <li>
                    To empower students and faculty with broad knowledge in
                    Civil Engineering and applications.
                  </li>
                  <li>
                    To produce Civil engineers, capable of handling technical
                    and social challenges.
                  </li>
                  <li>
                    To produce entrepreneurs capable of solving present problems
                    of the society.
                  </li>
                  <li>
                    To provide technological services which are sustainable and
                    environment friendly.
                  </li>
                </ol>
                <br />
                <h3>Programme Educational Objectives (PEOs):</h3>
                <ol>
                  <li>
                    Graduates will be actively engaged in a professional career
                    as a civil engineer or a related field, an entrepreneur or
                    pursuing higher study.
                  </li>
                  <li>
                    Graduates will understand professional practice and
                    demonstrate a commitment to act as a responsible, effective
                    and ethical citizen undertaking lifelong learning
                  </li>
                  <li>
                    Graduates guided by principles of sustainable development
                    will understand how their activities as a civil engineer or
                    an entrepreneur or in a related field affect society and
                    environment.
                  </li>
                  <li>
                    Graduates will develop their communication skills when
                    working as team members or leaders, so that they can
                    actively participate in their communities and their
                    profession.
                  </li>
                </ol>
                <div className="workshop_img">
                  <div className="img_align">
                    <img src="./Images/Department/CE/lab_1.jpg" alt=""></img>
                    <img src="./Images/Department/CE/lab_2.jpg" alt=""></img>
                  </div>
                </div>
                <br />
              </div>
              <div className="Dept_staff">
                <h2>Faculty Members : </h2>
                <div className="Members_align">
                  <div className="Members_container">
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_1.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Suresh Thokchom</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">thok_s@rediffmail.com </a>
                          <p>Ph.D.</p>
                          <p>Structural Engg.</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_2.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Thokchom Kiranbala Devi</h3>
                          <h4>Associate Professor</h4>
                          <a href="/">kiranbala_th@mitimphal.in </a>
                          <p>Ph.D.</p>
                          <p>Structural Engg.</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_3.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Th. Somchand Singh </h3>
                          <h4>Associate Professor </h4>
                          <a href="/">thangjam_somchand@yahoo.com </a>
                          <p>Ph.D.</p>
                          <p>Water Resources Engg.</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_4.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Y. Arunkumar Singh</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">y_arunmit@rediffmail.com </a>
                          <p>Ph.D.</p>
                          <p>Transportation Engg.</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="tag_align">
                        <div className="HOD_tag">
                          <p className="hod_tag_text">HOD</p>
                          <div className="tag_1"></div>
                          <div className="tag_2"></div>
                          <div className="tag_3"></div>
                        </div>
                      </div>
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_5.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Sangeeta Shougrakpam</h3>
                          <h4>Associate Professor & HOD (wef 7-11-2023)</h4>
                          <a href="/">ssangeetamit@gmail.com</a>
                          <p>Ph.D.</p>
                          <p>Geotechnical Engineering</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_6.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Konsam Rambha Devi</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">mail_rambha@yahoo.co.in </a>
                          <p>Ph.D.</p>
                          <p>
                            Dynamic properties of clay, Site investigations,
                            soil stabilization
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_7.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Nongthombam Premananda Singh</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">nps.env.mit@gmail.com</a>
                          <p>Ph.D.</p>
                          <p>
                            Urban Air Quality, Human Exposure
                            Assesment/Environment Engineering
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_8.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. N. Sukumar Singh</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">
                            sukumar@manipuruniv.ac.in, sukunao@gmail.com{" "}
                          </a>
                          <p>Ph.D.</p>
                          <p>
                            Structural Engg.: Structural Dynamics, Earthquake
                            Related Analysis, FEM, etc.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_9.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Ch. Gobin Singh</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">chgobin@rediffmail.com </a>
                          <p>Ph.D.</p>
                          <p>Sedimentology</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_10.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Mr. Nahakpam Hitler Singh</h3>
                          <h4>Guest Faculty </h4>
                          <a href="/">hitler_ju@yahoo.co.in</a>
                          <p>M.Tech</p>
                          <p>Environmental Engineering. </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_11.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Mr. Khumallambam Allinson</h3>
                          <h4>Guest Faculty </h4>
                          <a href="/">allinsonkh@gmail.com</a>
                          <p>M.Tech</p>
                          <p>Infrastructure Construction & Management</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/CE/Members/img_12.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Mr. Thoudam Jagat Singh</h3>
                          <h4>Guest Faculty </h4>
                          <a href="/">jagat.thoudam@gmail.com </a>
                          <p>M.Tech</p>
                          <p>
                            Structural Enginèeing, Performance based engineering
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Dept_lab">
                <h2>Concrete lab.</h2>
                <div className="DepLab_wrapper">
                  <div className="DeptLab_container">
                    <div className="DeptLab_pic">
                      <img src="./Images/Department/CE/lab_3.jpg" alt="" />
                    </div>
                  </div>
                </div>
                <div className="DeptLab_info">
                  <h3>Other Major Equipments are:-</h3>
                  <ol>
                    <li>Microprocessor based UV-visible Spectrophotometer</li>
                    <li>Tri-Axial testing Apparatus</li>
                    <li>Portable DO Meter</li>
                    <li>Digital Control BOD Incubator</li>
                    <li>Trimble Total Station</li>
                    <li>Digital Flame Photometer</li>
                    <li>Electrical Analogy Apparatus</li>
                    <li>Hele-Shaw Apparatus</li>
                    <li>Water Hammer Surge Apparatus</li>
                    <li>Marshal Apparatus</li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="Right_main">
              <LeftNotification />
              <LeftDownload />
              <LeftInformation />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CE_dept;
