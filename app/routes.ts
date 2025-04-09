import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // public routes
  layout("./layouts/PublicContentLayout.tsx", [
    index("routes/home.tsx"),
    route("/home", "./routes/home.tsx", { id: "home1" }),
    route("/Vice-Chancellor", "./routes/vice_chancellor.tsx"),
    route("/Principal", "./routes/principal.tsx"),
    route("/Institute_Administration", "./routes/Institute_Adminstration.tsx"),
    route("/Hostel_Adminstration", "./routes/hostel_adminstration.tsx"),
    route("/Library_Facility", "./routes/library_facility.tsx"),
    route("/Hostel_Facility", "./routes/hostel_facility.tsx"),
    route("/Internet_Facility", "./routes/internet_faclility.tsx"),
    route("/Language_Lab", "./routes/language_facility.tsx"),
    route("/Contact_Us", "./routes/contact.tsx"),
    route("/gallery", "./routes/gallery.tsx"),
    route("/editor", "./routes/editor.tsx"),
    route("CSE-dept","./routes/cse.tsx"),
  ]),
  // CMS Route
  ...prefix("cms", [
    layout("./layouts/CMSPublicLayout.tsx", [
      index("./routes/cms/home.tsx"),
      route("home", "./routes/cms/home.tsx", { id: "cmsHome1" }),
      route("signin", "./routes/cms/signin.tsx"),
      route("signup", "./routes/cms/signup.tsx"),
      route("forgotpass", "./routes/cms/forgotpass.tsx"),
    ]),
    // Routes Specific for Faculty
    ...prefix("faculty", [
      layout("./layouts/CMSFacultyLayout.tsx", [
        index("./routes/cms/faculty.dashboard.tsx"),
      ]),
    ]),
    // Routes Specific for Admin
    ...prefix("admin", [
      layout("./layouts/CMSAdminLayout.tsx", [
        index("./routes/cms/admin.dashboard.tsx"),
      ]),
    ]),
  ]),

  // 404 route
  // layout(
  // 	"./layouts/PublicContentLayout.tsx",
  // 	{ id: "publicLayoutForNotFound" },
  // 	[route("*", "routes/notFound.tsx")],
  // ),
] satisfies RouteConfig;
