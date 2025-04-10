import { User, Users } from "lucide-react";
import moment from "moment";
import type React from "react";
import { Link } from "react-router";
import type { Publication } from "~/types/api/faculty.type";

export const PublicationListItem: React.FC<Publication> = (props) => {
	return (
		<div className="p-4 rounded-md bg-slate-50 border border-slate-300 shadow-md hover:bg-slate-100 hover:shadow-lg transition-all">
			<div className="uppercase text-[12px] font-semibold text-slate-500 mb-1">
				{props.type}
			</div>
			{props.link ? (
				<Link
					to={props.link}
					className={`text-[1.1rem] text-slate-800 hover:underline`}>
					{props.paperTitle}
				</Link>
			) : (
				<div className={`text-[1.1rem] text-slate-800`}>
					{props.paperTitle}
				</div>
			)}
			<div className="text-sm text-slate-400">
				{moment(props.publicationDate).format("D MMMM YYYY")}
			</div>
			{props.doi && (
				<Link
					to={props.doi}
					className="text-sm text-slate-600 hover:underline">
					DOI: {props.doi}
				</Link>
			)}
			<div className="mt-2">
				<div className="inline-flex items-center text-sm gap-x-3">
					{props.authors.length > 1 ? (
						<Users size={14} />
					) : (
						<User size={14} />
					)}
					<div className="inline-flex items-center gap-x-2">
						{props.authors.map((a, i) => (
							<Link
								to={a.profileLink}
								key={i}
								className="capitalize py-0.5 px-1 rounded-md bg-slate-200 font-thin text-[12px]">
								{a.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const PublicationLists: React.FC<{ lists: Publication[] }> = ({ lists }) => {
	return (
		<div className="flex flex-col gap-y-2 font-roboto bg-slate-100">
			{lists.map((d, i) => (
				<PublicationListItem {...d} key={i} />
			))}
		</div>
	);
};

export default PublicationLists;
