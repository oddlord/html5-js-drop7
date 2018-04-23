'use strict';

// Misc settings ---------------------
var cellBlue = '#284c7c'; // used for grid cells
var darkBlue = '#223f5f'; // used for text and other elements
var lightBlue = '#3a84c1'; // used for gameover BG
var newHighscoreBlue = '#57cbf0'; // used for the "New Highscore" text
var buttonGreen = '#65be7a'; // used for buttons
var pauseLightGrey = '#cfd0d4'; // used for pause BG
var pauseMiddleGrey = '#a8aaa7'; // used for turned off switches
var pauseDarkGrey = '#626367'; // used for pause text
var bgNumberedColors = [// used for game BG (depends on current piece)
'#488557', // 1 piece color
'#b19438', // 2 piece color
'#b07b39', // 3 piece color
'#a23643', // 4 piece color
'#a4528e', // 5 piece color
'#3692af', // 6 piece color
'#2a5e8b' // 7 piece color
];
var bgSolidColor = '#d8e4ea'; // solid piece color
var pointsNumberedColors = [// used for match points (depends on current piece)
'#68c076', // 1 piece color
'#fed450', // 2 piece color
'#fcb051', // 3 piece color
'#e84d60', // 4 piece color
'#eb75cc', // 5 piece color
'#4dd1fa', // 6 piece color
'white' // 7 piece color
];

var solidValue = 200;
var crackedValue = 100;

var minStartingPieces = 11;
var maxStartingPieces = 21;

var classicSequenceDrops = 30;
var blitzDrops = 5;
var maxDropCountsRef = Math.max(classicSequenceDrops, blitzDrops);

// Images names ------------------
var numberedPiecesImgNames = ['1piece.png', '2piece.png', '3piece.png', '4piece.png', '5piece.png', '6piece.png', '7piece.png'];
var solidImgName = 'solid.png';
var crackedImgName = 'cracked.png';
var drop7BlueImgName = 'drop7-blue.png';
var drop7GreyImgName = 'drop7-grey.png';
var gameoverImgName = 'gameover.png';
var avgScoreUpImgName = 'avg-score-up.png';
var avgScoreDownImgName = 'avg-score-down.png';

// Audio files names -------------------
var explosionAudioName = 'ding.mp3';
var musicAudioName = 'retroland-recital.mp3';

// Dimensions --------------------
var canvasHScale = 0.9; // WRT document body

var playAreaHScale = 0.75; // WRT canvas height

// All these must sum to 1
var modeBestHScale = 0.25; // WRT upper section height
var scoreHScale = 0.45; // WRT upper section height
var scoreVPadScale = 0.15; // WRT upper section height
var levelHScale = 0.15; // WRT upper section height

var cellPadScale = 0.033; // WRT cell width

var dropCountPadScale = 0.2; // WRT drop counter width
var dropCountBorderWScale = 0.1; // WRT drop counter width

var modeBestWScale = 0.35; // WRT grid width

var matchPointsHScale = 0.4; // WRT cell width
var chainHScale = 0.4; // WRT cell width

// All these must sum to 1
var gameoverScoreTextHScale = 0.05; // WTR gameover lower section height
var gameoverScoreHScale = 0.15; // WTR gameover lower section height
var gameoverScoreNewHScale = 0.05; // WTR gameover lower section height
var gameoverScoreVPadScale = 0.05; // WTR gameover lower section height
var gameoverStatsHScale = 0.25; // WTR gameover lower section height
var gameoverStatsVPadScale = 0.1; // WTR gameover lower section height
var gameoverButtonsHScale = 0.3; // WTR gameover lower section height
var gameoverButtonsVPadScale = 0.05; // WTR gameover lower section height

var gameoverStatPadScale = 0.4; // WRT gameover stat height

var buttonWScale = 4; // WRT button height
var buttonTextHScale = 0.4; // WRT button height
var buttonBorderWScale = 0.025; // WRT button height
var buttonBorderFocusedWScale = 0.075; // WRT button height

