import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { ChevronDown, Hammer, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import type { NavbarData } from "~/types/api/resData.type";

export const useScrollDirection = () => {
	const lastScrollRef = useRef<number>(
		window.pageYOffset || document.documentElement.scrollTop,
	);
	const [scrollDirection, setScrollDirection] = useState<
		"up" | "down" | null
	>(null);

	const removeScrollListener = () =>
		window.removeEventListener("scroll", () => {});

	useEffect(() => {
		const factor = 10;
		window.addEventListener("scroll", () => {
			const y = window.pageYOffset || document.documentElement.scrollTop;
			// console.log(y, lastScrollRef.current);
			if (y > lastScrollRef.current + factor) {
				// scroll down
				setScrollDirection("down");
				lastScrollRef.current = y < 0 ? 0 : y;
			} else if (y < lastScrollRef.current - factor) {
				// scroll up
				setScrollDirection("up");
				lastScrollRef.current = y < 0 ? 0 : y;
			}
			// lastScrollRef.current = y < 0 ? 0 : y;
		});
		return removeScrollListener;
	}, []);

	useEffect(() => {
		console.log(scrollDirection);
	}, [lastScrollRef.current]);

	return { scrollDirection, removeScrollListener };
};

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

	const toggleHamMenu = () => {
		setIsOpen((s) => {
			return !s;
		});
	};

	return (
		<nav
			className={`bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg z-9 m-0 sticky top-0 transition-[top] duration-700`}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex justify-between">
						<div className="space-x-7 hidden lg:flex">
							{navigation.logoURL && (
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
							)}
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
					activeDropdown={activeDropdown}
					scrollDirection={"down"}
					toggleHamMenu={toggleHamMenu}
					mobNavViz={true}>
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

// export const defaulter =  ({ navigation }: { navigation: NavbarData }) => {
// 	const { scrollDirection } = useScrollDirection();
// 	const [isOpen, setIsOpen] = useState(false); // Hamburger menu open/close
// 	const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // menu dropdown
// 	const [mobNavViz, setMobNavViz] = useState<boolean>(true);
// 	const [deskNavViz, setDeskNavViz] = useState<boolean>(true);

// 	useEffect(() => {
// 		window.addEventListener("scroll", () => {
// 			if (scrollDirection === "down") {
// 				if (window.innerWidth < 1024) {
// 					if (!isOpen) {
// 						setDeskNavViz(false);
// 						setMobNavViz(false);
// 					} else {
// 						setDeskNavViz(true);
// 						setMobNavViz(true);
// 					}
// 				} else {
// 					if (activeDropdown === null) setDeskNavViz(false);
// 				}
// 			} else {
// 				setDeskNavViz(true);
// 				setMobNavViz(true);
// 			}
// 		});
// 		return () => window.removeEventListener("scroll", () => {});
// 	}, [scrollDirection, activeDropdown, isOpen]);

// 	const toggleDropdown = useCallback(
// 		(index: number) => {
// 			if (activeDropdown === index) {
// 				setActiveDropdown(null);
// 				setMobNavViz(true);
// 				setDeskNavViz(true);
// 			} else {
// 				setActiveDropdown(index);
// 			}
// 		},
// 		[activeDropdown, setActiveDropdown],
// 	);

// 	const toggleHamMenu = () => {
// 		setIsOpen((s) => {
// 			setMobNavViz(true);
// 			setDeskNavViz(true);

// 			return !s;
// 		});
// 	};

// 	return (
// 		<nav
// 			className={`bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg z-[999] m-0 sticky ${!deskNavViz ? "top-[-100%]" : "top-0"} transition-[top] duration-700`}>
// 			{deskNavViz ? "true" : "false"} | {mobNavViz ? "true" : "false"}
// 			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// 				<div className="max-w-6xl mx-auto px-4">
// 					<div className="flex justify-between">
// 						<div className="space-x-7 hidden lg:flex">
// 							<Link to={"/"}>
// 								<div className="bg-white absolute border-8 border-rose-700/90 p-1 rounded-full hover:scale-105 origin-top transition-transform duration-300">
// 									<img
// 										src={navigation.logoURL}
// 										alt={`logo of ${navigation.navbarTitle}`}
// 										height={60}
// 										width={60}
// 									/>
// 								</div>
// 							</Link>
// 						</div>

// 						{/* Desktop menu */}
// 						<DeskMenu
// 							navigation={navigation}
// 							activeDropdown={activeDropdown}
// 							toggleDropdown={toggleDropdown}
// 						/>
// 					</div>
// 				</div>

// 				{/* MobileNav */}
// 				<MobileNav
// 					logoURL={navigation.logoURL}
// 					navbarTitle={navigation.navbarTitle}
// 					isOpen={isOpen}
// 					activeDropdown={activeDropdown}
// 					scrollDirection={scrollDirection}
// 					toggleHamMenu={toggleHamMenu}
// 					mobNavViz={mobNavViz}>
// 					<MobileMenu
// 						isOpen={isOpen}
// 						navigation={navigation}
// 						activeDropdown={activeDropdown}
// 						toggleDropdown={toggleDropdown}
// 					/>
// 				</MobileNav>
// 			</div>
// 			<div className="w-full h-2 bg-yellow-500"></div>
// 			<div className="bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 w-full h-2 animate-gradient-bg"></div>
// 		</nav>
// 	);
// };

// export const defaulter = ({ navigation }: { navigation: NavbarData }) => {
// 	const [isOpen, setIsOpen] = useState(false); // Hamburger menu open/close
// 	const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // menu dropdown
// 	const [mobNavViz, setMobNavViz] = useState<boolean>(true);
// 	const [deskNavViz, setDeskNavViz] = useState<boolean>(true);

// useEffect(() => {
// 	window.addEventListener("scroll", () => {
// 		if (scrollDirection === "down") {
// 			if (window.innerWidth < 1024) {
// 				if (!isOpen) {
// 					setDeskNavViz(false);
// 					setMobNavViz(false);
// 				} else {
// 					setDeskNavViz(true);
// 					setMobNavViz(true);
// 				}
// 			} else {
// 				if (activeDropdown === null) setDeskNavViz(false);
// 			}
// 		} else {
// 			setDeskNavViz(true);
// 			setMobNavViz(true);
// 		}
// 	});
// 	return () => window.removeEventListener("scroll", () => {});
// }, [scrollDirection, activeDropdown, isOpen]);

// 	const toggleDropdown = useCallback(
// 		(index: number) => {
// 			if (activeDropdown === index) {
// 				setActiveDropdown(null);
// 				setMobNavViz(true);
// 				setDeskNavViz(true);
// 			} else {
// 				setActiveDropdown(index);
// 			}
// 		},
// 		[activeDropdown, setActiveDropdown],
// 	);

// 	const toggleHamMenu = () => {
// 		setIsOpen((s) => {
// 			if (s) {
// 				setMobNavViz(true);
// 				setDeskNavViz(true);
// 			}
// 			return !s;
// 		});
// 	};

// 	return (
// 		<>
// 			<DeskNav
// 				logoURL={navigation.logoURL}
// 				navbarTitle={navigation.navbarTitle}>
// 				<DeskMenu
// 					navigation={navigation}
// 					activeDropdown={activeDropdown}
// 					toggleDropdown={toggleDropdown}
// 				/>
// 			</DeskNav>
// 		</>
// 	);
// };

const DeskNav: React.FC<{
	logoURL: string;
	navbarTitle: string;
	children: JSX.Element;
}> = ({ logoURL, navbarTitle, children }) => {
	const [deskNavViz, setDeskNavViz] = useState<boolean>(true);

	return (
		<nav
			className={`bg-rose-700/90 backdrop-blur-sm shadow-lg rounded-b-lg z-[999] m-0 sticky ${!deskNavViz ? "top-[-100%]" : "top-0"} transition-[top] duration-700`}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex justify-between">
						<div className="space-x-7 hidden lg:flex">
							<Link to={"/"}>
								<div className="bg-white absolute border-8 border-rose-700/90 p-1 rounded-full hover:scale-105 origin-top transition-transform duration-300">
									<img
										src={logoURL}
										alt={`logo of ${navbarTitle}`}
										height={60}
										width={60}
									/>
								</div>
							</Link>
						</div>

						{/* Desktop menu */}
						{children}
					</div>
				</div>
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
										activeDropdown === index
											? "rotate-180"
											: "rotate-0"
									} transition-transform duration-300`}
								/>
							</button>
							{activeDropdown === index && (
								<div className="absolute z-[999] right-0 mt-0 w-48 rounded-md bg-rose-600 ring-1 ring-rose-300 ring-opacity-5 shadow-md">
									<div className="py-1 ">
										{item.childrens.map((child, indx) => (
											<NavLink
												to={child.href}
												key={child.name}
												target={
													child.target
														? child.target
														: "_self"
												}
												className={(isActive) =>
													`block px-4 py-2 text-sm text-gray-100 hover:bg-rose-500 ${
														item.childrens &&
														indx ===
															item.childrens
																.length -
																1
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
	activeDropdown: null | number;
	scrollDirection: null | "up" | "down";
	toggleHamMenu: () => void;
	mobNavViz: boolean;
	children: React.JSX.Element;
}> = ({
	logoURL,
	navbarTitle,
	isOpen,
	toggleHamMenu,
	activeDropdown,
	scrollDirection,
	mobNavViz,
	children,
}) => {
	return (
		<div className="lg:hidden max-h-[100vh] overflow-y-auto sticky">
			{/* Mobile menu button */}
			<div
				className={`lg:hidden sticky top-0 transition-[top] duration-700 w-[100%] text-center bg-rose-600/70 backdrop-blur-sm z-[99]`}>
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
						onClick={() => toggleHamMenu()}>
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
										activeDropdown === index
											? "rotate-180"
											: "rotate-0"
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
