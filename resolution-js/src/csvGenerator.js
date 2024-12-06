import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { generate } from "random-words";

const csvPath = path.resolve("resolution-js", "src", "files", "output.csv");
const writer = fs.createWriteStream(csvPath);
const header =
	"a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z\n";
writer.write(header);

function* generator(lines) {
	if (lines <= 0) {
		throw new Error("Lines must be greater than 0");
	}
	for (let i = 0; i < lines; i++) {
		const arr = `${generate(26).join(",")}\n`;
		yield arr;
	}
}

export async function generateCsv(lines) {
	await pipeline(generator(lines), writer)
		.then(() => {
			console.log("Pipeline processed successfully!");
		})
		.catch((error) => {
			console.error("Pipeline processed with error: ", error);
		});
}
