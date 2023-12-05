import { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";

export const openInput = async (
  path: PathLike,
  trim: Boolean = true
): Promise<String> => {
  const data = await readFile(path, "utf-8");
  return trim ? data.trim() : data;
};

export const getInputLines = async (day: number): Promise<Array<string>> =>
  (await openInput(`input/day${day}.txt`))
    .split("\n")
    .map((line) => line.trim());

export const printPart = (part: number, result: number) => {
  console.log(`Part ${part}: ${result}`);
};
