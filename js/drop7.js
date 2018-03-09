const body = document.body;
const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

const canvasHeightScale = 0.9;
const gridDropHeightScale = 0.8;
const cellPaddingScale = 0.033;
const scoreHeightScale = 0.6;

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
  const value = grid[i][j];

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
  if (counter === value){
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
  if (counter === value){
    return true;
  }

  return false;
}

function checkMatches(){
  chain++;
  const matchedPieces = [];

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      const value = grid[i][j];
      if (value === 0 || value === solidValue || value === crackedValue){
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

function pieceDrop() {
  if (grid[nextPiece.col][1] !== 0){
    return;
  }

  for (let j = 7; j >= 1; j--){
    if (grid[nextPiece.col][j] === 0){
      grid[nextPiece.col][j] = nextPiece.value;
      drawGrid();
      checkMatches();
      nextPieceReset();
      break;
    }
  }
}

function pieceMove(dir) {
  nextPiece.col = clamp(nextPiece.col + dir, 1, 7);
  drawDropSection();
}

function getCellOrigin(i, j){
  const x = (i-1)*cellWidth + i*cellPadding;
  const y = upperSectionHeight + j*cellWidth + (j+1)*cellPadding;
  return [x, y];
}

function getPieceImg(value){
  if (value >= 1 && value <= 7){
    return images[value-1];
  } else if (value === solidValue){
    return images[7];
  } else if (value === crackedValue){
    return images[8];
  } else {
    throw new Error('Invalid piece of value ' + value);
  }
}

function loadImages(){
  for (let i = 1; i <= 7; i++){
    let img = new Image();
    img.src = 'img/' + i + 'piece.png';
    img.onload = function(){
      imageLoadPost();
    }
    images.push(img);
  }

  const solid = new Image();
  solid.src = 'img/solid.png';
  solid.onload = function(){
    imageLoadPost();
  }
  images.push(solid);

  const cracked = new Image();
  cracked.src = 'img/cracked.png';
  cracked.onload = function(){
    imageLoadPost();
  }
  images.push(cracked);
}

function drawPieceImg(value, i, j){
  const img = getPieceImg(value);
  const [x, y] = getCellOrigin(i, j);

  // if image resolution is still not enough, consider step down resizing
  // as explained here
  // https://stackoverflow.com/questions/18761404/how-to-scale-images-on-a-html5-canvas-with-better-interpolation
  // and here
  // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing

  context.drawImage(img, x, y, cellWidth, cellWidth);
}

function drawGrid(){
  context.clearRect(0, upperSectionHeight + dropSectionHeight, gridWidth, gridWidth);

  context.fillStyle = cellColor;
  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      const [x, y] = getCellOrigin(i, j);
      context.fillRect(x, y, cellWidth, cellWidth);

      const value = grid[i][j];
      if (value !== 0){
        drawPieceImg(value, i, j);
      }
    }
  }
}

function drawDropSection(){
  context.clearRect(0, upperSectionHeight, gridWidth, dropSectionHeight);
  drawPieceImg(nextPiece.value, nextPiece.col, 0);
}

function canvasInit(){

  canvas.width = gridWidth;
  canvas.height = canvasHeight;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
}

function getRandomPiece(onlyNumbers){
  let max = 8;
  if (onlyNumbers){
    max = 7;
  }

  let piece = randomIntFromInterval(1, max);
  piece = piece === 8 ? solidValue : piece;

  return piece;
}

function nextPieceReset(){
  chain = 0;
  scoreUpdate();

  nextPiece.col = 4;
  nextPiece.value = getRandomPiece(false);

  let backgroundColor;
  if (nextPiece.value === solidValue){
    backgroundColor = backgroundColors[7];
  } else {
    backgroundColor = backgroundColors[nextPiece.value - 1];
  }
  body.style.background = 'linear-gradient(to top right, ' + backgroundColor + ', white)';

  drawDropSection();
}

function createAllDropCombinations(){
  const combinations = [];

  for (let piece = 1; piece <= 8; piece++){
    for (let col = 1; col <= 7; col++){
      combinations.push({
        col: col,
        value: piece === 8 ? solidValue : piece
      });
    }
  }

  return combinations;
}

function gridInit(){
  let piecesToDrop = randomIntFromInterval(minStartingPieces, maxStartingPieces);
  let combinations = createAllDropCombinations();
  while (piecesToDrop > 0 && combinations.length > 0){
    const combinationIndex = randomIntFromInterval(0, combinations.length-1);

    const gridCopy = createMatrix(grid.length, grid[0].length);
    copyMatrix(grid, gridCopy);

    nextPiece.col = combinations[combinationIndex].col;
    nextPiece.value = combinations[combinationIndex].value;
    pieceDrop();

    if (score > 0){
      combinations.splice(combinationIndex, 1);
      score = 0;
      copyMatrix(gridCopy, grid);
    } else {
      combinations = createAllDropCombinations();
      piecesToDrop--;
    }
  }
}

function scoreUpdate(){
  context.clearRect(0, 0, gridWidth, scoreHeight);
  context.font = scoreHeight + 'px Arial';
  context.fillStyle = cellColor;
  context.textAlign = 'center';
  context.textBaseline = 'top'
  context.fillText(score, gridWidth/2, 0);
}

function imageLoadPost(){
  loadedImages++;
  if (loadedImages === images.length){
    startGame();
  }
}

function startGame(){
  document.addEventListener('keydown', event => {
    const keyCode = event.keyCode;
    if (keyCode === 37 || keyCode === 65){
      pieceMove(-1);
    } else if (keyCode === 39 || keyCode === 68){
      pieceMove(1);
    } else if (keyCode === 40 || keyCode === 83){
      pieceDrop();
    }
  });

  gridInit();
  nextPieceReset();
  drawGrid();
}

function setDimensions(){
  canvasHeight = body.clientHeight * canvasHeightScale;
  gridDropHeight = canvasHeight * gridDropHeightScale;
  upperSectionHeight = canvasHeight * (1-gridDropHeightScale);

  cellWidth = gridDropHeight / (8 + cellPaddingScale*9);
  cellPadding = cellWidth * cellPaddingScale;

  gridWidth = cellWidth*7 + cellPadding*8;
  dropSectionHeight = cellPadding + cellWidth;

  dropCounterWidth = gridWidth / 30;
  scoreHeight = (upperSectionHeight - dropCounterWidth) * scoreHeightScale;
  levelHeight = (upperSectionHeight - dropCounterWidth) * (1-scoreHeightScale);
}

var canvasHeight;
var gridDropHeight;
var upperSectionHeight;

var cellWidth;
var cellPadding;

var gridWidth;
var dropSectionHeight;

var dropCounterWidth;
var scoreHeight;
var levelHeight;

setDimensions();
canvasInit();

const grid = createMatrix(8, 8);
const nextPiece = {
  col: 4,
  value: 1
}
let score = 0;
let chain = 0;

const images = [];
var loadedImages = 0;
loadImages();
