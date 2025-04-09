import { Outlet } from "react-router";
import Navbar from "../components/Navbar/CMSPublicNav";
import CMSFooter from "~/components/Footer/CMSFooter";
import type { Route } from "./+types/CMSPublicLayout";

export const links: Route.LinksFunction = () => {
  return [{ rel: "icon", href: "./Manipur_University_Logo.png" }];
};

export default function CMSLayout() {
  return (
    <div className="bg-slate-50">
      <Navbar />
      {/* TODO: add a background */}
      <main>
        <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0  min-h-[100vh]">
          <Outlet />
        </div>
      </main>
      <CMSFooter />
    </div>
  );
}
