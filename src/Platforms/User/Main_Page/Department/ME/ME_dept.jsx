import { Navbar } from "../../../Navbar/Navbar";
import "../Department_Style.css";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { Footer } from "../../../Footer/Footer";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
function ME_dept() {
  return (
    <div className="Dept_Container">
      <Navbar />
      <div className="Dept_align">
        <div className="Dept_Tittle">
          <h1>Department</h1>
        </div>
        <div className="Dept_name">
          <h1 className="DeptName_header">
            Department of Mechanical Engineering
          </h1>
        </div>
        <div className="Dept_Wrapper">
          <div className="Dept_main_Wrapper">

          <div className="Dept_main">
            <div className="Dept_info">
              <div className="Dept_info_align">
                <h3>
                  The Department is offering B.E. in Mechanical Engineering
                  (intake 30) from the academic session 2019-20.
                </h3>
              </div>
            </div>
            <div className="Dept_staff">
              <h2>Faculty Members : </h2>
              <div className="Members_align">
                <div className="Members_container Members_container_ME">
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/ME/Members/img_1.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Dr. Syed Mujibur Rahman</h3>
                        <h4>Assistant Professor</h4>
                        <a href="/">mujib27mit@gmail.com</a>
                        <p>Ph.D.</p>
                        <p>Thermal Engg. and Renewable Energy</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/ME/Members/img_2.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Dr. Ngangkham Peter Singh</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">peter.mit.me@manipuruniv.ac.in </a>
                        <p>Ph.D. </p>
                        <p>Advanced Materials Technology</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/ME/Members/img_3.jpeg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Dr. Rajkumar Shufen</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">rajkumar.shufen@iitg.ac.in </a>
                        <p>Ph.D.</p>
                        <p>Materials and Design</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/ME/Members/img_4.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Dr. Maisanam Anil Kumar Singh</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">hianil09@gmail.com </a>
                        <p>Ph.D.</p>
                        <p>Thermal Engineering</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/ME/Members/img_5.jpeg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Dr. Satishchandra Salam</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">satisji@gmail.com</a>
                        <p>Ph.D.</p>
                        <p>Applied Thermal Sciences</p>
                      </div>
                    </div>
                  </div>
                </div>
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

export default ME_dept;