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
    route("CSE_dept", "./routes/cse.tsx"),
    route("EE_dept", "./routes/ee.tsx"),
    route("BSH_dept", "./routes/bsh.tsx"),
    route("ECE_dept", "./routes/ece.tsx"),
    route("CE_dept", "./routes/ce.tsx"),
    route("ME_dept", "./routes/me.tsx"),
    route("Fire_Safety_Certificate", "./routes/fsc.tsx"),
    route("Mandatory_Disclosures", "./routes/md.tsx"),
    route("Ragging", "./routes/ragging.tsx"),
    route("Faculty_Development_Program", "./routes/fdp.tsx"),
    route("Placement", "./routes/placement.tsx"),
    route("Campus", "./routes/campus.tsx"),
    route("Classroom", "./routes/classroom.tsx"),
    route("Nirf", "./routes/nirf.tsx"),
    route("Confrence", "./routes/confrence.tsx"),
    route("aicte-vaani", "./routes/aicte_vaani.tsx"),
    route("Aicte-Vaani", "./routes/aicte_vaani.tsx", { id: "aicteVaaniCaps" }),
    route("student-list", "./routes/student_list.tsx"),
    route("all-notifications", "./routes/all_notification.tsx"),
    route("faculty/:facultyName", "./routes/teacher_view_profile.tsx"),
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
  ]),
  // Routes Specific for Admin
  ...prefix("admin", [
    layout("./layouts/CMSAdminLayout.tsx", [
      index("./routes/admin/admin_home_page.tsx"),
      route("/admin", "./routes/admin/admin_home_page.tsx", {
        id: "AdminHome1",
      }),
      route("/faculty", "./routes/admin/admin_faculty_page.tsx"),
      route("/image-carousel", "./routes/admin/admin_image_carousel_page.tsx"),
      route("/news-notification", "./routes/admin/admin_news_notification_page.tsx"),
      route("/gallery", "./routes/admin/admin_gallery_page.tsx"),
      route("/conference", "./routes/admin/admin_conference_page.tsx"),
      route("/nirf", "./routes/admin/admin_nirf_page.tsx"),
      route("/aicte-vaani", "./routes/admin/admin_aicte_vaani_page.tsx"),
      route("/administration", "./routes/admin/admin_authority.tsx"),
      route("/institute-admin", "./routes/admin/admin_institute_admin_page.tsx"),
      route("/hostel-admin", "./routes/admin/admin_hostel_admin_page.tsx"),
      route("/library-admin", "./routes/admin/admin_library_admin_page.tsx"),
      route("/student-list", "./routes/admin/admin_student_list_page.tsx"),
    ]),
  ]),
  // Routes Specific for Faculty
  ...prefix("faculty", [
    layout("./layouts/CMSFacultyLayout.tsx", [
      index("./routes/Faculty/teacher_home_page.tsx"),
    ]),
  ]),

  // 404 route
  // layout(
  // 	"./layouts/PublicContentLayout.tsx",
  // 	{ id: "publicLayoutForNotFound" },
  // 	[route("*", "routes/notFound.tsx")],
  // ),
] satisfies RouteConfig;
