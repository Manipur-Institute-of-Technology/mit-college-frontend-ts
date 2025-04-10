import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/teaching";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Suspense } from "react";
import { Await } from "react-router";
import Teaching from "~/pages/faculty/[facultyId]/teaching/teaching";

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

	if (error || !data)
		return <div className="text-black">An error occured</div>;

	return (
		<Suspense fallback={<>Loading...</>}>
			<Await resolve={data}>
				{(val) => <Teaching teachings={val.teachings} />}
			</Await>
		</Suspense>
	);
};
