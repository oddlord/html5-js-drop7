function getCellOrigin(i, j){
  const x = playAreaX + (i-1)*cellWH + i*cellPad;
  const y = dropY + j*cellWH + (j+1)*cellPad;
  return [x, y];
}

function drawPieceImg(value, i, j){
  const img = getPieceImg(value);
  const [x, y] = getCellOrigin(i, j);

  // if image resolution is still not enough, consider step down resizing
  // as explained here
  // https://stackoverflow.com/questions/18761404/how-to-scale-images-on-a-html5-canvas-with-better-interpolation
  // and here
  // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing

  context.drawImage(img, x, y, cellWH, cellWH);
}

function drawGrid(){
  context.clearRect(gridX, gridY, gridWH, gridWH);

  context.fillStyle = cellColor;
  for (let i = 1; i <= 7; i++){
    for (let j = 0; j <= 7; j++){
      const [x, y] = getCellOrigin(i, j);

      if (j !== 0){
        context.fillRect(x, y, cellWH, cellWH);
      }

      const value = grid[i][j];
      if (value !== 0){
        drawPieceImg(value, i, j);
      }
    }
  }
}

function drawDrop(){
  context.clearRect(dropX, dropY, gridWH, dropH);

  if (nextPiece.piece !== 0){
    drawPieceImg(nextPiece.piece, nextPiece.col, 0);
  }
}

function drawScore(){
  context.clearRect(scoreX, scoreY, gridWH, scoreH);

  const scoreFontH = gameover ? scoreH/2 : scoreH;
  context.font = scoreFontH + 'px Arial';
  context.fillStyle = cellColor;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  const scoreText = gameover ? 'GAME OVER! ' + score : score;
  context.fillText(scoreText, gridWH/2, scoreY);
}

function drawDropCount(){
  context.clearRect(dropCountX, dropCountY-scoreVPad, gridWH, dropCountWH+scoreVPad);

  context.fillStyle = cellColor;
  context.lineWidth = dropCountBorderW;
  context.strokeStyle = cellColor;
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

function drawMode(){
  context.clearRect(modeX, modeY, gridWH, modeH);

  context.font = modeH + 'px Arial';
  context.fillStyle = cellColor;
  context.textAlign = 'right';
  context.textBaseline = 'top';
  context.fillText('Mode: '+mode, gridWH, modeY);
}
