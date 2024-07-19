import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import csv from "csv-parser";

const csvPath = path.resolve(
	"resolution-js",
	"src",
	"files",
	"outputSorted.csv",
);
const jsonPath = path.resolve("resolution-js", "src", "files", "output.json");

const reader = fs.createReadStream(csvPath);
const writer = fs.createWriteStream(jsonPath);

const jsonParser = csv();
jsonParser.setMaxListeners(20);

let isFirstChunk = true;
const stringfyJson = new Transform({
	objectMode: true,
	transform(chunk, encoding, callback) {
		const stringfiedChunk = JSON.stringify(chunk);
		if (isFirstChunk) {
			callback(null, stringfiedChunk);
			isFirstChunk = false;
		} else {
			callback(null, `,${stringfiedChunk}`);
		}
	},
});

export async function transformCsvToJson() {
	writer.write("[");
	stringfyJson.on("end", () => writer.write("]"));
	return pipeline(reader, jsonParser, stringfyJson, writer)
		.then(() => {
			console.log("Pipeline processed successfully!");
		})
		.catch((error) => {
			console.error("Pipeline processed successfully: ", error);
		});
}
