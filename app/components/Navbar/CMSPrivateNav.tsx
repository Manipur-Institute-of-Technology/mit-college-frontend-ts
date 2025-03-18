import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuIcon, PanelRight, PanelRightOpen, Search, X } from "lucide-react";

export type AccountInfo = {
	name: string;
	email: string;
	imageURL: string;
};

const userNavigation = [
	{ name: "Your Profile", href: "#" },
	{ name: "Settings", href: "#" },
	{ name: "Sign out", href: "#" },
];

const CMSPrivateNav: React.FC<{
	navbarTitle: string;
	logoURL: string;
	accountData: AccountInfo;
	sidePanelOpen: boolean;
	setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
	navbarTitle,
	logoURL,
	accountData,
	sidePanelOpen,
	setSidePanelOpen,
}) => {
	return (
		<Disclosure as="nav" className="bg-gray-800">
			<div className="mx-auto px-5">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-x-6">
						<div>
							<div className="hidden md:block">
								<button onClick={() => setSidePanelOpen(!sidePanelOpen)}>
									{sidePanelOpen ? (
										<PanelRightOpen size={24} stroke="white" />
									) : (
										<PanelRight size={24} stroke="white" />
									)}
								</button>
							</div>
							<div className="md:hidden block">
								<button onClick={() => setSidePanelOpen(!sidePanelOpen)}>
									{sidePanelOpen ? (
										<X size={24} stroke="white" />
									) : (
										<MenuIcon size={24} stroke="white" />
									)}
								</button>
							</div>
						</div>
						<div className="shrink-0">
							<img
								alt={`${navbarTitle} logo`}
								src={logoURL}
								className="size-8 contrast-75 rounded-full bg-slate-50"
							/>
						</div>
						<div className="text-slate-50 text-lg font-semibold hidden md:block">
							{/* MIT Content Management System */}
							{navbarTitle}
						</div>
					</div>
					<div className="block">
						<div className="ml-4 flex items-center md:ml-6">
							<div className="hidden md:flex items-center rounded bg-slate-600 focus-within:bg-slate-200 gap-x-2">
								<div className="pl-2">
									<Search size={14} stroke="grey" />
								</div>
								<input
									type="text"
									placeholder="Search"
									className="outline-none bg-slate-600 rounded focus:bg-slate-200 py-1"
								/>
							</div>
							<button
								type="button"
								className="hidden md:block relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
								<span className="absolute -inset-1.5" />
								<span className="sr-only">View notifications</span>
								<BellIcon aria-hidden="true" className="size-6" />
							</button>

							{/* Profile dropdown */}
							<DesktopProfileDropdown accountData={accountData} />
						</div>
					</div>
					<div className="-mr-2 flex md:hidden">
						{/* Mobile menu button */}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
							{/* <span className="absolute -inset-0.5" /> */}
							<span className="sr-only">Open main menu</span>
							<img
								alt={`image of ${accountData.name}`}
								src={accountData.imageURL}
								className="size-8 rounded-full"
							/>
						</DisclosureButton>
					</div>
				</div>
			</div>
			<MobProfileDropDown accountData={accountData} />
		</Disclosure>
	);
};
export default CMSPrivateNav;

const MobProfileDropDown: React.FC<{ accountData: AccountInfo }> = ({
	accountData,
}) => {
	return (
		<DisclosurePanel className="md:hidden">
			<div className="border-t border-gray-700 pb-3 pt-4">
				<div className="flex items-center px-5">
					<div className="shrink-0">
						<img
							alt={`image of ${accountData.name}`}
							src={accountData.imageURL}
							className="size-10 rounded-full"
						/>
					</div>
					<div className="ml-3">
						<div className="text-base/5 font-medium text-white">
							{accountData.name}
						</div>
						<div className="text-sm font-medium text-gray-400">
							{accountData.email}
						</div>
					</div>
					<button
						type="button"
						className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
						<span className="absolute -inset-1.5" />
						<span className="sr-only">View notifications</span>
						<BellIcon aria-hidden="true" className="size-6" />
					</button>
				</div>
				<div className="mt-3 space-y-1 px-2">
					<div className="mx-3 flex items-center rounded bg-slate-600 focus-within:bg-slate-200 gap-x-2">
						<div className="pl-2">
							<Search size={14} stroke="grey" />
						</div>
						<input
							type="text"
							placeholder="Search"
							className="outline-none w-full border bg-slate-600 rounded focus:bg-slate-200 py-1"
						/>
					</div>
					{userNavigation.map((item) => (
						<DisclosureButton
							key={item.name}
							as="a"
							href={item.href}
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
							{item.name}
						</DisclosureButton>
					))}
				</div>
			</div>
		</DisclosurePanel>
	);
};

const DesktopProfileDropdown: React.FC<{ accountData: AccountInfo }> = ({
	accountData,
}) => {
	return (
		<Menu as="div" className="relative ml-3 hidden md:block">
			<div>
				<MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
					<span className="absolute -inset-1.5" />
					<span className="sr-only">Open user menu</span>
					<img
						alt={`image of ${accountData.name}`}
						src={accountData.imageURL}
						className="size-8 rounded-full"
					/>
				</MenuButton>
			</div>
			<MenuItems
				transition
				className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
				{userNavigation.map((item) => (
					<MenuItem key={item.name}>
						<a
							href={item.href}
							className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
							{item.name}
						</a>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
};
