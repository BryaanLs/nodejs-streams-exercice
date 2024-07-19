/**
 * @param rowsToGen number
 * @param wordsToGen number
 * @returns Generator
 * @description The first param recive a number of rows to generate on csv and second param recive the quantity of words per line
 */
type GenerateWordsFn = (
  rowsToGen: number,
  wordsToGen: number
) => Generator<string> | never;
