import type { Route } from "./+types/editor";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
	return genPageMetaData({ title: "Editor Test" });
}

export default function Editor() {
	return <div>Editor</div>;
}
