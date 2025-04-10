import moment from "moment";
import React from "react";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import PublicationListContainer from "./PublicationListContainer";
import PublicationChart from "./PublicationChart";

export const Publications: React.FC<FacultyDetailProfile> = (props) => {
	return (
		<div className="relative w-full font-roboto">
			<div className="grid grid-cols-12 relative">
				<div className="col-span-12 lg:col-span-9">
					<PublicationListContainer {...props} />
				</div>
				<div className="hidden lg:col-span-3 lg:block overflow-y-auto h-fit max-h-[100vh] sticky top-[9%]">
					<div className="font-roboto py-4 px-1 w-auto">
						<div>
							<img
								src="/mock/image.png"
								className="w-full h-auto"
							/>
						</div>
						<PublicationChart {...props} />
					</div>
				</div>
			</div>
		</div>
	);
};
export default Publications;
