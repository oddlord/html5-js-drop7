var loadingText;
const canvas = document.getElementById('d7-canvas');
const context = canvas.getContext('2d');

function canvasInit(){
  canvas.width = gridWH;
  canvas.height = canvasH;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
}

function startLoading(){
  const loadingImg = new Image();
  loadingImg.src = 'img/' + loadingImgName;
  loadingImg.classList.add('loading-text');
  loadingImg.onload = function(){
    const aligner = document.getElementById('aligner');
    aligner.appendChild(loadingImg);
    loadMedia();
  }
}

function loadMedia(){
  for (let i = 0; i < imagesSrc.length; i++){
    const img = new Image();
    img.src = 'img/' + imagesSrc[i];
    images[imagesSrc[i]] = img;
    img.onload = function(){
      loadPost();
    }
  }

  for (let i = 0; i < audiosSrc.length; i++){
    const audio = new Audio('audio/' + audiosSrc[i].src);
    audios[audiosSrc[i].src] = audio;
    audio.addEventListener('canplaythrough', function() {
      loadPost();
    }, false);
    if (audiosSrc[i].loop){
      audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }
  }
}

function loadPost(){
  loadedObjects++;
  if (loadedObjects === (Object.keys(imagesSrc).length + Object.keys(audiosSrc).length)){
    loadingComplete();
  }
}

canvasInit();

const imagesSrc = [
  numberedPiecesImgNames[0],
  numberedPiecesImgNames[1],
  numberedPiecesImgNames[2],
  numberedPiecesImgNames[3],
  numberedPiecesImgNames[4],
  numberedPiecesImgNames[5],
  numberedPiecesImgNames[6],
  solidImgName,
  crackedImgName,
  drop7BlueImgName,
  drop7GreyImgName,
  gameoverImgName,
  avgScoreUpImgName,
  avgScoreDownImgName
]

const audiosSrc = [
  explosionAudioName,
  musicAudioName
]

const images = {};
const audios = {};

var loadedObjects = 0;
