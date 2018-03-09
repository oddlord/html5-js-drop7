const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

function canvasInit(){
  canvas.width = gridWidth;
  canvas.height = canvasHeight;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
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

function imageLoadPost(){
  loadedImages++;
  if (loadedImages === images.length){
    startGame();
  }
}

canvasInit();

const images = [];
var loadedImages = 0;
loadImages();
