import NotFoundPage from "~/pages/NotFound";
import { genPageMetaData } from "~/utils/meta";

export function meta() {
	return genPageMetaData({ title: "MIT | Not Found" });
}

export default function NotFound() {
	return <NotFoundPage />;
}
