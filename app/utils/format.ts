/**
 * Capitalizes the first character of a string while keeping the rest unchanged.
 *
 * @param str - The input string to be capitalized
 * @returns The string with its first character converted to uppercase
 *
 * @example
 * ```typescript
 * capitalizeString("hello") // returns "Hello"
 * capitalizeString("") // returns ""
 * capitalizeString("a") // returns "A"
 * ```
 */
export const capitalizeString = (str: string): string => {
	if (str.length === 0) return "";
	else if (str.length === 1) return str.toUpperCase();
	else return str[0].toUpperCase() + str.slice(1);
};

export const capitalizeWords = (words: string): string => {
	return words
		.trim()
		.split(" ")
		.map((wrd) => capitalizeString(wrd))
		.join(" ");
};

/**
 * Convert Camel Case string to lowercase normal text (readable with space).
 *
 * `eg: throttleState -> throttle state`
 *
 * @param str - camel case string
 * @returns formatted string
 *
 * @example
 * ```typescript
 * capitalizeString("helloWorld") // returns "hello world"
 * ```
 */
export const formatCamelCaseString = (cString: string) => {
	if (cString.length === 0) return cString;

	let str = "";
	for (let i = 0; i < cString.length; i++) {
		if (cString[i].toUpperCase() === cString[i]) {
			if (cString[i].toUpperCase() === cString[i].toLowerCase()) {
				// Case of non alphabetic characters
				str += " ";
				for (
					;
					i < cString.length &&
					cString[i].toUpperCase() === cString[i].toLowerCase();
					i++
				) {
					str += cString[i].trim();
				}
				if (cString[i].toUpperCase() !== cString[i].toLowerCase()) i--;
			} else str += " " + cString[i];
		} else str += cString[i];
	}
	return str.trim();
};

/**
 * Convert Snake Case string to lowercase normal text (readable with space).
 *
 * `eg: throttle_state -> throttle state`
 *
 * @param str - camel case string
 * @returns formatted string
 *
 * @example
 * ```typescript
 * capitalizeString("hello_world") // returns "hello world"
 * ```
 */
export const formatSnakeCaseString = (cString: string): string => {
	if (cString.length === 0 || !cString.includes("_")) return cString;

	return cString
		.trim()
		.split("_")
		.reduce(
			(acc, w) =>
				w.length > 0 ? (acc + " " + w.toLowerCase()).trimEnd() : acc.trimEnd(),
			"",
		)
		.trim();
};

/**
 * Converts decimal degrees to degrees and minutes with direction
 *
 * @param deg - Decimal degree value
 * @returns Formatted string in degrees and minutes with direction
 *
 * @example
 * formatDegreeToDMS(1.4167) // returns "1°25'E"
 * formatDegreeToDMS(-1.4167) // returns "1°25'W"
 */
export const formatDegreeToDMS = (
	deg: number,
	type: "latitude" | "longitude",
): string => {
	const absolute = Math.abs(deg);
	const degrees = Math.floor(absolute);
	const minutes = Math.round((absolute - degrees) * 60);
	const direction =
		type === "latitude" ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";

	return `${degrees}°${minutes}'${direction}`;
};
