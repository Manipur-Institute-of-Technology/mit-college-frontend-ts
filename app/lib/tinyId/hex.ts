const aCode = "a".charCodeAt(0);
const fCode = "f".charCodeAt(0);
const zeroCode = "0".charCodeAt(0);
const nineCode = "9".charCodeAt(0);

// B66 Characters in ascending order of their value
export const b66Chars: string[] = [
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

// TODO: Rewrite the encoder with bitwise shift operation
export const encodeB66 = (hex: string): string => {
  // TODO; check layout page with 3 column, move page width, shadow style to PageContent component
  if (hex.length === 0) return "";
  if (hex === "0") return "0";
  // let hexVal = hex2BigInt(hex);
  let hexVal = BigInt("0x" + hex);
  const b66Len = log(hexVal, 66) + BigInt(1);
  let b66 = "";
  for (let idx = b66Len - 1n; idx >= 0 && hexVal > 0; idx--) {
    if (hexVal < 66n ** idx) {
      b66 += "0";
      continue;
    }
    const cIndx = Math.floor(Number(hexVal / 66n ** idx));
    hexVal -= BigInt(cIndx) * 66n ** idx;
    b66 += b66Chars[cIndx];
  }
  const res = b66 + "0".repeat(Number(b66Len) - b66.length);
  return res;
};

export const decodeB66 = (b66: string): string => {
  if (b66.length === 0) return "";
  if (b66 === "0") return "0";
  let b66Val = b662BigInt(b66);
  let hex = "";
  const hexLen = log(b66Val, 16) + 1n;
  for (let idx = hexLen - 1n; idx >= 0 && b66Val > 0; idx--) {
    if (b66Val < 16n ** idx) {
      hex += "0";
      continue;
    }
    const cIndx = Math.floor(Number(b66Val / 16n ** idx));
    b66Val -= BigInt(cIndx) * 16n ** idx;
    hex += b66Chars[cIndx];
  }
  const res = hex + "0".repeat(Number(hexLen) - hex.length);
  return res;
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

export const isValidHexChar = (char: string): boolean => {
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
  return b66Chars.includes(char);
};

export const isValidB66Str = (str: string): boolean => {
  for (const char of str) {
    if (!b66Chars.includes(char)) return false;
  }
  return true;
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
// TODO: Rewrite the log algorithm using big int
export const log = (num: bigint, base: number): bigint => {
  const res = Math.log(Number(num)) / Math.log(Number(base));
  return BigInt(Math.floor(res));
};

export const round = (num: number, decimalPlaces: number = 0) => {
  return Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;
};

/**
 * Function for calulating logarithm of a bigint
 * @param num
 * @param base
 * @returns
 */
// TODO: used numerical algorithm (taylor series expansion) instead of using loop
export const logBigInt = (num: bigint, base: bigint): bigint => {
  if (num === 0n) throw new Error("log of 0 is invalid");
  let exp = 0n;
  for (exp = 0n; base ** exp < num; exp++);
  if (base ** exp > num) exp--;
  return exp;
};

// const logBigInt = (num: bigint, base: bigint): bigint => {
// 	if (num <= 0n) throw new Error("Number must be positive");
// 	if (base <= 1n) throw new Error("Base must be greater than 1");

// 	// Using the change of base formula: log_b(x) = ln(x) / ln(b)
// 	// For Taylor series, we'll use: ln(x) = 2( z + z^3/3 + z^5/5 + ...) where z = (x-1)/(x+1)

// 	// Scale the number to be close to 1 for better convergence
// 	let scale = 0n;
// 	let scaled = num;
// 	while (scaled >= base) {
// 		scaled /= base;
// 		scale += 1n;
// 	}

// 	// Calculate z = (x-1)/(x+1)
// 	const precision = 1000000n; // Use fixed-point arithmetic
// 	let z = ((scaled - 1n) * precision) / (scaled + 1n);

// 	// Calculate series up to few terms
// 	let sum = z;
// 	let term = z;
// 	let zSquared = (z * z) / precision;

// 	for (let i = 3n; i <= 9n; i += 2n) {
// 		term = (term * zSquared) / precision;
// 		sum += term / i;
// 	}

// 	// Final result = (2 * sum / precision) * ln(2) + scale
// 	return (2n * sum) / precision + scale;
// };
