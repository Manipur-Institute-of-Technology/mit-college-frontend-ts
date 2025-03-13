import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function PublicFooter() {
	return (
		<>
			<div className="w-full bg-slate-900 text-slate-100 py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center md:items-stretch md:text-left text-center flex-wrap flex-col md:flex-row gap-y-2 gap-x-4">
					<div className="relative w-full md:w-fit py-2 md:self-center lg:border-r lg:border-r-gray-50 lg:pr-2">
						<div className="w-full">
							<img
								src="/Manipur_University_Logo1.png"
								alt="mu logo"
								className="block m-auto"
								style={{
									width: 100,
									height: "auto",
								}}
							/>
						</div>
						<div className="py-1 text-sm text-center">
							<div className="text-slate-50 font-bold text-lg">
								Manipur Institute of Technology
							</div>
							<div>
								<p className="text-slate-100">
									(A Constitute College of Manipur University)
								</p>
								<p className="text-slate-200">
									Takyelpat, Imphal - 795001, Manipur, India
								</p>
							</div>
						</div>
					</div>

					<div className="py-1">
						<div className="text-slate-50 font-semibold text-lg">
							Department
						</div>
						<ul className="list-none text-sm">
							<li>
								<a href="CE_dept">Department of Civil Engineering</a>
							</li>
							<li>
								<a href="ECE_dept">
									Department of Electronics & Communication Engineering
								</a>
							</li>
							<li>
								<a href="CSE_dept">
									Depatrment of Computer Sciences & Engineering
								</a>
							</li>
							<li>
								<a href="BSC_dept">Depatrment of Basic Sciences & Humanities</a>
							</li>
							<li>
								<a href="ME_dept">Depatrment of Mechanical Engineering</a>
							</li>
							<li>
								<a href="EE_dept">Depatrment of Electrical Engineering</a>
							</li>
						</ul>
					</div>

					<div className="py-1">
						<div className="text-slate-50 font-semibold text-lg">Facility</div>
						<ul className="list-none text-sm">
							<li>
								<a href="Library_Facility">Library Facility</a>
							</li>
							<li>
								<a href="Internet_Facility">Internet Facility</a>
							</li>
							<li>
								<a href="Hostel_Facility">Hostel Facility</a>
							</li>
							<li>
								<a href="Language_Lab">Language Lab</a>
							</li>
						</ul>
					</div>

					<div className="py-1">
						<div className="text-slate-50 font-semibold text-lg">
							Information
						</div>
						<ul className="list-none text-sm">
							<li>
								<a
									href="https://mitimphal.in/uploads/media/m1617252870.pdf"
									target="_break">
									Fire Safety Certificate
								</a>
							</li>
							<li>
								<a
									href="https://mitimphal.in/uploads/media/m1645779721.pdf"
									rel="noreferrer"
									target="_blank">
									Mandatory Disclosures
								</a>
							</li>
							<li>
								<a href="Ragging">Ragging</a>
							</li>
							<li>
								<a href="Faculty_Development_Program">
									Faculty Development Program
								</a>
							</li>
							<li>
								<a href="Placement">Placement</a>
							</li>
							<li>
								<a href="Campus">Campus</a>
							</li>
							<li>
								<a href="Classroom_0">Classroom</a>
							</li>
							<li>
								<a href="OGR_footer">Online Grievance Redressal</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<BottomBar />
			<div className="w-full h-2 bg-yellow-200 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 animate-gradient-bg"></div>
		</>
	);
}

function BottomBar() {
	return (
		<div className=" bg-slate-950">
			<div className="text-sm text-slate-300 w-full  py-2 flex flex-wrap flex-col-reverse md:flex-row justify-between items-center  mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center md:text-left">
					Copyright &#169; {new Date().getFullYear()} @ Manipur Institute of
					Technology <br />
					All Rights Reserved
				</div>
				<div className="space-y-1 text-center md:text-right ">
					<div>Follow us on:</div>
					<div className="flex justify-evenly md:justify-start items-center space-x-2 py-1">
						<div className="rounded-full w-5 h-5 flex items-center justify-center">
							<FaFacebook size={18} />
						</div>
						<div className="rounded-full w-5 h-5 flex items-center justify-center">
							<FaInstagram size={18} />
						</div>
						<div className="rounded-full w-5 h-5 flex items-center justify-center">
							<FaLinkedin size={18} />
						</div>
						<div className="rounded-full w-5 h-5 flex items-center justify-center">
							<FaLinkedin size={18} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function _PublicFooter() {
	return (
		<div className="w-full bg-slate-900 text-slate-100 py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center md:items-stretch md:text-left text-center flex-wrap flex-col md:flex-row gap-y-2 gap-x-4">
				<div className="relative w-full md:w-fit py-2 md:self-center lg:border-r lg:border-r-gray-50 lg:pr-2">
					<div className="w-full">
						<img
							src="./Manipur_University_Logo1.png"
							alt="mu logo"
							className="block m-auto"
							style={{
								width: 100,
								height: "auto",
							}}
						/>
					</div>
					<div className="py-1 text-sm text-center">
						<div className="text-slate-50 font-bold text-lg">
							Manipur Institute of Technology
						</div>
						<div>
							<p className="text-slate-100">
								(A Constitute College of Manipur University)
							</p>
							<p className="text-slate-200">
								Takyelpat, Imphal - 795001, Manipur, India
							</p>
						</div>
					</div>
				</div>

				<div className="py-1">
					<div className="text-slate-50 font-semibold text-lg">Department</div>
					<ul className="list-none text-sm">
						<li>
							<a href="CE_dept">Department of Civil Engineering</a>
						</li>
						<li>
							<a href="ECE_dept">
								Department of Electronics & Communication Engineering
							</a>
						</li>
						<li>
							<a href="CSE_dept">
								Depatrment of Computer Sciences & Engineering
							</a>
						</li>
						<li>
							<a href="BSC_dept">Depatrment of Basic Sciences & Humanities</a>
						</li>
						<li>
							<a href="ME_dept">Depatrment of Mechanical Engineering</a>
						</li>
						<li>
							<a href="EE_dept">Depatrment of Electrical Engineering</a>
						</li>
					</ul>
				</div>

				<div className="py-1">
					<div className="text-slate-50 font-semibold text-lg">Facility</div>
					<ul className="list-none text-sm">
						<li>
							<a href="Library_Facility">Library Facility</a>
						</li>
						<li>
							<a href="Internet_Facility">Internet Facility</a>
						</li>
						<li>
							<a href="Hostel_Facility">Hostel Facility</a>
						</li>
						<li>
							<a href="Language_Lab">Language Lab</a>
						</li>
					</ul>
				</div>

				<div className="py-1">
					<div className="text-slate-50 font-semibold text-lg">Information</div>
					<ul className="list-none text-sm">
						<li>
							<a
								href="https://mitimphal.in/uploads/media/m1617252870.pdf"
								target="_break">
								Fire Safety Certificate
							</a>
						</li>
						<li>
							<a
								href="https://mitimphal.in/uploads/media/m1645779721.pdf"
								rel="noreferrer"
								target="_blank">
								Mandatory Disclosures
							</a>
						</li>
						<li>
							<a href="Ragging">Ragging</a>
						</li>
						<li>
							<a href="Faculty_Development_Program">
								Faculty Development Program
							</a>
						</li>
						<li>
							<a href="Placement">Placement</a>
						</li>
						<li>
							<a href="Campus">Campus</a>
						</li>
						<li>
							<a href="Classroom_0">Classroom</a>
						</li>
						<li>
							<a href="OGR_footer">Online Grievance Redressal</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
