import { ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router";
import BreadCrumb from "~/components/BreadCrumb";

// TODO: Add Dashboard title
export default () => {
	const loc = useLocation();
	return (
		<div className="border rounded-md min-h-[100vh] font-roboto">
			<div className="w-full bg-white p-4 rounded-md shadow-md text-sm font-thin font-roboto">
				<BreadCrumb crumbs={loc.pathname.split("/").slice(1)} />
				<div className="inline-flex items-center gap-x-0.5 py-1	text-gray-500">
					{loc.pathname
						.split("/")
						.slice(1)
						.map((path, i) => (
							<div
								key={i}
								className="inline-flex items-center gap-x-0.5">
								{i !== 0 ? (
									<ChevronRight
										size={18}
										className="stroke-gray-500"
									/>
								) : null}

								<Link
									to={loc.pathname
										.split("/")
										.slice(0, i + 2)
										.join("/")}>
									{path}
								</Link>
							</div>
						))}
				</div>
				<div className="text-5xl font-bold text-gray-700 ">
					Dashboard
				</div>
			</div>
		</div>
	);
};
