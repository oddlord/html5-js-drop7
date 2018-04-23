'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getCellOrigin(i, j) {
  var x = playAreaX + (i - 1) * cellWH + i * cellPad;
  var y = dropY + j * cellWH + (j + 1) * cellPad;
  return [x, y];
}

function drawPieceImg(piece, i, j) {
  // if image resolution is still not enough, consider step down resizing
  // as explained here
  // https://stackoverflow.com/questions/18761404/how-to-scale-images-on-a-html5-canvas-with-better-interpolation
  // and here
  var _getCellOrigin = getCellOrigin(i, j),
      _getCellOrigin2 = _slicedToArray(_getCellOrigin, 2),
      x = _getCellOrigin2[0],
      y = _getCellOrigin2[1];

  drawPieceImgXY(piece, x, y);
}

function drawPieceImgXY(piece, x, y) {
  drawPieceImgXYScaled(piece, x, y, cellWH, cellWH);
}

function drawPieceImgXYScaled(piece, x, y, w, h) {
  if (!debugMode) {
    if (piece.isPlaceholder()) {
      return;
    }
  }

  var img = images[piece.imgName];
  context.drawImage(img, x, y, w, h);
}

function drawMode() {
  context.clearRect(modeBestX, modeBestY, modeBestW, modeBestH);

  context.fillStyle = darkBlue;
  context.textAlign = 'left';
  context.textBaseline = 'top';

  context.font = 'bold ' + modeBestTextH + 'px Arial';
  var text = 'Mode: ';
  context.fillText(text, modeX, modeY);
  var textWidth = context.measureText(text).width;
  context.font = modeBestTextH + 'px Arial';
  context.fillText(mode, modeX + textWidth, modeY);

  context.font = 'bold ' + modeBestTextH + 'px Arial';
  text = 'Best: ';
  context.fillText(text, bestX, bestY);
  var best = 0;
  if (scores[mode].length > 0) {
    best = Math.max.apply(Math, _toConsumableArray(scores[mode]));
  }
  textWidth = context.measureText(text).width;
  context.font = modeBestTextH + 'px Arial';
  context.fillText(getFormattedScore(best), bestX + textWidth, bestY);
}

function drawScore() {
  context.clearRect(scoreX, scoreY, gridWH, scoreH);

  context.font = scoreH + 'px Arial';
  context.fillStyle = darkBlue;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillText(getFormattedScore(score), gridWH / 2, scoreY);
}

function drawDropCount() {
  context.clearRect(dropCountX, dropCountY - scoreVPad, gridWH, dropCountWH + scoreVPad);

  context.fillStyle = darkBlue;
  context.lineWidth = dropCountBorderW;
  context.strokeStyle = darkBlue;
  var radius = dropCountWH / 2;
  var dropCountCircleY = dropCountY + radius;
  for (var i = 1; i <= getMaxDrops(); i++) {
    context.beginPath();
    var dropCountCircleX = dropCountX + (i - 1) * dropCountWH + i * dropCountPad + radius;
    context.arc(dropCountCircleX, dropCountCircleY, radius, 0, 2 * Math.PI, false);
    if (i <= dropCount) {
      context.fill();
    } else {
      context.stroke();
    }
  }
}

function drawLevel() {
  context.clearRect(levelX, levelY, gridWH, levelH);

  context.font = levelH + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillText('LEVEL ' + level, levelX, levelY);
}

function drawDrop() {
  context.clearRect(dropX, dropY, gridWH, dropH);

  if (nextPiece.piece !== null) {
    drawPieceImg(nextPiece.piece, nextPiece.col, 0);
    var backgroundColor = nextPiece.piece.getBGColor();
    document.body.style.background = 'linear-gradient(to top right, ' + backgroundColor + ', white)';
  }
}

function drawGrid() {
  context.clearRect(gridX, gridY, gridWH, gridWH);

  context.fillStyle = cellBlue;
  for (var i = 1; i <= 7; i++) {
    for (var j = 0; j <= 7; j++) {
      var _getCellOrigin3 = getCellOrigin(i, j),
          _getCellOrigin4 = _slicedToArray(_getCellOrigin3, 2),
          x = _getCellOrigin4[0],
          y = _getCellOrigin4[1];

      if (j !== 0) {
        context.fillRect(x, y, cellWH, cellWH);
      }

      var piece = grid[i][j];
      if (piece !== null) {
        drawPieceImg(piece, i, j);
      }
    }
  }
}

