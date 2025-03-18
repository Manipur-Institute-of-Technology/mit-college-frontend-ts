import { NavLink } from "react-router";

export type SideTrayListContent = (
	isActive: boolean,
	isPending: boolean,
	isTransitioning: boolean,
) => React.JSX.Element;

export type CMSNavigationData = {
	category: string;
	lists: {
		href: string;
		content: React.JSX.Element | SideTrayListContent;
		lists?: {
			href: string;
			content: React.JSX.Element | SideTrayListContent;
		}[];
	}[];
};

export type RawNavData = {
	category: string;
	lists: {
		name: string;
		href: string;
		icon: React.ComponentType<{ size: number; stroke: string; fill: string }>;
		lists?: {
			name: string;
			href: string;
			icon: React.ComponentType<{ size: number; stroke: string; fill: string }>;
		}[];
	}[];
};

export const rawNavToCMSNavData = (
	data: RawNavData[],
	listRender: (
		name: string,
		Icon: React.ComponentType<{ size: number; stroke: string; fill: string }>,
	) => SideTrayListContent,
): CMSNavigationData[] => {
	return data.map((d) => {
		return {
			...d,
			lists: d.lists.map((ls) => {
				const l = {
					href: ls.href,
					content: listRender(ls.name, ls.icon),
				};
				if (ls.lists && ls.lists.length > 0) {
					return {
						...l,
						lists: ls.lists.map((subL) => ({
							href: subL.href,
							content: listRender(subL.name, subL.icon),
						})),
					};
				}
				return l;
			}),
		};
	});
};

const moblListRender = (
	name: string,
	Icon: React.ComponentType<{ size: number; stroke: string; fill: string }>,
): SideTrayListContent => {
	return (isActive, isPending, isTransitioning) => (
		<div
			className={`inline-flex items-center gap-x-2 rounded-lg hover:bg-gray-600 p-2 w-full my-1 ${
				isActive ? "bg-gray-600" : ""
			}`}>
			<div>
				<Icon
					size={24}
					stroke={isActive ? "cyan" : "white"}
					fill="transparent"
				/>
			</div>
			<div className="text-lg text-gray-100 font-poppins">{name}</div>
		</div>
	);
};

const desktpListRender = (
	name: string,
	Icon: React.ComponentType<{ size: number; stroke: string; fill: string }>,
	sidePanelOpen: boolean,
): SideTrayListContent => {
	return (isActive, isPending, isTransitioning) => (
		<div
			className={`inline-flex items-center ${
				sidePanelOpen ? "justify-start" : "justify-center"
			} gap-x-2 rounded-lg hover:bg-gray-600 p-2 w-full my-1 ${
				isActive ? "bg-gray-600" : ""
			}`}>
			<div>
				<Icon
					size={24}
					stroke={isActive ? "cyan" : "white"}
					fill="transparent"
				/>
			</div>
			{sidePanelOpen && (
				<div className="text-md text-gray-100 font-poppins">{name}</div>
			)}
		</div>
	);
};

export const MobileSideTray: React.FC<{
	sidePanelOpen: boolean;
	navigation: RawNavData[];
}> = ({ sidePanelOpen, navigation }) => {
	return (
		<div
			style={{
				left: `${sidePanelOpen ? 0 : -100}%`,
			}}
			className="transition-all duration-700 md:hidden z-[999] border-t border-t-gray-500 absolute min-h-[100vh] h-min w-[18rem] overflow-y-auto bg-gray-800 p-2">
			{navigation.map((d, i) => (
				<div className="my-1" key={i}>
					<div className="text-sm text-gray-400 font-semibold">
						{d.category}
					</div>
					<div className="w-full my-2">
						{d.lists.map((l, li) => {
							return (
								<NavLink to={l.href} key={li}>
									{({ isActive, isPending, isTransitioning }) => (
										<>
											{moblListRender(l.name, l.icon)(
												isActive,
												isPending,
												isTransitioning,
											)}
											{l.lists && "V"}
										</>
									)}
								</NavLink>
							);
						})}
					</div>
					<hr className="bg-gray-600 border border-gray-600" />
				</div>
			))}
		</div>
	);
};

export const DesktopSideTray: React.FC<{
	sidePanelOpen: boolean;
	navigation: RawNavData[];
}> = ({ sidePanelOpen, navigation }) => {
	return (
		<div
			className={`hidden md:block md:col-span-1 bg-gray-800 h-[100vh] border-t border-t-gray-600 overflow-y-auto p-2 ${
				sidePanelOpen ? "w-[18rem]" : "w-[4rem]"
			} transition-all`}>
			{sidePanelOpen &&
				navigation.map((d, i) => (
					<div className="my-1" key={i}>
						<div className="text-sm text-gray-400 font-semibold">
							{d.category}
						</div>
						<div className="w-full my-2">
							{d.lists.map((l, i) => {
								return (
									<NavLink to={l.href} key={i}>
										{({ isActive, isPending, isTransitioning }) => (
											<>
												{desktpListRender(l.name, l.icon, sidePanelOpen)(
													isActive,
													isPending,
													isTransitioning,
												)}
												{l.lists && "V"}
											</>
										)}
									</NavLink>
								);
							})}
						</div>
					</div>
				))}
			<hr className="bg-gray-600 border border-gray-600" />
		</div>
	);
};