var gameoverButtonPadScale = 0.4; // WRT button height

var mainMenuUpperVPadScale = 0.15; // WRT canvas height

var mainMenuButtonPadScale = 0.15; // WRT button height
var mainMenuHighscoreHScale = 0.35; // WRT button height
var mainMenuHighscorePadScale = 0.6; // WRT button height

var copyrightHScale = 0.2; // WRT button height

var logoRatio = 1080 / 449;

var pauseWScale = 0.8; // WRT grid width

var pauseUpperVPadScale = 0.15; // WRT canvas height
var pauseMiddleVPadScale = 0.6; // WRT canvas height

var pauseButtonPadScale = 0.5; // WRT button height
var pauseSwitchHScale = 0.7; // WRT button height

var pauseSwitchWScale = 2; // WRT switch height
var pauseSwitchNameTextHScale = 0.6; // WRT switch height
var pauseSwitchTextHScale = 0.3; // WRT switch height
var pauseSwitchInnerBorderScale = 0.15; // WRT switch height
var pauseSwitchPadScale = 0.2; // WRT switch height

var pauseSwitchLeftHPadScale = 0.1; // WRT grid width
var pauseSwitchMiddleHPadScale = 0.5; // WRT grid width

// Animations -------------------
var msPerCellFall = 100;

var msExplosion = 350;
var maxExplosionWIncScale = 1;

var msMatchPoints = 450;
var maxMatchPointsHIncScale = 0.25;

var maxChainHIncScale = 0.3;

var msNextLevel = 1000;
var maxNextLevelHIncScale = 0.2;

