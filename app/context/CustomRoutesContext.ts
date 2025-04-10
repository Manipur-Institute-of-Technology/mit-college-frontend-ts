import { createContext, useContext } from "react";
import type { CustomRoute } from "~/types/api/customRoute.type";

export interface CustomRouteContextType {
	data: CustomRoute[] | undefined;
	error: string | undefined;
	state: "loading" | "idle";
	isRouteDataLoaded: boolean;
	getContentId: (route: string) => string | undefined;
	getContentIdAsync: (route: string) => Promise<string | undefined>;
}

export const CustomRouteContext = createContext<
	CustomRouteContextType | undefined
>(undefined);

const useCustomRoute = () => {
	const ctx = useContext(CustomRouteContext);
	if (ctx === undefined) {
		throw new Error(
			"useCustomRouteContext must be used within CustomRouteProvider",
		);
	}
	return ctx;
};
export default useCustomRoute;
