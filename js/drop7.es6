function applyGravity(){
  let noPieceFell = true;

  for (let i = 1; i <= 7; i++){
    for (let j = 7; j >= 0; j--){
      if (j === 7 || grid[i][j] === null){
        continue;
      }

      let j2 = j;
      while (j2 < 7){
        if (grid[i][j2+1] === null){
          j2++;
        } else {
          break;
        }
      }

      if (j !== j2){
        noPieceFell = false;
        const piece = grid[i][j];
        fallAnimStart(piece, i, j, j2);
      }
    }
  }

  if (noPieceFell){
    checkMatches();
  }
}

function breakNeighbour(i, j){
  const piece = grid[i][j];
  if (piece !== null && piece.isCrackable()){
    grid[i][j] = piece.crack();
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

function isNumberedPieceAMatch(i, j){ // check if a piece at given coords is a match
  const piece = grid[i][j];

  let counter = 1;  // vertical check
  for (let j2 = j-1; j2 >= 1; j2--){
    if (grid[i][j2] === null){
      break;
    }
    counter++;
  }
  for (let j2 = j+1; j2 <= 7; j2++){  // check for empty cells not necessary
    counter++;                        // here because of gravity
  }
  if (counter === piece.number){
    return true;
  }

  counter = 1;  // horizontal check
  for (let i2 = i-1; i2 >= 1; i2--){
    if (grid[i2][j] === null){
      break;
    }
    counter++;
  }
  for (let i2 = i+1; i2 <= 7; i2++){
    if (grid[i2][j] === null){
      break;
    }
    counter++;
  }
  if (counter === piece.number){
    return true;
  }

  return false;
}

function checkMatches(){
  const matchedPieces = [];

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      const piece = grid[i][j];
      if (piece === null || !piece.isNumbered()){
        continue;
      }

      if (isNumberedPieceAMatch(i, j)){
        matchedPieces.push({
          piece: piece,
          i: i,
          j: j
        });
      }
    }
  }

  if (matchedPieces.length > 0){
    chain++;
    longestChain = Math.max(longestChain, chain);
    const matchPoints = Math.floor(7 * (Math.pow(chain, 2.5)));
    explosionAnimStart(matchedPieces, matchPoints);
  } else {
    if (playerAction){
      if (dropCount === 0){
        nextLevelPre();
      } else {
        dropSequenceDone();
      }
    }
  }
}

function checkGameover(){
  let isGameover = false;       // check if gameover because of pieces overflow
  for (let i = 1; i <= 7; i++){ // after a new level
    if (grid[i][0] !== null){
      isGameover = true;
      break;
    }
  }

  if (isGameover){
    gameover();
  }

  isGameover = true;                      // check if gameover because full grid
  colsLoop: for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      if (grid[i][j] === null){
        isGameover = false;
        break colsLoop;
      }
    }
  }

  if (isGameover){
    gameover();
  }
}

function nextLevelPre(){
  let points;
  if (mode === 'blitz'){
    points = 17000;
  } else {
    points = 7000;
  }

  nextLevelAnimStart(points);
}

function nextLevelPost(points){
  level++;
  score += points;

  dropCount = getMaxDrops();
  drawDropCount();

  drawLevel();

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      grid[i][j-1] = grid[i][j];
    }
    if (mode === 'sequence'){
      grid[i][7] = sequenceEmerging[i-1];
    } else{
      grid[i][7] = SolidPiece.getRandomSolidPiece();
    }
  }

  drawGrid();

  checkMatches();
}

function checkBoardClearPre(){
  let emptyGrid = true;
  colsLoop: for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      if (grid[i][j] !== null){
        emptyGrid = false;
        break colsLoop;
      }
    }
  }

  if (emptyGrid){
    boardClearAnimStart();
  }
}

function checkBoardClearPost(){
  score += 70000;
  drawGame();
}

