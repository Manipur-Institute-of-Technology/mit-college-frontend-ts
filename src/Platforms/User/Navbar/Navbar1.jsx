import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import "./navbar1.css";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Admission", href: "#" },
		{
			name: "Department",
			href: "#",
			childrens: [
				{
					name: "Department of Computer Science & Engineering",
					href: "/CSE-dept",
				},
				{
					name: "Department of Electrical Engineering",
					href: "/EE_dept",
				},
				{
					name: "Department of Civil Engineering",
					href: "/CE_dept",
				},
				{
					name: "Department of Electronics & Communication Engineering",
					href: "/ECE_dept",
				},
				{
					name: "Department of Basic Sciences & Humanities",
					href: "/BSC_dept",
				},
				{
					name: "Department of Mechanical Engineering",
					href: "/ME_dept",
				},
			],
		},
		{
			name: "Administrative",
			href: "#",
			childrens: [
				{ name: "Vice Chancellor", href: "/Vice-Chancellor" },
				{ name: "Principal", href: "/Principal_0" },
				{ name: "Institute Administration", href: "/Institute_Administration" },
				{ name: "Hostel Administration", href: "/Hostel_admin_0" },
			],
		},
		{
			name: "Facility",
			href: "#",
			childrens: [
				{ name: "Library Facility", href: "/Library_Facility" },
				{ name: "Internet Facility", href: "/Internet_Facility" },
				{ name: "Hostel Facility", href: "/Hostel_Facility" },
				{ name: "Language Lab", href: "/Language_Lab" },
			],
		},
		{
			name: "Information",
			href: "#",
			childrens: [
				{ name: "Fire Safety Certificate", href: "/Fire_Safety_Certificate" },
				{ name: "Mandatory Disclosures", href: "/Mandatory_Disclosures" },
				{ name: "Ragging", href: "/Ragging" },
				{
					name: "Faculty Development Program",
					href: "/Faculty_Development_Program",
				},
				{ name: "Placement", href: "/Placement" },
				{ name: "Campus", href: "/Campus" },
				{ name: "Classroom", href: "/Classroom_0" },
				{
					name: "Online Grievance Redressal",
					href: "/Online_Grievance_Redressal",
				},
			],
		},
		{
			name: "Fee Payment",
			href: "#",
			childrens: [
				{
					name: "QFix",
					href: "https://www.eduqfix.com/PayDirect/#/student/pay/7ChovdHUkV4h1iT4e7muzE0DKGyi731lkU+vjeXKBwMrdo2FoeTSb2he6GWGiX6I/2836",
					target: "_blank",
				},
				{
					name: "Samarth",
					href: "https://manipuruniv.samarth.edu.in/feeportal/index.php/site/login",
					target: "_blank",
				},
			],
		},

		{
			name: "Extras",
			href: "#",
			childrens: [
				{
					name: "Exam",
					href: "https://www.manipuruniv.ac.in/examform2021/",
					target: "_blank",
				},
				{ name: "NIRF", href: "/NIRF" },
				{ name: "Gallery", href: "/gallery" },
				{ name: "Contact Us", href: "/Contact_Us" },
				{
					name: "Projects",
					href: "#",
				},
			],
		},
	];

	const toggleDropdown = (index) => {
		if (activeDropdown === index) {
			setActiveDropdown(null);
		} else {
			setActiveDropdown(index);
		}
	};

	return (
		<nav className="bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg sticky top-0 z-[999] m-0">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-between">
					<div className="space-x-7 hidden lg:flex">
						<div className="bg-white absolute border-8 border-rose-700/90 p-1 rounded-full hover:scale-105 origin-top transition-transform duration-300">
							<img
								src="/Manipur_University_Logo.png"
								alt="mu logo"
								height={60}
								width={60}
							/>
						</div>
					</div>

					{/* Desktop menu */}
					<div className="hidden lg:flex items-center space-x-1">
						{navigation.map((item, index) => (
							<div key={item.name} className="relative">
								{item.childrens?.length > 0 ? (
									<div>
										<button
											onClick={() => toggleDropdown(index)}
											className="relative py-4 px-2 text-gray-100 font-bold hover:bg-rose-500 transition duration-300 flex flex-row flex-nowrap items-center justify-center">
											<span className="block">{item.name}</span>
											<ChevronDown
												size={20}
												className={`${
													activeDropdown === index ? "rotate-180" : "rotate-0"
												} transition-transform duration-300`}
											/>
										</button>
										{activeDropdown === index && (
											<div className="absolute z-[999] right-0 mt-0 w-48 rounded-md bg-rose-600 ring-1 ring-black ring-opacity-5 shadow-md">
												<div className="py-1 ">
													{item.childrens.map((child, indx) => (
														<a
															key={child.name}
															href={child.href}
															target={child.target ? child.target : "_self"}
															className={`block px-4 py-2 text-sm text-gray-100 hover:bg-rose-500  ${
																indx === item.childrens.length - 1
																	? ""
																	: " border-b-2 border-b-rose-300"
															}`}>
															{child.name}
														</a>
													))}
												</div>
											</div>
										)}
									</div>
								) : (
									<a
										href={item.href}
										className="py-4 px-2 text-gray-100 font-bold hover:bg-rose-500 transition duration-300">
										{item.name}
									</a>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* MobileNav */}
			<div className="lg:hidden max-h-[100vh] overflow-y-auto">
				{/* Mobile menu button */}
				<div className="lg:hidden relative w-[100%] text-center">
					<div className="inline-block rounded-full w-fit bg-white p-1 my-1">
						<img
							src="/Manipur_University_Logo.png"
							alt="mu logo"
							height={60}
							width={60}
						/>
					</div>
					<div className="absolute right-2 top-[50%] translate-y-[-50%] rounded">
						<button
							className="block outline-none mobile-menu-button"
							onClick={() => setIsOpen(!isOpen)}>
							{isOpen ? (
								<X className="text-gray-200" size={32} />
							) : (
								<Menu className="text-gray-200" size={32} />
							)}
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{/* <div
					className={`lg:hidden ${
						isOpen ? "block" : "hidden"
					} rounded-lg border border-rose-100`}> */}
				<div
					className={`lg:hidden ${
						isOpen ? "h-auto" : "h-0"
					} rounded-lg border border-rose-100 transition-all duration-1000`}>
					{navigation.map((item, index) => (
						<div key={item.name}>
							{item.childrens?.length > 0 ? (
								<div>
									<button
										onClick={() => toggleDropdown(index)}
										className="border-b-rose-100 border-b-2  w-full relative py-2 px-4 text-gray-100 font-bold hover:bg-rose-600 transition duration-300 flex flex-row flex-nowrap items-center justify-between">
										<span className="block">{item.name}</span>

										<ChevronDown
											size={20}
											className={`${
												activeDropdown === index ? "rotate-180" : "rotate-0"
											} transition-transform duration-300`}
										/>
									</button>
									{activeDropdown === index && (
										<div className="bg-rose-500">
											{item.childrens.map((child) => (
												<a
													key={child.name}
													href={child.href}
													className="block py-2 px-8 text-sm text-gray-100 hover:bg-rose-400 border-b border-b-rose-100">
													{child.name}
												</a>
											))}
										</div>
									)}
								</div>
							) : (
								<a
									href={item.href}
									target={item.target ? item.target : "_self"}
									className="block py-2 px-4 text-sm font-bold text-gray-100 hover:bg-rose-200 border-b-rose-100 border-b-2">
									{item.name}
								</a>
							)}
						</div>
					))}
				</div>
			</div>
			<div className="w-full h-2 bg-yellow-500"></div>
			<div className="bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 w-full h-2 animate-gradient-bg"></div>
		</nav>
	);
};

export default Navbar;

// import {
// 	Disclosure,
// 	DisclosureButton,
// 	DisclosurePanel,
// 	Menu,
// 	MenuButton,
// 	MenuItem,
// 	MenuItems,
// } from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

// const navigation = [
// 	{ name: "Dashboard", href: "#", current: true },
// 	{ name: "Team", href: "#", current: false },
// 	{ name: "Projects", href: "#", current: false },
// 	{ name: "Calendar", href: "#", current: false },
// ];

// function classNames(...classes) {
// 	return classes.filter(Boolean).join(" ");
// }

// export default function Example() {
// 	return (
// 		<Disclosure as="nav" className="bg-rose-700">
// 			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
// 				<div className="relative flex h-16 items-center justify-between">
// 					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
// 						{/* Mobile menu button*/}
// 						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
// 							<span className="absolute -inset-0.5" />
// 							<span className="sr-only">Open main menu</span>
// 							<Bars3Icon
// 								aria-hidden="true"
// 								className="block size-6 group-data-[open]:hidden"
// 							/>
// 							<XMarkIcon
// 								aria-hidden="true"
// 								className="hidden size-6 group-data-[open]:block"
// 							/>
// 						</DisclosureButton>
// 					</div>
// 					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
// 						{/* <div className="flex shrink-0 items-center">
// 							<img
// 								alt="Your Company"
// 								src="/Manipur_University_Logo.png"
// 								className="h-8 w-auto"
// 							/>
// 						</div> */}
// 						<div className="hidden sm:ml-6 sm:block">
// 							<div className="flex space-x-4">
// 								{navigation.map((item) => (
// 									<a
// 										key={item.name}
// 										href={item.href}
// 										aria-current={item.current ? "page" : undefined}
// 										className={classNames(
// 											item.current
// 												? "bg-gray-900 text-white"
// 												: "text-gray-300 hover:bg-gray-700 hover:text-white",
// 											"rounded-md px-3 py-2 text-sm font-medium",
// 										)}>
// 										{item.name}
// 									</a>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
// 						<button
// 							type="button"
// 							className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
// 							<span className="absolute -inset-1.5" />
// 							<span className="sr-only">View notifications</span>
// 							<BellIcon aria-hidden="true" className="size-6" />
// 						</button>

// 						{/* Test Dropdown*/}
// 						<Menu as="div" className="relative ml-3">
// 							<div>
// 								<MenuButton className="relative">
// 									<span className="absolute -inset-1.5" />
// 									<span className="sr-only">Open user menu</span>
// 									<span className="text-lg font-bold text-white">
// 										Department
// 									</span>
// 								</MenuButton>
// 							</div>
// 							<MenuItems
// 								transition
// 								className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
// 								<MenuItem>
// 									{/* <a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Department of C
// 									</a> */}
// 									<a href="CE_dept">
// 										<div className="Dep_link_1">
// 											Department of Civil Engineering
// 										</div>
// 									</a>
// 								</MenuItem>

// 								<MenuItem>
// 									<a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Settings
// 									</a>
// 								</MenuItem>
// 								<MenuItem>
// 									<a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Sign out
// 									</a>
// 								</MenuItem>
// 							</MenuItems>
// 						</Menu>

// 						{/* Profile dropdown */}
// 						<Menu as="div" className="relative ml-3">
// 							<div>
// 								<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
// 									<span className="absolute -inset-1.5" />
// 									<span className="sr-only">Open user menu</span>
// 									<img
// 										alt=""
// 										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
// 										className="size-8 rounded-full"
// 									/>
// 								</MenuButton>
// 							</div>
// 							<MenuItems
// 								transition
// 								className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
// 								<MenuItem>
// 									<a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Your Profile
// 									</a>
// 								</MenuItem>
// 								<MenuItem>
// 									<a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Settings
// 									</a>
// 								</MenuItem>
// 								<MenuItem>
// 									<a
// 										href="#"
// 										className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
// 										Sign out
// 									</a>
// 								</MenuItem>
// 							</MenuItems>
// 						</Menu>
// 					</div>
// 				</div>
// 			</div>

// 			<DisclosurePanel className="sm:hidden">
// 				<div className="space-y-1 px-2 pb-3 pt-2">
// 					{navigation.map((item) => (
// 						<DisclosureButton
// 							key={item.name}
// 							as="a"
// 							href={item.href}
// 							aria-current={item.current ? "page" : undefined}
// 							className={classNames(
// 								item.current
// 									? "bg-gray-900 text-white"
// 									: "text-gray-300 hover:bg-gray-700 hover:text-white",
// 								"block rounded-md px-3 py-2 text-base font-medium",
// 							)}>
// 							{item.name}
// 						</DisclosureButton>
// 					))}
// 				</div>
// 			</DisclosurePanel>
// 		</Disclosure>
// 	);
// }
