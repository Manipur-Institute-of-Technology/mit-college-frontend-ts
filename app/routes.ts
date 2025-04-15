import {
	type RouteConfig,
	type RouteConfigEntry,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

import dotenv from "dotenv";
import type { CustomRoute } from "./types/api/customRoute.type";
const config = dotenv.config({ path: "./app.config.env" });

const routes = async (
	predefinedRoutes: RouteConfigEntry[],
): Promise<RouteConfig> => {
	const routeUrl = config?.parsed?.ROUTE_API_URL!;
	try {
		// Fetch user defined routes from API
		const res = await fetch(routeUrl);
		const customRoutes = (await res.json()) as CustomRoute[];
		console.info("All good!, route configured with user defined routes");

		return [
			...predefinedRoutes,
			// Custom defined routes
			layout(
				"./layouts/PublicContentLayout.tsx",
				{ id: "publicContentLayoutForCustomRoutes" },
				[
					...customRoutes.map((d) =>
						route(d.route, "./routes/page.tsx", { id: d.route }),
					),
				],
			),
		] satisfies RouteConfig;
	} catch (err) {
		console.error(
			`Error fetching user defined routes from API\nCheck API route ${routeUrl} is working!`,
		);
		console.error("Err: ", err);
		console.warn("configured routes without user defined routes");

		// No Custom defined routes
		return predefinedRoutes satisfies RouteConfig;
	}
};

export const predefinedRoutes = [
	// public routes
	// route("/test", "./routes/test.tsx"),
	route("/test1", "./routes/test1.tsx"),
	layout("./layouts/PublicContentLayout.tsx", [
		index("routes/home.tsx"),
		route("/home", "./routes/home.tsx", { id: "home1" }),
		route("/about", "./routes/about.tsx"),
		route("/contact", "./routes/contact.tsx"),
		route("/editor", "./routes/editor.tsx"),
		route("/publication/:pubId", "./routes/publication/[pubId].tsx"),
		// faculty routes
		...prefix("/faculty", [
			index("./routes/faculty/index.tsx"), // Faculty Search Routes
			...prefix(":facultyId", [
				// Faculty Profile Routes
				layout("./layouts/FacultyLayout/FacultyLayout.tsx", [
					index("./routes/faculty/[facultyId]/about.tsx"),
					route("aboutme", "./routes/faculty/[facultyId]/about.tsx", {
						id: "facultyAbout1",
					}),
					route(
						"teaching",
						"./routes/faculty/[facultyId]/teaching.tsx",
					),
					route(
						"research",
						"./routes/faculty/[facultyId]/research.tsx",
					),
					route(
						"publications",
						"./routes/faculty/[facultyId]/publications.tsx",
					),
					route(
						"students",
						"./routes/faculty/[facultyId]/students.tsx",
					),
				]),
			]),
		]),
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
				index("./routes/cms/faculty/dashboard.tsx"),
			]),
		]),
		// Routes Specific for Admin
		...prefix("admin", [
			layout("./layouts/CMSAdminLayout.tsx", [
				index("./routes/cms/admin/dashboard.tsx"),
				route("dashboard", "./routes/cms/admin/dashboard.tsx", {
					id: "adminDashboard1",
				}),
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

export default routes(predefinedRoutes) satisfies Promise<RouteConfig>;
// export default routes([
// 	layout("./layouts/PublicContentLayout.tsx", [index("routes/home.tsx")]),
// ]) satisfies Promise<RouteConfig>;
