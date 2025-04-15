import { User, Users } from "lucide-react";
import moment from "moment";
import { Link } from "react-router";
import Section from "~/components/Section";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";

export const ResearchSections: React.FC<FacultyDetailProfile> = (props) => {
	return (
		<div className="relative w-full font-roboto">
			<Section header="research areas">
				<div className="flex flex-row flex-wrap gap-2 py-2">
					{props.researchDetail.topicOfResearchInterests.map(
						(d, i) => (
							<div
								key={i}
								className="capitalize border rounded-full p-1 px-2 md:text-md text-sm bg-slate-200 font-roboto text-slate-700 font-thin">
								{d}
							</div>
						),
					)}
				</div>
			</Section>

			<Section header="research interests">
				<div
					dangerouslySetInnerHTML={{
						__html: props.researchDetail.researchInterests,
					}}
				/>
			</Section>

			<Section header="publications">
				<div className="flex flex-col gap-y-2 font-roboto bg-slate-100">
					{props.researchDetail.publications.map((d, i) => (
						<div
							key={i}
							className="p-4 rounded-md bg-slate-50 border border-slate-300 shadow-md hover:bg-slate-100 hover:shadow-lg transition-all duration-500">
							<div className="uppercase text-[12px] font-semibold text-slate-500 mb-1">
								{d.type}
							</div>
							{d.link ? (
								<Link
									to={d.link}
									className={`text-[1.1rem] text-slate-800 hover:underline`}>
									{d.paperTitle}
								</Link>
							) : (
								<div className={`text-[1.1rem] text-slate-800`}>
									{d.paperTitle}
								</div>
							)}
							<div className="text-sm text-slate-400">
								{moment(d.publicationDate).format(
									"D MMMM YYYY",
								)}
							</div>
							{d.doi && (
								<Link
									to={d.doi}
									className="text-sm text-slate-600 hover:underline">
									DOI: {d.doi}
								</Link>
							)}
							<div className="mt-2">
								<div className="inline-flex items-center text-sm gap-x-3">
									{d.authors.length > 1 ? (
										<Users size={14} />
									) : (
										<User size={14} />
									)}
									<div className="inline-flex items-center gap-x-2">
										{d.authors.map((a, i) => (
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
					))}
					<div className="text-sm text-center">
						<Link
							to={"./../publications"}
							className="hover:underline font-semibold">
							View More
						</Link>
					</div>
				</div>
			</Section>

			<Section header="honours / awards / distinction">
				<div className="relative font-roboto">
					{props.researchDetail.awards.map((d, i) => (
						<div
							key={i}
							className="rounded-md my-1 p-4 shadow-md border border-slate-300 hover:bg-slate-100 hover:shadow-lg transition-all">
							<div className="text-md text-slate-700 font-semibold">
								{d.title}
							</div>
							<div className="text-sm text-slate-400">
								{moment(d.date).format("D MMMM YYYY")}
							</div>
							<div className="capitalize text-md">{d.by}</div>
						</div>
					))}
				</div>
			</Section>

			<Section header="conferences">
				<div className="relative font-roboto">
					{props.researchDetail.conferences.map((d, i) => (
						<div
							key={i}
							className="border border-slate-300 rounded-md shadow-md p-4 my-1 hover:bg-slate-100 hover:shadow-lg transition-all">
							<div className="font-md text-slate-700 font-semibold">
								{d.title}
							</div>
							<div className="text-sm text-slate-400">
								{moment(d.date).format("D MMMM YYYY")}
							</div>
						</div>
					))}
				</div>
			</Section>
		</div>
	);
};
