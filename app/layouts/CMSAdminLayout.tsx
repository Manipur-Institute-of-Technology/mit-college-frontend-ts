import { Outlet } from "react-router";
import Navbar from "../Common/Navbar/Navbar";
import AdminNavbar from "../Platform/Admin/navbar/navbar";

export default function CMSLayout() {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <AdminNavbar />
      </div>
      {/* TODO: add a background */}
      <main>
        <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0  min-h-[100vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
