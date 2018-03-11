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
  longestChain = Math.max(longestChain, chain);
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

function checkGameover(){
  let isGameover = false;
  for (let i = 1; i <= 7; i++){
    if (grid[i][0] !== 0){
      isGameover = true;
      break;
    }
  }

  if (isGameover){
    gameover();
  }

  isGameover = true;
  colsLoop: for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      if (grid[i][j] === 0){
        isGameover = false;
        break colsLoop;
      }
    }
  }

  if (isGameover){
    gameover();
  }
}

function nextLevel(){
  level++;
  if (mode === 'blitz'){
    score += 17000;
  } else {
    score += 7000;
  }

  drawLevel();

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
    drawDropCount();
    if(dropCount === 0){
      dropCount = getMaxDrops();
      nextLevel();
      drawDropCount();
    }
  }

  drawDrop();
  drawGrid();

  checkMatches();
  checkEmptyGrid();

  checkGameover();

  if (!isGameover){
    chain = 0;
    if (playerDrop){
      drawScore();
      nextPieceReset();
    }
  }
}

function pieceMove(dir) {
  nextPiece.col = clamp(nextPiece.col + dir, 1, 7);
  drawDrop();
}

function nextPieceReset(){
  nextPiece.col = 4;

  const onlyNumbers = mode === 'blitz' ? true : false;
  nextPiece.piece = getRandomPiece(onlyNumbers);

  drawDrop();
}

function gridReset(){
  const onlyNumbers = mode === 'blitz' ? true : false;
  let piecesToDrop = randomIntFromInterval(minStartingPieces, maxStartingPieces);
  let combinations = getAllDropCombinations(onlyNumbers);
  while (piecesToDrop > 0 && combinations.length > 0){
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
      combinations = getAllDropCombinations(onlyNumbers);
      piecesToDrop--;
    }
  }
}

function resetVars(){
  score = 0;
  chain = 0;
  longestChain = 0;
  dropCount = getMaxDrops();
  level = 1;
}

function mainMenu(){
  inMenu = true;
  inGame = false;
  isGameover = false;

  mainMenuButtonFocused = 0;
  drawMainMenu();
}

function startGame(){
  inMenu = false;
  inGame = true;
  isGameover = false;

  grid = createMatrix(8, 8);
  gridReset();
  resetVars();
  nextPieceReset();

  drawGame();
}

function gameover(){
  inMenu = false;
  inGame = false;
  isGameover = true;

  scores[mode].push(score);

  gameoverButtonFocused = 0;
  drawGameover();
}

function loadingComplete(){
  isLoaded = true;
  mainMenu();
}

document.addEventListener('keydown', event => {
  const keyCode = event.keyCode;

  if (debugMode){
    if (keyCode === 75){  // K (as in "kill")
      gameover();
    }
  }

  if (!isLoaded){
    return;
  }

  if (inMenu){
    if (keyCode === 40 || keyCode === 83){ // S or down arrow
      mainMenuButtonFocused = (mainMenuButtonFocused + 1) % 3;
      drawMainMenu();
    } else if (keyCode === 38 || keyCode === 87){ // W or up arrow
      mainMenuButtonFocused = Math.abs(mainMenuButtonFocused - 1) % 3;
      drawMainMenu();
    } else if (keyCode === 32 || keyCode === 13){ // spacebar or Enter
      if (mainMenuButtonFocused === 0){
        mode = 'classic';
      } else if (mainMenuButtonFocused === 1){
        mode = 'blitz';
      } else if (mainMenuButtonFocused === 2) {
        mode = 'sequence';
      } else {
        throw new Error('Unknown error with button selection.');
      }
      startGame();
    }
  } else if (inGame){
    if (keyCode === 37 || keyCode === 65){  // A or left arrow
      pieceMove(-1);
    } else if (keyCode === 39 || keyCode === 68){ // D or right arrow
      pieceMove(1);
    } else if (keyCode === 40 || keyCode === 83){ // S or down arrow
      pieceDrop(true);
    }
  } else if (isGameover){
    if (keyCode === 40 || keyCode === 83){ // S or down arrow
      gameoverButtonFocused = (gameoverButtonFocused + 1) % 2;
      drawGameover();
    } else if (keyCode === 38 || keyCode === 87){ // W or up arrow
      gameoverButtonFocused = Math.abs(gameoverButtonFocused - 1) % 2;
      drawGameover();
    } else if (keyCode === 32 || keyCode === 13){ // spacebar or Enter
      if (gameoverButtonFocused === 0){
        startGame();
      } else if (gameoverButtonFocused === 1){
        mainMenu();
      } else {
        throw new Error('Unknown error with button selection.');
      }
    }
  }
});

const debugMode = false;

var isLoaded = false;
var inGame = false;
var isGameover = false;
var inMenu = false;

let grid;
const nextPiece = {
  col: 4,
  piece: 0
}
var mode = 'classic';
var score = 0;
const scores = {
  'classic': [],
  'blitz': [],
  'sequence': []
};
var chain = 0;
var longestChain = 0;
var dropCount = getMaxDrops();;
var level = 1;

gameoverButtonFocused = 0;
mainMenuButtonFocused = 0;

loadImages();
