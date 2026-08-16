import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";

import apiClient from "~/utils/apiClient";
import {
  confirmAction,
  showAlert,
} from "~/utils/alert_utils";

import { useAuth } from "~/context/AuthContext";

export type AdminNavItem = {
  name: string;
  href: string;
  childrens?: {
    name: string;
    href: string;
  }[];
};

const adminNavigation: AdminNavItem[] = [
  {
    name: "Home",
    href: "/admin",
  },

  {
    name: "Administration",
    href: "#",
    childrens: [
      {
        name: "Admin",
        href: "/admin/administration",
      },
      {
        name: "Institute Administration",
        href: "/admin/institute-admin",
      },
      {
        name: "Hostel Administration",
        href: "/admin/hostel-admin",
      },
      {
        name: "Library Administration",
        href: "/admin/library-admin",
      },
    ],
  },

  {
    name: "Faculty",
    href: "/admin/Faculty",
  },

  {
    name: "Image Carousel",
    href: "/admin/image-carousel",
  },

  {
    name: "News & Notification",
    href: "/admin/news-notification",
  },

  {
    name: "Gallery",
    href: "/admin/gallery",
  },

  {
    name: "Conference",
    href: "/admin/conference",
  },

  {
    name: "NIRF",
    href: "/admin/nirf",
  },

  {
    name: "AICTE-VAANI",
    href: "/admin/aicte-vaani",
  },

  {
    name: "Student List",
    href: "/admin/student-list",
  },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] =
    useState<number | null>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const { token } = useAuth();

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | TOGGLE DROPDOWN
  |--------------------------------------------------------------------------
  */

  const toggleDropdown = (index: number) => {
    setActiveDropdown(
      activeDropdown === index
        ? null
        : index
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE MOBILE MENU
  |--------------------------------------------------------------------------
  */

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | SWEETALERT CONFIRMATION
    |--------------------------------------------------------------------------
    */

    const confirmed = await confirmAction({
      title: "Logout?",
      text: "Are you sure you want to logout from the admin portal?",

      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",

      reverseButtons: true,
      focusCancel: true,

      customClass: {
        popup: "rounded-2xl",

        confirmButton:
          "px-5 py-2.5 rounded-lg font-semibold",

        cancelButton:
          "px-5 py-2.5 rounded-lg font-semibold",
      },
    });

    /*
    |--------------------------------------------------------------------------
    | USER CANCELLED
    |--------------------------------------------------------------------------
    */

    if (!confirmed) {
      return;
    }

    setLoggingOut(true);

    /*
    |--------------------------------------------------------------------------
    | LOGOUT API
    |--------------------------------------------------------------------------
    |
    | apiClient automatically:
    |
    | 1. Adds API_BASE_URL
    | 2. Adds /mit prefix
    | 3. Adds Authorization Bearer token
    |
    |--------------------------------------------------------------------------
    */

    try {
      await apiClient.post(
        "/account/logout",
        {
          email:
            localStorage.getItem("email"),

          token:
            token ||
            sessionStorage.getItem("token") ||
            localStorage.getItem("token"),
        }
      );

      /*
      |--------------------------------------------------------------------------
      | SUCCESS POPUP
      |--------------------------------------------------------------------------
      */

      await showAlert({
        title: "Logged Out",
        text: "You have been logged out successfully.",

        icon: "success",

        confirmButtonText: "OK",
        confirmButtonColor: "#be123c",

        timer: 1800,
        timerProgressBar: true,

        customClass: {
          popup: "rounded-2xl",

          confirmButton:
            "px-5 py-2.5 rounded-lg font-semibold",
        },
      });
    } catch (error: any) {
      /*
      |--------------------------------------------------------------------------
      | BACKEND LOGOUT FAILED
      |--------------------------------------------------------------------------
      |
      | Even if the backend logout fails, clear the
      | local authentication session.
      |
      |--------------------------------------------------------------------------
      */
      await showAlert({
        title: "Logged Out",
        text: "Your local admin session has been cleared.",

        icon: "info",

        confirmButtonText: "Continue",
        confirmButtonColor: "#be123c",

        timer: 1800,
        timerProgressBar: true,

        customClass: {
          popup: "rounded-2xl",

          confirmButton:
            "px-5 py-2.5 rounded-lg font-semibold",
        },
      });
    } finally {
      /*
      |--------------------------------------------------------------------------
      | CLEAR AUTHENTICATION
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "email"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      sessionStorage.removeItem(
        "token"
      );

      sessionStorage.removeItem(
        "email"
      );

      sessionStorage.removeItem(
        "role"
      );

      sessionStorage.removeItem(
        "user"
      );

      /*
      |--------------------------------------------------------------------------
      | CLOSE MENU
      |--------------------------------------------------------------------------
      */

      closeMobileMenu();

      setLoggingOut(false);

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      navigate("/admin", {
        replace: true,
      });

      /*
      |--------------------------------------------------------------------------
      | RELOAD AUTH CONTEXT
      |--------------------------------------------------------------------------
      */

      window.location.reload();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <nav className="bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg sticky top-0 z-[999] mb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center">

          {/* ================================================================
              DESKTOP
          ================================================================= */}

          <div className="hidden lg:flex items-center justify-center w-full">

            {adminNavigation.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="relative border-r border-rose-400 last:border-r-0"

                  onMouseEnter={() => {
                    if (
                      item.childrens?.length
                    ) {
                      setActiveDropdown(
                        index
                      );
                    }
                  }}

                  onMouseLeave={() => {
                    if (
                      item.childrens?.length
                    ) {
                      setActiveDropdown(
                        null
                      );
                    }
                  }}
                >

                  {/* ========================================================
                      DROPDOWN ITEM
                  ========================================================= */}

                  {item.childrens?.length ? (
                    <>
                      <button
                        type="button"
                        className="py-3 px-2.5 text-gray-100 text-sm font-bold whitespace-nowrap hover:bg-rose-500 flex items-center gap-1 transition-colors"
                      >
                        {item.name}

                        <ChevronDown
                          size={16}
                          className={`transition-transform flex-shrink-0 ${
                            activeDropdown ===
                            index
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {activeDropdown ===
                        index && (
                        <div className="absolute left-0 top-full w-60 bg-rose-600 rounded-b shadow-md z-[999] border border-rose-400 overflow-hidden">

                          {item.childrens.map(
                            (
                              child,
                              childIndex
                            ) => (
                              <NavLink
                                key={
                                  child.name
                                }
                                to={
                                  child.href
                                }
                                onClick={
                                  closeMobileMenu
                                }
                                className={`block px-4 py-2.5 text-sm text-gray-100 font-semibold whitespace-nowrap hover:bg-rose-500 transition-colors ${
                                  childIndex !==
                                  item
                                    .childrens!
                                    .length -
                                    1
                                    ? "border-b border-rose-400"
                                    : ""
                                }`}
                              >
                                {
                                  child.name
                                }
                              </NavLink>
                            )
                          )}

                        </div>
                      )}
                    </>
                  ) : (

                    /* ======================================================
                       NORMAL LINK
                    ====================================================== */

                    <NavLink
                      to={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className={({
                        isActive,
                      }) =>
                        `py-3 px-2.5 text-gray-100 text-sm font-bold whitespace-nowrap transition-colors inline-block ${
                          isActive
                            ? "bg-rose-500"
                            : "hover:bg-rose-500"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}

                </div>
              )
            )}

            {/* ================================================================
                DESKTOP LOGOUT
            ================================================================= */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              disabled={
                loggingOut
              }
              className="ml-2 py-2.5 px-3 text-gray-100 text-sm font-bold whitespace-nowrap hover:bg-red-600 rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <LogOut
                size={16}
              />

              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>

          </div>

          {/* ================================================================
              MOBILE HEADER
          ================================================================= */}

          <div className="lg:hidden flex items-center justify-between w-full py-3">

            <span className="text-white font-extrabold text-lg">
              MIT Admin Portal
            </span>

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  !isOpen
                )
              }
              className="p-1 text-white hover:bg-rose-600 rounded-md"
            >
              {isOpen ? (
                <X
                  size={28}
                />
              ) : (
                <Menu
                  size={28}
                />
              )}
            </button>

          </div>

        </div>

        {/* ================================================================
            MOBILE MENU
        ================================================================= */}

        {isOpen && (
          <div className="lg:hidden mt-2 rounded-lg overflow-hidden pb-3">

            {adminNavigation.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="border-b border-rose-400 last:border-b-0"
                >

                  {item.childrens?.length ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          toggleDropdown(
                            index
                          )
                        }
                        className="w-full py-2.5 px-4 text-gray-100 text-sm font-bold bg-rose-600 flex justify-between items-center border-b border-rose-500 whitespace-nowrap"
                      >
                        {item.name}

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            activeDropdown ===
                            index
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {activeDropdown ===
                        index &&
                        item.childrens.map(
                          (
                            child
                          ) => (
                            <NavLink
                              key={
                                child.name
                              }
                              to={
                                child.href
                              }
                              onClick={
                                closeMobileMenu
                              }
                              className="block py-2 px-8 text-sm text-gray-100 bg-rose-500 hover:bg-rose-400 border-b border-rose-400 last:border-0 whitespace-nowrap"
                            >
                              {
                                child.name
                              }
                            </NavLink>
                          )
                        )}
                    </>
                  ) : (

                    <NavLink
                      to={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className="block py-2.5 px-4 text-sm text-gray-100 font-bold bg-rose-600 hover:bg-rose-500 border-b border-rose-500 whitespace-nowrap"
                    >
                      {item.name}
                    </NavLink>
                  )}

                </div>
              )
            )}

            {/* ================================================================
                MOBILE LOGOUT
            ================================================================= */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              disabled={
                loggingOut
              }
              className="w-full mt-2 py-3 px-4 text-left text-white bg-red-600 hover:bg-red-700 font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <LogOut
                size={18}
              />

              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>

          </div>
        )}

      </div>

      {/* ================================================================
          DECORATIVE BARS
      ================================================================= */}

      <div className="h-1 bg-yellow-500"></div>

      <div className="h-1 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500"></div>

    </nav>
  );
}