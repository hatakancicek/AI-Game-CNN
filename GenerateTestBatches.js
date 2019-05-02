const Game = require("./Game").Game;
const Greedy = require("./Greedy").chooseGreedy;

const fs = require("fs");

let result = [];
for (let j = 0; j < 1000; j++) {
  const game = new Game();
  result.push(Greedy(game));
}

const file = "./testbatch.txt";
fs.writeFileSync(file, JSON.stringify(result));
