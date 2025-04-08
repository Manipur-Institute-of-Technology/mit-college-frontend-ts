// import TopNavbar from "./PublicTopNavbar";
// import MainNavbar from "./PublicMainNavbar";
// import { useLocation } from "react-router";
// import { type NavigationData } from "../../../public/mock/navbar";
// import "./navbar.css";

// export default function Navbar({
// 	navigation = [],
// }: {
// 	navigation?: NavigationData[];
// }) {
// 	const location = useLocation();
// 	const cmsRoutePattrn = /\/cms(\/?|\/.*)/;

// 	return (
// 		<>
// 			{cmsRoutePattrn.test(location.pathname) ? (
// 				<CMSNavbar />
// 			) : (
// 				<>
// 					<TopNavbar />
// 					<MainNavbar navigation={navigation} />
// 				</>
// 			)}
// 		</>
// 	);
// }
