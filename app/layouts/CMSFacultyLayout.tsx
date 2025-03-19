import CMSPrivLayout from "./CMSPrivateLayout";
import { BookOpen, LayoutDashboard, Wrench } from "lucide-react";
import { type RawNavData } from "./../components/SideTray/SideTray";
import type { Route } from "./+types/CMSFacultyLayout";
import type { AccountInfo } from "~/types/api/AccountInfo";

// Navdata for admin
const rawNavData: RawNavData[] = [
	{
		category: "Main Items",
		lists: [
			{
				name: "Dashboard",
				href: "/cms/dashboard",
				icon: LayoutDashboard,
				// icon: <LayoutDashboard size={24} stroke="white" />,
			},
			{
				name: "Pages",
				href: "/cms/pages",
				icon: BookOpen,
				// icon: <BookOpen size={24} stroke="rgb(30,129,206)" />,
				lists: [
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
				],
			},
			{
				name: "Tools",
				href: "/cms/tools",
				icon: Wrench,
			},
		],
	},
	{
		category: "Reasearch Tools",
		lists: [
			{
				name: "Dashboard",
				href: "/cms/dashboard",
				icon: LayoutDashboard,
			},
			{
				name: "Pages",
				href: "/cms/pages",
				icon: BookOpen,
				lists: [
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
					{ name: "Tools", href: "/cms/tools", icon: Wrench },
				],
			},
			{
				name: "Tools",
				href: "/cms/tools",
				icon: Wrench,
			},
		],
	},
];

export const clientLoader = async () => {
	const res = await fetch("/mock/accountData.json");
	const data = (await res.json()) as AccountInfo;
	return { data };
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data: accountInfo } = loaderData;
	return (
		<CMSPrivLayout
			navbarTitle="Manipur Institute of Technology"
			logoURL="/Manipur_University_Logo.png"
			navigation={rawNavData}
			accountData={accountInfo}
		/>
	);
};
