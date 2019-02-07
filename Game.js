const Config = require('./Config.js');

const { types, cols, rows, } = Config;

function GenerateBoard(rows, cols) {

  const tiles = [];
  for(let i = 0; i < rows; i++) {
    const row = [];

    for(let j = 0; j < cols; j++) {
      let type = Math.floor(Math.random() * Math.floor(types.length));
      if(j > 1)
        while((row[j - 1] === type && row[j - 2] === type))
          type = Math.floor(Math.random() * Math.floor(types.length));

      if(i > 1)
        while((tiles[i - 1][j] === type && tiles[i - 2][j] === type ))
          type = Math.floor(Math.random() * Math.floor(types.length));

      row.push(type);
    }

    tiles.push(row);
  };

  return tiles;
};

function _pop(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;

  let current = board[row][col];

  if(current < 0)
    return 0;

  let left = 0, right = 0, top = 0, bottom = 0, horizontal = 0, vertical = 0;
  for(let i = 1; 0 <= col - i; i++) {
    if(board[row][ col - i ] !== current)
      break;

    left = i;
  };

  for(let i = 1; col + i < cols; i++) {
    if(board[row][col + i] !== current)
      break;

    right = i;
  };

  if( left + right > 1 )
    horizontal = left + right;

  for(let i = 1; 0 <= row - i; i++) {
    if(board[row - i][col] !== current)
      break;

    top = i;
  };

  for(let i = 1; row + i < rows; i++) {
    if(board[row + i][col] !== current)
      break;

    bottom = i;
  };

  if( top + bottom > 1 )
    vertical = top + bottom;

  if(!( horizontal + vertical ))
    return 0;

  if(horizontal) {
    for(let i = 0; i < horizontal + 1; i++) {
      if(board[row][col - left + i] < 0)
        continue

      board[row][col - left + i] = Math.abs(board[row][col - left + i]) * -1 - 1;
    };
  };

  if(vertical) {
    for(let i = 0; i < vertical + 1; i++) {
      if(board[row - top + i][col] < 0)
        continue

      board[row - top + i][col] = Math.abs(board[row - top + i][col]) * -1 - 1;
    };
  };

  return horizontal + vertical + 1;
}

function _move(board, index, real) {
  if(!real)
    board = board.map(row => row.map(el => el));
  const rows = board.length;
  const cols = board[0].length;
  let row, col, direction, total = 0;

  if(index < rows * ( cols - 1 ) ) {
    // Horizontal Swap
    row = Math.floor(index / ( cols - 1));
    col = index % ( cols - 1);

    row = Math.max(0, row);
    col = Math.max(0, col);

    if(board[row][col] < 0 || board[row][col + 1] < 0)
      return 0;

    direction = "H";

    const tmp = board[row][col];
    board[row][col] = board[row][col + 1];
    board[row][col + 1] = tmp;
  } else {
    // Vertical Swap
    row = Math.floor((index - rows * (cols - 1)) / ( cols ));
    col = index % ( cols );

    row = Math.max(0, row);
    col = Math.max(0, col);

    if(board[row][col] < 0 || board[row + 1][col] < 0)
      return 0;

    direction = "V";

    const tmp = board[row][col];
    board[row][col] = board[row + 1][col];
    board[row + 1][col] = tmp;
  };

  total = _pop(board, row, col);
  if(direction === "H")
    total += _pop(board, row, col + 1);
  else
    total += _pop(board, row + 1, col);

  return total;
};

exports.Game = function() {
  const board = new GenerateBoard(rows, cols);
  const move = (index, real) => _move(board, index, real);

  return {
    board,
    move,
  };
};