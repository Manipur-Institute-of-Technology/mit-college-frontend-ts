import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
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

/*
|--------------------------------------------------------------------------
| PASSWORD INPUT
|--------------------------------------------------------------------------
*/

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  disabled?: boolean;
  onEnter?: () => void;
};

function PasswordInput({
  value,
  onChange,
  placeholder,
  visible,
  setVisible,
  disabled = false,
  onEnter,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            onEnter();
          }
        }}
      />

      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible(!visible)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600 transition-colors disabled:opacity-50"
      >
        {visible ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );
}

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] =
    useState<number | null>(null);

  const [opsOpen, setOpsOpen] = useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHANGE PASSWORD STATE
  |--------------------------------------------------------------------------
  */

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordForm, setPasswordForm] =
    useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
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
    setOpsOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN CHANGE PASSWORD
  |--------------------------------------------------------------------------
  */

  const openChangePassword = () => {
    setPasswordError("");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setOpsOpen(false);
    setIsOpen(false);

    setShowChangePassword(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE CHANGE PASSWORD
  |--------------------------------------------------------------------------
  */

  const closeChangePassword = () => {
    if (changingPassword) {
      return;
    }

    setShowChangePassword(false);

    setPasswordError("");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  /*
  |--------------------------------------------------------------------------
  | CHANGE PASSWORD
  |--------------------------------------------------------------------------
  */

  const handleChangePassword = async () => {
    if (changingPassword) {
      return;
    }

    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!oldPassword.trim()) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError(
        "Please enter your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    setPasswordError("");
    setChangingPassword(true);

    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    */

    try {
      await apiClient.post(
        "/account/changepassword",
        {
          oldPassword,
          newPassword,
        }
      );

      setShowChangePassword(false);

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      await showAlert({
        title: "Password Changed",
        text: "Your password has been changed successfully.",

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
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to change password. Please check your current password and try again.";

      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
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
    <>
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
                  OPS
              ================================================================= */}

              <div
                className="relative ml-1"
                onMouseEnter={() =>
                  setOpsOpen(true)
                }
                onMouseLeave={() =>
                  setOpsOpen(false)
                }
              >
                <button
                  type="button"
                  className="py-3 px-2.5 text-gray-100 text-sm font-bold whitespace-nowrap hover:bg-rose-500 flex items-center gap-1 transition-colors"
                >
                  Ops

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      opsOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {opsOpen && (
                  <div className="absolute right-0 top-full w-52 bg-rose-600 rounded-b shadow-md z-[999] border border-rose-400 overflow-hidden">

                    {/* CHANGE PASSWORD */}

                    <button
                      type="button"
                      onClick={
                        openChangePassword
                      }
                      className="w-full px-4 py-3 text-left text-sm text-gray-100 font-semibold hover:bg-rose-500 transition-colors flex items-center gap-2 border-b border-rose-400"
                    >
                      <KeyRound
                        size={17}
                      />

                      Change Password
                    </button>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      disabled={
                        loggingOut
                      }
                      className="w-full px-4 py-3 text-left text-sm text-gray-100 font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <LogOut
                        size={17}
                      />

                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </button>

                  </div>
                )}
              </div>

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
                  MOBILE OPS
              ================================================================= */}

              <div className="mt-2">

                <button
                  type="button"
                  onClick={() =>
                    setOpsOpen(
                      !opsOpen
                    )
                  }
                  className="w-full py-2.5 px-4 text-gray-100 text-sm font-bold bg-rose-600 hover:bg-rose-500 flex justify-between items-center border-b border-rose-500"
                >
                  <span>
                    Ops
                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      opsOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {opsOpen && (
                  <div>

                    {/* CHANGE PASSWORD */}

                    <button
                      type="button"
                      onClick={
                        openChangePassword
                      }
                      className="w-full py-2.5 px-8 text-left text-sm text-gray-100 bg-rose-500 hover:bg-rose-400 border-b border-rose-400 flex items-center gap-2"
                    >
                      <KeyRound
                        size={17}
                      />

                      Change Password
                    </button>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      disabled={
                        loggingOut
                      }
                      className="w-full py-3 px-8 text-left text-white bg-red-600 hover:bg-red-700 font-bold text-sm flex items-center gap-2 disabled:opacity-50"
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

            </div>
          )}

        </div>

        {/* ================================================================
            DECORATIVE BARS
        ================================================================= */}

        <div className="h-1 bg-yellow-500"></div>

        <div className="h-1 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500"></div>

      </nav>

      {/* ======================================================================
          CHANGE PASSWORD MODAL
      ======================================================================= */}

      {showChangePassword && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !changingPassword
            ) {
              closeChangePassword();
            }
          }}
        >

          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================================================================
                MODAL HEADER
            ================================================================= */}

            <div className="bg-rose-700 px-6 py-4 flex items-center justify-between">

              <div className="flex items-center gap-2 text-white">

                <KeyRound
                  size={21}
                />

                <h2 className="text-lg font-bold">
                  Change Password
                </h2>

              </div>

              <button
                type="button"
                onClick={
                  closeChangePassword
                }
                disabled={
                  changingPassword
                }
                className="text-white/80 hover:text-white hover:bg-rose-600 rounded-lg p-1.5 transition-colors disabled:opacity-50"
              >
                <X
                  size={22}
                />
              </button>

            </div>

            {/* ================================================================
                MODAL BODY
            ================================================================= */}

            <div className="p-6 space-y-5">

              {/* ERROR */}

              {passwordError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {passwordError}
                </div>
              )}

              {/* CURRENT PASSWORD */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Current Password
                </label>

                <PasswordInput
                  value={
                    passwordForm.oldPassword
                  }
                  onChange={(value) =>
                    setPasswordForm(
                      (prev) => ({
                        ...prev,
                        oldPassword:
                          value,
                      })
                    )
                  }
                  placeholder="Enter current password"
                  visible={
                    showOldPassword
                  }
                  setVisible={
                    setShowOldPassword
                  }
                  disabled={
                    changingPassword
                  }
                  onEnter={
                    handleChangePassword
                  }
                />
              </div>

              {/* NEW PASSWORD */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>

                <PasswordInput
                  value={
                    passwordForm.newPassword
                  }
                  onChange={(value) =>
                    setPasswordForm(
                      (prev) => ({
                        ...prev,
                        newPassword:
                          value,
                      })
                    )
                  }
                  placeholder="Enter new password"
                  visible={
                    showNewPassword
                  }
                  setVisible={
                    setShowNewPassword
                  }
                  disabled={
                    changingPassword
                  }
                  onEnter={
                    handleChangePassword
                  }
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>

                <PasswordInput
                  value={
                    passwordForm.confirmPassword
                  }
                  onChange={(value) =>
                    setPasswordForm(
                      (prev) => ({
                        ...prev,
                        confirmPassword:
                          value,
                      })
                    )
                  }
                  placeholder="Confirm new password"
                  visible={
                    showConfirmPassword
                  }
                  setVisible={
                    setShowConfirmPassword
                  }
                  disabled={
                    changingPassword
                  }
                  onEnter={
                    handleChangePassword
                  }
                />
              </div>

            </div>

            {/* ================================================================
                MODAL FOOTER
            ================================================================= */}

            <div className="px-6 pb-6 flex gap-3">

              <button
                type="button"
                onClick={
                  closeChangePassword
                }
                disabled={
                  changingPassword
                }
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleChangePassword
                }
                disabled={
                  changingPassword
                }
                className="flex-1 py-3 px-4 rounded-lg bg-rose-700 text-white font-semibold hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}