import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

// Paths I/O streams
const csvPath = path.resolve("src", "files", "csvWords.csv");
const outputOrdeningCsv = path.resolve("src", "files", "ordeningWords.csv");
const outputJson = path.resolve("src", "files", "jsonWords.json");

// Creating my read file
const readCsvData = fs.createReadStream(csvPath);

// Creating my transform stream with csv-parser lib (this lib return a json row for each csv line)
const parser = csv();

// increasing the event emission limit on streams that will be reused in the pipeline
readCsvData.setMaxListeners(20);
parser.setMaxListeners(20);

// Creating my output files
const writeOrdeningCsv = fs.createWriteStream(outputOrdeningCsv);
const writeCsvToJson = fs.createWriteStream(outputJson);

// header of csv and keys of json
const letters: Array<string> = ["a", "b", "c", "d"];

// writing the first line of csv with my header
writeOrdeningCsv.write(`${letters.join(",").toUpperCase()}\n`);
writeCsvToJson.write("[");

// Ordening data function
const ordeningData: OrdeningDataFn = function (csvRowHowJson, letters) {
  const tempObj: OrdeningObjects = {},
    sortedObj: OrdeningObjects = {},
    finalObj: OrdeningObjects = {};

  Object.keys(csvRowHowJson).forEach((letra) => (tempObj[letra] = ""));

  for (const value of Object.values(csvRowHowJson)) {
    const firstLetter = value.split("")[0];

    letters.filter((letter, index) => {
      if (firstLetter === letter) {
        tempObj[letters[index].toUpperCase()] = value;
      }
    });
  }

  if (Object.keys(tempObj).length === 0) {
    return false;
  }
  const sortedKeys = Object.keys(tempObj).sort();
  sortedKeys.forEach((key) => (sortedObj[key] = tempObj[key]));
  letters.forEach(
    (key) => (finalObj[key.toUpperCase()] = sortedObj[key.toUpperCase()])
  );
  return finalObj;
};

// Transform -> ordening words
const ordeningWords = new Transform({
  objectMode: true,
  transform(csvRowHowJson: Record<string, string>, enc, cb) {
    const ordenedData = ordeningData(csvRowHowJson, letters);
    if (!ordenedData) {
      cb(null);
    } else {
      cb(null, ordenedData);
    }
  },
});

// Transform -> format ordening words to csv
const formatRows = new Transform({
  objectMode: true,
  transform(ordenedData: Record<string, string>, enc, cb) {
    let csvLine = Object.values(ordenedData).map((value) => value);
    cb(null, `${csvLine.join(",")}\n`);
  },
});

// Transform -> format jsonLine
const addCsvLine = new Transform({
  objectMode: true,
  transform(csvRowHowJson, enc, cb) {
    cb(null, `${JSON.stringify(csvRowHowJson)},\n`);
  },
});

// close object array of the json
addCsvLine.on("end", () => writeCsvToJson.write("]"));

// The final function with pipeline process
function processData(): void {
  // The first pipeline -> ordening csv words per first letter and columns
  pipeline(readCsvData, parser, ordeningWords, formatRows, writeOrdeningCsv)
    .then(() => {
      console.log("The first pipeline is processed with sucessful!");
      console.table({
        "Bytes read": readCsvData.bytesRead,
        "Bytes written": writeOrdeningCsv.bytesWritten,
      });
    })
    .catch((err) => {
      console.log("Error on first pipeline: ", err);
    });

  // The second pipeline -> convert csv to json
  pipeline(readCsvData, parser, addCsvLine, writeCsvToJson)
    .then(() => {
      console.log("The second pipeline is processed with sucessful!");
      console.table({
        "Bytes read": readCsvData.bytesRead,
        "Bytes written": writeCsvToJson.bytesWritten,
      });
    })
    .catch((err) => {
      console.log("Error on second pipeline: ", err);
    });
}

processData();
