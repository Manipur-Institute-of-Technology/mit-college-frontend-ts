import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/students";
import { getFacultyStudents } from "~/mock/services/fetchMockData";
import { Suspense } from "react";
import { Await } from "react-router";
import Students from "~/pages/faculty/[facultyId]/students/students";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Students`,
	});
}

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
	const { facultyId } = params;
	try {
		const data = getFacultyStudents(facultyId);
		return { data };
	} catch (err) {
		console.error(err);
		return { error: err };
	}
};

export default ({ loaderData }: Route.ComponentProps) => {
	const { data, error } = loaderData;

	if (error || !data)
		return <div className="text-black">An error occured</div>;

	return (
		<Suspense fallback={<>Loading...</>}>
			<Await resolve={data}>{(val) => <Students students={val} />}</Await>
		</Suspense>
	);
};
