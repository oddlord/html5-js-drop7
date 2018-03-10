// Misc settings ---------------------

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

const maxDropCountsRef = 30;
const classicSequenceDrops = 30;
const blitzDrops = 5;

// Dimensions --------------------

const canvasHScale = 0.9; // WRT document body

const playAreaHScale = 0.8; // WRT canvas height

// All these must sum to 1
const modeHScale = 0.15;    // WRT upper section height
const scoreHScale = 0.6;    // WRT upper section height
const scoreVPadScale = 0.1; // WRT upper section height
const levelHScale = 0.15;   // WRT upper section height

const cellPadScale = 0.033; // WRT cell width

const dropCountPadScale = 0.2;      // WRT drop counter width
const dropCountBorderWScale = 0.1;  // WRT drop counter width

function setDimensions(){
  canvasH = document.body.clientHeight * canvasHScale;

  playAreaH = canvasH * playAreaHScale;
  upperSectionH = canvasH * (1-playAreaHScale);

  cellWH = playAreaH / (8 + cellPadScale*9);
  cellPad = cellWH * cellPadScale;
  gridWH = cellWH*7 + cellPad*8;
  dropH = cellPad + cellWH;

  dropCountWH = gridWH / (maxDropCountsRef + dropCountPadScale*(maxDropCountsRef+1));
  dropCountPad = dropCountWH * dropCountPadScale;
  dropCountBorderW = dropCountWH * dropCountBorderWScale;

  modeH = (upperSectionH-dropCountWH) * modeHScale;
  scoreH = (upperSectionH-dropCountWH) * scoreHScale;
  scoreVPad = (upperSectionH-dropCountWH) * scoreVPadScale;
  levelH = (upperSectionH-dropCountWH) * levelHScale;
}

var canvasH;

var playAreaH;
var upperSectionH;

var cellWH;
var cellPad;
var gridWH;
var dropH;

var dropCountWH;
var dropCountPad;
var dropCountBorderW;

var modeH;
var scoreH;
var scoreVPad;
var levelH;

setDimensions();

// Origins --------------------

function setOrigins(){
  playAreaX = 0;
  playAreaY = upperSectionH;

  upperSectionX = 0;
  upperSectionY = 0;

  gridX = playAreaX + 0;
  gridY = playAreaY + dropH;

  dropX = playAreaX + 0;
  dropY = playAreaY + 0;

  dropCountX = upperSectionX + 0;
  dropCountY = upperSectionY + modeH + scoreH + scoreVPad;

  modeX = upperSectionX + 0;
  modeY = upperSectionY + 0;

  scoreX = upperSectionX + 0;
  scoreY = upperSectionY + modeH;

  levelX = upperSectionX + 0;
  levelY = upperSectionY + modeH + scoreH + scoreVPad + dropCountWH;
}

var playAreaX;
var playAreaY;

var upperSectionX;
var upperSectionY;

var gridX;
var gridY;

var dropX;
var dropY;

var dropCountX;
var dropCountY;

var modeX;
var modeY;

var scoreX;
var scoreY;

var levelX;
var levelY;

setOrigins();
