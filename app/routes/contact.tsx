import type { Route } from "./+types/contact";
import { genPageMetaData } from "~/utils/meta";
import ContactUsPage from "~/pages/contact/contact";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({ title: "MIT | Contact" });
}

export default function Contact() {
	return <ContactUsPage />;
}
