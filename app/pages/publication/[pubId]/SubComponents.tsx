import {
	LinkIcon,
	Network,
	PackageSearch,
	UserCircle,
	Users,
} from "lucide-react";
import { Link } from "react-router";

export const AuthorLists: React.FC<{
	authors: { name: string; profileLink: string | null }[];
}> = ({ authors }) => {
	return (
		<div className="shadow-md border border-slate-300 bg-slate-100 rounded-md">
			<div className="font-roboto bg-slate-100 text-slate-700 text-md py-1 inline-flex items-center gap-2 px-2 w-full shadow-md rounded-md">
				<Users size={14} />
				<span>Authors</span>
			</div>
			<div className="rounded-md bg-white flex flex-col text-sm text-slate-700">
				{authors.map((author, i) => {
					return author.profileLink ? (
						<Link
							to={author.profileLink}
							key={i}
							className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 py-0.5 font-roboto px-2">
							{author.name}
						</Link>
					) : (
						<div
							key={i}
							className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 py-0.5 font-roboto px-2">
							{author.name}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const LinkLists: React.FC<{
	authors: { name: string; profileLink: string | null }[];
}> = ({ authors }) => {
	return (
		<div className="shadow-md border border-slate-300 rounded-md">
			<div className="font-roboto bg-slate-100 text-slate-700 text-md py-1 inline-flex items-center gap-2 px-2 w-full shadow-md rounded-md">
				<LinkIcon size={14} />
				<span>Links</span>
			</div>
			<div className="rounded-md bg-white flex flex-col text-sm text-slate-700">
				<Link
					to={"qw"}
					className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 font-roboto px-2 inline-flex items-center gap-2 py-1">
					<Network size={14} />
					<span>View collaboration network for this paper</span>
				</Link>
				<Link
					to={"qw"}
					className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 font-roboto px-2 inline-flex items-center gap-2 py-1">
					<PackageSearch size={14} />
					<span>View all publications</span>
				</Link>
				<Link
					to={"qw"}
					className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 font-roboto px-2 inline-flex items-center gap-2 py-1">
					<Users size={14} />
					<span>View all faculties</span>
				</Link>
				{authors.map((author, i) => {
					if (author.profileLink && author.profileLink.length > 0)
						return (
							<Link
								key={i}
								to={author.profileLink}
								className="hover:bg-slate-100 border-t border-b border-t-slate-200 border-b-slate-200 font-roboto px-2 inline-flex items-center gap-2 py-1">
								<UserCircle size={14} />
								<span>
									View profile of{" "}
									<span className="text-slate-500 font-semibold">
										{author.name}
									</span>
								</span>
							</Link>
						);
					return null;
				})}
			</div>
		</div>
	);
};
