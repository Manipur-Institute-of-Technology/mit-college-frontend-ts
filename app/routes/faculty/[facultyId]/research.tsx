import { genPageMetaData } from "~/utils/meta";
import type { Route } from "./+types/research";
import { getFacultyDetailProfile } from "~/mock/services/fetchMockData";
import { Await, Link } from "react-router";
import React, { Suspense } from "react";
import type { FacultyDetailProfile } from "~/types/api/faculty.type";
import Section from "~/components/Section";
import moment from "moment";
import { User, Users } from "lucide-react";

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

  if (error || !data) return <div className="text-black">An error occured</div>;

  return (
    <Suspense fallback={<>Loading...</>}>
      <Await resolve={data}>{(val) => <Research {...val} />}</Await>
    </Suspense>
  );
};

const Research: React.FC<FacultyDetailProfile> = (props) => {
  return (
    <div className="relative w-full font-roboto">
      <div className="grid grid-cols-12 relative">
        <div className="col-span-12 lg:col-span-9">
          <Research1 {...props} />
        </div>
        <div className="hidden lg:col-span-3 lg:block overflow-y-auto h-fit max-h-[100vh] sticky top-[9%]">
          <div className="font-roboto py-4 px-1 w-auto">
            <div>
              <img src="/mock/image.png" className="w-full h-auto" />
            </div>
            <PublicationChart {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicationChart: React.FC<FacultyDetailProfile> = (props) => {
  const data = React.useMemo(() => {
    const publications = props.researchDetail.publications;
    const countByYear = publications.reduce(
      (acc, pub) => {
        const year = moment(pub.publicationDate).format("YYYY");
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(countByYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, count]) => ({ year, count }));
  }, [props.researchDetail.publications]);

  return (
    <div className="p-2 rounded-md bg-slate-200 shadow-md font-roboto">
      <div className="relative w-fit text-wrap font-semibold">
        Publication Statistics
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] h-[300px] p-4">
          <div className="relative h-full flex items-end gap-2">
            {data.map(({ year, count }, i) => (
              <div
                key={i}
                className="group flex-1 flex flex-col items-center border"
                style={{ height: "100%" }}
              >
                <div
                  className="w-2 bg-blue-500 hover:bg-blue-600 transition-all duration-200 rounded-t-md relative border"
                  style={{
                    height: `${(count / Math.max(...data.map((d) => d.count))) * 80}%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white px-2 py-1 rounded text-sm transition-opacity">
                    {count} papers
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Research1: React.FC<FacultyDetailProfile> = (props) => {
  return (
    <div className="relative w-full font-roboto">
      <Section header="research areas">
        <div className="flex flex-row flex-wrap gap-2">
          {props.researchDetail.topicOfResearchInterests.map((d, i) => (
            <div
              key={i}
              className="capitalize border rounded-full p-1 px-2 text-md bg-slate-200 font-roboto text-slate-700 font-thin"
            >
              {d}
            </div>
          ))}
        </div>
      </Section>

      <Section header="research interests">
        <div
          dangerouslySetInnerHTML={{
            __html: props.researchDetail.researchInterests,
          }}
        />
      </Section>

      <Section header="publications">
        <div className="flex flex-col gap-y-2 font-roboto bg-slate-100">
          {props.researchDetail.publications.map((d, i) => (
            <div
              key={i}
              className="p-4 rounded-md bg-slate-50 border border-slate-300 shadow-md hover:bg-slate-100 hover:shadow-lg transition-all duration-500"
            >
              <div className="uppercase text-[12px] font-semibold text-slate-500 mb-1">
                {d.type}
              </div>
              {d.link ? (
                <Link
                  to={d.link}
                  className={`text-[1.1rem] text-slate-800 hover:underline`}
                >
                  {d.paperTitle}
                </Link>
              ) : (
                <div className={`text-[1.1rem] text-slate-800`}>
                  {d.paperTitle}
                </div>
              )}
              <div className="text-sm text-slate-400">
                {moment(d.publicationDate).format("D MMMM YYYY")}
              </div>
              {d.doi && (
                <Link
                  to={d.doi}
                  className="text-sm text-slate-600 hover:underline"
                >
                  DOI: {d.doi}
                </Link>
              )}
              <div className="mt-2">
                <div className="inline-flex items-center text-sm gap-x-3">
                  {d.authors.length > 1 ? (
                    <Users size={14} />
                  ) : (
                    <User size={14} />
                  )}
                  <div className="inline-flex items-center gap-x-2">
                    {d.authors.map((a, i) => (
                      <Link
                        to={a.profileLink}
                        key={i}
                        className="capitalize py-0.5 px-1 rounded-md bg-slate-200 font-thin text-[12px]"
                      >
                        {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="text-sm text-center">
            <Link
              to={"./../publications"}
              className="hover:underline font-semibold"
            >
              View More
            </Link>
          </div>
        </div>
      </Section>

      <Section header="honours / awards / distinction">
        <div className="relative font-roboto">
          {props.researchDetail.awards.map((d, i) => (
            <div
              key={i}
              className="rounded-md my-1 p-4 shadow-md border border-slate-300 hover:bg-slate-100 hover:shadow-lg transition-all"
            >
              <div className="text-md text-slate-700 font-semibold">
                {d.title}
              </div>
              <div className="text-sm text-slate-400">
                {moment(d.date).format("D MMMM YYYY")}
              </div>
              <div className="capitalize text-md">{d.by}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section header="conferences">
        <div className="relative font-roboto">
          {props.researchDetail.conferences.map((d, i) => (
            <div
              key={i}
              className="border border-slate-300 rounded-md shadow-md p-4 my-1 hover:bg-slate-100 hover:shadow-lg transition-all"
            >
              <div className="font-md text-slate-700 font-semibold">
                {d.title}
              </div>
              <div className="text-sm text-slate-400">
                {moment(d.date).format("D MMMM YYYY")}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
