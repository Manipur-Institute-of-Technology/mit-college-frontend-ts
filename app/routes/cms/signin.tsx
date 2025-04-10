import Signin from "~/pages/cms/signin/signin";
import type { Route } from "./+types/signin";

export default ({ actionData }: Route.ComponentProps) => {
	return <Signin actionData={actionData} />;
};
