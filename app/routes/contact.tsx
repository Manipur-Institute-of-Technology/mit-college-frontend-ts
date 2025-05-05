import type { Route } from "./+types/contact";
import { genPageMetaData } from "~/utils/meta";
import ContactUsPage from "~/pages/contact/contact";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({ title: "MIT | Contact" });
}

export const links: Route.LinksFunction = () => [
	// Can be override in another page
	// TODO: Fix favicon icon override
	{ rel: "icon", href: "/favicon.ico" },
];

export default function Contact() {
	return <ContactUsPage />;
}
