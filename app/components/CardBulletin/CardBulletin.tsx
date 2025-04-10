import type React from "react";
import CardBulletinMarques from "./CardBulletinMarques";
import CardBulletinStatic from "./CardBulletinStatic";

export interface ListItem {
	href: string;
	linkText: string;
	publishedDate: string;
	urgency: "high" | "medium" | "low";
}

export interface CardBulletinProps {
	cardTitle: string;
	lists: ListItem[];
	moreViewLink?: string;
	refreshFetcher?: () => Promise<ListItem[]>;
	marques?: boolean;
	animeIntervalDelay?: number;
}

const CardBulletin: React.FC<CardBulletinProps> = (props) => {
	if (props.marques) return <CardBulletinMarques {...props} />;
	else return <CardBulletinStatic {...props} />;
};

export default CardBulletin;
