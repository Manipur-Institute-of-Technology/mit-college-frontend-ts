import { Outlet } from "react-router";
import Navbar from "../Common/Navbar/Navbar";
import AdminNavbar from "../Platform/Admin/navbar/navbar";
import { useAuth } from "~/context/AuthContext";

export default function CMSLayout() {
  const { token, role } = useAuth();
  console.log(token, role)

  const isAdmin = Boolean(token && role === "admin");

  console.log(isAdmin)

  return (
    <div className="bg-slate-50">
      {/* Public navbar */}
      <Navbar />

      {/* Admin navbar (only for admin) */}
      {isAdmin && (
        <div className="sticky top-0 z-50">
          <AdminNavbar />
        </div>
      )}

      <main>
        <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 min-h-[100vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
