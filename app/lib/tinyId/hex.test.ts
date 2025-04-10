import { expect, describe, it } from "vitest";
import { decodeB66, encodeB66, log, logBigInt } from "./hex";

describe("logBigInt", () => {
	it("should throw error with log of 0", () => {
		expect(() => logBigInt(0n, 21n)).toThrow("log of 0 is invalid");
	});

	it("logBigInt comparison with Math.log using base 2", () => {
		const nums = [1, 500, 10];
		nums.forEach((d) =>
			expect(logBigInt(BigInt(d), 2n)).toBe(log(BigInt(d), 2)),
		);
	});
});

describe("B6 encoding", () => {
	it("b66 encoding", () => {
		const hex = "10";
		const got = encodeB66(hex);
		const want = "g";
		expect(got).toBe(want);
	});

	it("should handle empty string", () => {
		expect(encodeB66("")).toBe("");
	});

	it("should encode single digit hex", () => {
		expect(encodeB66("0")).toBe("0");
		expect(encodeB66("1")).toBe("1");
		expect(encodeB66("a")).toBe("a");
		expect(encodeB66("f")).toBe("f");
		expect(encodeB66("13")).toBe("j");
	});

	// TODO: write test case for the following case
	// it("should encode multi digit hex", () => {
	// 	// check it work
	// 	expect(encodeB66("ff")).toBe(encodeB66("ff"));
	// });

	// TODO:
	// it("should encode large hex values", () => {
	// });

	describe("B66 decoding", () => {
		it("should decode empty string", () => {
			expect(decodeB66("")).toBe("");
		});

		it("should decode single character b66", () => {
			expect(decodeB66("0")).toBe("0");
			expect(decodeB66("1")).toBe("1");
			expect(decodeB66("a")).toBe("a");
			expect(decodeB66("g")).toBe("10");
		});

		// TODO:
		// it("should decode multi character b66", () => {
		// });

		// TODO:
		// it("should decode large b66 values", () => {
		// });

		it("should throw error for invalid b66 characters", () => {
			expect(() => decodeB66("#")).toThrow();
			expect(() => decodeB66("$%^")).toThrow();
		});

		// it("should be reversible with encode", () => {
		// 	const testValues = ["10", "ff", "abc", "dead", "ffffff", "deadbeef"];
		// 	for (const hex of testValues) {
		// 		expect(decodeB66(encodeB66(hex))).toBe(hex);
		// 	}
		// });
	});
});

describe("B66 encoder-decoder pair test", () => {
	it("hex test", () => {
		const hex = ["1232", "aa789f", "f112be", "e1e1e", "fabb"];
		const b66 = hex.map((d) => encodeB66(d));
		const decodeHex = b66.map((d) => decodeB66(d));

		for (let i = 0; i < hex.length; i++) {
			expect(hex[i]).toBe(decodeHex[i]);
		}
	});

	it("b66 test", () => {
		const b66 = ["qe12", "ihuS-", "-212", "u-.WQ"];
		const hex = b66.map((d) => decodeB66(d));
		const encB66 = hex.map((d) => encodeB66(d));

		for (let i = 0; i < b66.length; i++) {
			expect(b66[i]).toBe(encB66[i]);
		}
	});
});
