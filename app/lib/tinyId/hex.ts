const aCode = "a".charCodeAt(0);
const fCode = "f".charCodeAt(0);
const zeroCode = "0".charCodeAt(0);
const nineCode = "9".charCodeAt(0);

// B66 Characters in ascending order of their value
const b66Chars: string[] = [
	...Array.from({ length: 10 }, (_, i) => String(i)), // 0-9
	...Array.from({ length: "z".charCodeAt(0) - "a".charCodeAt(0) + 1 }, (_, i) =>
		String.fromCharCode("a".charCodeAt(0) + i),
	), // a-z
	...Array.from({ length: "Z".charCodeAt(0) - "A".charCodeAt(0) + 1 }, (_, i) =>
		String.fromCharCode("A".charCodeAt(0) + i),
	), // A-Z,
	"-",
	"_",
	".",
	"~",
];
// -, _, , ~
// 507f1f77bcf86cd799439011
export const encodeB66 = (hex: string): string => {
	// TODO; check layout page with 3 column, move page width, shadow style to PageContent component
	if (hex.length === 0) return "";
	let hexVal = hex2BigInt(hex);
	const b66Len = log(hexVal, 66) + BigInt(1);
	let b66 = "";
	for (let idx = b66Len - 1n; idx >= 0 && hexVal > 0; idx--) {
		if (hexVal < 66n ** idx) {
			b66 += "0";
			continue;
		}
		const cIndx = Math.floor(Number(hexVal / 66n ** idx));
		b66 += b66Chars[cIndx];
	}

	return b66 + "0".repeat(Number(b66Len) - b66.length);
};

export const decodeB66 = (b66: string): string => {
	if (b66.length === 0) return "";
	let b66Val = b662BigInt(b66);
	let hex = "";
	const hexLen = log(b66Val, 16) + 1n;
	for (let idx = hexLen - 1n; idx >= 0 && b66Val > 0; idx--) {
		if (b66Val < 16n ** idx) {
			hex += "0";
			continue;
		}
		const cIndx = Math.floor(Number(b66Val / 16n ** idx));
		hex += b66Chars[cIndx];
	}
	return hex + "0".repeat(Number(hexLen) - hex.length);
};

export const hex2BigInt = (hex: string): bigint => {
	if (hex.length === 0) return 0n;
	let val = 0n;
	for (let i = 0; i < hex.length; i++) {
		const hChar = hex.charAt(i);
		if (!isValidHexChar(hChar))
			throw new Error(
				`${hex} is not a valid hex string, invalid character: ${hChar} at pos ${i}`,
			);
		val += BigInt(getHexCharIntVal(hChar) * 16 ** (hex.length - 1 - i));
	}
	return val;
};

export const b662BigInt = (b66: string): bigint => {
	if (b66.length === 0) return 0n;
	let val = 0n;
	for (let i = 0; i < b66.length; i++) {
		if (!isValidB66Char(b66[i])) throw new Error(`invalid b66 char: ${b66[i]}`);
		val += BigInt(getB66CharVal(b66[i]) * 66 ** (b66.length - 1 - i));
	}
	return val;
};

const isValidHexChar = (char: string): boolean => {
	if (char.length === 0) throw new Error("char cannot be empty");
	else if (char.length !== 1)
		throw new Error(
			`only single character is allowed, given char: ${char}, have length: ${char.length}`,
		);

	const code = char.charCodeAt(0);
	return (
		(code >= aCode && code <= fCode) || (code >= zeroCode && code <= nineCode)
	);
};

export const isValidB66Char = (char: string): boolean => {
	return false;
};

export const isValidB66Str = (char: string): boolean => {
	return false;
};

const getHexCharIntVal = (char: string): number => {
	if (char.length !== 1)
		throw new Error(`char should be of length, found length: ${char.length}`);

	const code = char.charCodeAt(0);
	if (code >= zeroCode && code <= nineCode) return Number(char);
	else if (code >= aCode && code <= fCode) return 10 + code - aCode;
	else throw new Error(`char is not a hex, ${char} should be 0-9, a-f`);
};

const getB66CharVal = (char: string): number => {
	const val = b66Chars.findIndex((c) => c === char);
	if (val === -1) throw new Error(`invalid char: ${char}`);
	return val;
};

// TODO: Rewrite it to work with BigInt
const log = (num: bigint, base: number): bigint => {
	return BigInt(Math.log(Number(num)) / Math.log(Number(base)));
};
