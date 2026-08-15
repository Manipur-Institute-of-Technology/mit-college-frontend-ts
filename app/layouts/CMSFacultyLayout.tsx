import { Outlet, useLocation } from "react-router";
import { navigationData as navigation } from "../mock/navbar";
import Navbar from "../Common/Navbar/Navbar";
import Footer from "../Common/Footer/PublicFooter";

export default function FacultyLayout() {
  const location = useLocation();
  return (
    <div className="bg-slate-50">
      <main>
        <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0  min-h-[100vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
