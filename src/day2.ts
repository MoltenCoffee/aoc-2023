import { getInputLines, printPart } from "./util";

const day = 2;
const lines = await getInputLines(day);

const games = lines.map((line, i) => {
  const [game, sets] = line.split(":");
  return {
    sets: sets.split(";").map((set) =>
      set.split(",").map((combo) => {
        const [count, color] = combo.trim().split(" ");
        return { count: parseInt(count), color };
      })
    ),
    index: parseInt(game.split(" ")[1]),
  };
});

const cubeCounts = {
  red: 12,
  green: 13,
  blue: 14,
};

const part1 = games
  .filter(({ sets }) =>
    sets.every((set) =>
      set.every(({ count, color }) => count <= cubeCounts[color])
    )
  )
  .reduce((acc, { index }) => acc + index, 0);

printPart(1, part1);
