import type { Route } from "./+types/contact";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({ title: "MIT | Contact" });
}

export default function Contact() {
	return <div>Contact Me</div>;
}
