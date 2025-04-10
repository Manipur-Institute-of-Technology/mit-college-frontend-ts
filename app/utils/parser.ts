import type { Weather } from "~/types/api/resData.type";

// Parse Weather data by adding corresponding unit to each reading value
export const parseWeatherData = (weatherData: Weather): Map<string, string> => {
	const parseData = new Map<string, string>();
	const currentData = Object.entries(weatherData.current_units);

	for (let [k, v] of Object.entries(weatherData.current)) {
		if (typeof v === "number") v = String(v); // Set all values to string if not

		// Custom format for particular field type
		if (k === "time") parseData.set(k, v.trimEnd());
		else if (k === "weather_code") parseData.set(k, v);
		else if (k === "is_day")
			parseData.set("day_time", v === "0" ? "no" : "yes");
		else {
			// Val and unit combination
			const unit =
				currentData.find(([key1, _]) => key1 === k)?.at(1) || "";
			parseData.set(k, (v + " " + unit).trimEnd());
		}
	}
	return parseData;
};