function setDimensions() {
  canvasH = document.body.clientHeight * canvasHScale;

  playAreaH = canvasH * playAreaHScale;
  upperSectionH = canvasH * (1 - playAreaHScale);

  cellWH = playAreaH / (8 + cellPadScale * 9);
  cellPad = cellWH * cellPadScale;
  gridWH = cellWH * 7 + cellPad * 8;
  dropH = cellPad + cellWH;

  dropCountWH = gridWH / (maxDropCountsRef + dropCountPadScale * (maxDropCountsRef + 1));
  dropCountPad = dropCountWH * dropCountPadScale;
  dropCountBorderW = dropCountWH * dropCountBorderWScale;

  modeBestH = (upperSectionH - dropCountWH) * modeBestHScale;
  scoreH = (upperSectionH - dropCountWH) * scoreHScale;
  scoreVPad = (upperSectionH - dropCountWH) * scoreVPadScale;
  levelH = (upperSectionH - dropCountWH) * levelHScale;

  modeBestW = gridWH * modeBestWScale;
  modeBestTextH = modeBestH / 2;

  matchPointsH = cellWH * matchPointsHScale;
  chainH = cellWH * chainHScale;

  gameoverImgNonWritableH = 450 / 1080 * gridWH;
  gameoverLowerSectionH = canvasH - gameoverImgNonWritableH;

  gameoverScoreTextH = gameoverLowerSectionH * gameoverScoreTextHScale;
  gameoverScoreH = gameoverLowerSectionH * gameoverScoreHScale;
  gameoverScoreNewH = gameoverLowerSectionH * gameoverScoreNewHScale;
  gameoverScoreVPad = gameoverLowerSectionH * gameoverScoreVPadScale;
  gameoverStatsH = gameoverLowerSectionH * gameoverStatsHScale;
  gameoverStatsVPad = gameoverLowerSectionH * gameoverStatsVPadScale;
  gameoverButtonsH = gameoverLowerSectionH * gameoverButtonsHScale;

  gameoverStatH = gameoverStatsH / (5 + 3 * gameoverStatPadScale);
  gameoverStatPad = gameoverStatH * gameoverStatPadScale;

  buttonH = gameoverButtonsH / (2 + gameoverButtonPadScale);
  buttonW = buttonH * buttonWScale;
  buttonTextH = buttonH * buttonTextHScale;
  buttonBorderW = buttonH * buttonBorderWScale;
  buttonBorderFocusedW = buttonH * buttonBorderFocusedWScale;

  gameoverButtonPad = buttonH * gameoverButtonPadScale;

  mainMenuUpperVPad = canvasH * mainMenuUpperVPadScale;

  mainMenuButtonPad = buttonH * mainMenuButtonPadScale;
  mainMenuHighscoreH = buttonH * mainMenuHighscoreHScale;
  mainMenuHighscorePad = buttonH * mainMenuHighscorePadScale;
  copyrightH = buttonH * copyrightHScale;

  mainMenuLogoH = gridWH / logoRatio;

  pauseW = gridWH * pauseWScale;

  pauseUpperVPad = canvasH * pauseUpperVPadScale;
  pauseMiddleVPad = canvasH * pauseMiddleVPadScale;

  pauseButtonPad = buttonH * pauseButtonPadScale;
  pauseSwitchH = buttonH * pauseSwitchHScale;

  pauseSwitchW = pauseSwitchH * pauseSwitchWScale;
  pauseSwitchNameTextH = pauseSwitchH * pauseSwitchNameTextHScale;
  pauseSwitchTextH = pauseSwitchH * pauseSwitchTextHScale;
  pauseSwitchInnerBorder = pauseSwitchH * pauseSwitchInnerBorderScale;
  pauseSwitchPad = pauseSwitchH * pauseSwitchPadScale;

  pauseSwitchLeftHPad = gridWH * pauseSwitchLeftHPadScale;
  pauseSwitchMiddleHPad = gridWH * pauseSwitchMiddleHPadScale;

  pauseLogoH = pauseW / logoRatio;
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

var matchPointsH;
var chainH;

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

var mainMenuButtonPad;
var mainMenuHighscoreH;
var mainMenuHighscorePad;

var copyrightH;

var mainMenuLogoH;

var pauseW;

var pauseUpperVPad;
var pauseMiddleVPad;

var pauseButtonPad;
var pauseSwitchH;

var pauseSwitchW;
var pauseSwitchNameTextH;
var pauseSwitchTextH;
var pauseSwitchInnerBorder;
var pauseSwitchPad;

var pauseSwitchLeftHPad;
var pauseSwitchMiddleHPad;

var pauseLogoH;

setDimensions();

// Origins --------------------
function setOrigins() {
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
  gameoverScoreNewY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH + gameoverScoreH + 0;

  gameoverStatsX = gameoverX + 0;
  gameoverStatsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH + gameoverScoreH + gameoverScoreNewH + gameoverScoreVPad + 0;

  gameoverButtonsX = gameoverX + 0;
  gameoverButtonsY = gameoverY + gameoverImgNonWritableH + gameoverScoreTextH + gameoverScoreH + gameoverScoreNewH + gameoverScoreVPad + gameoverStatsH + gameoverStatsVPad + 0;

  gameoverStatModeX = gameoverStatsX + 0;
  gameoverStatModeY = gameoverStatsY + 0;

  gameoverStatChainX = gameoverStatsX + 0;
  gameoverStatChainY = gameoverStatsY + gameoverStatH + gameoverStatPad;

  gameoverStatLevelX = gameoverStatsX + 0;
  gameoverStatLevelY = gameoverStatsY + 2 * gameoverStatH + 2 * gameoverStatPad;

  gameoverStatPrevScoreX = gameoverStatsX + 0;
  gameoverStatPrevScoreY = gameoverStatsY + 3 * gameoverStatH + 3 * gameoverStatPad;

  gameoverStatNewScoreX = gameoverStatsX + 0;
  gameoverStatNewScoreY = gameoverStatsY + 4 * gameoverStatH + 4 * gameoverStatPad;

  gameoverButtonPlayX = gameoverButtonsX + gridWH / 2 - buttonW / 2;
  gameoverButtonPlayY = gameoverButtonsY;

  gameoverButtonMenuX = gameoverButtonsX + gridWH / 2 - buttonW / 2;
  gameoverButtonMenuY = gameoverButtonsY + buttonH + gameoverButtonPad;

  mainMenuButtonsX = 0;
  mainMenuButtonsY = mainMenuUpperVPad + 0;

  mainMenuButtonClassicX = mainMenuButtonsX + gridWH / 2 - buttonW / 2;
  mainMenuButtonClassicY = mainMenuButtonsY + 0;

  mainMenuButtonClassicHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonClassicHighscoreY = mainMenuButtonsY + buttonH + mainMenuButtonPad;

  mainMenuButtonBlitzX = mainMenuButtonsX + gridWH / 2 - buttonW / 2;
  mainMenuButtonBlitzY = mainMenuButtonsY + buttonH + mainMenuButtonPad + mainMenuHighscoreH + mainMenuHighscorePad;

  mainMenuButtonBlitzHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonBlitzHighscoreY = mainMenuButtonsY + 2 * buttonH + 2 * mainMenuButtonPad + mainMenuHighscoreH + mainMenuHighscorePad;

  mainMenuButtonSequenceX = mainMenuButtonsX + gridWH / 2 - buttonW / 2;
  mainMenuButtonSequenceY = mainMenuButtonsY + 2 * buttonH + 2 * mainMenuButtonPad + 2 * mainMenuHighscoreH + 2 * mainMenuHighscorePad;

  mainMenuButtonSequenceHighscoreX = mainMenuButtonsX + 0;
  mainMenuButtonSequenceHighscoreY = mainMenuButtonsY + 3 * buttonH + 3 * mainMenuButtonPad + 2 * mainMenuHighscoreH + 2 * mainMenuHighscorePad;

  pauseButtonsX = 0;
  pauseButtonsY = 0 + pauseUpperVPad;

  pauseButtonRestartX = pauseButtonsX + pauseW / 2 - buttonW / 2;
  pauseButtonRestartY = pauseButtonsY + 0;

  pauseButtonMainMenuX = pauseButtonsX + pauseW / 2 - buttonW / 2;
  pauseButtonMainMenuY = pauseButtonsY + buttonH + pauseButtonPad;

  pauseSwitchesX = 0;
  pauseSwitchesY = 0 + pauseMiddleVPad;

  pauseSwitchMusicNameX = pauseSwitchesX + pauseSwitchLeftHPad + 0;
  pauseSwitchMusicNameY = pauseSwitchesY + 0;

  pauseSwitchMusicX = pauseSwitchesX + pauseSwitchMiddleHPad + 0;
  pauseSwitchMusicY = pauseSwitchesY + 0;

  pauseSwitchSoundNameX = pauseSwitchesX + pauseSwitchLeftHPad + 0;;
  pauseSwitchSoundNameY = pauseSwitchesY + pauseSwitchH + pauseSwitchPad;

  pauseSwitchSoundX = pauseSwitchesX + pauseSwitchMiddleHPad + 0;;
  pauseSwitchSoundY = pauseSwitchesY + pauseSwitchH + pauseSwitchPad;
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

var pauseButtonsX;
var pauseButtonsY;

var pauseButtonRestartX;
var pauseButtonRestartY;

var pauseButtonMainMenuX;
var pauseButtonMainMenuY;

var pauseSwitchesX;
var pauseSwitchesY;

var pauseSwitchMusicNameX;
var pauseSwitchMusicNameY;

var pauseSwitchMusicX;
var pauseSwitchMusicY;

var pauseSwitchSoundNameX;
var pauseSwitchSoundNameY;

var pauseSwitchSoundX;
var pauseSwitchSoundY;

setOrigins();