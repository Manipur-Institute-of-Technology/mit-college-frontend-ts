import Contact_Us from "~/Platform/User/Contact Us/Contact_us";
import type { Route } from "./+types/contact";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
  return genPageMetaData({ title: "MIT | Contact" });
}

export default function Contact() {
  return <Contact_Us />;
}
