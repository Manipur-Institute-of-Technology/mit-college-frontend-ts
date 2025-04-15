import type { Route } from ".react-router/types/app/routes/publication/+types/[pubId]";
import type React from "react";
import { Suspense } from "react";
import { Await } from "react-router";
import ErrorElementAsync from "~/components/ErrorElementAsync";
import type { PublicationDetail } from "~/types/api/faculty.type";
import { MainPanel } from "./MainPanel";
import { AuthorLists, LinkLists } from "./SubComponents";

const PublicationDetailComponent: React.FC<
	Pick<Route.ComponentProps, "loaderData">
> = ({ loaderData }) => {
	return (
		<div className="lg:grid grid-cols-12 gap-4 space-y-2 px-2 xl:px-0">
			<div className="col-span-9 space-y-2">
				<Suspense
					fallback={<MainPanel publicationDetailData={undefined} />}>
					<Await
						resolve={loaderData.publicationDetailData}
						errorElement={<ErrorElementAsync />}>
						{(val) => <MainPanel publicationDetailData={val} />}
					</Await>
				</Suspense>
			</div>
			<div className="col-span-3">
				<Suspense fallback={<SidePanel authors={[]} />}>
					<Await
						resolve={loaderData.publicationDetailData}
						errorElement={<SidePanel authors={[]} />}>
						{(val) => <SidePanel authors={val.authors || []} />}
					</Await>
				</Suspense>
			</div>
		</div>
	);
};

export default PublicationDetailComponent;

const SidePanel: React.FC<Pick<PublicationDetail, "authors"> | undefined> = (
	props,
) => {
	return (
		<div className="w-full rounded-md space-y-2 md:overflow-y-auto md:max-h-[100vh]">
			{props?.authors && (
				<>
					<AuthorLists authors={props.authors} />
					<LinkLists authors={props.authors} />
				</>
			)}
		</div>
	);
};
