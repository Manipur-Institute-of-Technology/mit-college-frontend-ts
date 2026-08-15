import TopNavbar from "./TopNavbar";
import MainNavbar from "./MainNavbar";
import { useLocation } from "react-router";
import { type NavigationData } from "../../mock/navbar";
import "./navbar.css";

export default function Navbar({
  navigation = [],
}: {
  navigation?: NavigationData[];
}) {
  const location = useLocation();
  const cmsRoutePattrn = /\/(cms|admin)(\/?|\/.*)/;

  return (
    <>
      {cmsRoutePattrn.test(location.pathname) ? (
        <CMSNavbar />
      ) : (
        <>
          <TopNavbar />
          <MainNavbar navigation={navigation} />
        </>
      )}
    </>
  );
}

const CMSNavbar = () => {
  const location = useLocation();
  // Check if the path is exactly /admin or starts with /admin (but not /cms/admin)
  // Or if it is /cms/admin or /cms/admin/...
  const isAdminRoute = location.pathname.includes("admin");

  return (
    <>
    </>
  );
};
