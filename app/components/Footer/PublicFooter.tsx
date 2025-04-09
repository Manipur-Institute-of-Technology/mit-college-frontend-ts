import { FaLink } from "react-icons/fa";
import WeatherCard from "../WeatherCard";
import { useXFetcher } from "~/hooks/useXFetcher";
import React, { Suspense, useEffect, useState } from "react";
import type { FooterData, Weather } from "~/types/api/resData.type";
import { getFooterData, getWeatherData } from "~/mock/services/fetchMockData";
import "../shared/anim.css";
import PublicFooterSkel from "./PublicFooterSkel";
import { Await, Link } from "react-router";
import { socialIconMap } from "~/constants/socialIconMap";
import type { IconType } from "react-icons";
import { capitalizeWords } from "~/utils/format";
import { Globe, Mail, Phone } from "lucide-react";

// export const PublicFooter: React.FC<> = () => {
// 	const [AData, setAData] = useState<Promise<FooterData>>();
// 	useEffect(() => {
// 		setAData(getFooterData());
// 	}, []);

// 	if (AData)
// 		return (
// 			<Suspense fallback={<PublicFooterSkel />}>
// 				<Await resolve={AData}>
// 					{(val) => {
// 						return <MainFooter footerData={val} />;
// 					}}
// 				</Await>
// 			</Suspense>
// 		);
// 	else return <></>;
// };

const _MainFooter: React.FC<{ footerData: FooterData }> = ({ footerData }) => {
  const {
    data: weatherData,
    error: weatherErr,
    state: weatherState,
    xFetch: xFetchWeather,
  } = useXFetcher<Weather & { cacheDate: Date }>();

  useEffect(() => {
    xFetchWeather(getWeatherData);
  }, []);

  return (
    <>
      <div className="w-full bg-slate-900 text-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:flex-nowrap justify-center md:justify-between  gap-y-2 gap-x-2">
          <div className="relative max-w-[100vw] md:min-w-[18rem] md:w-fit py-2 pr-1 md:border-r md:border-r-slate-500 h-fit">
            <FooterContact footerData={footerData} />
          </div>
          <div className="ml-2 flex flex-col md:flex-row md:items-stretch items-center text-center md:text-left md:flex-wrap justify-between md:justify-between w-full gap-x-2">
            {footerData.links.map((section, i) => (
              <FooterListSection
                key={i}
                listHeader={section.listHeader}
                items={section.lists}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-2 bg-slate-900 text-slate-50 relative flex flex-col md:items-end items-center p-2">
          {weatherData && <WeatherCard weatherData={weatherData} />}
        </div>
      </div>
      <BottomBar
        socialLinks={footerData.socialMedia}
        logoUrl={footerData.logo}
      />

      <div className="w-full h-2 bg-yellow-200 bg-gradient-to-r from-rose-500 via-yellow-500 to-orange-500 animate-gradient-bg"></div>
    </>
  );
};
export default React.memo(_MainFooter);

const FooterContact: React.FC<{ footerData: FooterData }> = ({
  footerData,
}) => {
  return (
    <>
      <div className="w-full">
        <img
          loading="lazy"
          src={footerData.logo}
          alt="mu logo"
          className="block m-auto"
          style={{
            width: 100,
            height: "auto",
          }}
        />
      </div>
      <div className="py-1 text-center">
        <div className="text-slate-50 font-bold text-lg">
          Manipur Institute of Technology
        </div>
        <div>
          <p className="text-slate-100 text-sm">
            (A Constitute College of Manipur University)
          </p>
          <p className="text-slate-300 text-sm my-1">
            {capitalizeWords(footerData.contactInfo.location.address)},{" "}
            {capitalizeWords(footerData.contactInfo.location.district)},{" "}
            {capitalizeWords(footerData.contactInfo.location.state)} <br />
            {capitalizeWords(footerData.contactInfo.location.country)},{" "}
            {footerData.contactInfo.location.pinCode}
          </p>
        </div>
        <div className="text-sm my-4 text-slate-200">
          <Link
            to={`tel:${footerData.contactInfo.phone}`}
            className="hover:text-slate-50"
          >
            <div className="inline-flex items-center gap-x-1">
              <Phone size={18} /> <span>{footerData.contactInfo.phone}</span>
            </div>
          </Link>
          <br />
          <Link
            to={`mailto:${footerData.contactInfo.email}`}
            className="hover:text-slate-50"
          >
            <div className="inline-flex items-center gap-x-1">
              <Mail size={18} />
              <span>{footerData.contactInfo.email}</span>
            </div>
          </Link>
          <br />
          <Link
            to={footerData.contactInfo.webAddress}
            className="hover:text-slate-50"
          >
            <div className="inline-flex items-center gap-x-1">
              <Globe size={18} />
              <span>{footerData.contactInfo.webAddress}</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

const FooterListSection: React.FC<{
  listHeader: string;
  items: Array<{ linkText: string; href: string }>;
}> = React.memo(({ listHeader, items }) => {
  return (
    <div className="py-1 md:w-fit w-fit group h-fit">
      <div className="text-slate-100 font-semibold text-xl/loose relative w-fit mx-auto md:mx-0">
        {listHeader}
        <div className="h-[4px] w-[40px] max-w-full bg-yellow-500 rounded-md absolute bottom-1 left-[50%] translate-x-[-50%] md:left-0 md:translate-x-0 md:origin-left origin-center transition-all duration-300 group-hover:w-full" />
      </div>
      <ul className="md:list-disc list-none text-sm md:pl-4">
        {items.map((item, j) => (
          <li key={j}>
            <Link
              to={item.href}
              className="text-[14px] hover:underline underline-offset-2 hover:text-slate-200 text-slate-300"
            >
              {item.linkText}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

const MainFooter = React.memo(_MainFooter);

const _BottomBar: React.FC<{
  logoUrl: string;
  socialLinks: Array<{ platform: string; url: string }>;
}> = ({ logoUrl, socialLinks }) => {
  const iconMaps = Object.entries(socialIconMap);
  return (
    <div className=" bg-slate-950">
      <div className="text-sm text-slate-300 w-full  py-2 flex flex-wrap flex-col-reverse md:flex-row justify-between items-center  mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left inline-flex md:gap-x-1 gap-y-1.5 md:flex-row flex-col-reverse items-center">
          <div>
            <img src={logoUrl} alt="" className="size-[2rem]" />
          </div>
          <div>
            Copyright &#169; {new Date().getFullYear()} @ Manipur Institute of
            Technology <br />
            All Rights Reserved
          </div>
        </div>
        <div className="space-y-1 text-center md:text-right ">
          {socialLinks.length > 0 && (
            <>
              <div>Follow us on:</div>
              <div className="flex justify-evenly md:justify-start items-center space-x-2 py-1">
                {socialLinks.map((d, i) => {
                  const IconElm = iconMaps.find((p) => p[0] === d.platform);
                  let Icon: IconType;
                  if (IconElm) {
                    Icon = IconElm[1];
                  } else {
                    Icon = FaLink;
                  }
                  return (
                    <div
                      key={i}
                      className="rounded-full w-5 h-5 flex items-center justify-center hover:-translate-y-0.5 hover:stroke-orange-400 transition-transform"
                    >
                      <Link to={d.url}>
                        <Icon size={18} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const BottomBar = React.memo(_BottomBar);
