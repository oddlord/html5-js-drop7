const cellColor = '#28456f';
const backgroundColors = [
  '#488557',  // 1 piece color
  '#b19438',  // 2 piece color
  '#b07b39',  // 3 piece color
  '#a23643',  // 4 piece color
  '#a4528e',  // 5 piece color
  '#3692af',  // 6 piece color
  '#2a5e8b',  // 7 piece color
  '#d8e4ea'   // solid piece color
];

const solidValue = 200;
const crackedValue = 100;

const minStartingPieces = 11;
const maxStartingPieces = 21;

const maxDropCounts = 30;

function applyGravity(){
  for (let i = 1; i <= 7; i++){
    for (let j = 7; j >= 1; j--){
      if (j === 7 || grid[i][j] === 0){
        continue;
      }

      let j2 = j;
      while (j2 < 7){
        if (grid[i][j2+1] === 0){
          j2++;
        } else {
          break;
        }
      }

      if (j !== j2){
        grid[i][j2] = grid[i][j];
        grid[i][j] = 0;
      }
    }
  }

  drawGrid();
  checkMatches();
}

function breakNeighbour(i, j){
  if (grid[i][j] === solidValue){
    grid[i][j] = crackedValue;
  } else if (grid[i][j] === crackedValue){
    grid[i][j] = getRandomPiece(true);
  }
}

function breakNeighbours(i, j){
  if (i > 1){
    breakNeighbour(i-1, j);
  }
  if (i < 7){
    breakNeighbour(i+1, j);
  }
  if (j > 1){
    breakNeighbour(i, j-1);
  }
  if (j < 7){
    breakNeighbour(i, j+1);
  }
}

function isPieceAMatch(i, j){ // check if a piece at given coords is a match
  const piece = grid[i][j];

  let counter = 1;  // vertical check
  for (let j2 = j-1; j2 >= 1; j2--){
    if (grid[i][j2] === 0){
      break;
    }
    counter++;
  }
  for (let j2 = j+1; j2 <= 7; j2++){  // check for empty cells not necessary
    counter++;                        // here because of gravity
  }
  if (counter === piece){
    return true;
  }

  counter = 1;  // horizontal check
  for (let i2 = i-1; i2 >= 1; i2--){
    if (grid[i2][j] === 0){
      break;
    }
    counter++;
  }
  for (let i2 = i+1; i2 <= 7; i2++){
    if (grid[i2][j] === 0){
      break;
    }
    counter++;
  }
  if (counter === piece){
    return true;
  }

  return false;
}

function checkMatches(){
  chain++;
  const matchedPieces = [];

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      const piece = grid[i][j];
      if (piece === 0 || piece === solidValue || piece === crackedValue){
        continue;
      }

      if (isPieceAMatch(i, j)){
        matchedPieces.push({
          i: i,
          j: j
        });
      }
    }
  }

  if (matchedPieces.length > 0){
    for (let matchedPiece of matchedPieces){
      score += Math.floor(7 * (Math.pow(chain, 2.5)));
      grid[matchedPiece.i][matchedPiece.j] = 0;
      breakNeighbours(matchedPiece.i, matchedPiece.j);
    }
    drawGrid();
    applyGravity();
  }
}

function gameOver(){
  gameover = true;
  drawScore();
}

function checkGameOver(){
  let gameover = false;
  for (let i = 1; i <= 7; i++){
    if (grid[i][0] !== 0){
      gameover = true;
      break;
    }
  }

  if (gameover){
    gameOver();
  }

  gameover = true;
  colsLoop: for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      if (grid[i][j] === 0){
        gameover = false;
        break colsLoop;
      }
    }
  }

  if (gameover){
    gameOver();
  }
}

function nextLevel(){
  level++;
  score += 7000;

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      grid[i][j-1] = grid[i][j];
    }
    grid[i][7] = solidValue;
  }
}

function checkEmptyGrid(){
  let emptyGrid = true;
  colsLoop: for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      if (grid[i][j] !== 0){
        emptyGrid = false;
        break colsLoop;
      }
    }
  }

  if (emptyGrid){
    score += 70000;
  }
}

function pieceDrop(playerDrop) {
  if (grid[nextPiece.col][1] !== 0){
    return;
  }

  for (let j = 7; j >= 1; j--){
    if (grid[nextPiece.col][j] === 0){
      grid[nextPiece.col][j] = nextPiece.piece;
      nextPiece.piece = 0;
      break;
    }
  }

  if (playerDrop){
    dropCount--;
    drawDropCounter();
    if(dropCount === 0){
      dropCount = maxDropCounts;
      nextLevel();
      drawDropCounter();
    }
  }

  drawDropSection();
  drawGrid();

  checkGameOver();
  checkMatches();
  checkEmptyGrid();

  if (!gameover){
    chain = 0;
    if (playerDrop){
      drawScore();
      nextPieceReset();
    }
  }
}

function pieceMove(dir) {
  nextPiece.col = clamp(nextPiece.col + dir, 1, 7);
  drawDropSection();
}

function nextPieceReset(){
  nextPiece.col = 4;
  nextPiece.piece = getRandomPiece(false);

  let backgroundColor;
  if (nextPiece.piece === solidValue){
    backgroundColor = backgroundColors[7];
  } else {
    backgroundColor = backgroundColors[nextPiece.piece - 1];
  }
  document.body.style.background = 'linear-gradient(to top right, ' + backgroundColor + ', white)';

  drawDropSection();
}

function gridReset(){
  let piecesToDrop = randomIntFromInterval(minStartingPieces, maxStartingPieces);
  let combinations = getAllDropCombinations();
  while (piecesToDrop > 0 && combinations.length > 0){
    //debugger;
    const combinationIndex = randomIntFromInterval(0, combinations.length-1);

    const gridCopy = createMatrix(grid.length, grid[0].length);
    copyMatrix(grid, gridCopy);

    nextPiece.col = combinations[combinationIndex].col;
    nextPiece.piece = combinations[combinationIndex].piece;
    pieceDrop(false);

    if (score > 0){
      combinations.splice(combinationIndex, 1);
      score = 0;
      copyMatrix(gridCopy, grid);
    } else {
      combinations = getAllDropCombinations();
      piecesToDrop--;
    }
  }
}

function startGame(){
  gameStarted = true;
  gameover = false;

  score = 0;
  chain = 0;
  dropCount = maxDropCounts;
  level = 1;

  drawScore();
  drawDropCounter();

  drawGrid();
  gridReset();
  drawGrid();

  nextPieceReset();
}

document.addEventListener('keydown', event => {
  if (gameover || !gameStarted){
    return;
  }

  const keyCode = event.keyCode;
  if (keyCode === 37 || keyCode === 65){
    pieceMove(-1);
  } else if (keyCode === 39 || keyCode === 68){
    pieceMove(1);
  } else if (keyCode === 40 || keyCode === 83){
    pieceDrop(true);
  }
});

const grid = createMatrix(8, 8);
const nextPiece = {
  col: 4,
  piece: 0
}
var gameStarted = false;
var gameover;
var score;
var chain;
var dropCount;
var level;
