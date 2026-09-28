import { Outlet } from "react-router";
import Navbar from "../Common/Navbar/Navbar";

export default function CMSLayout() {
  return (
    <div className="bg-slate-50">
      <Navbar />
      {/* TODO: add a background */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6  min-h-[100vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
