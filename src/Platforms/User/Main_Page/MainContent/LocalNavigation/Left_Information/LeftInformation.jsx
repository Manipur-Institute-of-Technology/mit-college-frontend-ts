import "../LocalNavigation.css";

export function LeftInformation() {
	return (
		<div className="border border-black rounded-md">
			<div className="font-semibold text-2xl p-4 shadow-md rounded-md">
				<h1>Information</h1>
			</div>
			<div className="min-h-[30vh] max-h-[70vh] sm:max-h-[30vh] w-full overflow-y-auto px-4">
				<div className="font-semibold text-3xl/1 border-b border-b-gray-400">
					<a
						className="text-[#5ca20d] text-wrap"
						href="Fire_Safety_Certificate">
						Fire Safety Certificate
					</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Fire_Safety_Certificate">Fire Safety Certificate</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Mandatory_Disclosures">Mandatory Disclosures</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Ragging">Ragging</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Faculty_Development_Program">Faculty Development Program</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Placement">Placement</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Campus">Campus</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Classroom_0">Classroom</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Online_Grievance_Redressal">Online Grievance Redressal</a>
				</div>
			</div>
		</div>
	);
}

export function _LeftInformation() {
	return (
		<div className="LeftInformation max-h-[30vh] overflow-auto">
			<div className="LeftNavigation_wrapper lN_w2">
				<div className="LeftNavigation_Header">
					<h1>Information</h1>
					<div className="line LN2"></div>
				</div>
				<div className="LeftNavigation_options">
					<a href="Fire_Safety_Certificate">Fire Safety Certificate</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Mandatory_Disclosures">Mandatory Disclosures</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Ragging">Ragging</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Faculty_Development_Program">Faculty Development Program</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Placement">Placement</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Campus">Campus</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Classroom_0">Classroom</a>
				</div>
				<div className="LeftNavigation_options">
					<a href="Online_Grievance_Redressal">Online Grievance Redressal</a>
				</div>
			</div>
		</div>
	);
}
