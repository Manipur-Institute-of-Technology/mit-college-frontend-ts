// TODO: Refactor Weather Card component into various components
import moment from "moment";
import React from "react";
import { useEffect, useRef, useState } from "react";
import {
	daysShort,
	wmoCodeDescription,
	wmoMap,
} from "~/constants/meteoOpenWeatherMap";
import type { Weather } from "~/types/api/resData.type";
import {
	capitalizeString,
	formatDegreeToDMS,
	formatSnakeCaseString,
} from "~/utils/format";
import { parseWeatherData } from "~/utils/parser";

const WeatherCard = ({
	weatherData,
}: {
	weatherData: Weather & { cacheDate: Date };
}) => {
	const [detailView, setDetailView] = useState<boolean>(false);
	const [curTime, setCurTime] = useState<Date>(new Date());
	const intIdRef = useRef<number | null>(null);
	const [detailData, setDetailData] = useState<Map<string, string>>();

	useEffect(() => {
		const pData = parseWeatherData(weatherData);
		pData.set(
			"weather_description",
			wmoCodeDescription[+(detailData?.get("weather_code") || "0")],
		);
		setDetailData(pData);

		intIdRef.current = window.setInterval(() => {
			setCurTime(new Date());
		}, 1000);
		return () => {
			if (intIdRef.current) clearInterval(intIdRef.current);
		};
	}, [weatherData]);

	return (
		<div className="w-fit">
			<div className="w-full">
				<div className={`flex flex-col md:flex-row md:flex-nowrap`}>
					<div
						className={`bg-gradient-to-br ${(detailData?.get("day_time") || "yes") === "yes" ? "from-blue-700 via-yellow-600 to-yellow-800" : "from-blue-700 via-gray-600 to-gray-800"}  p-2 max-w-[100vw] w-[16rem] font-roboto rounded-tl-md text-sm ${!detailView ? "rounded-tr-md" : ""}`}>
						<div className="grid grid-cols-4">
							<div className="col-span-2 flex flex-col items-start">
								<div className="text-lg inline-flex flex-nowrap items-center gap-x-0.5">
									<img
										// src="/weatherIcons/01d@2x.png"
										src={`/weatherIcons/${String(wmoMap[+(detailData?.get("weather_code") || "0")]).padStart(2, "0")}${(detailData?.get("day_time") || "yes") === "yes" ? "d" : "n"}@2x.png`}
										alt={`${wmoMap[+(detailData?.get("wmo_code") || "0")]}`}
										className="w-[34px] h-[34px]"
									/>
									<div className="text-[14px]/[16px]">
										{
											wmoCodeDescription[
												+(
													detailData?.get(
														"weather_code",
													) || "0"
												)
											]
										}
									</div>
								</div>

								<div className=" font-[400] text-4xl">
									{weatherData.current.temperature_2m || "NA"}
									{weatherData.current_units.temperature_2m ||
										""}
								</div>
								<div className="text-md font-thin">
									{(weatherData.current.wind_direction_10m &&
										weatherData.current.wind_speed_10m +
											" " +
											weatherData.current_units
												.wind_speed_10m) ||
										""}
								</div>
							</div>
							<div className="col-span-2 flex flex-col justify-between items-end">
								<div className="flex flex-col items-end">
									<div className="text-lg">
										{curTime
											.toLocaleTimeString("en-US", {
												hour12: false,
											})
											.split(":")
											.slice(0, 2)
											.join(":")}
									</div>

									<div className="text-md">
										{capitalizeString(
											daysShort[new Date().getDay()],
										)}
										, {moment(curTime).format("DD/MM/YY")}
									</div>
								</div>
								<div className="text-right">
									<div className="font-mono text-[12px]">
										{weatherData.latitude &&
											formatDegreeToDMS(
												weatherData.latitude,
												"latitude",
											)}{" "}
										{weatherData.longitude &&
											formatDegreeToDMS(
												weatherData.longitude,
												"longitude",
											)}
									</div>
									<div className="text-md font-semibold">
										Imphal
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className={`bg-gradient-to-br ${detailData?.get("day_time") === "yes" ? "from-blue-700 via-yellow-600 to-yellow-800" : "from-blue-700 via-gray-600 to-gray-800"} md:rounded-tr-md ${detailView ? "md:w-max md:border-l pr-[1px] md:border-l-yellow-500" : "md:w-[0] h-[0]"} w-[16rem] transition-all`}>
						{detailView && (
							<div
								className={`flex flex-col flex-wrap text-slate-950 w-full md:w-fit text-left h-fit md:h-[6.9rem] bg-slate-900/50 backdrop-blur-lg md:px-1 px-0 md:rounded-tr-sm ${detailView ? "md:max-w-[60vw] overflow-x-auto" : ""}`}
								style={scrollbarStyle}>
								{detailView &&
									detailData &&
									Array.from(detailData).map(
										([k, v], index) => {
											if (
												k.trim().toLowerCase() ===
												"time"
											) {
												return (
													<React.Fragment
														key={`time-${index}`}>
														<div className="hover:bg-white/10 py-0 px-2 md:px-0.5 font-sans font-thin text-sm text-slate-50 border-b border-b-slate-50 mx-0.5 inline-flex flex-nowrap items-center justify-between ">
															<div>{"Date"}:</div>
															<div className="font font-semibold">
																{moment(
																	new Date(v),
																).format(
																	"DD/MM/YYYY",
																)}
															</div>
														</div>
														<div
															key={"Time"}
															className="hover:bg-white/10 py-0 px-2 md:px-0.5 font-sans font-thin text-sm text-slate-50 border-b border-b-slate-50 mx-0.5 inline-flex flex-nowrap items-center justify-between ">
															<div>{"Time"}:</div>
															<div className="font font-semibold">
																{new Date(
																	v,
																).toLocaleTimeString()}
															</div>
														</div>
													</React.Fragment>
												);
											} else
												return (
													<div
														key={k}
														className="text-wrap py-0 px-2 md:px-0.5 font-sans font-thin text-sm text-slate-50 border-b border-b-slate-50 mx-0.5 inline-flex flex-nowrap items-center justify-between hover:bg-white/10">
														<div>
															{capitalizeString(
																formatSnakeCaseString(
																	k,
																),
															)}
															:
														</div>
														<div className="font font-semibold text-wrap text-right">
															{v}
														</div>
													</div>
												);
										},
									)}
							</div>
						)}
					</div>
				</div>
				<div
					className={`shadow-[0_0_10px_rgba(0,0,0,0.3)] flex flex-wrap rounded-b-md ${(detailData?.get("day_time") || "yes") === "yes" ? "bg-yellow-800" : "bg-gray-800"}  px-2 text-sm font-thin font-roboto justify-between w-full`}>
					{weatherData.current.precipitation !== undefined && (
						<div
							className={`py-0.5 font-thin text-sm ${detailView ? "opacity-0" : "opacity-100"} transition-opacity`}>
							Precipitation:{" "}
							<span className="font-semibold">
								{weatherData.current.precipitation}{" "}
								{weatherData.current_units.precipitation || ""}
							</span>
						</div>
					)}
					<div
						className="font-semibold hover:cursor-pointer"
						onClick={() => setDetailView((s) => !s)}>
						{detailView ? "Less" : "More..."}
					</div>
				</div>
			</div>
			<div className="text-[12px] font-thin text-center md:text-right">
				Data Source: <span className="font-semibold">open-meteo</span>
			</div>
			<div className="text-[12px] font-thin text-center md:text-right">
				Last Updated on:{" "}
				{(weatherData.cacheDate || new Date()).toLocaleString()}
			</div>
		</div>
	);
};

const scrollbarStyle = {
	scrollbarWidth: "thin",
	scrollbarColor: "#CBD5E0 transparent",
	"&::WebkitScrollbar": {
		width: "2px",
		borderRadius: "4px",
	},
	"&::WebkitScrollbarTrack": {
		background: "transparent",
	},
	"&::WebkitScrollbarThumb": {
		backgroundColor: "#CBD5E0",
		borderRadius: "2px",
	},
} as const;

export default React.memo(WeatherCard);
