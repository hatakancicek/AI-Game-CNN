const Game = require("./Game").Game;
const Greedy = require("./Greedy").chooseGreedy;

const fs = require("fs");

let result = [];
for (let j = 0; j < 80000; j++) {
  const game = new Game();
  result.push(Greedy(game));
}

const file = "./train_large.txt";
fs.writeFileSync(file, JSON.stringify(result));
