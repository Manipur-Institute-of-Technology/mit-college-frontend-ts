import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";

const navs = [
	{ linkText: "About", href: "aboutme" },
	{ linkText: "Research", href: "research" },
	{ linkText: "Publications", href: "publications" },
	{ linkText: "Teachings", href: "teaching" },
	{ linkText: "Students", href: "students" },
	{ linkText: "Networks", href: "networks" },
];

// TODO: Add last update date
export const NavTabs: React.FC<FacultyBasicProfile> = (props) => {
	return (
		<div className="w-full relative shadow-lg inline-flex bg-slate-100 text-md text-slate-600 items-center justify-stretch text-center">
			{navs.slice(0, 2).map((d, i) => (
				<NavLink
					to={props.userProfileUrl + "/" + d.href}
					key={i}
					className={({ isActive }) =>
						`uppercase py-1 w-full text-md font-roboto ${isActive ? "font-semibold bg-slate-300 text-slate-600" : "text-slate-500 font-thin"} hover:bg-slate-200 border-r`
					}>
					{d.linkText}
				</NavLink>
			))}

			{navs.slice(2).map((d, i) => (
				<NavLink
					to={props.userProfileUrl + "/" + d.href}
					// to={d.href}
					key={i}
					className={({ isActive }) =>
						`hidden md:block uppercase py-1 w-full text-md font-roboto ${isActive ? "font-semibold bg-slate-300 text-slate-600" : "text-slate-500  font-thin"} hover:bg-slate-200 ${i + 2 < navs.length - 1 && "border-r"}`
					}>
					{d.linkText}
				</NavLink>
			))}

			<Menu as={"nav"} className="w-full font-roboto text-md md:hidden">
				<MenuButton className="inline-flex items-center gap-x-1 w-full py-1 hover:cursor-pointer hover:bg-slate-200 h-[100%]">
					<div className="mx-auto w-fit inline-flex items-center">
						<span className="uppercase">More</span>{" "}
						<EllipsisVertical size={18} />
					</div>
				</MenuButton>
				<MenuItems className="absolute z-[99] right-1 rounded-md mt-1 w-56 origin-top-right bg-slate-50 divide-y shadow-lg border border-slate-300">
					{navs.slice(2).map((item, index) => (
						<MenuItem key={index}>
							<NavLink
								to={props.userProfileUrl + "/" + item.href}
								className={({ isActive }) =>
									`uppercase rounded-md font-roboto block text-md text-right p-1 pr-4 hover:bg-slate-300 ${isActive ? "bg-slate-300 font-semibold text-slate-600 " : "text-slate-500 bg-slate-50 font-thin"}`
								}>
								{item.linkText}
							</NavLink>
						</MenuItem>
					))}
				</MenuItems>
			</Menu>
		</div>
	);
};
