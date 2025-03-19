import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	// public routes
	route("/test", "./routes/test.tsx"),
	layout("./layouts/PublicContentLayout.tsx", [
		index("routes/home.tsx"),
		route("/home", "./routes/home.tsx", { id: "home1" }),
		route("/contact", "./routes/contact.tsx"),
		route("/editor", "./routes/editor.tsx"),
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
