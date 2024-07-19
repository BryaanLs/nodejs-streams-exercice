import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import csv from "csv-parser";
import { transform } from "typescript";

const csvPath = path.resolve("files", "output.csv");
const reader = fs.createReadStream(csvPath);
const jsonPath = path.resolve("files", "output.json");
const writer = fs.createWriteStream(jsonPath);
const jsonSortedPath = path.resolve("files", "outputSorted.csv");
const writerSorted = fs.createWriteStream(jsonSortedPath);

let isFirstChunk = true;
const jsonParser = csv();
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

writer.write("[");
stringfyJson.on("end", () => writer.write("]"));

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

const trasnformToCsvRows = new Transform({
	transform(chunk, encoding, callback) {
		const jsonValues = Object.values(JSON.parse(chunk));
		const row = `${jsonValues.join(",")}\n`;
		console.log(row);
		callback(null, row);
	},
});

export async function transformJson() {
	await pipeline(reader, jsonParser, stringfyJson, writer)
		.then(() => {
			console.log("Pipeline processed successfully!");
		})
		.catch((error) => {
			console.error("Pipeline processed successfully: ", error);
		});
}

export async function sortJson() {
	const headers = keys.join(",");
	writerSorted.write(`${headers}\n`);
	await pipeline(reader, jsonParser, sorter, trasnformToCsvRows, writerSorted)
		.then(() => {
			console.log("Pipeline processed successfully!");
		})
		.catch((error) => {
			console.error("Pipeline processed successfully: ", error);
		});
}

sortJson();
