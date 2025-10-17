import type { Route } from "./+types/home";
import HomePage from "../Platform/User/Home/Home";
import { genPageMetaData } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
  return genPageMetaData({});
}

export default function Home() {
  return <HomePage />;
}
