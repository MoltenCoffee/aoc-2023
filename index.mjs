import ncc from "@vercel/ncc";

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { fork } from "node:child_process";
import { resolve } from "node:path";

const runFile = async (path) => {
  const process = fork(path, [], {
    stdio: "inherit",
  });

  return new Promise((resolve, reject) => {
    process.on("error", reject);
    process.on("close", resolve);
  });
};

const fileExists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch (error) {
    return false;
  }
};

const run = async (day) => {
  const srcPath = `./src/day${day}.ts`;
  const destPath = `./dist/day${day}.mjs`;
  const cachePath = `./dist/cache.json`;

  if (!(await fileExists(srcPath))) {
    await create(day);
    throw new Error(`day${day}.ts does not exist. Files created instead.`);
  }

  const cache = (await fileExists(cachePath))
    ? JSON.parse(await readFile(cachePath, "utf-8"))
    : {};
  const { mtimeMs: srcMtimeMs } = await stat(srcPath);

  if (!cache[day] || cache[day].mtimeMs !== srcMtimeMs) {
    console.log(`Building day${day}.ts...`);
    const { code } = await ncc(resolve(`./src/day${day}.ts`), {
      quiet: true,
      target: "es2020",
    });

    await mkdir("./dist", { recursive: true });
    await writeFile(destPath, code, "utf-8");
  }

  await runFile(destPath);
  await writeFile(
    cachePath,
    JSON.stringify({ ...cache, [day]: { mtimeMs: srcMtimeMs } }),
    "utf-8"
  );
};

const create = async (day) => {
  const path = `./src/day${day}.ts`;

  if (await fileExists(path)) {
    throw new Error(`day${day}.ts already exists`);
  }

  await writeFile(
    path,
    `import { getInputLines, printPart } from "./util";

const day = ${day};
const lines = await getInputLines(day);`
  );

  await writeFile(`./input/day${day}.txt`, "\n");
};

const main = async () => {
  const [day, command = "run"] = process.argv.slice(2);
  const parsedDay = parseInt(day, 10);

  // verify day is a number
  if (isNaN(parsedDay)) {
    throw new Error("day must be a number");
  }

  if (parsedDay < 1 || parsedDay > 25) {
    throw new Error("day must be between 1 and 25");
  }

  switch (command) {
    case "run":
      await run(day);
      break;
    case "create":
      await create(day);
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

main();
