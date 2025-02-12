import "../LocalNavigation.css";
import React from "react";

export function LeftNotification() {
	return (
		<div className="LeftNotification max-h-[30vh] overflow-auto">
			<div className="LeftNavigation_wrapper ">
				<div className="LeftNavigation_Header">
					<h1>News and Notices</h1>
				</div>
				<marquee direction="up" scrollamount="2.8" className="news_n_notices">
					<div className="LeftNavigation_options">
						<a
							href="https://mitimphal.in/uploads/media/m1727267257.pdf"
							target="_blank">
							Result of Qualifying Entrance Test (QET) 2024-2025 held on
							25-09-2024 for admission to Ph.D. programme
						</a>
					</div>
				</marquee>
			</div>
		</div>
	);
}
