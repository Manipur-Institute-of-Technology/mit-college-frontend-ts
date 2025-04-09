import { b66Chars, encodeB66, round } from "./hex";
import { writeFileSync } from "fs";

const maxHexStrLen = 30;
const minHexStrLen = 0;
const avgObs = 5; // num of hexStr to take average of

const randHexStr = (hexLen: number): string => {
  let hexStr = "";
  const cIndx = Math.floor(Math.random() * 16);
  const hexChar = b66Chars.at(cIndx);
  if (hexChar) hexStr += hexChar;
  else throw new Error(`invalid cIndx: ${cIndx}`);
  return hexStr;
};

const bench = () => {
  console.log("Benchmark data for TinyId");

  const hexLens: number[] = [];
  const avgB66Lens: number[] = [];

  for (let hexLen = minHexStrLen; hexLen <= maxHexStrLen; hexLen++) {
    if (hexLen === 0) {
      hexLens.push(0);
      avgB66Lens.push(0);
      continue;
    }
    let totalB66Ratio = 0;
    for (let i = 0; i < avgObs; i++) {
      const hexStr = randHexStr(hexLen);
      console.log("hex: ", hexStr, hexLen);
      const b66Str = encodeB66(hexStr);
      // b66 encoded str length ratio with respect to its corresponding hex str length
      const ratio = round(b66Str.length / hexStr.length, 2);
      totalB66Ratio += ratio;
    }
    const avg = round(totalB66Ratio / avgObs, 2);
    hexLens.push(hexLen);
    avgB66Lens.push(avg);
  }

  return { hexLens, avgB66Lens };
};

const writeBenchmarkReport = (
  data: {
    hexLens: number[];
    avgB66Lens: number[];
  },
  mdFilePath: string = "./benchmark-report.md",
) => {
  const mermaidGraph = `
## TinyId Benchmark Results

\`\`\`mermaid
graph LR
    title[B66 Encoded String Length Ratio vs Hex String Length]
    ${data.hexLens
      .map(
        (hex, i) =>
          `    ${hex}[${hex}] --> ${data.avgB66Lens[i]}[${data.avgB66Lens[i]}]`,
      )
      .join("\n")}
\`\`\`

## Data Summary
| Hex Length | B66 Length Ratio |
|------------|-----------------|
${data.hexLens.map((hex, i) => `| ${hex} | ${data.avgB66Lens[i]} |`).join("\n")}
`;

  writeFileSync(mdFilePath, mermaidGraph, "utf-8");
  console.log(`Benchmark report written to ${mdFilePath}`);
};

const mdFilePath = "./benchmark-report.md";
const result = bench();
writeBenchmarkReport(result, mdFilePath);