function dropSequenceDone(){
  drawDrop();
  drawGrid();

  checkBoardClearPre();

  checkGameover();

  if (!isGameover){
    chain = 0;
    if (playerAction){
      drawScore();
      nextPieceReset();
    }
  }
}

function pieceDrop() {
  if (nextPiece.piece === null){
    return;
  }

  if (grid[nextPiece.col][1] !== null){
    return;
  }

  for (let j = 7; j >= 1; j--){
    if (grid[nextPiece.col][j] === null){
      const piece = nextPiece.piece;
      const i = nextPiece.col;
      nextPiece.piece = null;

      dropCount--;
      drawDropCount();
      fallAnimStart(piece, i, 0, j);

      break;
    }
  }
}

function pieceMove(dir) {
  if (nextPiece.piece === null){
    return;
  }

  nextPiece.col = clamp(nextPiece.col + dir, 1, 7);
  drawDrop();
}

function nextPieceReset(){
  nextPiece.col = 4;

  if (mode === 'classic'){
    nextPiece.piece = Piece.getRandomPiece();
  } else if (mode === 'blitz'){
    nextPiece.piece = NumberedPiece.getRandomNumberedPiece();
  } else if (mode === 'sequence'){
    nextPiece.piece = sequenceDrops[sequenceNextPiece];
    sequenceNextPiece = (sequenceNextPiece + 1) % 30;
  }

  drawDrop();
}

