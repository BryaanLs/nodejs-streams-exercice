import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

// Paths I/O streams
const csvPath = path.resolve("src", "files", "csvWords.csv");
const outputOrdeningCsv = path.resolve("src", "files", "ordeningWords.csv");

// Creating my read file
const readCsvData = fs.createReadStream(csvPath);

// Creating my transform stream with csv-parser lib (this lib return a json row for each csv line)
const parser = csv();

// Creating my output files
const writeOrdeningCsv = fs.createWriteStream(outputOrdeningCsv);

// header of csv and keys of json
const letters: Array<string> = ["a", "b", "c", "d", "E"]
  .join(",")
  .toUpperCase()
  .split(",");

// writing the first line of csv with my header
writeOrdeningCsv.write(`${letters.join(",")}\n`);

// Ordening data function
const ordeningData: OrdeningDataFn = function (csvRowHowJson, letters) {
  const obj: Record<string, string> = {};
  const lineWords = Object.values(csvRowHowJson).sort();

  for (const letter of letters) {
    obj[letter] = "";
    lineWords.forEach((word) => {
      if (word[0].toUpperCase() === letter) {
        obj[letter] = word;
      }
    });
  }
  return `${Object.values(obj).join(",")}\n`;
};

// Transform -> ordening words
const ordeningWords = new Transform({
  objectMode: true,
  transform(csvRowHowJson: Record<string, string>, enc, cb) {
    const csvLine = ordeningData(csvRowHowJson, letters);
    if (!csvLine) {
      cb(new Error("csvLine is empty"));
    } else {
      cb(null, csvLine);
    }
  },
});

// The first pipeline -> ordening csv words per first letter and columns
pipeline(readCsvData, parser, ordeningWords, writeOrdeningCsv)
  .then(() => {
    console.log("----".repeat(15));
    console.log("Ordening CSV created With success!");
    console.table({
      "Bytes read": readCsvData.bytesRead,
      "Bytes written": writeOrdeningCsv.bytesWritten,
    });
    console.log("----".repeat(15));
  })
  .catch((err) => {
    console.log("Error on Ordening CSV pipeline: ", err);
  });
