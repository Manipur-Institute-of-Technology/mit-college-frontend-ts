import { b66Chars, encodeB66, round } from "./hex";
import { writeFileSync } from "fs";

const maxHexStrLen = 30;
const minHexStrLen = 0;
const avgObs = 5; // num of hexStr to take average of

const randHexStr = (hexLen: number): string => {
  let hexStr = "";
  for (let i = 0; i < hexLen; i++) {
    const cIndx = Math.floor(Math.random() * 16);
    const hexChar = b66Chars.at(cIndx);
    if (hexChar) hexStr += hexChar;
    else throw new Error(`invalid cIndx: ${cIndx}`);
  }
  return hexStr;
};

const bench = () => {
  console.log("Benchmark data for TinyId");

  const hexLens: number[] = [];
  const b66Lens: number[] = [];
  const avgB66Lens: number[] = [];

  for (let hexLen = minHexStrLen; hexLen <= maxHexStrLen; hexLen++) {
    if (hexLen === 0) {
      hexLens.push(0);
      avgB66Lens.push(0);
      continue;
    }
    let totalB66Ratio = 0;
    let totalB66Len = 0;
    for (let i = 0; i < avgObs; i++) {
      const hexStr = randHexStr(hexLen);
      const b66Str = encodeB66(hexStr);
      // b66 encoded str length ratio with respect to its corresponding hex str length
      const ratio = round(b66Str.length / hexStr.length, 2);
      totalB66Ratio += ratio;
      totalB66Len += b66Str.length;
    }
    b66Lens.push(round(totalB66Len / avgObs, 2));
    hexLens.push(hexLen);
    avgB66Lens.push(round(totalB66Ratio / avgObs, 2));
  }

  return { hexLens, avgB66Lens, b66Lens };
};

const writeBenchmarkReport = (
  data: {
    hexLens: number[];
    b66Lens: number[];
    avgB66Lens: number[];
  },
  mdFilePath: string = "./benchmark-report.md",
) => {
  const graphTitle = `TinyId Benchmark Results`;
  const mermaidGraph = `
## TinyId Benchmark Results

\`\`\`mermaid
%%{init: {"theme": "default"}}%%
xychart-beta
    title "${graphTitle}"
    x-axis "Hex string length" [${data.hexLens.reduce((acc, d, i) => acc + `${d}${i !== data.hexLens.length - 1 ? ", " : ""}`, "")}]
    y-axis "Decoded B66 string average length"
    line [${data.b66Lens.reduce((acc, d, i) => acc + `${d}${i !== data.b66Lens.length - 1 ? ", " : ""}`, "")}]
    line [${data.hexLens.reduce((acc, d, i) => acc + `${d}${i !== data.hexLens.length - 1 ? ", " : ""}`, "")}]
\`\`\`


## Data Summary
| Hex Length | B66 Length | B66 Length Ratio |
|------------|-----------------|-----------------|
${data.hexLens.map((hex, i) => `| ${hex} | ${data.b66Lens[i]} | ${data.avgB66Lens[i]} |`).join("\n")}
`;

  writeFileSync(mdFilePath, mermaidGraph, "utf-8");
  console.log(`Benchmark report written to ${mdFilePath}`);
};

const mdFilePath = "./benchmark-report.md";
const result = bench();
writeBenchmarkReport(result, mdFilePath);

// \`\`\`mermaid
// graph LR
//     title[B66 Encoded String Length Ratio vs Hex String Length]
//     ${data.hexLens
// 			.map(
// 				(hex, i) =>
// 					`    ${hex}[${hex}] --> ${data.avgB66Lens[i]}[${data.avgB66Lens[i]}]`,
// 			)
// 			.join("\n")}
// \`\`\`
