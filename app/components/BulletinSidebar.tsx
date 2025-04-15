import React, { Suspense } from "react";
import type { ListItem } from "./CardBulletin/CardBulletin";
import { EmptyList, Skel } from "./CardBulletin/AuxComponent";
import { Await } from "react-router";
import CardBulletin from "./CardBulletin/CardBulletin";
import generateService from "~/service/Service";
import ErrorBoundary from "./ErrorElementAsync";
import ErrorElement from "./ErrorElementAsync";

export type BulletinSideBarProp = {
	noticeListData: Promise<
		| ListItem[]
		| {
				error: any;
		  }
	>;
	informationListData: Promise<
		| ListItem[]
		| {
				error: any;
		  }
	>;
	newsListData: Promise<
		| ListItem[]
		| {
				error: any;
		  }
	>;
};

const BulletinSideBar: React.FC<BulletinSideBarProp> = ({
	noticeListData,
	informationListData,
	newsListData,
}) => {
	return (
		<>
			<Suspense fallback={<Skel />}>
				<Await resolve={noticeListData} errorElement={<ErrorElement />}>
					{(vals) => {
						if (Array.isArray(vals) && vals.length > 0)
							return (
								<CardBulletin
									cardTitle="Notice"
									lists={vals}
									moreViewLink="/xxx"
									refreshFetcher={
										generateService().getNoticeList
									}
								/>
							);
						else if (Array.isArray(vals) && vals.length === 0)
							return (
								<EmptyList
									detail={"There is no notice to display"}
									mssg="No Notice"
								/>
							);
						// else return <ErrorBoundary err={(vals as { error: any }).error} />;
					}}
				</Await>
			</Suspense>
			<Suspense fallback={<Skel />}>
				<Await
					resolve={informationListData}
					errorElement={<ErrorElement />}>
					{(vals) => {
						if (Array.isArray(vals) && vals.length > 0)
							return (
								<CardBulletin
									cardTitle="Information"
									lists={vals}
									moreViewLink="/xxx"
									refreshFetcher={
										generateService().getNoticeList
									}
								/>
							);
						else if (Array.isArray(vals) && vals.length === 0)
							return (
								<EmptyList
									detail={
										"There is no Information to display"
									}
									mssg="No Information"
								/>
							);
						// else return <ErrorElement />;
					}}
				</Await>
			</Suspense>

			<Suspense fallback={<Skel />}>
				<Await resolve={newsListData} errorElement={<ErrorElement />}>
					{(vals) => {
						if (Array.isArray(vals) && vals.length > 0)
							return (
								<CardBulletin
									cardTitle="News"
									lists={vals}
									marques={false}
								/>
							);
						else if (Array.isArray(vals) && vals.length === 0)
							return (
								<EmptyList
									detail={"There is no news to display"}
									mssg="No News"
								/>
							);
						// else return <ErrorBoundary err={(vals as { error: any }).error} />;
					}}
				</Await>
			</Suspense>
		</>
	);
};

export default React.memo(BulletinSideBar);
