import SignUp from "~/pages/cms/signup/signup";
import type { Route } from "./+types/signup";

export default ({ actionData }: Route.ComponentProps) => {
	return <SignUp actionData={actionData} />;
};
