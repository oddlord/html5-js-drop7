// Misc settings ---------------------
const cellBlue = '#284c7c';         // used for grid cells
const darkBlue = '#223f5f';         // used for text and other elements
const lightBlue = '#3a84c1';        // used for gameover BG
const newHighscoreBlue = '#57cbf0'; // used for the "New Highscore" text
const buttonGreen = '#65be7a';      // used for buttons
const bgNumberedColors = [          // used for game BG (depends on current piece)
  '#488557',  // 1 piece color
  '#b19438',  // 2 piece color
  '#b07b39',  // 3 piece color
  '#a23643',  // 4 piece color
  '#a4528e',  // 5 piece color
  '#3692af',  // 6 piece color
  '#2a5e8b'   // 7 piece color
];
const bgSolidColor = '#d8e4ea'; // solid piece color

const solidValue = 200;
const crackedValue = 100;

const minStartingPieces = 11;
const maxStartingPieces = 21;

const classicSequenceDrops = 30;
const blitzDrops = 5;
const maxDropCountsRef = Math.max(classicSequenceDrops, blitzDrops);

// Images names ------------------
const numberedPiecesImgNames = [
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
const avgScoreUpImgName = 'avg-score-up.png';
const avgScoreDownImgName = 'avg-score-down.png';

// Dimensions --------------------
const canvasHScale = 0.9; // WRT document body

const playAreaHScale = 0.75; // WRT canvas height

// All these must sum to 1
const modeBestHScale = 0.25;    // WRT upper section height
const scoreHScale = 0.45;    // WRT upper section height
const scoreVPadScale = 0.15; // WRT upper section height
const levelHScale = 0.15;   // WRT upper section height

const cellPadScale = 0.033; // WRT cell width

const dropCountPadScale = 0.2;      // WRT drop counter width
const dropCountBorderWScale = 0.1;  // WRT drop counter width

const modeBestWScale = 0.35; // WRT grid width

// All these must sum to 1
const gameoverScoreTextHScale = 0.05;   // WTR gameover lower section height
const gameoverScoreHScale = 0.15;       // WTR gameover lower section height
const gameoverScoreNewHScale = 0.05;    // WTR gameover lower section height
const gameoverScoreVPadScale = 0.05;    // WTR gameover lower section height
const gameoverStatsHScale = 0.25;       // WTR gameover lower section height
const gameoverStatsVPadScale = 0.1;     // WTR gameover lower section height
const gameoverButtonsHScale = 0.3;      // WTR gameover lower section height
const gameoverButtonsVPadScale = 0.05;  // WTR gameover lower section height

const gameoverStatPadScale = 0.4; // WRT gameover stat height

const buttonWScale = 4;                 // WRT button height
const buttonTextHScale = 0.4;           // WRT button height
const buttonBorderWScale = 0.025;       // WRT button height
const buttonBorderFocusedWScale = 0.1;  // WRT button height

const gameoverButtonPadScale = 0.4; // WRT button height

const mainMenuUpperVPadScale = 0.2; // WRT canvas height

const mainMenuHighscoreHScale = 0.35;  // WRT button height
const mainMenuButtonPadScale = 0.4;   // WRT button height

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

  modeBestH = (upperSectionH-dropCountWH) * modeBestHScale;
  scoreH = (upperSectionH-dropCountWH) * scoreHScale;
  scoreVPad = (upperSectionH-dropCountWH) * scoreVPadScale;
  levelH = (upperSectionH-dropCountWH) * levelHScale;

  modeBestW = gridWH * modeBestWScale;
  modeBestTextH = modeBestH / 2;

  gameoverImgNonWritableH = (450/1080)*gridWH;
  gameoverLowerSectionH = canvasH - gameoverImgNonWritableH;

  gameoverScoreTextH = gameoverLowerSectionH * gameoverScoreTextHScale;
  gameoverScoreH = gameoverLowerSectionH * gameoverScoreHScale;
  gameoverScoreNewH = gameoverLowerSectionH * gameoverScoreNewHScale;
  gameoverScoreVPad = gameoverLowerSectionH * gameoverScoreVPadScale;
  gameoverStatsH = gameoverLowerSectionH * gameoverStatsHScale;
  gameoverStatsVPad = gameoverLowerSectionH * gameoverStatsVPadScale;
  gameoverButtonsH = gameoverLowerSectionH * gameoverButtonsHScale;

  gameoverStatH = gameoverStatsH / (5 + 3*gameoverStatPadScale);
  gameoverStatPad = gameoverStatH * gameoverStatPadScale;

  buttonH = gameoverButtonsH / (2 + gameoverButtonPadScale);
  buttonW = buttonH * buttonWScale;
  buttonTextH = buttonH * buttonTextHScale;
  buttonBorderW = buttonH * buttonBorderWScale;
  buttonBorderFocusedW = buttonH * buttonBorderFocusedWScale;

  gameoverButtonPad = buttonH * gameoverButtonPadScale;

  mainMenuUpperVPad = canvasH * mainMenuUpperVPadScale;

  mainMenuHighscoreH = buttonH * mainMenuHighscoreHScale;
  mainMenuButtonPad = buttonH * mainMenuButtonPadScale;
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

var modeBestH;
var scoreH;
var scoreVPad;
var levelH;

var modeBestW;
var modeBestTextH;

var gameoverImgNonWritableH;
var gameoverLowerSectionH;

var gameoverScoreTextH;
var gameoverScoreH;
var gameoverScoreNewH;
var gameoverScoreVPad;
var gameoverStatsH;
var gameoverStatsVPad;
var gameoverButtonsH;

var gameoverStatH;
var gameoverStatPad;

var buttonH;
var buttonW;
var buttonTextH;
var buttonBorderW;
var buttonBorderFocusedW;

var gameoverButtonPad;

var mainMenuUpperVPad;

var mainMenuHighscoreH;
var mainMenuButtonPad;

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
  dropCountY = upperSectionY + modeBestH + scoreH + scoreVPad;

  modeBestX = upperSectionX + (gridWH - modeBestW);
  modeBestY = upperSectionY + 0;

  scoreX = upperSectionX + 0;
  scoreY = upperSectionY + modeBestH;

  levelX = upperSectionX + 0;
  levelY = upperSectionY + modeBestH + scoreH + scoreVPad + dropCountWH;

  modeX = modeBestX + 0;
  modeY = modeBestY + 0;

  bestX = modeBestX + 0;
  bestY = modeBestY + modeBestTextH;

  gameoverX = 0;
  gameoverY = 0;

  gameoverScoreTextX = gameoverX + 0;
  gameoverScoreTextY = gameoverY + gameoverImgNonWritableH + 0;

  gameoverScoreX = gameoverX + 0;
  gameoverScoreY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH + 0;

  gameoverScoreNewX = gameoverX + 0;
  gameoverScoreNewY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH +
                      gameoverScoreH + 0;

  gameoverStatsX = gameoverX + 0;
  gameoverStatsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH +
                   gameoverScoreH + gameoverScoreNewH + gameoverScoreVPad + 0;

  gameoverButtonsX = gameoverX + 0;
  gameoverButtonsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH +
                     gameoverScoreH + gameoverScoreNewH + gameoverScoreVPad +
                     gameoverStatsH + gameoverStatsVPad + 0;

  gameoverStatModeX = gameoverStatsX + 0;
  gameoverStatModeY = gameoverStatsY + 0;

  gameoverStatChainX = gameoverStatsX + 0;
  gameoverStatChainY = gameoverStatsY + gameoverStatH + gameoverStatPad;

  gameoverStatLevelX = gameoverStatsX + 0;
  gameoverStatLevelY = gameoverStatsY + 2*gameoverStatH + 2*gameoverStatPad;

  gameoverStatPrevScoreX = gameoverStatsX + 0;
  gameoverStatPrevScoreY = gameoverStatsY + 3*gameoverStatH + 3*gameoverStatPad;

  gameoverStatNewScoreX = gameoverStatsX + 0;
  gameoverStatNewScoreY = gameoverStatsY + 4*gameoverStatH + 4*gameoverStatPad;

  gameoverButtonPlayX = gameoverButtonsX + gridWH/2 - buttonW/2;
  gameoverButtonPlayY = gameoverButtonsY;

  gameoverButtonMenuX = gameoverButtonsX + gridWH/2 - buttonW/2;
  gameoverButtonMenuY = gameoverButtonsY + buttonH + gameoverButtonPad;

  mainMenuButtonsX = 0;
  mainMenuButtonsY = mainMenuUpperVPad + 0;

  mainMenuButtonClassicX = mainMenuButtonsX + gridWH/2 - buttonW/2;
  mainMenuButtonClassicY = mainMenuButtonsY + 0;

  mainMenuButtonClassicHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonClassicHighscoreY = mainMenuButtonsY + buttonH;

  mainMenuButtonBlitzX = mainMenuButtonsX + gridWH/2 - buttonW/2;
  mainMenuButtonBlitzY = mainMenuButtonsY + buttonH + mainMenuHighscoreH + mainMenuButtonPad;

  mainMenuButtonBlitzHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonBlitzHighscoreY = mainMenuButtonsY + 2*buttonH + mainMenuHighscoreH + mainMenuButtonPad;

  mainMenuButtonSequenceX = mainMenuButtonsX + gridWH/2 - buttonW/2;
  mainMenuButtonSequenceY = mainMenuButtonsY + 2*buttonH + 2*mainMenuHighscoreH + 2*mainMenuButtonPad;

  mainMenuButtonSequenceHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonSequenceHighscoreY = mainMenuButtonsY + 3*buttonH + 2*mainMenuHighscoreH + 2*mainMenuButtonPad;
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

var modeBestX;
var modeBestY;

var scoreX;
var scoreY;

var levelX;
var levelY;

var modeX;
var modeY;

var bestX;
var bestY;

var gameoverX;
var gameoverY;

var gameoverScoreTextX;
var gameoverScoreTextY;

var gameoverScoreX;
var gameoverScoreY;

var gameoverScoreNewX;
var gameoverScoreNewY;

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

var gameoverStatPrevScoreX;
var gameoverStatPrevScoreY;

var gameoverStatNewScoreX;
var gameoverStatNewScoreY;

var gameoverButtonPlayX;
var gameoverButtonPlayY;

var gameoverButtonMenuX;
var gameoverButtonMenuY;

var mainMenuButtonsX;
var mainMenuButtonsY;

var mainMenuButtonClassicX;
var mainMenuButtonClassicY;

var mainMenuButtonClassicHighscoreX;
var mainMenuButtonClassicHighscoreY;

var mainMenuButtonBlitzX;
var mainMenuButtonBlitzY;

var mainMenuButtonBlitzHighscoreX;
var mainMenuButtonBlitzHighscoreY;

var mainMenuButtonSequenceX;
var mainMenuButtonSequenceY;

var mainMenuButtonSequenceHighscoreX;
var mainMenuButtonSequenceHighscoreY;

setOrigins();
