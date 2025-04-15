import { ChevronRight } from "lucide-react";
import type React from "react";
import { Link } from "react-router";

const BreadCrumb: React.FC<{
	crumbs: { displayName: string; link: string }[] | string[];
}> = ({ crumbs }) => {
	return (
		<div className="inline-flex items-center gap-x-0.5 py-1	text-gray-500">
			{crumbs.map((path, i) => {
				return (
					<div key={i} className="inline-flex items-center gap-x-0.5">
						{i !== 0 ? (
							<ChevronRight
								size={18}
								className="stroke-gray-500"
							/>
						) : null}

						{typeof path === "string" ? (
							<Link to={"/" + crumbs.slice(0, i + 1).join("/")}>
								{path}
							</Link>
						) : (
							typeof path === "object" &&
							path.link &&
							path.displayName && (
								<Link to={path.link}>{path.displayName}</Link>
							)
						)}
					</div>
				);
			})}
		</div>
	);
};

export default BreadCrumb;
