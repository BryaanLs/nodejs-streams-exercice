import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { pipeline } from "node:stream/promises";
import { Transform } from "stream";

const wordsCsv = path.resolve("lucca", "files", "words.csv");
const ordenedCsv = path.resolve("lucca", "files", "ordenedWords.csv");
const outputJson = path.resolve("lucca", "files", "output.json");
const letters = ["a", "b", "c", "d"];

const csvParserStream = csv();
const myReadable = fs.createReadStream(wordsCsv);
const myWritable = fs.createWriteStream(ordenedCsv);
const writableJson = fs.createWriteStream(outputJson);

myReadable.setMaxListeners(20);
csvParserStream.setMaxListeners(20);

myWritable.write(`${letters.join(",")}\n`);
writableJson.write("[");

const myTransform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const ordenedArray = [];
    const words = Object.values(chunk);
    for (const letter of letters) {
      for (const index in words) {
        if (words[index][0] == letter) {
          ordenedArray.push(words[index]);
          break;
        }
        if (index == words.length - 1) {
          ordenedArray.push("");
        }
      }
    }
    callback(null, `${ordenedArray.join(",")}\n`);
  },
});

const commaTransform = new Transform({
  objectMode: true,
  transform(chunk, enc, cb) {
    cb(null, `${JSON.stringify(chunk)},`);
  },
});

commaTransform.on("finish", () => {
  writableJson.write("]");
});

pipeline(myReadable, csvParserStream, myTransform, myWritable);

pipeline(myReadable, csvParserStream, commaTransform, writableJson);
