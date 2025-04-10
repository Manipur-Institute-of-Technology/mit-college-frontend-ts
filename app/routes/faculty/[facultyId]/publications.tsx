import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/research";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Await } from "react-router";
import { Suspense } from "react";
import Publications from "~/pages/faculty/[facultyId]/publications/publications";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Research`,
	});
}

export const clientLoader = ({
	params,
	request,
	context,
}: Route.ClientLoaderArgs) => {
	const url = new URL(request.url);
	const searchParams = Object.fromEntries(url.searchParams);
	const { pageSize, pageNum, sortBy } = searchParams;
	console.log(pageSize, pageNum, sortBy);

	const { facultyId } = params;
	try {
		const data = getFacultyDetailProfile(facultyId);
		// TODO: Mock a service that return list of publications along with pagination info - like last page, paginationSize
		// TODO: mock a service that return publication Statistics - num of paper published in each year
		// const data = getFacultyPublications(facultyId);
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
			<Await resolve={data}>{(val) => <Publications {...val} />}</Await>
		</Suspense>
	);
};
