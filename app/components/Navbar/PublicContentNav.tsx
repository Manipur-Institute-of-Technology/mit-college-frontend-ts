import PublicTopNavbar from "./PublicTopNavbar";
import PublicMainNavbar from "./PublicMainNavbar";

import "./navbar.css";
import type { NavbarData } from "~/types/api/resData.type";

export const PublicContentNav: React.FC<{ navigation: NavbarData }> = ({
	navigation,
}) => {
	return (
		<>
			<PublicTopNavbar />
			<PublicMainNavbar navigation={navigation} />
		</>
	);
};

export default PublicContentNav;
