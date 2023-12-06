import { getInputLines, printPart } from "./util";

const day = 3;
// const lines = await getInputLines(day);
const lines = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split("\n");

const charAtCoordIsSymbol = (grid: Array<String>, x: number, y: number) => {
  const code = grid[y]?.charCodeAt(x) || 0;

  return (code > 0 && code < 48 && code !== 46) || code > 57;
};

const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

printPart(
  1,
  lines
    .flatMap((line, i) =>
      Array.from(line.matchAll(/(\d+)/g)).map((match) => ({
        x: match.index,
        y: i,
        length: match[0].length,
        number: parseInt(match[0]),
      }))
    )
    .filter(({ x, y, length }) => {
      for (let i = 0; i < length; i++) {
        if (
          dirs.some(([dY, dX]) =>
            charAtCoordIsSymbol(lines, x + i + dX, y + dY)
          )
        ) {
          return true;
        }
      }
      return false;
    })
    .reduce((acc, { number }) => acc + number, 0)
);

const charAtCoordIsDigit = (grid: Array<String>, x: number, y: number) => {
  const code = grid[y]?.charCodeAt(x) || 0;

  return code > 47 && code < 58;
};

const gears = lines.flatMap((line, i) =>
  Array.from(line.matchAll(/\*/g))
    .map((match) => ({ x: match.index, y: i }))
    .filter(({ x, y }) =>
      dirs.some(([dY, dX]) => charAtCoordIsDigit(lines, x + dX, y + dY))
    )
);

console.log(gears);