function clearCanvas() {
  context.clearRect(0, 0, gridWH, canvasH);
}

function drawGame() {
  clearCanvas();

  drawMode();
  drawScore();
  drawDropCount();
  drawLevel();
  drawDrop();
  drawGrid();
}

function drawGameover() {
  clearCanvas();

  document.body.style.background = lightBlue;
  context.drawImage(images[gameoverImgName], 0, 0, gridWH, gridWH);

  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'top';

  context.font = gameoverScoreTextH + 'px Arial';
  context.fillText('Your Score:', gridWH / 2, gameoverScoreTextY);

  context.font = gameoverScoreH + 'px Arial';
  context.fillText(getFormattedScore(score), gridWH / 2, gameoverScoreY);

  if (isNewHighscore()) {
    context.font = gameoverScoreNewH + 'px Arial';
    context.fillStyle = newHighscoreBlue;
    context.fillText('NEW HIGH SCORE!', gridWH / 2, gameoverScoreNewY);
  }

  context.font = gameoverStatH + 'px Arial';
  context.fillStyle = 'white';

  context.textAlign = 'right';
  context.fillText('Mode:', gridWH / 2, gameoverStatModeY);
  context.textAlign = 'left';
  context.fillText(' ' + mode, gridWH / 2, gameoverStatModeY);

  context.textAlign = 'right';
  context.fillText('Longest Chain:', gridWH / 2, gameoverStatChainY);
  context.textAlign = 'left';
  context.fillText(' ' + longestChain, gridWH / 2, gameoverStatChainY);

  context.textAlign = 'right';
  context.fillText('Level:', gridWH / 2, gameoverStatLevelY);
  context.textAlign = 'left';
  context.fillText(' ' + level, gridWH / 2, gameoverStatLevelY);

  var _getAvgScores = getAvgScores(),
      _getAvgScores2 = _slicedToArray(_getAvgScores, 2),
      prevAvgScore = _getAvgScores2[0],
      newAvgScore = _getAvgScores2[1];

  context.textAlign = 'right';
  context.fillText('Prev. Avg. Score:', gridWH / 2, gameoverStatPrevScoreY);
  context.textAlign = 'left';
  context.fillText(' ' + getFormattedScore(prevAvgScore), gridWH / 2, gameoverStatPrevScoreY);

  context.textAlign = 'right';
  context.fillText('New Avg. Score:', gridWH / 2, gameoverStatNewScoreY);
  context.textAlign = 'left';
  var newAvgScoreText = ' ' + getFormattedScore(newAvgScore);
  context.fillText(newAvgScoreText, gridWH / 2, gameoverStatNewScoreY);
  if (prevAvgScore !== newAvgScore) {
    var avgScoreImgName = newAvgScore > prevAvgScore ? images[avgScoreUpImgName] : images[avgScoreDownImgName];
    var avgScoreImgX = gridWH / 2 + context.measureText(newAvgScoreText).width + gameoverStatH;
    context.drawImage(avgScoreImgName, avgScoreImgX, gameoverStatNewScoreY, gameoverStatH, gameoverStatH);
  }

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';

  context.fillStyle = buttonGreen;
  context.fillRect(gameoverButtonPlayX, gameoverButtonPlayY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.fillText('Play Again', gridWH / 2, gameoverButtonPlayY + buttonH / 2);
  if (gameoverButtonFocused === 0) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(gameoverButtonPlayX, gameoverButtonPlayY, buttonW, buttonH);
    context.stroke();
  }

  context.lineWidth = gameoverButtonFocused === 1 ? buttonBorderFocusedW : buttonBorderW;
  context.strokeStyle = 'white';
  context.beginPath();
  context.rect(gameoverButtonMenuX, gameoverButtonMenuY, buttonW, buttonH);
  context.stroke();
  context.fillText('Main Menu', gridWH / 2, gameoverButtonMenuY + buttonH / 2);
}

