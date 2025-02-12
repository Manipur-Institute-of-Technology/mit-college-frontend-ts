import Navbar from "../../../Navbar/Navbar1";
import TopNavbar from "../../../Navbar/TopNavbar/Top_Navbar";
import "../Department_Style.css";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { Footer } from "../../../Footer/Footer";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
function CSE_dept() {
	return (
		<div className="Dept_Container m-0 p-0">
			<TopNavbar />
			<Navbar />
			<div className="Dept_align">
				<div className="Dept_Tittle">
					<h1>Department</h1>
				</div>
				<div className="Dept_name">
					<h1 className="DeptName_header">
						Department of Computer Science & Engineering
					</h1>
				</div>
				<div className="Dept_Wrapper">
					<div className="Dept_main_Wrapper">
						<div className="Dept_main">
							<div className="Dept_info">
								<h3>
									The Department presently offers the following programmes:
								</h3>
								<div className="Dept_info_align">
									<p>1. B.E. in Computer Science & Engineering</p>
									<p>2. M. Tech in Computer Science & Engineering</p>
								</div>
							</div>
							<div className="Dept_staff">
								<h2>Faculty Members : </h2>
								<div className="Members_align">
									<div className="Members_container Members_container_CSE">
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
														src="./Images/Department/CSE/Members/img_1.jpeg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Dr. Th. Ibungomacha Singh</h3>
													<h4>Associate Professor & HoD (wef 7-11-2023) </h4>
													<a href="/">ibomcha.2007@rediffmail.com </a>
													<p>Ph.D.</p>
													<p>Image Processing</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_2.jpg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Dr. Ranbir Soram</h3>
													<h4>Associate Professor</h4>
													<a href="/">ranbirsoram@gmail.com </a>
													<p>Ph.D.</p>
													<p>Elliptic Curve Cryptography,WSN</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_3.jpeg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Dr. Sapam Jitu Singh </h3>
													<h4>Associate Professor </h4>
													<a href="/">sapamjitu@gmail.com </a>
													<p>Ph.D.</p>
													<p>Robotics, AI</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_4.jpg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Dr. Takhellambam Sonamani Singh</h3>
													<h4>Associate Professor </h4>
													<a href="/">sona.cse2013@gmail.com</a>
													<p>Ph.D.</p>
													<p>Wireless Sensor Network, Software Engineering</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_5.jpg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Selina Khoirom</h3>
													<h4>Associate Professor</h4>
													<a href="/">selinakh@gmail.com</a>
													<p>M.Tech.</p>
													<p>OS, Cloud Computing. Java</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_6.jpg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Dr. Rajeev Rajkumar</h3>
													<h4>Associate Professor </h4>
													<a href="/">rajeev.bono@gmail.com </a>
													<p>Ph.D.</p>
													<p>Digital Image Processing, Networking</p>
												</div>
											</div>
										</div>
										<div className="Box_1">
											<div className="Box_1_align">
												<div className="member_img_container">
													<img
														className="member_img"
														src="./Images/Department/CSE/Members/img_7.jpg"
														alt=""
													/>
												</div>
												<div className="member_info_box">
													<h3>Pebam Binodini</h3>
													<h4>Guest Faculty</h4>
													<a href="/">tambipebam@gmail.com</a>
													<p>M.E.</p>
													<p>
														Wireless Network, Computer Organisation, Computer
														Architecture
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="Dept_lab">
								<h2>Lab</h2>
								<div className="DepLab_wrapper">
									<div className="CSE_lab_img">
										<img src="./Images/Department/CSE/img_1.jpg" alt=""></img>
									</div>
									<div className="CSE_lab_img">
										<img src="./Images/Department/CSE/img_2.jpg" alt=""></img>
									</div>
								</div>
							</div>
							<div className="Dept_moreInfo">
								<h2>Facilities</h2>
								<p>
									The Department has several state of the art Computer
									Laboratories with a host of servers, workstation and a large
									number of i3 and i5 Desktop Computers connected to the
									Campus-wide LAN with access to the internet through NKN
									(National Knowledge Network). The system runs on wide variety
									of operating systems including Linux Red hat, Windows 7
									Professional, Windows 8, High profile Anti-Virus, MySQL,
									Oracle, Visual Studio, Adobe Premier, Maya (Latest). The
									laboratories are equipped with up-to-date office automation
									software, file servers in addition to the various
									state-of-the-art compilers and programming environment i.e.
									Hardware Lab., Software Lab., Networking Lab., and Graphic
									Lab. well equipped with latest Core i3, i5 PC’s etc. The
									network laboratory is equipped with wireless networking
									system, LAN trainers and Wi-Fi connection. There is a hardware
									Lab. equipped with various training kits, experimental setup,
									analyser equipment etc.
								</p>
								<ol>
									<li>
										PCs: Core i3 and i5 Desktop Computers and Data Server are
										available in various laboratories.
									</li>
									<li>INTERNET:</li>
									<ul>
										<li>
											High speed Internet access with separate Cable
											connectivity for academic, all Departments, Hostels,
											Library and browsing centre.
										</li>
										<li>Wi-Fi Campus</li>
									</ul>
								</ol>
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

export default CSE_dept;
