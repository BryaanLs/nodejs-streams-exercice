import fs from "fs";
import { generate } from "random-words";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const alphabetList = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const pathCsv = path.resolve("lucca", "files", "words.csv");
console.log(pathCsv);

function* generateWords(rowSize, columnSize) {
  if (rowSize <= 0 || columnSize <= 0) {
    throw new Error("Row and column size must be greater than 0");
  }
  for (let index = 0; index < rowSize; index++) {
    const elements = generate(columnSize);
    yield `${elements.join(",")}\n`;
  }
}

const myWritable = fs.createWriteStream(pathCsv);

myWritable.write(`${alphabetList.join(",")}\n`);

pipeline(generateWords(1e6, alphabetList.length), myWritable);
