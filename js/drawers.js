function getCellOrigin(i, j){
  const x = playAreaX + (i-1)*cellWH + i*cellPad;
  const y = dropY + j*cellWH + (j+1)*cellPad;
  return [x, y];
}

function drawPieceImg(piece, i, j){
  // if image resolution is still not enough, consider step down resizing
  // as explained here
  // https://stackoverflow.com/questions/18761404/how-to-scale-images-on-a-html5-canvas-with-better-interpolation
  // and here
  // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing

  const [x, y] = getCellOrigin(i, j);
  drawPieceImgXY(piece, x, y);
}

function drawPieceImgXY(piece, x, y){
  drawPieceImgXYScaled(piece, x, y, cellWH, cellWH);
}

function drawPieceImgXYScaled(piece, x, y, w, h){
  if (!debugMode){
    if (piece.isPlaceholder()){
     return;
    }
  }

  const img = images[piece.imgName];
  context.drawImage(img, x, y, w, h);
}

function drawMode(){
  context.clearRect(modeBestX, modeBestY, modeBestW, modeBestH);

  context.fillStyle = darkBlue;
  context.textAlign = 'left';
  context.textBaseline = 'top';

  context.font = 'bold ' + modeBestTextH + 'px Arial';
  let text = 'Mode: ';
  context.fillText(text, modeX, modeY);
  let textWidth = context.measureText(text).width;
  context.font = modeBestTextH + 'px Arial';
  context.fillText(mode, modeX + textWidth, modeY);

  context.font = 'bold ' + modeBestTextH + 'px Arial';
  text = 'Best: ';
  context.fillText(text, bestX, bestY);
  let best = 0;
  if (scores[mode].length > 0){
    best = Math.max(...scores[mode]);
  }
  textWidth = context.measureText(text).width;
  context.font = modeBestTextH + 'px Arial';
  context.fillText(getFormattedScore(best), bestX + textWidth, bestY);
}

function drawScore(){
  context.clearRect(scoreX, scoreY, gridWH, scoreH);

  context.font = scoreH + 'px Arial';
  context.fillStyle = darkBlue;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillText(getFormattedScore(score), gridWH/2, scoreY);
}

function drawDropCount(){
  context.clearRect(dropCountX, dropCountY-scoreVPad, gridWH, dropCountWH+scoreVPad);

  context.fillStyle = darkBlue;
  context.lineWidth = dropCountBorderW;
  context.strokeStyle = darkBlue;
  const radius = dropCountWH/2;
  const dropCountCircleY = dropCountY + radius;
  for (let i = 1; i <= getMaxDrops(); i++){
    context.beginPath();
    const dropCountCircleX = dropCountX + (i-1)*dropCountWH + i*dropCountPad + radius;
    context.arc(dropCountCircleX, dropCountCircleY, radius, 0, 2*Math.PI, false);
    if (i <= dropCount){
      context.fill();
    } else {
      context.stroke();
    }
  }
}

function drawLevel(){
  context.clearRect(levelX, levelY, gridWH, levelH);

  context.font = levelH + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top'
  context.fillText('LEVEL '+level, levelX, levelY);
}

function drawDrop(){
  context.clearRect(dropX, dropY, gridWH, dropH);

  if (nextPiece.piece !== null){
    drawPieceImg(nextPiece.piece, nextPiece.col, 0);
    const backgroundColor = nextPiece.piece.getBGColor();
    document.body.style.background = 'linear-gradient(to top right, ' + backgroundColor + ', white)';
  }
}

function drawGrid(){
  context.clearRect(gridX, gridY, gridWH, gridWH);

  context.fillStyle = cellBlue;
  for (let i = 1; i <= 7; i++){
    for (let j = 0; j <= 7; j++){
      const [x, y] = getCellOrigin(i, j);

      if (j !== 0){
        context.fillRect(x, y, cellWH, cellWH);
      }

      const piece = grid[i][j];
      if (piece !== null){
        drawPieceImg(piece, i, j);
      }
    }
  }
}