function gridReset(){
  if (mode === 'sequence'){
    for (let i = 1; i <= 7; i++){
      grid[i][7] = sequenceEmerging[i-1];
    }
    return;
  }

  const onlyNumbers = mode === 'blitz' ? true : false;
  let piecesToDrop = randomIntFromInterval(minStartingPieces, maxStartingPieces);
  let combinations = getAllDropCombinations(onlyNumbers);

  while (piecesToDrop > 0 && combinations.length > 0){
    const combinationIndex = randomIntFromInterval(0, combinations.length-1);

    const gridCopy = createMatrix(grid.length, grid[0].length, null);
    copyMatrix(grid, gridCopy);

    nextPiece.col = combinations[combinationIndex].col;
    nextPiece.piece = combinations[combinationIndex].piece;
    pieceDrop();

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

  sequenceNextPiece = 0;

  fallingPieces = 0;
  explodingPieces = 0;
  animatingNextLevel = false;
  animatingBoardClear = false;
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

  grid = createMatrix(8, 8, null);
  playerAction = false;
  gridReset();
  playerAction = true;
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
  loadingText.style.display = 'none';
  canvas.style.display = 'block';
  isLoaded = true;
  playAudio(musicAudioName);
  mainMenu();
}

document.addEventListener('keydown', event => {
  const keyCode = event.keyCode;

  if (debugMode){
    if (keyCode === 75){  // K (as in "kill")
      gameover();
    } else if (keyCode === 66){ // B (as in "board clear")
      grid = createMatrix(8, 8, null);
      checkBoardClearPre();
    }
  }

  if (!isLoaded || inAnimation()){
    return;
  }

  const unknownButtonPressedStr = 'Unknown error with button selection.';

  if (pause){
    if (keyCode === 40 || keyCode === 83){ // S or down arrow
      if (inMenu){
        pauseButtonFocused = ((pauseButtonFocused-2 + 1) % 2) + 2;
      } else if (inGame){
        pauseButtonFocused = (pauseButtonFocused + 1) % 4;
      }
      drawPauseMenu();
    } else if (keyCode === 38 || keyCode === 87){ // W or up arrow
      if (inMenu){
        pauseButtonFocused = (Math.abs(pauseButtonFocused-2 - 1) % 2) + 2;
      } else if (inGame){
        pauseButtonFocused = pauseButtonFocused - 1;
        pauseButtonFocused = pauseButtonFocused >= 0 ? pauseButtonFocused : 4 + pauseButtonFocused;
        pauseButtonFocused = (pauseButtonFocused) % 4;
      }
      drawPauseMenu();
    } else if (keyCode === 32 || keyCode === 13){ // spacebar or Enter
      if (pauseButtonFocused === 0){
        pause = false;
        startGame();
      } else if (pauseButtonFocused === 1){
        pause = false;
        mainMenu();
      } else if (pauseButtonFocused === 2){
        musicEnabled = !musicEnabled;

        if (musicEnabled){
          playAudio(musicAudioName);
        } else {
          pauseAudio(musicAudioName);
        }

        drawPauseMenu();
      } else if (pauseButtonFocused === 3){
        soundEnabled = !soundEnabled;
        drawPauseMenu();
      } else {
        throw new Error(unknownButtonPressedStr);
      }
    } else if(keyCode === 27){ // ESC key
      pause = false;
      if (inMenu){
        drawMainMenu();
      } else if (inGame){
        drawGame();
      }
    }

    return;
  }

  if ((inMenu || inGame) && !pause){
    if(keyCode === 27){ // ESC key
      pause = true;
      if (inMenu){
        pauseButtonFocused = 2;
      } else if (inGame){
        pauseButtonFocused = 0;
      }
      drawPauseMenu();
    }
  }

  if (inMenu){
    if (keyCode === 40 || keyCode === 83){ // S or down arrow
      mainMenuButtonFocused = (mainMenuButtonFocused + 1) % 3;
      drawMainMenu();
    } else if (keyCode === 38 || keyCode === 87){ // W or up arrow
      mainMenuButtonFocused = mainMenuButtonFocused - 1;
      mainMenuButtonFocused = mainMenuButtonFocused >= 0 ? mainMenuButtonFocused : 3 + mainMenuButtonFocused;
      mainMenuButtonFocused = (mainMenuButtonFocused) % 3;
      drawMainMenu();
    } else if (keyCode === 32 || keyCode === 13){ // spacebar or Enter
      if (mainMenuButtonFocused === 0){
        mode = 'classic';
      } else if (mainMenuButtonFocused === 1){
        mode = 'blitz';
      } else if (mainMenuButtonFocused === 2) {
        mode = 'sequence';
      } else {
        throw new Error(unknownButtonPressedStr);
      }
      startGame();
    }
  } else if (inGame){
    if (keyCode === 37 || keyCode === 65){  // A or left arrow
      pieceMove(-1);
    } else if (keyCode === 39 || keyCode === 68){ // D or right arrow
      pieceMove(1);
    } else if (keyCode === 40 || keyCode === 83){ // S or down arrow
      pieceDrop();
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
        throw new Error(unknownButtonPressedStr);
      }
    }
  }
});

const debugMode = false;

var isLoaded = false;
var inGame = false;
var isGameover = false;
var inMenu = false;

var pause = false;
var musicEnabled = true;
var soundEnabled = true;

var playerAction = false;

let grid;
const nextPiece = {
  col: 4,
  piece: null
}
var mode = 'classic';

var score = 0;
var chain = 0;
var longestChain = 0;
var dropCount = getMaxDrops();;
var level = 1;

const scores = {
  'classic': [],
  'blitz': [],
  'sequence': []
};

let gameoverButtonFocused = 0;
let mainMenuButtonFocused = 0;
let pauseButtonFocused = 0;

var sequenceNextPiece = 0;
const sequenceDrops = [
  np(2), np(1), np(1), sp(6), np(4), np(5), sp(5), sp(5), sp(1), np(6), np(1),
  np(5), np(7), np(5), np(3), np(6), np(3), sp(2), np(6), sp(4), np(2), np(5),
  np(7), np(1), sp(2), np(5), sp(1), sp(3), sp(2), np(4)
];
const sequenceEmerging = [sp(6), sp(4), sp(5), sp(7), sp(5), sp(1), sp(3)];

var fallingPieces = 0;
var explodingPieces = 0;
var animatingNextLevel = false;
var animatingBoardClear = false;

startLoading();
