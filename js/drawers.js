function drawPieceImg(value, i, j){
  const img = getPieceImg(value);
  const [x, y] = getCellOrigin(i, j);

  // if image resolution is still not enough, consider step down resizing
  // as explained here
  // https://stackoverflow.com/questions/18761404/how-to-scale-images-on-a-html5-canvas-with-better-interpolation
  // and here
  // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing

  context.drawImage(img, x, y, cellWidth, cellWidth);
}

function drawGrid(){
  context.clearRect(0, upperSectionHeight + dropSectionHeight, gridWidth, gridWidth);

  context.fillStyle = cellColor;
  for (let i = 1; i <= 7; i++){
    for (let j = 0; j <= 7; j++){
      const [x, y] = getCellOrigin(i, j);

      if (j !== 0){
        context.fillRect(x, y, cellWidth, cellWidth);
      }

      const value = grid[i][j];
      if (value !== 0){
        drawPieceImg(value, i, j);
      }
    }
  }
}

function drawDropSection(){
  context.clearRect(0, upperSectionHeight, gridWidth, dropSectionHeight);
  if (nextPiece.piece !== 0){
    drawPieceImg(nextPiece.piece, nextPiece.col, 0);
  }
}

function drawScore(){
  context.clearRect(0, 0, gridWidth, scoreSectionHeight);
  const scoreFontHeight = gameover ? scoreHeight/2 : scoreHeight;
  context.font = scoreFontHeight + 'px Arial';
  context.fillStyle = cellColor;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  const scoreText = gameover ? 'GAME OVER! ' + score : score;
  context.fillText(scoreText, gridWidth/2, 0);
}

function drawDropCounter(){
  context.clearRect(0, scoreSectionHeight, gridWidth, dropCounterWidth + levelHeight);

  context.fillStyle = cellColor;
  context.strokeStyle = cellColor;
  for (let i = 1; i <= maxDropCounts; i++){
    context.beginPath();
    const radius = dropCounterWidth/2;
    const originX = (i-1)*dropCounterWidth + i*dropCounterPadding + radius;
    const originY = scoreSectionHeight + radius;
    context.arc(originX, originY, radius, 0, 2*Math.PI, false);
    if (i <= dropCount){
      context.fill();
    } else {
      context.stroke();
    }
  }

  context.font = levelHeight + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top'
  context.fillText('LEVEL '+level, 0, scoreSectionHeight + dropCounterWidth);
}
