import { Outlet, useLocation } from "react-router";
import { navigationData as navigation } from "../mock/navbar";
import Navbar from "../Common/Navbar/Navbar";
import Footer from "../Common/Footer/PublicFooter";
import ImageCarousel from "../Platform/User/Home/ImageCarousel/ImageCarrousel";
import type { Route } from "./+types/PublicContentLayout";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar navigation={navigation} />
      <main
      >
        {/* {location.pathname === "/" && (
          <div className="mt-8 mb-2">
            <ImageCarousel />
          </div>
        )} */}

        <div className="mx-auto max-w-7xl px-0 py-6 sm:px-6 lg:px-0 min-h-[100vh]">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
