import { Outlet } from "react-router";
import { useState } from "react";

import type { RawNavData } from "~/components/SideTray/SideTray";
import type { AccountInfo } from "~/components/Navbar/CMSPrivateNav";

import CMSPrivateNav from "~/components/Navbar/CMSPrivateNav";
import {
	MobileSideTray,
	DesktopSideTray,
} from "~/components/SideTray/SideTray";

export type CMSLayoutProps = {
	navbarTitle: string;
	logoURL: string;
	navigation: RawNavData[];
	accountData: AccountInfo;
};
const CMSLayout: React.FC<CMSLayoutProps> = ({
	navbarTitle,
	logoURL,
	navigation,
	accountData,
}) => {
	const [sidePanelOpen, setSidePanelOpen] = useState(false);

	return (
		<>
			<div className="min-h-full">
				{/* Navbar */}
				<CMSPrivateNav
					navbarTitle={navbarTitle}
					logoURL={logoURL}
					accountData={accountData}
					sidePanelOpen={sidePanelOpen}
					setSidePanelOpen={setSidePanelOpen}
				/>
				{/* Mobile side tray */}
				<MobileSideTray navigation={navigation} sidePanelOpen={sidePanelOpen} />

				<div className="relative md:flex md:flex-nowrap">
					{/* Desktop side tray */}
					<DesktopSideTray
						navigation={navigation}
						sidePanelOpen={sidePanelOpen}
					/>
					<div className="w-full">
						{/* Main Content Start */}
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
};

export default CMSLayout;
