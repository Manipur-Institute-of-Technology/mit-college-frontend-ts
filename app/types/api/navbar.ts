export type NavbarData = {
	navbarTitle: string;
	logoURL: string;
	menus: {
		name: string;
		href: string;
		target?: string;
		childrens?: {
			name: string;
			href: string;
			target?: string;
		}[];
	}[];
};
