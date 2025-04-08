import { getFacultyBasicProfile } from "~/mock/services/fetchMockData";
import type { Route } from "./+types/FacultyLayout";
import React, { Suspense, useState } from "react";
import {
	Await,
	Link as LinkTo,
	NavLink,
	useLocation,
	useNavigation,
} from "react-router";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import {
	capitalizeString,
	capitalizeWords,
	formatCamelCaseString,
} from "~/utils/format";
import {
	ArrowRight,
	ArrowUpRight,
	ChevronDown,
	Contact,
	Copy,
	Download,
	EllipsisVertical,
	ExternalLink,
	Globe,
	Link,
	Mail,
	MapPin,
	Phone,
	Share2,
} from "lucide-react";
import { FaOrcid } from "react-icons/fa";
import { socialIconMap } from "~/constants/socialIconMap";
import type { IconType } from "react-icons";
import {
	DialogTitle,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/react";
import { Outlet } from "react-router";
import { useModal } from "~/hooks/useModal";
import { FacultyBasicProfileDataContext } from "~/context/FacultyBasicProfileDataContext";
import moment from "moment";

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
	// TODO: Test with non existent or invalid ID
	// TODO: refactor, suspense, errBoundary components
	// Create a generic component that can handle suspense, err, and design in a way that we can inject
	// the template to be displayed in different scenarios (like invalid URL, not found Profile)
	//make the generic component have a default template also
	try {
		const { facultyId } = params;
		if (facultyId) {
			// TODO: Decode B66 encoded string here
			const basicProfile = getFacultyBasicProfile(facultyId);
			return { data: basicProfile };
		}
		throw new Error(
			`faculty id in path is not defined: ${window.location.href}`,
		);
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error) {
		return <div className="text-black">An error occur</div>;
	}
	return (
		<div>
			<Suspense fallback={<>Loading...</>}>
				<Await resolve={data}>
					{(val) => val && <FacultyBasicInfoCard {...val} />}
				</Await>
			</Suspense>
		</div>
	);
};

