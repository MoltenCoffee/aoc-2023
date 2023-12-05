import { getInputLines } from "./util";

const day = 1;
const lines = await getInputLines(day);

const calcLinePart1 = (line: string): number => {
  const digits = line.split("").filter((char) => !isNaN(parseInt(char)));
  return parseInt([digits[0], digits.at(-1)].join(""));
};

const part1 = lines.reduce((acc, line) => acc + calcLinePart1(line), 0);
console.log(part1);

const writtenDigits: Array<[string, number]> = [
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
];

const calcLinePart2 = (line: string): number => {
  const digitsWithPositions = line
    .split("")
    .map((char, index) => ({ digit: parseInt(char), index }))
    .concat(
      writtenDigits.flatMap(([word, digit]) => [
        { digit, index: line.indexOf(word) },
        { digit, index: line.lastIndexOf(word) },
      ])
    )
    .filter(({ digit, index }) => !isNaN(digit) && index > -1)
    .sort((a, b) => a.index - b.index);

  return parseInt(
    [digitsWithPositions[0].digit, digitsWithPositions.at(-1).digit].join("")
  );
};

const part2 = lines.reduce((acc, line) => acc + calcLinePart2(line), 0);
console.log(part2);
