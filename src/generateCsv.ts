import { generate } from "random-words";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import path from "path";

const generateWords: GenerateWordsFn = function* (rowsToGen, wordsToGen) {
  // None of the parameters can be 0,
  if (rowsToGen === 0 || wordsToGen === 0) {
    throw new Error("rowsToGen or WordsToGen must be greater than 0");
  }
  for (let i = 0; i < rowsToGen; i++) {
    // if range > 2 generate function will return words array
    if (wordsToGen > 2) {
      const wordsArray = generate(wordsToGen) as string[];
      yield `${wordsArray.join(",")}\n`;
    } else {
      //else, the generate function will return only word
      yield `${generate(wordsToGen)[0]}\n`;
    }
  }
};

const generator = generateWords(10, 26);
const outputPath = path.resolve("src", "files", "csvWords.csv");
const csvWriter = createWriteStream(outputPath);

const columns: string = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z\n";
csvWriter.write(columns);

await pipeline(generator, csvWriter);
