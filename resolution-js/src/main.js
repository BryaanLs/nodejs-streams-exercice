import { generateCsv } from "./csvGenerator.js";
import { sortJsonIntoCsv } from "./csvSorter.js";
import { transformCsvToJson } from "./csvToJsonTransformer.js";

async function main() {
	// STEP 1
	await generateCsv(100);
	// STEP 2
	await sortJsonIntoCsv();
	// STEP 3
	await transformCsvToJson();
}

main();
