const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

const cellWidth = 50;
const cellPadding = 2;
const cellColor = '#3A5086';

function getCellOrigin(i, j){
  const x = (i-1)*cellWidth + i*cellPadding;
  const y = j*cellWidth + (j+1)*cellPadding;
  return [x, y];
}

function draw7X7Grid(){
  context.fillStyle = cellColor;

  for (let i = 1; i <= 7; i++){
    for (let j = 1; j <= 7; j++){
      const [x, y] = getCellOrigin(i, j);
      context.fillRect(x, y, cellWidth, cellWidth);
    }
  }
}

function canvasInit(){
  context.imageSmoothingEnabled = false;

  const w = 7*cellWidth + 8*cellPadding;
  canvas.setAttribute('width', w);
  const h = 8*cellWidth + 9*cellPadding;
  canvas.setAttribute('height', h);
}

canvasInit();
draw7X7Grid();

let img = new Image();
img.src = 'img/1piece.png';
img.onload = function(){
  const [x, y] = getCellOrigin(4, 0);
  context.drawImage(img, x, y, cellWidth, cellWidth);
}
