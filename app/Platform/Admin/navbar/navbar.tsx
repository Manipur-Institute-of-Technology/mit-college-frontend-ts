import { Link } from "react-router";

const adminNavItems = [
  { name: "Home", href: "/admin" },
  { name: "Faculty", href: "/admin/Faculty" },
  { name: "Image Carousel", href: "/admin/image-carousel" },
  { name: "Pages", href: "/admin/pages" },
  { name: "News & Notification", href: "/admin/news-notification" },
  { name: "Gallery", href: "/admin/gallery" },
];

export default function AdminNavbar() {
  return (
    <nav className="bg-rose-700/90 shadow-lg sticky top-0 z-50 w-full mb-6">
      <div className="flex flex-row justify-center gap-0 py-3 items-center">
        {/* Left divider for the first item */}
        <span className="h-6 w-px bg-white/40 mx-3" />
        {adminNavItems.map((item, idx) => (
          <>
            <Link
              key={item.name}
              to={item.href}
              className="text-white font-semibold text-lg hover:text-yellow-300 transition-colors px-4"
            >
              {item.name}
            </Link>
            {/* Divider after each item except the last */}
            {idx !== adminNavItems.length - 1 ? (
              <span className="h-6 w-px bg-white/40 mx-3" />
            ) : null}
          </>
        ))}
        {/* Right divider for the last item */}
        <span className="h-6 w-px bg-white/40 mx-3" />
      </div>
    </nav>
  );
}
