import { BookOpen, Download } from "lucide-react";
import moment from "moment";
import { Link } from "react-router";
import Skeleton from "~/components/Skeleton";
import type { PublicationDetail } from "~/types/api/faculty.type";

export const MainPanel: React.FC<{
	publicationDetailData: PublicationDetail | undefined;
}> = ({ publicationDetailData }) => {
	return (
		<div className="w-full font-roboto p-4 md:pr-6 bg-slate-50 rounded-md shadow-md">
			<div className="w-full md:grid grid-cols-12">
				<div className="col-span-2"></div>
				<div className="col-span-10">
					<div className="w-full text-2xl md:text-left font-thin py-2 text-blue-900 mb-1">
						{publicationDetailData ? (
							publicationDetailData.paperLink ? (
								<Link
									to={publicationDetailData.paperLink}
									className="hover:underline">
									{publicationDetailData.paperTitle}
								</Link>
							) : (
								<div>{publicationDetailData.paperTitle}</div>
							)
						) : (
							<Skeleton className="!h-[4rem] mb-4" />
						)}
					</div>
				</div>
			</div>

			<div className="md:grid grid-cols-12 mb-4">
				<div className="col-span-2"></div>
				<div className="col-span-10 flex gap-2">
					{publicationDetailData?.paperLink && (
						<Link
							to={publicationDetailData?.paperLink}
							className="p-2 text-sm rounded-md border border-blue-400 bg-slate-100 text-blue-500 inline-flex items-center gap-2">
							<BookOpen size={18} />
							<span>Read Online</span>
						</Link>
					)}
					{publicationDetailData?.downloadLink && (
						<Link
							to={publicationDetailData?.downloadLink}
							download={true}
							className="p-2 text-sm rounded-md border border-blue-300 inline-flex items-center gap-2 text-blue-50 bg-blue-500 hover:bg-blue-50 hover:text-blue-500 transition-all">
							<Download size={18} />
							<span>Download</span>
						</Link>
					)}
				</div>
			</div>

			<div className="md:grid grid-cols-12 gap-4 w-full items-start">
				<div className="col-span-2 md:text-right text-[13px] text-slate-600">
					Authors:
				</div>
				<div className="col-span-10  mb-2">
					{publicationDetailData ? (
						<div className="text-sm text-slate-800">
							{publicationDetailData.authors.map((author, i) =>
								author.profileLink ? (
									<Link
										to={author.profileLink}
										key={i}
										className="hover:underline">
										{author.name}
										{i <
											publicationDetailData.authors
												.length -
												1 && ", "}
									</Link>
								) : (
									<span key={i}>
										{author.name}
										{i <
											publicationDetailData.authors
												.length -
												1 && ", "}
									</span>
								),
							)}
						</div>
					) : (
						<Skeleton className="!h-[1.4rem] border-0" />
					)}
				</div>
				<div className="col-span-2 md:text-right text-[13px] text-slate-600">
					Date of Publication:
				</div>
				<div className="col-span-10 mb-2">
					{publicationDetailData ? (
						<div className="text-sm text-slate-800 capitalize">
							{moment(
								new Date(publicationDetailData.publicationDate),
							).format("YYYY-MM-DD")}
						</div>
					) : (
						<Skeleton className="!h-[1.4rem] border-0" />
					)}
				</div>
				<div className="col-span-2 md:text-right text-[13px] text-slate-600">
					DOI:
				</div>
				<div className="col-span-10 mb-2">
					{publicationDetailData ? (
						<div className="text-sm text-slate-800 capitalize">
							{publicationDetailData.doi}
						</div>
					) : (
						<Skeleton className="!h-[1.4rem] border-0" />
					)}
				</div>
				<div className="col-span-2 md:text-right text-[13px] text-slate-600">
					Type of Publication:
				</div>
				<div className="col-span-10 mb-2">
					{publicationDetailData ? (
						<div className="text-sm text-slate-800 capitalize">
							{publicationDetailData.type}
						</div>
					) : (
						<Skeleton className="!h-[1.4rem] border-0" />
					)}
				</div>
				<div className="col-span-2 md:text-right text-[13px] text-slate-600">
					Abstract:
				</div>
				<div className="col-span-10 relative">
					{publicationDetailData ? (
						<div className="text-sm text-slate-800 text-justify mb-2">
							{publicationDetailData.abstract}
						</div>
					) : (
						<Skeleton className="!h-[8rem] border-0" />
					)}
				</div>
			</div>
		</div>
	);
};
