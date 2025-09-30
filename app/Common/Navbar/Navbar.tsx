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
  const cmsRoutePattrn = /\/(cms|faculty|admin)(\/?|\/.*)/;

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
      <nav
        className={`bg-rose-700/90 shadow-lg top-0 z-[999] m-0 w-full${!isAdminRoute ? " sticky" : ""}`}
      >
        <div className="md:w-10/12 relative flex flex-row flex-nowrap items-center gap-2 py-2 px-2 md:pl-8 m-auto">
          <div className="border-4 border-rose-700/90 shadow-lg bg-white rounded-full p-1 relative md:absolute md:top-[0%] md:translate-y-[-0%]">
            <img
              src="/Manipur_University_Logo.png"
              alt="MU logo"
              // className="size-16"
              className="w-16 contrast-75"
            />
          </div>
          <div className="flex flex-nowrap flex-row md:ml-24 gap-x-2">
            <div className="w-[3px]  rounded-lg bg-slate-50"></div>
            <div className="text-2xl sm:text-[2rem] font-semibold text-slate-100">
              Manipur Institute of Technology
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-yellow-500"></div>
        <div className="bg-gradient-to-r from-rose-600  to-yellow-500 w-full h-2 animate-gradient-bg"></div>
      </nav>
    </>
  );
};