function drawMainMenu() {
  clearCanvas();

  var noHighscoreText = 'No High Score';
  var highscoreText = void 0;

  document.body.style.background = lightBlue;

  context.textAlign = 'center';

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonClassicX, mainMenuButtonClassicY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Classic', gridWH / 2, mainMenuButtonClassicY + buttonH / 2);
  if (mainMenuButtonFocused === 0) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonClassicX, mainMenuButtonClassicY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['classic'].length > 0) {
    highscoreText = 'High Score: ' + getFormattedScore(Math.max.apply(Math, _toConsumableArray(scores['classic'])));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH / 2, mainMenuButtonClassicHighscoreY);

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonBlitzX, mainMenuButtonBlitzY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Blitz', gridWH / 2, mainMenuButtonBlitzY + buttonH / 2);
  if (mainMenuButtonFocused === 1) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonBlitzX, mainMenuButtonBlitzY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['blitz'].length > 0) {
    highscoreText = 'High Score: ' + getFormattedScore(Math.max.apply(Math, _toConsumableArray(scores['blitz'])));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH / 2, mainMenuButtonBlitzHighscoreY);

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonSequenceX, mainMenuButtonSequenceY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Sequence', gridWH / 2, mainMenuButtonSequenceY + buttonH / 2);
  if (mainMenuButtonFocused === 2) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonSequenceX, mainMenuButtonSequenceY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['sequence'].length > 0) {
    highscoreText = 'High Score: ' + getFormattedScore(Math.max.apply(Math, _toConsumableArray(scores['sequence'])));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH / 2, mainMenuButtonSequenceHighscoreY);

  context.drawImage(images[drop7BlueImgName], 0, canvasH - mainMenuLogoH, gridWH, mainMenuLogoH);

  context.fillStyle = 'white';
  context.textBaseline = 'bottom';
  context.font = copyrightH + 'px Arial';
  context.fillText('\xA9 2015 Zynga Inc. All rights reserved.', gridWH / 2, canvasH);
}

function drawColumn(i) {
  var _getCellOrigin5 = getCellOrigin(i, 0),
      _getCellOrigin6 = _slicedToArray(_getCellOrigin5, 2),
      x = _getCellOrigin6[0],
      y = _getCellOrigin6[1];

  context.clearRect(x, y, cellWH, playAreaH);

  context.fillStyle = cellBlue;
  for (var j = 0; j <= 7; j++) {
    var _getCellOrigin7 = getCellOrigin(i, j),
        _getCellOrigin8 = _slicedToArray(_getCellOrigin7, 2),
        _x = _getCellOrigin8[0],
        _y = _getCellOrigin8[1];

    if (j !== 0) {
      context.fillRect(_x, _y, cellWH, cellWH);
    }

    var piece = grid[i][j];
    if (piece !== null) {
      drawPieceImg(piece, i, j);
    }
  }
}

function drawPlayArea() {
  drawDrop();
  drawGrid();
}

