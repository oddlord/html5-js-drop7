'use strict';

var canvas = document.getElementById('d7-canvas');
var context = canvas.getContext('2d');

function canvasInit() {
  canvas.width = gridWH;
  canvas.height = canvasH;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
}

function loadImages() {
  for (var i = 0; i < imagesSrc.length; i++) {
    var img = new Image();
    img.src = 'img/' + imagesSrc[i];
    images[imagesSrc[i]] = img;
  }

  for (var imgName in images) {
    images[imgName].onload = function () {
      imageLoadPost();
    };
  }
}

function imageLoadPost() {
  loadedImages++;
  if (loadedImages === Object.keys(images).length) {
    loadingComplete();
  }
}

canvasInit();

var imagesSrc = [numberedPiecesImgNames[0], numberedPiecesImgNames[1], numberedPiecesImgNames[2], numberedPiecesImgNames[3], numberedPiecesImgNames[4], numberedPiecesImgNames[5], numberedPiecesImgNames[6], solidImgName, crackedImgName, drop7BlueImgName, drop7GreyImgName, gameoverImgName, avgScoreUpImgName, avgScoreDownImgName];

var images = {};
var loadedImages = 0;