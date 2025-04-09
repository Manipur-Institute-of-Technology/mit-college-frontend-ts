import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/about";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import React, { Suspense, useState } from "react";
import { Await } from "react-router";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import moment from "moment";
import { ChevronDown, Link } from "lucide-react";
import { Link as LinkTo } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return genPageMetaData({ title: `${params.facultyId} | MIT - Faculty` });
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

  if (error || !data) return <div className="text-black">An error occured</div>;

  return (
    <Suspense fallback={<>Loading...</>}>
      <Await resolve={data}>{(val) => <About {...val} />}</Await>
    </Suspense>
  );
};

const About: React.FC<FacultyDetailProfile> = (props) => {
  return (
    <div className="relative w-full font-roboto">
      <Section header="BIO">
        <div
          className="text-slate-600 text-md"
          dangerouslySetInnerHTML={{ __html: props.bio }}
        />
      </Section>

      <Section header="ACADEMIC POSITIONS">
        <Timeline>
          {props.academicPositions
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
                  <span>{moment(d.startDate).format("DD MMMM YYYY")} </span>
                  <span>
                    {d.endDate ? (
                      <>- {moment(d.endDate).format("DD MMMM YYYY")}</>
                    ) : (
                      <> - Present</>
                    )}{" "}
                  </span>
                  <span className="inline-flex items-center gap-x-1.5">
                    <div className="w-[1px] h-4 bg-slate-400 rounded-md inline-block" />
                    (
                    {moment
                      .duration(
                        moment(d.endDate || new Date()).diff(d.startDate),
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

      <Section header="Non-ACADEMIC POSITIONS">
        <Timeline>
          {props.nonAcademicPositions
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
                  <span>{moment(d.startDate).format("DD MMMM YYYY")} </span>
                  <span>
                    {d.endDate ? (
                      <>- {moment(d.endDate).format("DD MMMM YYYY")}</>
                    ) : (
                      <> - Present</>
                    )}{" "}
                  </span>
                  <span className="inline-flex items-center gap-x-1.5">
                    <div className="w-[1px] h-4 bg-slate-400 rounded-md inline-block" />
                    (
                    {moment
                      .duration(
                        moment(d.endDate || new Date()).diff(d.startDate),
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
                    {d.employer.city}, {d.employer.state}, {d.employer.country}
                  </div>
                </div>
              </React.Fragment>
            ))}
        </Timeline>
      </Section>

      <Section header="Degrees">
        <Timeline>
          {props.academicDegrees
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
                        moment(d.endDate || new Date()).diff(d.startDate),
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
                  <span>{moment(d.startDate).format("DD MMMM YYYY")} </span>
                  <span>
                    {d.endDate ? (
                      <>- {moment(d.endDate).format("DD MMMM YYYY")}</>
                    ) : (
                      <> - Present</>
                    )}
                  </span>
                </div>
              </React.Fragment>
            ))}
        </Timeline>
      </Section>
    </div>
  );
};

const Timeline: React.FC<{ children: React.JSX.Element[] }> = ({
  children,
}) => {
  return (
    <>
      {children.map((d, i) => (
        <div
          className="group/timelineItem relative py-3 pl-8 border-b border-dashed border-b-slate-400 rounded-md hover:bg-slate-100 transition-all"
          key={i}
        >
          <div className="mb-2 flex flex-col items-start before:z-[9] after:z-[9] before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3.5 before:self-start before:bg-slate-300 before:px-px after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-3.5 after:rounded-full after:border-4 after:border-slate-50 after:bg-slate-600 after:ring-1 hover:after:ring-blue-700 group-hover/timelineItem:after:bg-blue-700 group-last/timelineItem:before:hidden">
            {d}
          </div>
        </div>
      ))}
    </>
  );
};

const Section: React.FC<{ header: string; children: React.JSX.Element }> = ({
  header,
  children,
}) => {
  const [bodyViz, setBodyViz] = useState<boolean>(true);
  return (
    <section
      id={header.toLowerCase()}
      className="rounded-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative group/section"
    >
      <div className="rounded-t-md font-semibold text-slate-800 text-xl w-full relative mb-1 border-b border-b-slate-500 border-dashed p-4 bg-slate-200 inline-flex flex-nowrap items-center justify-between">
        <div className="w-fit">
          <LinkTo to={`#${header.toLowerCase()}`}>
            <h1 className="w-fit relative inline-flex items-center justify-start gap-x-2">
              <Link
                size={18}
                className="inline-block lg:hidden lg:group-hover/section:inline"
              />
              <div className="uppercase relative w-fit text-wrap">
                {header}
                <div className="absolute bottom-0 w-[50%] group-hover/section:w-[100%] origin-left transition-[width] h-1 bg-slate-600 rounded-md" />
              </div>
            </h1>
          </LinkTo>
        </div>
        <button
          className="w-fit border-2 border-slate-500 rounded-full p-1  hover:cursor-pointer"
          onClick={() => setBodyViz((s) => !s)}
        >
          <ChevronDown
            size={24}
            className={`${bodyViz ? "rotate-0" : "rotate-180"} transition-transform`}
          />
        </button>
      </div>

      <div
        className={`text-slate-600 text-md relative ${bodyViz ? "p-4 h-fit" : "h-0 opacity-0"} transition-[height] `}
      >
        {children}
      </div>
    </section>
  );
};
