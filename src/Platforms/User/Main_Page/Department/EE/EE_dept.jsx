import { Navbar } from "../../../Navbar/Navbar";
import "../Department_Style.css";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { Footer } from "../../../Footer/Footer";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
function EE_dept() {
  return (
    <div className="Dept_Container">
      <Navbar />
      <div className="Dept_align">
        <div className="Dept_Tittle">
          <h1>Department</h1>
        </div>
        <div className="Dept_name">
          <h1 className="DeptName_header">
            Department of Electrical Engineering
          </h1>
        </div>
        <div className="Dept_Wrapper">
          <div className="Dept_main_Wrapper">

          <div className="Dept_main">
            <div className="Dept_info">
              <h3>
                The Department is offering B.E. in Electrical Engineering
                (intake 45) from the academic session 2019-20.
              </h3>
              <div className="Dept_info_align"></div>
            </div>
            <div className="Dept_staff">
              <h2>Faculty Members : </h2>
              <div className="Members_align">
                <div className="Members_container Members_container_EE">
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/EE/Members/img_1.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Mr. Th. Sukadeba Singh</h3>
                        <h4>Assistant Professor</h4>
                        <a href="/">sukacm@yahoo.com </a>
                        <p>M.E. </p>
                        <p>Control System, Measurement</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/EE/Members/img_2.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Mr. Khwairakpam Chaoba Singh</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">chaobasit@gmail.com</a>
                        <p>M.Tech.</p>
                        <p>Power System</p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/EE/Members/img_3.jpeg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Mr. Athokpam Bharatbushan Singh</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">Bbsan2043@gmail.com</a>
                        <p>Master in Power Electronics, Pursuing Ph.D.</p>
                        <p>
                          Power Electronics, Electrical Machines, Renewable
                          Energy
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="Box_1">
                    <div className="Box_1_align">
                      <div className="member_img_container">
                        <img
                          className="member_img"
                          src="./Images/Department/EE/Members/img_4.jpg"
                          alt=""
                        />
                      </div>
                      <div className="member_info_box">
                        <h3>Mr. Sanasam Dhanabanta Singh</h3>
                        <h4>Guest Faculty</h4>
                        <a href="/">dhanasanasam1@gmail.com</a>
                        <p>M.Tech, Pursuing Ph.D.</p>
                        <p>Power and Control System</p>
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

export default EE_dept;
