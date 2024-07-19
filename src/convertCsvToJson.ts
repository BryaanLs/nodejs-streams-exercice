import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

// Paths I/O streams
const csvPath = path.resolve("src", "files", "csvWords.csv");
const outputJson = path.resolve("src", "files", "jsonWords.json");

// Creating my read file
const readCsvData = fs.createReadStream(csvPath);

// Creating my transform stream with csv-parser lib (this lib return a json row for each csv line)
const parser = csv();

// Creating my output files
const writeCsvToJson = fs.createWriteStream(outputJson);
writeCsvToJson.write("[");

// Transform -> format jsonLine
const addJsonLine = new Transform({
  objectMode: true,
  transform(csvRowHowJson, enc, cb) {
    cb(null, `${JSON.stringify(csvRowHowJson)},\n`);
  },
});

// close object array of the json
addJsonLine.on("end", () => writeCsvToJson.write("]"));

// The second pipeline -> convert csv to json
pipeline(readCsvData, parser, addJsonLine, writeCsvToJson)
  .then(() => {
    console.log("----".repeat(15));
    console.log("CSV conveted to json with success!");
    console.table({
      "Bytes read": readCsvData.bytesRead,
      "Bytes written": writeCsvToJson.bytesWritten,
    });
    console.log("----".repeat(15));
  })
  .catch((err) => console.log("Error to convert csv to json: ", err));
