const Game = require('./Game').Game;
const Greedy = require('./Greedy').chooseGreedy;

const fs = require('fs');

for(let i = 0; i < 10000; i++) {
  let result = [];
  for(let j = 0; j < 100; j++) {
    const game = new Game();
    result.push(Greedy(game));
  }

  const file = "./batches/" + i + ".txt";
  fs.writeFileSync(file, JSON.stringify(result));
}