import React, { useEffect, useRef, useState } from "react";
import "./NavBar.css";

function NavBar() {
  const [menuOpened, setMenuOpened] = useState(false);
  const navRef = useRef(null);

  const location = window.location.pathname;

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setMenuOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex content-center justify-between TopBar uppercase tracking-wide pl-6 pr-6 select-none">
      <div className="flex content-center justify-center gap-5 flex-wrap font-bold tracking-wider">
        Admin Panel
      </div>
      <div className="flex content-center justify-center gap-6">
        <div
          onClick={() => {
            window.location.href = "/Admin";
          }}
          className={
            location === "/Admin"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Home
        </div>
        <div
          onClick={() => {
            window.location.href = "/Admin/Mail";
          }}
          className={
            location === "/Admin/Mail"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Mail
        </div>
        <div
          onClick={() => {
            window.location.href = "/Admin/Grivance";
          }}
          className={
            location === "/Admin/Grievance"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Grievances
        </div>
        <div
          className={
            location === "/Admin/News"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          News & Notification
        </div>
        <div
          className={
            location === "/Admin/Pages"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Pages
        </div>
        <div
          onClick={() => {
            window.location.href = "/Admin/ImageCarousal";
          }}
          className={
            location === "/Admin/ImageCarousal"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Carousal Images
        </div>
        <div
          className={
            location === "/Admin/Gallery"
              ? "flex content-center justify-center flex-wrap cursor-pointer ActiveNavBar"
              : "flex content-center justify-center flex-wrap cursor-pointer"
          }
        >
          Gallary
        </div>
        <button
          className={`menu ${menuOpened ? "opened" : ""}`}
          onClick={toggleMenu}
          aria-label="Main Menu"
          aria-expanded={menuOpened}
          aria-controls="main-menu"
        >
          <svg width="45" height="40" viewBox="0 0 100 100">
            <path
              className="line line1"
              d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
            />
            <path className="line line2" d="M 20,50 H 80" />
            <path
              className="line line3"
              d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
            />
          </svg>
        </button>

        <div
          ref={navRef}
          className={`NavSmallViewPort flex content-center pt-3 justify-start gap-2 uppercase tracking-widest ${
            menuOpened ? "opened" : "hidden"
          }`}
        >
          <a
            className="flex content-center justify-center text-black font-semibold"
            href="#HomeWrapper"
          >
            Change Password
          </a>
          <a
            className="flex content-center justify-center text-black font-semibold"
            href="#AboutWrapper"
          >
            LogOut
          </a>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
