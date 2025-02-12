import "./Department_drop.css";
export function Department_drop() {
	return (
		<div className="Department_drop">
			<div className="Department_drop_align">
				<a href="CE_dept">
					<div className="Dep_link_1">Department of Civil Engineering</div>
				</a>
				<a href="ECE_dept">
					<div className="Dep_link_1">
						Department of Electronics & Communication Engineering
					</div>
				</a>
				<a href="CSE_dept">
					<div className="Dep_link_1">
						Department of Computer Science & Engineering
					</div>
				</a>
				<a href="BSC_dept">
					<div className="Dep_link_1">
						Department of Basic Sciences & Humanities
					</div>
				</a>
				<a href="ME_dept">
					<div className="Dep_link_1">Department of Mechanical Engineering</div>
				</a>
				<a href="EE_dept">
					<div className="Dep_link_1 last_link">
						Department of Electrical Engineering
					</div>
				</a>
			</div>
		</div>
	);
}
