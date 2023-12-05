import { getInputLines, printPart } from "./util";

const day = 2;
const games = (await getInputLines(day)).map((line, i) => {
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

const maxCubeCounts = {
  red: 12,
  green: 13,
  blue: 14,
};

printPart(
  1,
  games
    .filter(({ sets }) =>
      sets.every((set) =>
        set.every(({ count, color }) => count <= maxCubeCounts[color])
      )
    )
    .reduce((acc, { index }) => acc + index, 0)
);

printPart(
  2,
  games
    .map(({ sets }) => {
      const { red, green, blue } = sets.reduce(
        (minCounts, set) => {
          set.forEach(({ count, color }) => {
            minCounts[color] = Math.max(minCounts[color] || 0, count);
          });
          return minCounts;
        },
        { red: 0, green: 0, blue: 0 }
      );

      return red * green * blue;
    })
    .reduce((acc, val) => acc + val, 0)
);
