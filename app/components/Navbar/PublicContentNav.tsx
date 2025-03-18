import PublicTopNavbar from "./PublicTopNavbar";
import PublicMainNavbar from "./PublicMainNavbar";

import "./navbar.css";
import type { NavbarData } from "~/types/api/navbar";

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
