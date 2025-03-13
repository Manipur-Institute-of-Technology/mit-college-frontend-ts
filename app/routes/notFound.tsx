import NotFoundPage from "~/pages/NotFound";
import type { Route } from "./+types/notFound";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({ title: "MIT | Not Found" });
}

export default function NotFound() {
	return <NotFoundPage />;
}
