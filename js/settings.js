// Misc settings ---------------------
const cellBlue = '#284c7c';  // used for grid cells
const darkBlue = '#223f5f';   // used for text and other elements
const lightBlue = '#3a84c1';  // used for gameover BG
const buttonGreen = '#65be7a' // used for buttons
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

// Images names ------------------
const piecesImgNames = [
  '1piece.png',
  '2piece.png',
  '3piece.png',
  '4piece.png',
  '5piece.png',
  '6piece.png',
  '7piece.png'
];
const solidImgName = 'solid.png';
const crackedImgName = 'cracked.png';
const gameoverImgName = 'gameover.png';

// Dimensions --------------------
const canvasHScale = 0.9; // WRT document body

const playAreaHScale = 0.75; // WRT canvas height

// All these must sum to 1
const modeHScale = 0.15;    // WRT upper section height
const scoreHScale = 0.5;    // WRT upper section height
const scoreVPadScale = 0.2; // WRT upper section height
const levelHScale = 0.15;   // WRT upper section height

const cellPadScale = 0.033; // WRT cell width

const dropCountPadScale = 0.2;      // WRT drop counter width
const dropCountBorderWScale = 0.1;  // WRT drop counter width

// All these must sum to 1
const gameoverScoreTextHScale = 0.05;   // WTR gameover lower section height
const gameoverScoreHScale = 0.15;       // WTR gameover lower section height
const gameoverScoreVPadScale = 0.1;     // WTR gameover lower section height
const gameoverStatsHScale = 0.2;        // WTR gameover lower section height
const gameoverStatsVPadScale = 0.1;     // WTR gameover lower section height
const gameoverButtonsHScale = 0.35;     // WTR gameover lower section height
const gameoverButtonsVPadScale = 0.05;  // WTR gameover lower section height

const gameoverStatPadScale = 0.4; // WRT gameover stat height

const gameoverButtonWScale = 3;                 // WRT gameover button height
const gameoverButtonPadScale = 0.4;             // WRT gameover button height
const gameoverButtonTextHScale = 0.3;           // WRT gameover button height
const gameoverButtonBorderWScale = 0.025;       // WRT gameover button height
const gameoverButtonBorderFocusedWScale = 0.1;  // WRT gameover button height

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

  gameoverImgNonWritableH = (500/1080)*gridWH;
  gameoverLowerSectionH = canvasH - gameoverImgNonWritableH;

  gameoverScoreTextH = gameoverLowerSectionH * gameoverScoreTextHScale;
  gameoverScoreH = gameoverLowerSectionH * gameoverScoreHScale;
  gameoverScoreVPad = gameoverLowerSectionH * gameoverScoreVPadScale;
  gameoverStatsH = gameoverLowerSectionH * gameoverStatsHScale;
  gameoverStatsVPad = gameoverLowerSectionH * gameoverStatsVPadScale;
  gameoverButtonsH = gameoverLowerSectionH * gameoverButtonsHScale;

  gameoverStatH = gameoverStatsH / (3 + 2*gameoverStatPadScale);
  gameoverStatPad = gameoverStatH * gameoverStatPadScale;

  gameoverButtonH = gameoverButtonsH / (2 + gameoverButtonPadScale);
  gameoverButtonW = gameoverButtonH * gameoverButtonWScale;
  gameoverButtonPad = gameoverButtonH * gameoverButtonPadScale;
  gameoverButtonTextH = gameoverButtonH * gameoverButtonTextHScale;
  gameoverButtonBorderW = gameoverButtonH * gameoverButtonBorderWScale;
  gameoverButtonBorderFocusedW = gameoverButtonH * gameoverButtonBorderFocusedWScale;
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

var gameoverImgNonWritableH;
var gameoverLowerSectionH;

var gameoverScoreTextH;
var gameoverScoreH;
var gameoverScoreVPad;
var gameoverStatsH;
var gameoverStatsVPad;
var gameoverButtonsH;

var gameoverStatH;
var gameoverStatPad;

var gameoverButtonH;
var gameoverButtonW;
var gameoverButtonPad;
var gameoverButtonTextH;
var gameoverButtonBorderW;
var gameoverButtonBorderFocusedW;

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

  gameoverX = 0;
  gameoverY = 0;

  gameoverScoreTextX = gameoverX + 0;
  gameoverScoreTextY = gameoverY + gameoverImgNonWritableH + 0;

  gameoverScoreX = gameoverX + 0;
  gameoverScoreY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH + 0;

  gameoverStatsX = gameoverX + 0;
  gameoverStatsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH +
                   gameoverScoreH + gameoverScoreVPad + 0;

  gameoverButtonsX = gameoverX + 0;
  gameoverButtonsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH +
                     gameoverScoreH + gameoverScoreVPad + gameoverStatsH +
                     gameoverStatsVPad + 0;

  gameoverStatModeX = gameoverStatsX + 0;
  gameoverStatModeY = gameoverStatsY + 0;

  gameoverStatChainX = gameoverStatsX + 0;
  gameoverStatChainY = gameoverStatsY + gameoverStatH + gameoverStatPad;

  gameoverStatLevelX = gameoverStatsX + 0;
  gameoverStatLevelY = gameoverStatsY + 2*gameoverStatH + 2*gameoverStatPad;

  gameoverButtonPlayX = gameoverButtonsX + gridWH/2 - gameoverButtonW/2;
  gameoverButtonPlayY = gameoverButtonsY;

  gameoverButtonMenuX = gameoverButtonsX + gridWH/2 - gameoverButtonW/2;
  gameoverButtonMenuY = gameoverButtonsY + gameoverButtonH + gameoverButtonPad;
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

var gameoverX;
var gameoverY;

var gameoverScoreTextX;
var gameoverScoreTextY;

var gameoverScoreX;
var gameoverScoreY;

var gameoverStatsX;
var gameoverStatsY;

var gameoverButtonsX;
var gameoverButtonsY;

var gameoverStatModeX;
var gameoverStatModeY;

var gameoverStatChainX;
var gameoverStatChainY;

var gameoverStatLevelX;
var gameoverStatLevelY;

var gameoverButtonPlayX;
var gameoverButtonPlayY;

var gameoverButtonMenuX;
var gameoverButtonMenuY;

setOrigins();
