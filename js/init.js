const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

function canvasInit(){
  canvas.width = gridWH;
  canvas.height = canvasH;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
}

function loadImages(){
  for (let i = 0; i < imagesSrc.length; i++){
    const img = new Image();
    img.src = 'img/' + imagesSrc[i];
    images[imagesSrc[i]] = img;
  }

  for (let imgName in images){
    images[imgName].onload = function(){
      imageLoadPost();
    }
  }
}

function imageLoadPost(){
  loadedImages++;
  if (loadedImages === Object.keys(images).length){
    loadingComplete();
  }
}

canvasInit();

const imagesSrc = [
  piecesImgNames[0],
  piecesImgNames[1],
  piecesImgNames[2],
  piecesImgNames[3],
  piecesImgNames[4],
  piecesImgNames[5],
  piecesImgNames[6],
  solidImgName,
  crackedImgName,
  gameoverImgName,
  avgScoreUpImgName,
  avgScoreDownImgName
]

const images = {};
var loadedImages = 0;
