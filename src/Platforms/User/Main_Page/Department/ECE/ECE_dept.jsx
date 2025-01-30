import { Navbar } from "../../../Navbar/Navbar";
import "../Department_Style.css";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import { Footer } from "../../../Footer/Footer";
function ECE_dept() {
  return (
    <div className="Dept_Container">
      <Navbar />
      <div className="Dept_align">
        <div className="Dept_Tittle">
          <h1>Department</h1>
        </div>
          <div className="Dept_name">
          <h1 className="DeptName_header">
            Department of Electronics & Communication Engineering
          </h1>
          </div>
        <div className="Dept_Wrapper">
          <div className="Dept_main_Wrapper">
            <div className="Dept_main">
              <div className="Dept_info">
                <h3>The Department presently offers the following programmes:</h3>
                <div className="Dept_info_align">
                  <p>1. B.E. in Electronics & Communication Engineering</p>
                  <ul>
                    <li>2. M. Tech in the following specialisations : </li>
                    <li>a) Microelectronics and VSLI</li>
                    <li>b) Communication and Signal Processing </li>
                  </ul>
                  <p>3. Ph. D. in Electronics & Communication Engineering</p>
                </div>
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
                            src="./Images/Department/ECE/Members/img_1.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Prof. N. Basanta Singh</h3>
                          <h4>Professor </h4>
                          <a href="/">basanta_n@rediffmail.com</a>
                          <p>Ph.D.</p>
                          <p>Modelling & Simulation of Semiconductor Devices</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/imh_2.png"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Kh. Jolson Singh</h3>
                          <h4>Associate Professor</h4>
                          <a href="/">jolly4u2@rediffmail.com</a>
                          <p>Ph.D.</p>
                          <p>Devices, Biomedical Engg</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_3.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Romesh Laishram</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">romeshlaishram@gmail.com</a>
                          <p>Ph.D.</p>
                          <p>
                            Communication & Signal processing, Image Processing,
                            Swarm Intelligence, Robotics, VLSI
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_4.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Sharmila Meinam</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">sharmila_meinam@yahoo.com </a>
                          <p>M.E.</p>
                          <p>Communication</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_5.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Kh. Renuca Devi</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">khrenucamit@yahoo.com </a>
                          <p>M.E.</p>
                          <p>
                            Communication (Pursuing Ph.D. at Manipur University)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_6.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>A. Balarampyari Devi</h3>
                          <h4>Associate Professor </h4>
                          <a href="/">balaramaribam@gmail.com </a>
                          <p>M.Tech.</p>
                          <p>VLSI & Embedded system</p>
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
                            src="./Images/Department/ECE/Members/img_7.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Ghaneshori Thingbaijam</h3>
                          <h4>Assistant Professor & HoD (wef 7-11-2023)</h4>
                          <a href="/">ghaneth@yahoo.co.in </a>
                          <p>M.E.</p>
                          <p>Communication</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_8.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Nemthianhoi Zou P</h3>
                          <h4>Associate Professor </h4>
                          <p>M.Tech. (Electronics & Communication Engg.)</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_9.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Dickson Warepam</h3>
                          <h4>Guest Faculty </h4>
                          <a href="/">dicksonwarepam@gmail.com </a>
                          <p>Ph.D. </p>
                          <p>
                            Optoelectronic Devices, Semiconductor Materials for
                            Solar Cell, Micro Electronics and Control Systems
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_10.jpg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. L. Kholee Phimu</h3>
                          <h4>Guest Faculty </h4>
                          <a href="/">kholeephimu@gmail.com </a>
                          <p>Ph. D.</p>
                          <p>Solar Cells, semiconductor devices</p>
                        </div>
                      </div>
                    </div>
                    <div className="Box_1">
                      <div className="Box_1_align">
                        <div className="member_img_container">
                          <img
                            className="member_img"
                            src="./Images/Department/ECE/Members/img_11.jpeg"
                            alt=""
                          />
                        </div>
                        <div className="member_info_box">
                          <h3>Dr. Paikhomba Loktongbam</h3>
                          <h4>Guest Faculty</h4>
                          <a href="/">pailee.li81@gmail.com </a>
                          <p>Ph. D.</p>
                          <p>
                            Design and Analytical Modelling of mm-wave dipole
                            antennas, Biomedical implantable antennas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <>
                {/* <div className="Dept_lab">
                <h2>Lab</h2>
                <div className="DepLab_wrapper">
                  <div className="DeptLab_container"></div>
                  <div className="DeptLab_container"></div>
                </div>
              </div>
              <div className="Dept_moreInfo">
                <h2>Dept Info</h2>
                <p>
                  mnfsjkdfhgsdnmfgkudshfgmnsldkfgnksdhjglndfg;lksndfgmhdfgnsdflgjesrgnudsfngm,dnsfglkjeorlkg
                </p>
                <p>
                  mnfsjkdfhgsdnmfgkudshfgmnsldkfgnksdhjglndfg;lksndfgmhdfgnsdflgjesrgnudsfngm,dnsfglkjeorlkg
                </p>
                <p>
                  mnfsjkdfhgsdnmfgkudshfgmnsldkfgnksdhjglndfg;lksndfgmhdfgnsdflgjesrgnudsfngm,dnsfglkjeorlkg
                </p>
                <h3>sjfsdbjhfgajbsfdjhaf</h3>
                <p>
                  mnfsjkdfhgsdnmfgkudshfgmnsldkfgnksdhjglndfg;lksndfgmhdfgnsdflgjesrgnudsfngm,dnsfglkjeorlkg
                </p>
              </div> */}
              </>
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

export default ECE_dept;
