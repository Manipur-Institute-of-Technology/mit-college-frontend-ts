import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import { type NavigationData } from "~/mock/navbar";
import { confirmExternalLink } from "~/utils/alert_utils";

export default function Navbar({
  navigation = [],
}: {
  navigation: NavigationData[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  /**
   * Determines whether a URL points outside the current website.
   */
  const isExternalLink = (href: string) => {
    try {
      const url = new URL(href, window.location.origin);

      return url.origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  /**
   * Handles navigation for both desktop and mobile menus.
   *
   * Internal links:
   * - Navigate normally.
   *
   * External links:
   * - Show SweetAlert confirmation.
   * - Cancel = stay on current page.
   * - Confirm = navigate to external URL.
   */
  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    target?: string,
  ) => {
    // Internal link — allow React Router/browser navigation.
    if (!isExternalLink(href)) {
      closeMobileMenu();
      return;
    }

    // External link — prevent navigation until confirmation.
    e.preventDefault();

    const confirmed = await confirmExternalLink({
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
      },
    });

    if (!confirmed) {
      return;
    }

    closeMobileMenu();

    if (target === "_blank") {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg sticky top-0 z-[999]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="hidden lg:block">
            <div className="bg-white border-8 border-rose-700/90 p-1 rounded-full hover:scale-105 transition">
              <img
                src="/Manipur_University_Logo.png"
                alt="MU Logo"
                width={60}
                height={60}
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.childrens?.length ? (
                  <>
                    <button
                      type="button"
                      className="py-4 px-2 text-gray-100 font-bold hover:bg-rose-500 flex items-center gap-1"
                    >
                      {item.name}

                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === index && (
                      <div className="absolute right-0 w-48 bg-rose-600 rounded shadow-md z-[999]">
                        {item.childrens.map((child, childIndex) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            target={child.target}
                            onClick={(e) =>
                              handleNavClick(
                                e,
                                child.href,
                                child.target,
                              )
                            }
                            className={`block px-4 py-2 text-sm text-gray-100 hover:bg-rose-500 ${
                              childIndex !== item.childrens!.length - 1
                                ? "border-b border-rose-400"
                                : ""
                            }`}
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.href}
                    target={item.target}
                    onClick={(e) =>
                      handleNavClick(e, item.href, item.target)
                    }
                    className="py-4 px-2 text-gray-100 font-bold hover:bg-rose-500"
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={32} className="text-white" />
            ) : (
              <Menu size={32} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 rounded-lg overflow-hidden">
            {navigation.map((item, index) => (
              <div key={item.name}>
                {item.childrens?.length ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(index)}
                      className="w-full py-2 px-4 text-gray-100 font-bold bg-rose-600 flex justify-between items-center"
                      aria-expanded={activeDropdown === index}
                    >
                      {item.name}

                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === index &&
                      item.childrens.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          target={child.target}
                          onClick={(e) =>
                            handleNavClick(
                              e,
                              child.href,
                              child.target,
                            )
                          }
                          className="block py-2 px-8 text-sm text-gray-100 bg-rose-500 hover:bg-rose-400"
                        >
                          {child.name}
                        </NavLink>
                      ))}
                  </>
                ) : (
                  <NavLink
                    to={item.href}
                    target={item.target}
                    onClick={(e) =>
                      handleNavClick(e, item.href, item.target)
                    }
                    className="block py-2 px-4 text-gray-100 font-bold bg-rose-600 hover:bg-rose-500"
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative bars */}
      <div className="h-2 bg-yellow-500" />

      <div className="h-2 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 animate-gradient-bg" />
    </nav>
  );
}