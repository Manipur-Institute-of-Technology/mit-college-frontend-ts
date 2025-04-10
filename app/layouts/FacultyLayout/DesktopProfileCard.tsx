import { socialIconMap } from "~/constants/socialIconMap";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import { Link as LinkTo } from "react-router";
import {
	ArrowRight,
	ArrowUpRight,
	Mail,
	MapPin,
	Phone,
	Link,
} from "lucide-react";
import { FaOrcid } from "react-icons/fa";
import { capitalizeWords, formatCamelCaseString } from "~/utils/format";
import type { IconType } from "react-icons";
import type React from "react";

export const DeskProfileCard: React.FC<FacultyBasicProfile> = (props) => {
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
								<Phone size={18} />({d.countryCode}) {d.number}{" "}
								({d.type})
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
									{props.address.city},{" "}
									{props.address.country},{" "}
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
										<AcademicPositionListItem
											key={i}
											{...position}
										/>
									);
								})}
							</div>
							<div>
								{props.positions.nonAcademic.map(
									(position, i) => {
										return (
											<NonAcademicPositionListItem
												key={i}
												{...position}
											/>
										);
									},
								)}
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
						<div className="text-2xl text-slate-100">
							Research Topics
						</div>
						<div className="text-md font-semibold">
							{props.topicOfResearchInterests.map((d, i) => (
								<span
									className="capitalize pr-1 font-thin text-slate-300"
									key={i}>
									{d}
									{i !==
										props.topicOfResearchInterests.length -
											1 && ","}
								</span>
							))}
						</div>
					</div>

					<div className="py-4	">
						<div className="text-2xl mb-2 font-thin">
							Social Links
						</div>
						<div className="flex flex-wrap gap-x-2">
							{props.socialLinks
								.sort((a, b) =>
									a.platform
										.toLowerCase()
										.localeCompare(
											b.platform.toLowerCase(),
										),
								)
								.map((d, i) => {
									const Icon = iconMap.find(
										(s) => s[0] === d.platform,
									);
									let IconElm: IconType = Icon
										? Icon[1]
										: Link;
									return (
										<SocialLink
											key={i}
											IconElm={IconElm}
											platform={d.platform}
											url={d.url}
										/>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SocialLink: React.FC<{
	IconElm: IconType;
	url: string;
	platform: string;
}> = ({ url, platform, IconElm }) => {
	return (
		<div className="inline-flex items-center gap-x-2 rounded-full px-2 py-1 bg-slate-800 group hover:outline-1 transition">
			<LinkTo to={url} className="inline-flex gap-x-1 items-center">
				<IconElm size={18} />
				<div className="text-md group-hover:underline">
					{capitalizeWords(formatCamelCaseString(platform))}
				</div>
			</LinkTo>
			<LinkTo
				to={url}
				target="_blank"
				referrerPolicy="no-referrer"
				rel="noopener noreferrer">
				<ArrowUpRight className="size-[24] hover:size-[26] transition duration-700" />
			</LinkTo>
		</div>
	);
};

const AcademicPositionListItem: React.FC<
	FacultyBasicProfile["positions"]["academic"][number]
> = (position) => {
	return (
		<li className="inline-flex gap-x-2">
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
};

const NonAcademicPositionListItem: React.FC<
	FacultyBasicProfile["positions"]["nonAcademic"][number]
> = (position) => {
	return (
		<li className="inline-flex gap-x-2">
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
};
