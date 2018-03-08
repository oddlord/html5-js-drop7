const body = document.body;
const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

const cellWidth = 50;
const cellPadding = 2;
const cellColor = '#3A5086';

const backgroundColors = [
  '#95bad7',
  '#afd8b6',
  '#f6f6f6',
  '#eaa3a9',
  '#f5cfa0'
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
      grid[matchedPiece.i][matchedPiece.j] = 0;
      breakNeighbours(matchedPiece.i, matchedPiece.j);
    }
    drawGrid();
    applyGravity();
  }
}

function nextPieceDrop() {
  const i = nextPiece.col;

  if (grid[i][1] !== 0){
    return;
  }

  for (let j = 7; j >= 1; j--){
    if (grid[i][j] === 0){
      grid[i][j] = nextPiece.value;
      drawGrid();
      nextPieceReset();
      checkMatches();
      break;
    }
  }
}

function nextPieceMove(dir) {
  nextPiece.col = clamp(nextPiece.col + dir, 1, 7);
  drawDropSection();
}

function getCellOrigin(i, j){
  const x = (i-1)*cellWidth + i*cellPadding;
  const y = j*cellWidth + (j+1)*cellPadding;
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
  context.fillStyle = cellColor;
  context.clearRect(0, (cellPadding + cellWidth), (7*cellWidth + 8*cellPadding), (7*cellWidth + 8*cellPadding));

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
  context.clearRect(0, 0, (7*cellWidth + 8*cellPadding), (cellPadding + cellWidth));
  drawPieceImg(nextPiece.value, nextPiece.col, 0);
}

function canvasInit(){

  const w = 7*cellWidth + 8*cellPadding;
  canvas.width = w;
  const h = 8*cellWidth + 9*cellPadding;
  canvas.height = h;

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
  let backgroundColor;
  do {
    backgroundColor = backgroundColors[randomIntFromInterval(0, backgroundColors.length-1)];
  } while (backgroundColor === lastBackground);
  lastBackground = backgroundColor;
  body.style.background = 'linear-gradient(to top right, ' + backgroundColor + ', white)';

  nextPiece.col = 4;
  nextPiece.value = getRandomPiece(false);

  drawDropSection();
}

function gridInit(){
  let piecesToDrop = randomIntFromInterval(minStartingPieces, maxStartingPieces);
  for (; piecesToDrop > 0; piecesToDrop--){
    const piece = getRandomPiece(false);
    let col;
    do {
      col = randomIntFromInterval(1, 7);
    } while (grid[col][1] !== 0);

    for (let j = 7; j >= 1; j--){
      if (grid[col][j] === 0){
        grid[col][j] = piece;
        break;
      }
    }
  }
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
      nextPieceMove(-1);
    } else if (keyCode === 39 || keyCode === 68){
      nextPieceMove(1);
    } else if (keyCode === 40 || keyCode === 83){
      nextPieceDrop();
    }
  });

  gridInit();
  checkMatches();
  drawGrid();
  nextPieceReset();
}

canvasInit();

const grid = createMatrix(8, 8);
const nextPiece = {
  col: 4,
  value: 1
}

let lastBackground = '#fff';

const images = [];
let loadedImages = 0;
loadImages();