function drawPauseMenu() {
  context.fillStyle = pauseLightGrey;
  context.fillRect(0, 0, pauseW, canvasH);

  context.textAlign = 'center';
  context.textBaseline = 'middle';

  if (inGame) {
    context.fillStyle = buttonGreen;
    context.fillRect(pauseButtonRestartX, pauseButtonRestartY, buttonW, buttonH);
    context.fillStyle = 'white';
    context.font = buttonTextH + 'px Arial';
    context.fillText('Restart Game', pauseW / 2, pauseButtonRestartY + buttonH / 2);
    if (pauseButtonFocused === 0) {
      context.lineWidth = buttonBorderFocusedW;
      context.strokeStyle = pauseDarkGrey;
      context.beginPath();
      context.rect(pauseButtonRestartX, pauseButtonRestartY, buttonW, buttonH);
      context.stroke();
    }

    context.fillStyle = buttonGreen;
    context.fillRect(pauseButtonMainMenuX, pauseButtonMainMenuY, buttonW, buttonH);
    context.fillStyle = 'white';
    context.font = buttonTextH + 'px Arial';
    context.fillText('Main Menu', pauseW / 2, pauseButtonMainMenuY + buttonH / 2);
    if (pauseButtonFocused === 1) {
      context.lineWidth = buttonBorderFocusedW;
      context.strokeStyle = pauseDarkGrey;
      context.beginPath();
      context.rect(pauseButtonMainMenuX, pauseButtonMainMenuY, buttonW, buttonH);
      context.stroke();
    }
  }

  context.textAlign = 'left';
  context.font = pauseSwitchNameTextH + 'px Arial';
  context.fillStyle = pauseDarkGrey;
  context.fillText('Music', pauseSwitchMusicNameX, pauseSwitchMusicNameY + pauseSwitchH / 2);
  if (musicEnabled) {
    context.fillStyle = buttonGreen;
  } else {
    context.fillStyle = pauseMiddleGrey;
  }
  context.fillRect(pauseSwitchMusicX, pauseSwitchMusicY, pauseSwitchW, pauseSwitchH);
  if (pauseButtonFocused === 2) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = pauseDarkGrey;
    context.beginPath();
    context.rect(pauseSwitchMusicX, pauseSwitchMusicY, pauseSwitchW, pauseSwitchH);
    context.stroke();
  }
  context.textAlign = 'center';
  context.font = pauseSwitchTextH + 'px Arial';
  context.fillStyle = 'white';
  if (musicEnabled) {
    context.fillText('ON', pauseSwitchMusicX + pauseSwitchW / 4, pauseSwitchMusicY + pauseSwitchH / 2);
    context.fillRect(pauseSwitchMusicX + pauseSwitchW / 2 + pauseSwitchInnerBorder, pauseSwitchMusicY + pauseSwitchInnerBorder, pauseSwitchW / 2 - 2 * pauseSwitchInnerBorder, pauseSwitchH - 2 * pauseSwitchInnerBorder);
  } else {
    context.fillText('OFF', pauseSwitchMusicX + 3 * pauseSwitchW / 4, pauseSwitchMusicY + pauseSwitchH / 2);
    context.fillRect(pauseSwitchMusicX + pauseSwitchInnerBorder, pauseSwitchMusicY + pauseSwitchInnerBorder, pauseSwitchW / 2 - 2 * pauseSwitchInnerBorder, pauseSwitchH - 2 * pauseSwitchInnerBorder);
  }

  context.textAlign = 'left';
  context.font = pauseSwitchNameTextH + 'px Arial';
  context.fillStyle = pauseDarkGrey;
  context.fillText('Sound Effects', pauseSwitchSoundNameX, pauseSwitchSoundNameY + pauseSwitchH / 2);
  if (soundEnabled) {
    context.fillStyle = buttonGreen;
  } else {
    context.fillStyle = pauseMiddleGrey;
  }
  context.fillRect(pauseSwitchSoundX, pauseSwitchSoundY, pauseSwitchW, pauseSwitchH);
  if (pauseButtonFocused === 3) {
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = pauseDarkGrey;
    context.beginPath();
    context.rect(pauseSwitchSoundX, pauseSwitchSoundY, pauseSwitchW, pauseSwitchH);
    context.stroke();
  }
  context.textAlign = 'center';
  context.font = pauseSwitchTextH + 'px Arial';
  context.fillStyle = 'white';
  if (soundEnabled) {
    context.fillText('ON', pauseSwitchSoundX + pauseSwitchW / 4, pauseSwitchSoundY + pauseSwitchH / 2);
    context.fillRect(pauseSwitchSoundX + pauseSwitchW / 2 + pauseSwitchInnerBorder, pauseSwitchSoundY + pauseSwitchInnerBorder, pauseSwitchW / 2 - 2 * pauseSwitchInnerBorder, pauseSwitchH - 2 * pauseSwitchInnerBorder);
  } else {
    context.fillText('OFF', pauseSwitchSoundX + 3 * pauseSwitchW / 4, pauseSwitchSoundY + pauseSwitchH / 2);
    context.fillRect(pauseSwitchSoundX + pauseSwitchInnerBorder, pauseSwitchSoundY + pauseSwitchInnerBorder, pauseSwitchW / 2 - 2 * pauseSwitchInnerBorder, pauseSwitchH - 2 * pauseSwitchInnerBorder);
  }

  context.drawImage(images[drop7GreyImgName], 0, canvasH - pauseLogoH, pauseW, pauseLogoH);

  context.fillStyle = 'black';
  context.textBaseline = 'bottom';
  context.font = copyrightH + 'px Arial';
  context.fillText('Drop7 \xA9 2015 Zynga Inc.', pauseW / 2, canvasH);
}