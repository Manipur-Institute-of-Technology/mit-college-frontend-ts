import type { Route } from "./+types/[pubId]";
import generateService from "~/service/Service";
import type { PublicationDetail as PublicationDetailType } from "~/types/api/faculty.type";
import PublicationDetailComponent from "~/pages/publication/[pubId]/[pubId]";
import { data, useLocation } from "react-router";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import { createFetchError } from "~/types/api/FetchError";
import BreadCrumb from "~/components/BreadCrumb";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
	const { pubId } = params;

	if (pubId && pubId.length > 0) {
		return {
			publicationDetailData:
				generateService().getPublicationDetail(pubId),
		};
	} else {
		throw data(new Error("The publication ID in your url is invalid"));
	}
}

export default function PublicationDetailPage({
	loaderData,
}: Route.ComponentProps) {
	const loc = useLocation();
	return (
		<div>
			<div className="bg-slate-50 p-4 mb-2 rounded-md shadow-md text-sm font-thin font-roboto">
				<BreadCrumb crumbs={loc.pathname.split("/").slice(1)} /> <br />
				<div className="text-5xl font-bold text-gray-700 ">
					Publication
				</div>
			</div>
			<PublicationDetailComponent loaderData={loaderData} />
		</div>
	);
}

export const ErrorBoundary = (error: Route.ErrorBoundaryProps) => {
	return <ErrorBoundaryComponent error={error} />;
};
