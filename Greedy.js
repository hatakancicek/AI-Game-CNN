const Config = require('./Config.js');

const { types, cols, rows, } = Config;

exports.chooseGreedy = game => {
  const actions = Array(rows).fill(0).map(_ => Array(cols).fill(0));


  let max = 0, action = 0;
  for(let i = 0; i < rows * (cols - 1) + (rows - 1) * cols; i++) {
    const tmp = game.move(i);

    if(tmp > 0) {
      let row, col;

      if(i < rows * ( cols - 1 )) {
        // Horizontal Swap
        row = Math.floor(i / ( cols - 1));
        col = i % ( cols - 1);

        row = Math.max(0, row);
        col = Math.max(0, col);

        actions[row][col] = 1;
        actions[row][col + 1] = 1;
      } else {
        // Vertical Swap
        row = Math.floor((i - 1 - rows * (cols - 1)) / ( cols ));
        col = i % ( cols );

        row = Math.max(0, row);
        col = Math.max(0, col);

        actions[row][col] = 1;
        actions[row + 1][col] = 1;
      };
    }

    if(tmp > max) {
      max = tmp;
      action = i;
    };
  };

  const state = Array(rows).fill(0).map(_ => 
    Array(cols).fill(0).map(_ =>
      []));

  for(let i = 0; i < types.length; i++) {
    game.board.forEach((row, r) => 
      row.forEach((element, c) =>
        element === i
          ? state[r][c].push(1)
          : state[r][c].push(0)))
  };

  actions.forEach((row, r) => 
      row.forEach((element, c) =>
        state[r][c].push(element)))

  const _action = Array(122).fill(0);
  _action[action] = 1;

  return {
    state,
    action: _action,
  };
};