const navs = [
	{ linkText: "About", href: "/aboutme" },
	{ linkText: "Research", href: "/research" },
	{ linkText: "Publications", href: "/publications" },
	{ linkText: "Teachings", href: "/teaching" },
	{ linkText: "Students", href: "/students" },
	{ linkText: "Networks", href: "/networks" },
];
// TODO: Add last update date
const NavTabs: React.FC<FacultyBasicProfile> = (props) => {
	return (
		<div className="w-full relative shadow-lg inline-flex bg-slate-100 text-md text-slate-600 items-center justify-stretch text-center">
			{navs.slice(0, 2).map((d, i) => (
				<NavLink
					to={props.userProfileUrl + d.href}
					key={i}
					className={({ isActive }) =>
						`uppercase py-1 w-full text-md font-roboto ${isActive ? "font-semibold bg-slate-300 border-b text-slate-600" : "text-slate-500  font-thin"} hover:bg-slate-200 border-r`
					}>
					{d.linkText}
				</NavLink>
			))}
			<Menu as={"nav"} className="w-full font-roboto text-md">
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
								to={props.userProfileUrl + item.href}
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
const FacultyBasicInfoCard: React.FC<FacultyBasicProfile> = (props) => {
	return (
		<FacultyBasicProfileDataContext.Provider value={props}>
			<div className="w-full">
				<FacultyProfileCard {...props} />
				<FacultyTab {...props} />
				{/* TabNavigations */}
				<NavTabs {...props} />
				<Outlet />
			</div>
		</FacultyBasicProfileDataContext.Provider>
	);
};

const FacultyTab: React.FC<FacultyBasicProfile> = (props) => {
	const iconMap = Object.entries(socialIconMap);
	return (
		<ContactTabs
			tabs={[Contact, Link].map((Icon) => {
				return (isActive) => (
					<Icon size={24} className="stroke-slate-100 md:hidden" />
				);
			})}>
			<div className="w-full text-slate-700 font-roboto">
				<h1 className="text-center font-bold text-slate-800 text-2xl">
					Contact Information
				</h1>
				<div>
					{props.emails.map((email, i) => (
						<LinkTo
							to={`mailto:${email}`}
							key={i}
							className="inline-flex items-center gap-x-2 text-md my-1">
							<Mail size={24} /> <div>{email}</div>
						</LinkTo>
					))}
				</div>
				<div>
					{props.phoneNumbers.map((p, i) => (
						<LinkTo
							to={`tel:${p.countryCode}${p.number}`}
							key={i}
							className="inline-flex items-center gap-x-2 text-md my-1">
							<Phone size={24} />
							<div>
								({p.countryCode}) {p.number} ({p.type})
							</div>
						</LinkTo>
					))}
				</div>
				<LinkTo
					to={`maps.google.com/location/${props.address.streetAddress || ""} ${props.address.state}, ${props.address.state}, ${props.address.country}`}
					className="w-full inline-flex items-center gap-x-2 text-md my-1">
					<MapPin size={24} />
					<div>
						{props.address.streetAddress && props.address.streetAddress + ", "}
						{props.address.city}, {props.address.state}, {props.address.country}
						, {props.address.zipCode}
					</div>
				</LinkTo>
			</div>
			<div className="w-full text-slate-700 font-roboto">
				<h1 className="text-center font-bold text-slate-800 text-2xl">Links</h1>
				{props.personalWebsite && (
					<div className="inline-flex items-center gap-x-2">
						<Globe size={20} />
						<LinkTo
							to={props.personalWebsite}
							className="text-md hover:underline">
							Personal Website
						</LinkTo>
						<LinkTo
							to={props.personalWebsite}
							target="_blank"
							referrerPolicy="no-referrer"
							rel="noopener noreferrer">
							<ExternalLink size={14} />
						</LinkTo>
					</div>
				)}
				{props.orchidId && (
					<div className="w-full">
						<div className="inline-flex items-center gap-x-2">
							<FaOrcid size={20} />
							<LinkTo
								to={"https://orcid.org/" + props.orchidId}
								className="text-md hover:underline">
								Orchid
							</LinkTo>
							<LinkTo
								to={"https://orcid.org/" + props.orchidId}
								target="_blank"
								referrerPolicy="no-referrer"
								rel="noopener noreferrer">
								<ExternalLink size={14} />
							</LinkTo>
						</div>
					</div>
				)}
				{props.socialLinks.map((d, i) => {
					const Icon = iconMap.find((s) => s[0] === d.platform);
					let IconElm: IconType = Icon ? Icon[1] : Link;
					return (
						<div className="w-full inline-flex items-center gap-x-2" key={i}>
							{<IconElm size={20} />}
							<LinkTo to={d.url} className="text-md hover:underline">
								{capitalizeWords(formatCamelCaseString(d.platform))}
							</LinkTo>
							<LinkTo
								to={d.url}
								target="_blank"
								referrerPolicy="no-referrer"
								rel="noopener noreferrer">
								<ExternalLink size={14} />
							</LinkTo>
						</div>
					);
				})}
			</div>
		</ContactTabs>
	);
};

const ContactTabs: React.FC<{
	tabs: ((active: boolean) => React.JSX.Element)[];
	children: React.JSX.Element[];
	activeStyle?: string;
	inActivStyle?: string;
}> = ({
	tabs,
	children,
	activeStyle = "bg-slate-600",
	inActivStyle = "bg-slate-500",
}) => {
	const [activeTabIndx, setActiveTabIndx] = useState<number | null>(null);

	return (
		<div className="w-full">
			<div className="flex flex-row flex-nowrap items-center justify-stretch w-full">
				{tabs.map((t, i) => (
					<div
						key={i}
						className={
							"hover:cursor-pointer shadow-xl p-1 w-full inline-flex items-center justify-center " +
							(i === tabs.length - 1 ? "" : " border-r border-r-slate-300 ") +
							(i === activeTabIndx ? activeStyle : inActivStyle)
						}
						onClick={() => setActiveTabIndx((s) => (s === i ? null : i))}>
						{t(i === activeTabIndx)}
					</div>
				))}
			</div>
			<div
				className={`w-full relative bg-slate-50 px-4 ${activeTabIndx === null ? "h-0" : "py-2 h-fit"}`}>
				{/* {activeTabIndx !== null ? children[activeTabIndx] : <></>} */}
				{activeTabIndx !== null &&
					children.map((d, i) => (
						<div
							key={i}
							className={`w-full top-0 ${i === activeTabIndx ? "h-fit" : "h-0 scale-y-0"} origin-top`}>
							{d}
						</div>
					))}
			</div>
		</div>
	);
};

const ModalContent: React.FC<{
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	userProfileUrl: string;
}> = ({ setIsOpen, userProfileUrl }) => {
	return (
		<>
			<DialogTitle
				as="h3"
				className="text-lg font-medium leading-6 text-gray-900">
				Share Link
			</DialogTitle>
			<div className="mt-2">
				<div className="text-sm text-gray-500">
					<div>Sorry, native sharing is not available on your browser.</div>
					<div className="flex flex-col gap-2 mt-2">
						<div className="flex items-center gap-2">
							<input
								type="text"
								readOnly
								value={window.location.origin + userProfileUrl}
								className="w-full p-2 border rounded bg-gray-50"
							/>
							<button
								onClick={() => navigator.clipboard.writeText(userProfileUrl)}
								className="p-2 rounded bg-blue-100 hover:bg-blue-200">
								<Copy size={16} />
							</button>
						</div>
					</div>
					<div>Instead, used this link to share it.</div>
				</div>
			</div>

			<div className="mt-4">
				<button
					type="button"
					className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-sate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
					onClick={() => setIsOpen(false)}>
					Close
				</button>
			</div>
		</>
	);
};

const FacultyProfileCard: React.FC<FacultyBasicProfile> = (props) => {
	const { setIsOpen, ModalComponent } = useModal();
	const Modal = (
		<ModalComponent>
			<ModalContent
				setIsOpen={setIsOpen}
				userProfileUrl={props.userProfileUrl}
			/>
		</ModalComponent>
	);

	return (
		<div className="p-2 w-full text-center font-roboto bg-slate-700 text-slate-200 relative rounded-t-lg">
			{/* Desk */}
			<div className="hidden md:block">
				<DeskProfileCard {...props} />
			</div>
			{/* Mobile */}
			<div className="md:hidden">
				<MobileProfileCard {...props} />
			</div>
			<div className="text-[12px] text-right text-slate-300">
				Last updates at {moment(props.updatedAt).format("D MMM YYYY, HH:mm")}
			</div>

			{/* Share Button */}
			<button
				className="absolute top-4 right-4 rounded-full border p-2 bg-slate-600 hover:cursor-pointer hover:bg-slate-800"
				onClick={async () => {
					try {
						await navigator.share({
							title: `${props.firstName} ${props.lastName}'s Profile`,
							url: props.userProfileUrl,
							text: `Faculty profile of ${props.firstName} ${props.lastName}`,
						});
					} catch (err) {
						console.error("sharing option not available", err);
						setIsOpen(true);
					}
				}}>
				<Share2 size={20} />
			</button>
			{Modal}
		</div>
	);
};

const DeskProfileCard: React.FC<FacultyBasicProfile> = (props) => {
	const iconMap = Object.entries(socialIconMap);

	return (
		<div className="flex items-center">
			<div className="grid grid-cols-6 gap-x-12 py-2 items-start">
				<div className="col-span-2 inline-flex items-center justify-center rounded-lg overflow-clip py-4">
					{props.avatarUrl ? (
						<img
							// src={"https://randomuser.me/api/portraits/men/4.jpg"}
							src="/avatar.png"
							alt={`Profile photo of ${props.firstName} ${props.lastName}`}
							className="rounded-lg object-contain h-auto w-[24rem] max-w-full"
						/>
					) : (
						// TODO: instead of displaying initial two letter, used a generic profile image
						<div className="rounded-full size-[10rem] border text-4xl relative border-amber-500">
							<div className="translate-[-50%] top-[50%] left-[50%] border border-green-500 w-fit relative">
								MK
							</div>
						</div>
					)}
				</div>
				<div className="col-span-4 text-left font-roboto py-4">
					<div className="text-5xl text-slate-50">
						<span className="capitalize">{props.initial}</span>{" "}
						{props.firstName} {props.lastName}
					</div>

					<div className="mt-2">
						{props.emails.map((d, i) => (
							<LinkTo
								key={i}
								to={`mailto:${d}`}
								className="text-sm font-thin underline hover:decoration-0 inline-flex items-center gap-x-2 text-slate-200">
								<Mail size={18} />
								{d}
							</LinkTo>
						))}
					</div>
					<div>
						{props.phoneNumbers.map((d, i) => (
							<LinkTo
								key={i}
								to={`tel:${d}`}
								className="text-sm font-thin hover:decoration-0 inline-flex items-center gap-x-2 text-slate-200 capitalize">
								<Phone size={18} />({d.countryCode}) {d.number} ({d.type})
							</LinkTo>
						))}
					</div>
					<div>
						<LinkTo
							to={`https://google.com/`}
							className="text-sm font-thin hover:decoration-0 inline-flex items-start gap-x-2 text-slate-200 capitalize">
							<MapPin size={18} className="my-1" />
							<div>
								<div className="text-slate-200 text-md">
									{props.address.streetAddress}
								</div>
								<div className="text-slate-300 text-sm">
									{props.address.city}, {props.address.country},{" "}
									{props.address.state}
									<br />
									{props.address.zipCode}
								</div>
							</div>
						</LinkTo>
					</div>

					<div className="my-4">
						<ul className="list-none space-y-2">
							<div>
								{props.positions.academic.map((position, i) => {
									return (
										<li key={i} className="inline-flex gap-x-2">
											<ArrowRight size={24} className="text-purple-200 my-1" />
											<div>
												<div className="capitalize text-2xl text-slate-50 leading-8">
													{position.position}
												</div>
												{position.department && (
													<div className="text-md leading-5 text-slate-200">
														Department of {position.department}
													</div>
												)}
												<div className="text-md leading-5">
													<div className="font-semibold text-slate-100">
														{position.institution.organisation}
													</div>
													<span className="text-sm text-slate-300 font-thin">
														{position.institution.city},{" "}
														{position.institution.state},{" "}
														{position.institution.country}
													</span>
												</div>
											</div>
										</li>
									);
								})}
							</div>
							<div>
								{props.positions.nonAcademic.map((position, i) => {
									return (
										<li key={i} className="inline-flex gap-x-2">
											<ArrowRight size={24} className="text-purple-200 my-1" />
											<div>
												<div className="capitalize text-2xl text-slate-50 leading-8">
													{position.position}
												</div>
												{position.department && (
													<div className="text-md leading-5 text-slate-200">
														Department of {position.department}
													</div>
												)}
												<div className="text-md leading-5">
													<div className="font-semibold text-slate-100">
														{position.employer.organisation}
													</div>
													<span className="text-sm text-slate-300 font-thin">
														{position.employer.city}, {position.employer.state},{" "}
														{position.employer.country}
													</span>
												</div>
											</div>
										</li>
									);
								})}
							</div>
						</ul>
					</div>

					{props.orchidId && (
						<div className="inline-flex w-full gap-x-2 my-2 items-center">
							<FaOrcid size={24} />
							<div className="text-lg">{props.orchidId}</div>
						</div>
					)}

					<div className="py-4 my-1 border-t border-b border-dashed">
						<div className="text-2xl text-slate-100">Research Topics</div>
						<div className="text-md font-semibold">
							{props.topicOfResearchInterests.map((d, i) => (
								<span
									className="capitalize pr-1 font-thin text-slate-300"
									key={i}>
									{d}
									{i !== props.topicOfResearchInterests.length - 1 && ","}
								</span>
							))}
						</div>
					</div>

					<div className="py-4	">
						<div className="text-2xl mb-2 font-thin">Social Links</div>
						<div className="flex flex-wrap gap-x-2">
							{props.socialLinks
								.sort((a, b) =>
									a.platform
										.toLowerCase()
										.localeCompare(b.platform.toLowerCase()),
								)
								.map((d, i) => {
									const Icon = iconMap.find((s) => s[0] === d.platform);
									let IconElm: IconType = Icon ? Icon[1] : Link;
									return (
										<div
											key={i}
											className="inline-flex items-center gap-x-2 rounded-full px-2 py-1 bg-slate-800 group hover:outline-1 transition">
											<LinkTo
												to={d.url}
												className="inline-flex gap-x-1 items-center">
												<IconElm size={18} />
												<div className="text-md group-hover:underline">
													{capitalizeWords(formatCamelCaseString(d.platform))}
												</div>
											</LinkTo>
											<LinkTo
												to={d.url}
												target="_blank"
												referrerPolicy="no-referrer"
												rel="noopener noreferrer">
												<ArrowUpRight className="size-[24] hover:size-[26] transition duration-700" />
											</LinkTo>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const MobileProfileCard: React.FC<FacultyBasicProfile> = (props) => {
	const iconMaps = Object.entries(socialIconMap);

	return (
		<>
			<div className="rounded-full size-[10rem] mx-auto my-1 border border-slate-500">
				{props.avatarUrl ? (
					<img
						src={props.avatarUrl}
						alt={`Profile photo of ${props.firstName} ${props.lastName}`}
						className="rounded-full size-[10rem]"
					/>
				) : (
					// TODO: instead of initial, used a generic profile image
					<div className="rounded-full size-[10rem] border text-4xl relative border-amber-500">
						<div className="translate-[-50%] top-[50%] left-[50%] border border-green-500 w-fit relative">
							MK
						</div>
					</div>
				)}
			</div>
			<div>
				<div className="text-2xl text-slate-50 font-bold">
					{capitalizeString(props.initial)} {props.firstName} {props.lastName}
				</div>
				<div>
					{props.positions.academic.map((d, i) => (
						<div key={i}>
							<span className="text-xl font-semibold text-slate-100">
								{capitalizeWords(d.position)}
							</span>
							<br />
							{d.department && (
								<>
									<span className="text-[1.1rem] font-semibold text-slate-200">
										Department of {d.department}
									</span>
									<br />
								</>
							)}
							<span className="text-md font-semibold text-slate-200">
								{d.institution.organisation}
							</span>
							<br />
							<span className="text-md text-slate-300">
								{d.institution.city}, {d.institution.state},{" "}
								{d.institution.country}
							</span>
						</div>
					))}
				</div>
			</div>
			{props.orchidId && (
				<div className="inline-flex w-full justify-center gap-x-2 my-2 border-t border-b py-2 border-dashed">
					<FaOrcid size={24} /> <div className="text-md">{props.orchidId}</div>
				</div>
			)}
		</>
	);
};
