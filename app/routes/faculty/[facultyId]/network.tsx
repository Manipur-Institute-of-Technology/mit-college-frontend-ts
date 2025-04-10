// // import type { Route } from "./+types/network";

// import { genPageMetaData } from "~/utils/meta";

// export function meta({ params }: Route.MetaArgs) {
// 	return genPageMetaData({
// 		title: `${params.facultyId} | Collaboration Network`,
// 	});
// }

// export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
// 	const { facultyId } = params;
// 	// try {
// 	// 	const data = getFacultyDetailProfile(facultyId);
// 	// 	return { data };
// 	// } catch (err) {
// 	// 	console.error(err);
// 	// 	return { error: err };
// 	// }
// };

// export default ({ loaderData }: Route.ComponentProps) => {
// 	const { data, error } = loaderData;

// 	if (error || !data) return <div className="text-black">An error occured</div>;

// 	return (
// 		// <Suspense fallback={<Skeleton className="w-full h-[100vh]" />}>
// 		// 	<Await resolve={data}>{(val) => <About {...val} />}</Await>
// 		// </Suspense>
// 		<Network />
// 	);
// };