function clearCanvas(){
  context.clearRect(0, 0, gridWH, canvasH);
}

function drawGame(){
  clearCanvas();

  drawMode();
  drawScore();
  drawDropCount();
  drawLevel();
  drawDrop();
  drawGrid();
}

function drawGameover(){
  clearCanvas();

  document.body.style.background = lightBlue;
  context.drawImage(images[gameoverImgName], 0, 0, gridWH, gridWH);

  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'top';

  context.font = gameoverScoreTextH + 'px Arial';
  context.fillText('Your Score:', gridWH/2, gameoverScoreTextY);

  context.font = gameoverScoreH + 'px Arial';
  context.fillText(getFormattedScore(score), gridWH/2, gameoverScoreY);

  if (isNewHighscore()){
    context.font = gameoverScoreNewH + 'px Arial';
    context.fillStyle = newHighscoreBlue;
    context.fillText('NEW HIGH SCORE!', gridWH/2, gameoverScoreNewY);
  }

  context.font = gameoverStatH + 'px Arial';
  context.fillStyle = 'white';

  context.textAlign = 'right';
  context.fillText('Mode:', gridWH/2, gameoverStatModeY);
  context.textAlign = 'left';
  context.fillText(' '+mode, gridWH/2, gameoverStatModeY);

  context.textAlign = 'right';
  context.fillText('Longest Chain:', gridWH/2, gameoverStatChainY);
  context.textAlign = 'left';
  context.fillText(' '+longestChain, gridWH/2, gameoverStatChainY);

  context.textAlign = 'right';
  context.fillText('Level:', gridWH/2, gameoverStatLevelY);
  context.textAlign = 'left';
  context.fillText(' '+level, gridWH/2, gameoverStatLevelY);

  [prevAvgScore, newAvgScore] = getAvgScores();

  context.textAlign = 'right';
  context.fillText('Prev. Avg. Score:', gridWH/2, gameoverStatPrevScoreY);
  context.textAlign = 'left';
  context.fillText(' '+getFormattedScore(prevAvgScore), gridWH/2, gameoverStatPrevScoreY);

  context.textAlign = 'right';
  context.fillText('New Avg. Score:', gridWH/2, gameoverStatNewScoreY);
  context.textAlign = 'left';
  const newAvgScoreText = ' '+getFormattedScore(newAvgScore);
  context.fillText(newAvgScoreText, gridWH/2, gameoverStatNewScoreY);
  if (prevAvgScore !== newAvgScore){
    const avgScoreImgName = newAvgScore > prevAvgScore ? images[avgScoreUpImgName] : images[avgScoreDownImgName]
    const avgScoreImgX = gridWH/2 + context.measureText(newAvgScoreText).width + gameoverStatH;
    context.drawImage(avgScoreImgName, avgScoreImgX, gameoverStatNewScoreY, gameoverStatH, gameoverStatH);
  }

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';

  context.fillStyle = buttonGreen;
  context.fillRect(gameoverButtonPlayX, gameoverButtonPlayY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.fillText('Play Again', gridWH/2, gameoverButtonPlayY + buttonH/2);
  if (gameoverButtonFocused === 0){
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
  context.fillText('Main Menu', gridWH/2, gameoverButtonMenuY + buttonH/2);
}

function drawMainMenu(){
  clearCanvas();

  const noHighscoreText = 'No High Score';
  let highscoreText;

  document.body.style.background = lightBlue;

  context.textAlign = 'center';

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonClassicX, mainMenuButtonClassicY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Classic', gridWH/2, mainMenuButtonClassicY + buttonH/2);
  if (mainMenuButtonFocused === 0){
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonClassicX, mainMenuButtonClassicY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['classic'].length > 0){
    highscoreText = 'High Score: ' + getFormattedScore(Math.max(...scores['classic']));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH/2, mainMenuButtonClassicHighscoreY);

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonBlitzX, mainMenuButtonBlitzY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Blitz', gridWH/2, mainMenuButtonBlitzY + buttonH/2);
  if (mainMenuButtonFocused === 1){
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonBlitzX, mainMenuButtonBlitzY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['blitz'].length > 0){
    highscoreText = 'High Score: ' + getFormattedScore(Math.max(...scores['blitz']));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH/2, mainMenuButtonBlitzHighscoreY);

  context.fillStyle = buttonGreen;
  context.fillRect(mainMenuButtonSequenceX, mainMenuButtonSequenceY, buttonW, buttonH);
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.font = buttonTextH + 'px Arial';
  context.fillText('Sequence', gridWH/2, mainMenuButtonSequenceY + buttonH/2);
  if (mainMenuButtonFocused === 2){
    context.lineWidth = buttonBorderFocusedW;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(mainMenuButtonSequenceX, mainMenuButtonSequenceY, buttonW, buttonH);
    context.stroke();
  }
  highscoreText = noHighscoreText;
  if (scores['sequence'].length > 0){
    highscoreText = 'High Score: ' + getFormattedScore(Math.max(...scores['sequence']));
  }
  context.textBaseline = 'top';
  context.font = mainMenuHighscoreH + 'px Arial';
  context.fillText(highscoreText, gridWH/2, mainMenuButtonSequenceHighscoreY);

  context.drawImage(images[drop7BlueImgName], 0, canvasH - mainMenuLogoH, gridWH, mainMenuLogoH);

  context.fillStyle = 'white';
  context.textBaseline = 'bottom';
  context.font = copyrightH + 'px Arial';
  context.fillText('\u00A9 2015 Zynga Inc. All rights reserved.', gridWH/2, canvasH);
}

function drawColumn(i){
  const [x, y] = getCellOrigin(i, 0);
  context.clearRect(x, y, cellWH, playAreaH);

  context.fillStyle = cellBlue;
  for (let j = 0; j <= 7; j++){
    const [x, y] = getCellOrigin(i, j);

    if (j !== 0){
      context.fillRect(x, y, cellWH, cellWH);
    }

    const piece = grid[i][j];
    if (piece !== null){
      drawPieceImg(piece, i, j);
    }
  }
}

function drawPlayArea(){
  drawDrop();
  drawGrid();
}

function drawPauseMenu(){
  context.fillStyle = pauseLightGrey;
  context.fillRect(0, 0, pauseW, canvasH);

  context.textAlign = 'center';

  if (inGame){
    context.fillStyle = buttonGreen;
    context.fillRect(pauseButtonRestartX, pauseButtonRestartY, buttonW, buttonH);
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.font = buttonTextH + 'px Arial';
    context.fillText('Restart Game', pauseW/2, pauseButtonRestartY + buttonH/2);
    if (pauseButtonFocused === 0){
      context.lineWidth = buttonBorderFocusedW;
      context.strokeStyle = 'white';
      context.beginPath();
      context.rect(pauseButtonRestartX, pauseButtonRestartY, buttonW, buttonH);
      context.stroke();
    }

    context.fillStyle = buttonGreen;
    context.fillRect(pauseButtonMainMenuX, pauseButtonMainMenuY, buttonW, buttonH);
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.font = buttonTextH + 'px Arial';
    context.fillText('Main Menu', pauseW/2, pauseButtonMainMenuY + buttonH/2);
    if (pauseButtonFocused === 1){
      context.lineWidth = buttonBorderFocusedW;
      context.strokeStyle = 'white';
      context.beginPath();
      context.rect(pauseButtonMainMenuX, pauseButtonMainMenuY, buttonW, buttonH);
      context.stroke();
    }
  }

  // TODO: Music & sound buttons here!

  context.drawImage(images[drop7GreyImgName], 0, canvasH - pauseLogoH, pauseW, pauseLogoH);

  context.fillStyle = 'black';
  context.textBaseline = 'bottom';
  context.font = copyrightH + 'px Arial';
  context.fillText('Drop7 \u00A9 2015 Zynga Inc.', pauseW/2, canvasH);
}
