const Game = require('./Game').Game;
const Greedy = require('./Greedy').chooseGreedy;

const fs = require('fs');

for (let i = 0; i < 1; i++) {
  let result = [];
  for (let j = 0; j < 1000; j++) {
    const game = new Game();
    result.push(Greedy(game));
  }

  if (i % 100 === 0) console.log('Iteration:', i);

  const file = './testbatch.txt';
  fs.writeFileSync(file, JSON.stringify(result));
}
