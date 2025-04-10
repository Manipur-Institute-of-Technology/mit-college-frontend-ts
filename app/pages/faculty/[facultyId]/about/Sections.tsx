import moment from "moment";
import React from "react";
import Section from "~/components/Section";
import Timeline from "~/components/Timeline";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";

export const AcademicPositionsSection: React.FC<
	Pick<FacultyDetailProfile, "academicPositions">
> = ({ academicPositions }) => {
	return (
		<Section header="ACADEMIC POSITIONS">
			<Timeline>
				{academicPositions
					.sort(
						(a, b) =>
							new Date(b.startDate).getTime() -
							new Date(a.startDate).getTime(),
					)
					.map((d, i) => (
						<React.Fragment key={i}>
							<div className="p-2 text-[0.9rem] left-0 mb-1 inline-flex translate-y-0.5 items-center justify-center rounded-lg bg-slate-200 font-semibold uppercase text-slate-600">
								{d.position}
							</div>
							<div className="px-1 text-sm text-slate-600 inline-flex flex-wrap items-center gap-x-1.5">
								<span>
									{moment(d.startDate).format(
										"DD MMMM YYYY",
									)}{" "}
								</span>
								<span>
									{d.endDate ? (
										<>
											-{" "}
											{moment(d.endDate).format(
												"DD MMMM YYYY",
											)}
										</>
									) : (
										<> - Present</>
									)}{" "}
								</span>
								<span className="inline-flex items-center gap-x-1.5">
									<div className="w-[1px] h-4 bg-slate-400 rounded-md inline-block" />
									(
									{moment
										.duration(
											moment(
												d.endDate || new Date(),
											).diff(d.startDate),
										)
										.humanize()}
									)
								</span>
							</div>

							<div className="w-full px-1">
								<div className="text-md font-bold text-slate-900">
									{d.institution.organisation}
								</div>
								<div className="text-slate-700 text-md capitalize font-thin">
									{d.department}
								</div>
								<div className="text-slate-500 text-sm capitalize">
									{d.institution.city}, {d.institution.state},{" "}
									{d.institution.country}
								</div>
							</div>
						</React.Fragment>
					))}
			</Timeline>
		</Section>
	);
};

export const NonAcademicPositionsSection: React.FC<
	Pick<FacultyDetailProfile, "nonAcademicPositions">
> = ({ nonAcademicPositions }) => {
	return (
		<Section header="Non-ACADEMIC POSITIONS">
			<Timeline>
				{nonAcademicPositions
					.sort(
						(a, b) =>
							new Date(b.startDate).getTime() -
							new Date(a.startDate).getTime(),
					)
					.map((d, i) => (
						<React.Fragment key={i}>
							<div className="p-2 text-[0.9rem] left-0 mb-1 inline-flex translate-y-0.5 items-center justify-center rounded-lg bg-slate-200 font-semibold uppercase text-slate-600">
								{d.position}
							</div>
							<div className="px-1 text-sm text-slate-600 inline-flex flex-wrap items-center gap-x-1.5">
								<span>
									{moment(d.startDate).format(
										"DD MMMM YYYY",
									)}{" "}
								</span>
								<span>
									{d.endDate ? (
										<>
											-{" "}
											{moment(d.endDate).format(
												"DD MMMM YYYY",
											)}
										</>
									) : (
										<> - Present</>
									)}{" "}
								</span>
								<span className="inline-flex items-center gap-x-1.5">
									<div className="w-[1px] h-4 bg-slate-400 rounded-md inline-block" />
									(
									{moment
										.duration(
											moment(
												d.endDate || new Date(),
											).diff(d.startDate),
										)
										.humanize()}
									)
								</span>
							</div>

							<div className="w-full px-1">
								<div className="text-md font-bold text-slate-900">
									{d.employer.organisation}
								</div>
								<div className="text-slate-700 text-md capitalize font-thin">
									{d.department}
								</div>
								<div className="text-slate-500 text-sm capitalize">
									{d.employer.city}, {d.employer.state},{" "}
									{d.employer.country}
								</div>
							</div>
						</React.Fragment>
					))}
			</Timeline>
		</Section>
	);
};

export const AcademicDegreesSection: React.FC<
	Pick<FacultyDetailProfile, "academicDegrees">
> = ({ academicDegrees }) => {
	return (
		<Section header="Degrees">
			<Timeline>
				{academicDegrees
					.sort(
						(a, b) =>
							new Date(b.startDate).getTime() -
							new Date(a.startDate).getTime(),
					)
					.map((d, i) => (
						<React.Fragment key={i}>
							<div className="">
								<div className="p-2 pl-1 pb-0 text-xl left-0 mb-0 inline-flex translate-y-0.5 items-center justify-center rounded-lg font-semibold text-slate-600 capitalize">
									{d.name}
								</div>
								<div className="px-1 text-[12px] text-slate-600">
									{moment
										.duration(
											moment(
												d.endDate || new Date(),
											).diff(d.startDate),
										)
										.humanize()}
								</div>
								<div className="text-[0.9rem] font-thin text-slate-700 px-1">
									{d.subject}
								</div>
							</div>

							<div className="w-full px-1 mb-2">
								<div className="text-slate-900 text-md capitalize font-bold">
									{d.institution.organisation}
								</div>
								<div className="text-slate-500 text-sm capitalize">
									{d.institution.city}, {d.institution.state},{" "}
									{d.institution.country}
								</div>
							</div>
							<div className="px-1 text-[12px] text-slate-600 inline-flex flex-wrap items-center gap-x-1.5">
								<span>
									{moment(d.startDate).format(
										"DD MMMM YYYY",
									)}{" "}
								</span>
								<span>
									{d.endDate ? (
										<>
											-{" "}
											{moment(d.endDate).format(
												"DD MMMM YYYY",
											)}
										</>
									) : (
										<> - Present</>
									)}
								</span>
							</div>
						</React.Fragment>
					))}
			</Timeline>
		</Section>
	);
};
