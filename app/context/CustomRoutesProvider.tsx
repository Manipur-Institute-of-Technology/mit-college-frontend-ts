import type React from "react";
import {
	CustomRouteContext,
	type CustomRouteContextType,
} from "./CustomRoutesContext";
import { useEffect, useState } from "react";
import { useXFetcher } from "~/hooks/useXFetcher";
import type { CustomRoute } from "~/types/api/customRoute.type";

const CustomRoutesProvider: React.FC<{
	routeSrcUrl: string;
	children: React.JSX.Element;
}> = ({ routeSrcUrl, children }) => {
	let url: URL;
	try {
		url = new URL(routeSrcUrl);
	} catch (err) {
		console.error(`${routeSrcUrl} is not a valid URL`);
		throw err;
	}
	const [isRouteDataLoaded, setIsRouteDataLoaded] = useState(false);
	const [dataSrcUrl, setDataSrcUrl] = useState(url);
	const { data, error, xFetch, state } = useXFetcher<CustomRoute[]>();

	useEffect(() => {
		try {
			xFetch(async () => {
				try {
					// TODO: delay response, remove on prod
					await new Promise((res) =>
						setTimeout(() => res(false), 800),
					);
					const res = await fetch(dataSrcUrl.href);
					return (await res.json()) as CustomRoute[];
				} catch (err) {
					console.error(
						`err fetching route data with url: ${dataSrcUrl}`,
					);
					console.error(err);
					return [] as CustomRoute[];
				}
			});
		} catch (err) {
			console.error(
				`Cannot fetch routes data from the provided url: ${dataSrcUrl.href}`,
			);
			console.error(err);
		} finally {
			setIsRouteDataLoaded(true);
		}
	}, [dataSrcUrl]);

	/**
	 * Retrieves the content ID associated with a given route path.
	 *
	 * @param route - The route path string to look up
	 * @returns Promise that resolves to either:
	 *          - The matching content ID string if found
	 *          - undefined if no match is found or data isn't available
	 *
	 * @remarks
	 * The function implements a polling mechanism when route data is still loading,
	 * checking every 100ms until the data becomes available.
	 * Once data is loaded, it searches for a matching route and returns its contentId.
	 */
	// TODO: Attach a promise to xfetch callback and used promiseAll like, instead of long polling
	const getContentIdAsync = (route: string): Promise<string | undefined> => {
		return new Promise((resolve) => {
			if (!isRouteDataLoaded || state === "loading") {
				const checkData = () => {
					if (isRouteDataLoaded && state === "idle" && data) {
						const matchedRoute = data.find(
							(r) => r.route === route,
						);
						resolve(matchedRoute?.contentId);
					} else {
						setTimeout(checkData, 100);
					}
				};
				checkData();
			} else if (data) {
				const matchedRoute = data.find((r) => r.route === route);
				resolve(matchedRoute?.contentId);
			} else {
				resolve(undefined);
			}
		});
	};

	const getContentId = (route: string): string | undefined => {
		if (isRouteDataLoaded && !error && data && state === "idle") {
			return data.find((d) => d.route === route)?.contentId;
		}
		return undefined;
	};

	const value: CustomRouteContextType = {
		data,
		error,
		state,
		isRouteDataLoaded,
		getContentId,
		getContentIdAsync,
	};

	return (
		<CustomRouteContext.Provider value={value}>
			{children}
		</CustomRouteContext.Provider>
	);
};

export default CustomRoutesProvider;
