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

const main = async () => {
  const args = process.argv.slice(2);
  const [day] = args;

  // verify day is a number
  if (isNaN(day)) {
    throw new Error("day must be a number");
  }

  const parsed = parseInt(day, 10);
  if (parsed < 1 || parsed > 25) {
    throw new Error("day must be between 1 and 25");
  }

  const srcPath = `./src/day${day}.ts`;
  const destPath = `./dist/day${day}.mjs`;
  const cachePath = `./dist/cache.json`;

  if (!(await fileExists(srcPath))) {
    throw new Error(`day${day}.ts does not exist`);
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

main();
