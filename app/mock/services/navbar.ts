import type { NavbarData } from "~/types/api/resData.type";

export const getPublicNavContent = async (): Promise<NavbarData> => {
	try {
		const res = await fetch("/mock/pubNavbar.json");
		return (await res.json()) satisfies NavbarData[];
	} catch (err) {
		console.log("navbar fetch error", err);
		throw err;
	}
};
