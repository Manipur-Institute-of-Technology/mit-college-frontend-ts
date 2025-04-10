import { ChevronDown, Link } from "lucide-react";
import React, { memo, useState } from "react";
import { Link as LinkTo } from "react-router";

const Section: React.FC<{
  header: string;
  children: React.JSX.Element;
  accordion?: boolean;
  internalLink?: boolean;
  bodyClassName?: string;
}> = ({
  header,
  children,
  accordion = true,
  internalLink = true,
  bodyClassName = "",
}) => {
  const [bodyViz, setBodyViz] = useState<boolean>(true);
  return (
    <section
      id={header.toLowerCase()}
      className="rounded-b-md shadow-md bg-slate-50 mt-4 mx-1 sm:mx-2 xl:mx-0 relative group/section border-t-6 border-t-slate-500"
    >
      <div
        className={`font-semibold text-slate-800 text-xl w-full relative mb-1 border-b border-b-slate-500 border-dashed p-4 bg-slate-200 inline-flex flex-nowrap items-center ${accordion ? "justify-between" : ""} `}
      >
        <div className="w-fit">
          {internalLink ? (
            <LinkTo to={`#${header.toLowerCase()}`}>
              <h1 className="w-fit relative inline-flex items-center justify-start gap-x-2">
                <Link
                  size={18}
                  className="inline-block lg:hidden lg:group-hover/section:inline"
                />
                <div className="uppercase relative w-fit text-wrap font-semibold">
                  {header}
                  <div className="absolute bottom-0 w-[50%] group-hover/section:w-[100%] origin-left transition-[width] h-1 bg-slate-600 rounded-md" />
                </div>
              </h1>
            </LinkTo>
          ) : (
            <div>
              <h1 className="w-fit relative inline-flex items-center justify-start gap-x-2">
                <div className="uppercase relative w-fit text-wrap font-semibold">
                  {header}
                  <div className="absolute bottom-0 w-[50%] group-hover/section:w-[100%] origin-left transition-[width] h-1 bg-slate-600 rounded-md" />
                </div>
              </h1>
            </div>
          )}
        </div>
        {accordion && (
          <button
            className="w-fit border-2 border-slate-500 rounded-full p-1  hover:cursor-pointer"
            onClick={() => setBodyViz((s) => !s)}
          >
            <ChevronDown
              size={24}
              className={`${bodyViz ? "rotate-0" : "rotate-180"} transition-transform`}
            />
          </button>
        )}
      </div>

      <div
        className={`text-slate-600 text-md relative ${bodyViz ? "md:p-4 px-2 h-fit" : "h-0 opacity-0"} transition-[height] ${bodyClassName}`}
      >
        {children}
      </div>
    </section>
  );
};

export default memo(Section);
