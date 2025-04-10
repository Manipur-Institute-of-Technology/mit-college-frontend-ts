import { Outlet } from "react-router";
import { useState } from "react";

import type { RawNavData } from "~/components/SideTray/SideTray";
import type { AccountInfo } from "~/types/api/resData.type";

import CMSPrivateNav from "~/components/Navbar/CMSPrivateNav";
import {
	MobileSideTray,
	DesktopSideTray,
} from "~/components/SideTray/SideTray";
import { AuthProvider } from "~/context/AuthContextProvider";

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
	// TODO: wrap auth context here, redirect siginin if already authenticated

	return (
		<AuthProvider>
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
					{/* <MobileSideTray navigation={navigation} sidePanelOpen={sidePanelOpen} /> */}

					<div className="relative md:flex md:flex-nowrap">
						<MobileSideTray
							navigation={navigation}
							sidePanelOpen={sidePanelOpen}
						/>
						{/* Desktop side tray */}
						<DesktopSideTray
							navigation={navigation}
							sidePanelOpen={sidePanelOpen}
						/>
						<div className="w-full">
							{/* Main Content Start */}
							<main
								className="w-full min-h-[100vh] p-2"
								style={{
									backgroundRepeat: "noRepeat",
									backgroundAttachment: "fixed",
									backgroundImage: `repeating-linear-gradient(0deg, transparent 0 19px, #ddd 19px 20px), repeating-linear-gradient(90deg, transparent 0 19px, #ddd 19px 20px), radial-gradient(circle at center, transparent 50%, #eee 80%)`,
								}}>
								<Outlet />
							</main>
						</div>
					</div>
				</div>
			</>
		</AuthProvider>
	);
};

export default CMSLayout;
