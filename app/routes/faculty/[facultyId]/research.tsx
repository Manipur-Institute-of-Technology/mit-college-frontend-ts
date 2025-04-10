import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/research";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Await, Link } from "react-router";
import React, { Suspense } from "react";
import Research from "~/pages/faculty/[facultyId]/research/research";

export function meta({ params }: Route.MetaArgs) {
	return genPageMetaData({
		title: `${params.facultyId} | MIT - Faculty | Research`,
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
			<Await resolve={data}>{(val) => <Research {...val} />}</Await>
		</Suspense>
	);
};
