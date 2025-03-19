import { useCallback, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import type { NavbarData } from "~/types/api/navbar";

export default ({ navigation }: { navigation: NavbarData }) => {
	const [isOpen, setIsOpen] = useState(false); // Hamburger menu open/close
	const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // menu dropdown

	const toggleDropdown = useCallback(
		(index: number) => {
			if (activeDropdown === index) {
				setActiveDropdown(null);
			} else {
				setActiveDropdown(index);
			}
		},
		[activeDropdown, setActiveDropdown],
	);

	return (
		<nav className="bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg sticky top-0 z-[999] m-0">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex justify-between">
						<div className="space-x-7 hidden lg:flex">
							<Link to={"/"}>
								<div className="bg-white absolute border-8 border-rose-700/90 p-1 rounded-full hover:scale-105 origin-top transition-transform duration-300">
									<img
										src={navigation.logoURL}
										alt={`logo of ${navigation.navbarTitle}`}
										height={60}
										width={60}
									/>
								</div>
							</Link>
						</div>

						{/* Desktop menu */}
						<DeskMenu
							navigation={navigation}
							activeDropdown={activeDropdown}
							toggleDropdown={toggleDropdown}
						/>
					</div>
				</div>

				{/* MobileNav */}
				<MobileNav
					logoURL={navigation.logoURL}
					navbarTitle={navigation.navbarTitle}
					isOpen={isOpen}
					setIsOpen={setIsOpen}>
					<MobileMenu
						isOpen={isOpen}
						navigation={navigation}
						activeDropdown={activeDropdown}
						toggleDropdown={toggleDropdown}
					/>
				</MobileNav>
			</div>
			<div className="w-full h-2 bg-yellow-500"></div>
			<div className="bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 w-full h-2 animate-gradient-bg"></div>
		</nav>
	);
};

const DeskMenu: React.FC<{
	navigation: NavbarData;
	activeDropdown: number | null;
	toggleDropdown: (indx: number) => void;
}> = ({ navigation, activeDropdown, toggleDropdown }) => {
	return (
		<div className="hidden lg:flex items-center space-x-1">
			{navigation.menus.map((item, index) => (
				<div key={item.name} className="relative">
					{item.childrens && item.childrens.length > 0 ? (
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
											<NavLink
												to={child.href}
												key={child.name}
												target={child.target ? child.target : "_self"}
												className={(isActive) =>
													`block px-4 py-2 text-sm text-gray-100 hover:bg-rose-500 ${
														item.childrens && indx === item.childrens.length - 1
															? ""
															: " border-b-2 border-b-rose-300"
													}`
												}>
												{child.name}
											</NavLink>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<NavLink
							to={item.href}
							className={(isActive) =>
								`py-4 px-2 text-gray-100 font-bold hover:bg-rose-500 transition duration-300`
							}>
							{item.name}
						</NavLink>
					)}
				</div>
			))}
		</div>
	);
};

const MobileNav: React.FC<{
	logoURL: string;
	navbarTitle: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.JSX.Element;
}> = ({ logoURL, navbarTitle, isOpen, setIsOpen, children }) => {
	return (
		<div className="lg:hidden max-h-[100vh] overflow-y-auto">
			{/* Mobile menu button */}
			<div className="lg:hidden sticky top-0 w-[100%] text-center bg-rose-600/70 backdrop-blur-sm z-[99]">
				<div className="inline-block rounded-full w-fit bg-white p-1 my-1">
					<Link to={"/"}>
						<img
							src={logoURL}
							alt={`logo of ${navbarTitle}`}
							height={60}
							width={60}
						/>
					</Link>
				</div>
				<div className="absolute right-2 top-[50%] translate-y-[-50%] rounded">
					<button
						className="block outline-none mobile-menu-button hover:cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? (
							<X className="text-gray-200" size={32} />
						) : (
							<Menu className="text-gray-200" size={32} />
						)}
					</button>
				</div>
			</div>
			{/* MobileMenu */}
			{children}
		</div>
	);
};

const MobileMenu: React.FC<{
	isOpen: boolean;
	navigation: NavbarData;
	activeDropdown: number | null;
	toggleDropdown: (indx: number) => void;
}> = ({ isOpen, navigation, activeDropdown, toggleDropdown }) => {
	return (
		<div
			className={`lg:hidden ${
				isOpen ? "block" : "hidden"
			} rounded-lg border border-rose-100 transition-all duration-1000`}>
			{navigation.menus.map((item, index) => (
				<div key={item.name}>
					{item.childrens && item.childrens.length > 0 ? (
						<div>
							<button
								onClick={() => toggleDropdown(index)}
								className="hover:cursor-pointer border-b-rose-100 border-b-2  w-full relative py-2 px-4 text-gray-100 font-bold hover:bg-rose-600 transition duration-300 flex flex-row flex-nowrap items-center justify-between">
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
										<NavLink
											key={child.name}
											to={child.href}
											className="block py-2 px-8 text-sm text-gray-100 hover:bg-rose-400 border-b border-b-rose-100">
											{child.name}
										</NavLink>
									))}
								</div>
							)}
						</div>
					) : (
						<NavLink
							to={item.href}
							target={item.target ? item.target : "_self"}
							className="block py-2 px-4 text-sm font-bold text-gray-100 hover:bg-rose-200 border-b-rose-100 border-b-2">
							{item.name}
						</NavLink>
					)}
				</div>
			))}
		</div>
	);
};
