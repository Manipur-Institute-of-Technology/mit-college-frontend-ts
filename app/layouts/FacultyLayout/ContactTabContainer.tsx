import { socialIconMap } from "~/constants/socialIconMap";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";
import { ContactTabs } from "./ContactTabs";
import {
	Contact,
	ExternalLink,
	Globe,
	Link,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { Link as LinkTo } from "react-router";
import { FaOrcid } from "react-icons/fa";
import type { IconType } from "react-icons";
import { capitalizeWords, formatCamelCaseString } from "~/utils/format";

export const ContactTabContainer: React.FC<FacultyBasicProfile> = (props) => {
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
						{props.address.streetAddress &&
							props.address.streetAddress + ", "}
						{props.address.city}, {props.address.state},{" "}
						{props.address.country}, {props.address.zipCode}
					</div>
				</LinkTo>
			</div>
			<div className="w-full text-slate-700 font-roboto">
				<h1 className="text-center font-bold text-slate-800 text-2xl">
					Links
				</h1>
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
						<div
							className="w-full inline-flex items-center gap-x-2"
							key={i}>
							{<IconElm size={20} />}
							<LinkTo
								to={d.url}
								className="text-md hover:underline">
								{capitalizeWords(
									formatCamelCaseString(d.platform),
								)}
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
