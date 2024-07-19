import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import csv from "csv-parser";

const csvPath = path.resolve("resolution-js", "src", "files", "output.csv");
const csvSortedPath = path.resolve(
	"resolution-js",
	"src",
	"files",
	"outputSorted.csv",
);

const reader = fs.createReadStream(csvPath);
const writer = fs.createWriteStream(csvSortedPath);

const jsonParser = csv();
jsonParser.setMaxListeners(20);

const keys = ["a", "b", "c"];
const sorter = new Transform({
	objectMode: true,
	transform(chunk, encoding, callback) {
		const object = {};
		for (const key of keys) {
			for (const value of Object.values(chunk)) {
				if (value[0] === key && !object[key]) {
					object[key] = value;
				} else if (!object[key]) {
					object[key] = "";
				}
			}
		}
		callback(null, JSON.stringify(object));
	},
});

const transformToCsvRows = new Transform({
	transform(chunk, encoding, callback) {
		const jsonValues = Object.values(JSON.parse(chunk));
		const row = `${jsonValues.join(",")}\n`;
		callback(null, row);
	},
});

export async function sortJsonIntoCsv() {
	const headers = keys.join(",");
	writer.write(`${headers}\n`);
	return pipeline(reader, jsonParser, sorter, transformToCsvRows, writer)
		.then(() => {
			console.log("Pipeline processed successfully!");
		})
		.catch((error) => {
			console.error("Pipeline processed successfully: ", error);
		});
}
