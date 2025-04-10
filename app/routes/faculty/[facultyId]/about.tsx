import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/about";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Suspense } from "react";
import { Await } from "react-router";
import Skeleton from "~/components/Skeleton";
import About from "~/pages/faculty/[facultyId]/about/about";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({ title: `${params.facultyId} | MIT - Faculty` });
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
		<Suspense fallback={<Skeleton className="w-full h-[100vh]" />}>
			<Await resolve={data}>{(val) => <About {...val} />}</Await>
		</Suspense>
	);
};
