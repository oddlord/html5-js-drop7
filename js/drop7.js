const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

const cellWidth = 50;
const cellPadding = 2;
const cellColor = '#3A5086';

const solidValue = 200;
const crackedValue = 100;

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
        console.log('Applying gravity at '+i+', '+j);
        grid[i][j2] = grid[i][j];
        grid[i][j] = 0;
      }
    }
  }
  drawGrid();
  checkMatches();
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
      drawDropSection()
    }
    images.push(img);
  }

  const solid = new Image();
  solid.src = 'img/solid.png';
  solid.onload = function(){
    drawDropSection()
  }
  images.push(solid);

  const cracked = new Image();
  cracked.src = 'img/cracked.png';
  images.push(cracked);
}

function drawPieceImg(value, i, j){
  const img = getPieceImg(value);
  const [x, y] = getCellOrigin(i, j);
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
  context.imageSmoothingEnabled = false;

  const w = 7*cellWidth + 8*cellPadding;
  canvas.setAttribute('width', w);
  const h = 8*cellWidth + 9*cellPadding;
  canvas.setAttribute('height', h);
}

function getRandomPiece(onlyNumbers){
  let pieces;
  if (onlyNumbers){
    pieces = '1234567';
  } else {
    pieces = '1234567S';
  }

  const piece = pieces[pieces.length * Math.random() | 0];
  let value;
  if (piece === 'S'){
    value = solidValue;
  } else {
    value = parseInt(piece);
  }

  return value;
}

function nextPieceReset(){
  nextPiece.col = 4;
  nextPiece.value = getRandomPiece(false);

  drawDropSection();
}

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

const grid = createMatrix(8, 8);

const nextPiece = {
  col: 4,
  value: 1
}

const images = [];
loadImages();

canvasInit();
drawGrid();
nextPieceReset();
