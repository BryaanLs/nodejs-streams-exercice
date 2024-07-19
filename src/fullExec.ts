import { ChildProcess, spawn } from "child_process";

function createProcess(args: string[]): ChildProcess {
  const command = "npm";
  const options = { shell: true };
  const process = spawn(command, args, options);
  return process;
}

async function execProcess(process: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout?.on("data", (data) => {
      console.log(data.toString());
    });
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    process.on("error", (err) => {
      reject(err);
    });
  });
}

async function runProcesses(): Promise<void> {
  try {
    console.log("Generating CSV");
    await execProcess(createProcess(["run", "dev:generateCsv"]));

    console.log("Ordening CSV");
    await execProcess(createProcess(["run", "dev:fakeEtl"]));

    console.log("Converting CSV to JSON");
    await execProcess(createProcess(["run", "dev:convertCsvToJson"]));

    console.log("All processes completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

runProcesses();
