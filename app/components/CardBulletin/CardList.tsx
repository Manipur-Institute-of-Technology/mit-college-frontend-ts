import moment from "moment";
import type { ListItem } from "./CardBulletin";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router";
import React from "react";

const CardList: React.FC<{ list: ListItem }> = ({ list }) => {
	return (
		<div
			className={`border-b border-gray-300 p-2 w-full ${list.urgency === "high" ? "bg-red-50" : list.urgency === "medium" ? "bg-yellow-50" : "bg-white"}`}>
			<div
				className={`hover:underline text-sm font-semibold ${list.urgency === "high" ? "text-red-950" : list.urgency === "medium" ? "text-yellow-950" : "text-green-950"}`}>
				<Link to={list.href}>{list.linkText}</Link>
			</div>

			<div className="inline-flex flex-nowrap items-center justify-between w-full">
				<div className="flex flex-col">
					<div className="inline-flex gap-x-1.5 items-center justify-start text-sm font-thin w-fit">
						<Calendar size={12} stroke="grey" />
						<div className="text-[12px] font-thin">
							{new Date(list.publishedDate).toLocaleDateString()}
						</div>
					</div>
					<div className="inline-flex gap-x-1.5 items-center justify-start text-sm font-thin w-fit">
						<Clock size={12} stroke="grey" />
						<div className="text-[12px] font-thin">
							{new Date(list.publishedDate).toLocaleTimeString()}
						</div>
					</div>
				</div>
				<div className="flex flex-col items-end">
					<div className="text-[12px] font-thin text-gray-700">
						({moment(list.publishedDate).fromNow()})
					</div>
					<div className="text-[10px] text-rose-950 bg-rose-100 font-thin font-roboto border border-rose-300 p-0.5 w-fit rounded-md animate-pulse">
						New
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CardList);
