import type { Route } from "./+types/home";
import HomePage from "../pages/Home";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({});
	// return [
	// 	{ title: "Manipur Institute of Technology" },
	// 	{
	// 		name: "description",
	// 		content: "Home page for Manipur Institute of Technology",
	// 	},
	// 	{
	// 		name: "og:image",
	// 		itemProp: "image primaryImageOfPage",
	// 		content:
	// 			"https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded",
	// 	},
	// ];
}

export default function Home() {
	return <HomePage />;
}
