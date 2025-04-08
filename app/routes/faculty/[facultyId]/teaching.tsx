import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/teaching";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Suspense, useState } from "react";
import { Await, Link } from "react-router";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import Section from "~/components/Section";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Teachings`,
	});
}

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
	const { facultyId } = params;
	try {
		const data = getFacultyDetailProfile(facultyId);
		return { data };
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error || !data) return <div className="text-black">An error occured</div>;

	return (
		<Suspense fallback={<>Loading...</>}>
			<Await resolve={data}>
				{(val) => <Teaching teachings={val.teachings} />}
			</Await>
		</Suspense>
	);
};

const Teaching: React.FC<Pick<FacultyDetailProfile, "teachings">> = ({
	teachings,
}) => {
	return (
		<div className="relative w-full font-roboto">
			<Section header="teaching interests">
				<div className="flex flex-row flex-wrap gap-2">
					{teachings.teachingInterests}
				</div>
			</Section>

			<Section header="taught courses">
				<div className="flex flex-row flex-wrap gap-2 justify-center">
					{teachings.taughtCourses.map((course, idx) => (
						<div
							key={idx}
							className="flex-1 max-w-[18rem] min-w-[250px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
							<h3 className="text-lg font-semibold text-slate-800 mb-2">
								{course.courseLink ? (
									<Link
										to={course.courseLink}
										target="_blank"
										rel="noopener noreferrer"
										className="underline">
										{course.courseName}
									</Link>
								) : (
									<>{course.courseName}</>
								)}
							</h3>
							<p className="text-sm text-slate-600">{course.courseCode}</p>
							<div className="mt-2">
								{course.description.length > 200 ? (
									<p className="text-sm text-slate-600 text-justify">
										<ContentClampLen>
											{({ showAll, toggleShow }) => (
												<>
													{!showAll
														? course.description.slice(0, 200) + "..."
														: course.description}
													<button
														className="text-sm block hover:cursor-pointer"
														onClick={() => toggleShow()}>
														{!showAll ? "More ..." : "Less"}
													</button>
												</>
											)}
										</ContentClampLen>
									</p>
								) : (
									<p className="text-sm text-slate-600 text-justify">
										{course.description}
									</p>
								)}
							</div>
							{course.courseLink && (
								<div className="font-roboto text-[12px] font-semibold bg-slate-500 underline w-fit text-slate-100 p-1 my-1 rounded">
									<Link to={course.courseLink}>Course Link</Link>
								</div>
							)}
						</div>
					))}
				</div>
			</Section>
		</div>
	);
};

const ContentClampLen: React.FC<{
	children: ({
		showAll,
		toggleShow,
	}: {
		showAll: boolean;
		toggleShow: () => void;
	}) => React.JSX.Element;
}> = ({ children }) => {
	const [showAll, setShowAll] = useState<boolean>(false);

	const toggleShow = () => {
		setShowAll((s) => !s);
	};

	return <>{children({ showAll, toggleShow })}</>;
};
