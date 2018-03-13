function fallAnimStart(piece, i, startJ, endJ){
  fallingPieces++;

  grid[i][startJ] = null;
  grid[i][endJ] = new PlaceholderPiece();

  if (playerAction){
    window.requestAnimationFrame(function() {
      fallAnim(piece, i, startJ, endJ, now());
    });
  } else {
    fallAnimDone(piece, i, endJ);
  }
}

function fallAnim(piece, i, startJ, endJ, startTime){
  const [startX, startY] = getCellOrigin(i, startJ);
  const [endX, endY] = getCellOrigin(i, endJ);
  const hPerMsFall = cellWH / msPerCellFall;

  const elapsedTime = deltaTime(startTime);
  const currentY = startY + elapsedTime*hPerMsFall;

  if (currentY >= endY){
    fallAnimDone(piece, i, endJ);
    return;
  }

  drawColumn(i);
  drawPieceImgXY(piece, endX, currentY);

  window.requestAnimationFrame(function() {
    fallAnim(piece, i, startJ, endJ, startTime);
  });
}

function fallAnimDone(piece, i, j){
  grid[i][j] = piece;

  fallingPieces--;
  if (!inAnimation()){
    drawGrid();
    checkMatches();
  }
}

function explosionAnimStart(matchedPieces, points){
  explodingPieces += matchedPieces.length;

  if (playerAction){
    window.requestAnimationFrame(function() {
      explosionAnim(matchedPieces, points, now());
    });
  } else {
    matchPointsAnimStart(matchedPieces, points, now());
  }
}

function explosionAnim(matchedPieces, points, startTime){
  const elapsedTime = deltaTime(startTime);

  if (elapsedTime >= msExplosion){
    matchPointsAnimStart(matchedPieces, points, startTime);
    return;
  }

  drawPlayArea();

  updateChain(elapsedTime);

  for (let matchedPiece of matchedPieces){
    const piece = matchedPiece.piece;
    const i = matchedPiece.i;
    const j = matchedPiece.j;

    const [x, y] = getCellOrigin(i, j);

    const widthIncrease = Math.sin(Math.PI/(2*msExplosion) * elapsedTime) * maxExplosionWIncScale * cellWH;
    const newX = x - widthIncrease/2;
    const newY = y - widthIncrease/2;

    drawPieceImgXYScaled(piece, newX, newY, cellWH+widthIncrease, cellWH+widthIncrease);
  }

  window.requestAnimationFrame(function() {
    explosionAnim(matchedPieces, points, startTime);
  });
}

function matchPointsAnimStart(matchedPieces, points, startTime){
  for (let matchedPiece of matchedPieces){
    if (playerAction && soundEnabled){
      playAudio(explosionAudioName, false);
    }

    const i = matchedPiece.i;
    const j = matchedPiece.j;

    grid[i][j] = null;

    breakNeighbours(i, j);
  }

  drawGrid();

  if (playerAction){
    window.requestAnimationFrame(function() {
      matchPointAnim(matchedPieces, points, startTime);
    });
  } else {
    explosionAnimDone(matchedPieces, points);
  }
}

function matchPointAnim(matchedPieces, points, startTime){
  const elapsedTime = deltaTime(startTime + msExplosion);

  if (elapsedTime >= msMatchPoints){
    explosionAnimDone(matchedPieces, points);
    return;
  }

  drawPlayArea();

  updateChain(elapsedTime + msExplosion);

  for (let matchedPiece of matchedPieces){
    const piece = matchedPiece.piece;
    const i = matchedPiece.i;
    const j = matchedPiece.j;

    const [x, y] = getCellOrigin(i, j);

    const heightIncrease = Math.sin(Math.PI/(msMatchPoints) * elapsedTime) * maxMatchPointsHIncScale * cellWH;
    const newY = y - heightIncrease/2;

    context.font = 'bold ' + (matchPointsH + heightIncrease) + 'px Arial';
    context.fillStyle = piece.getPointsColor();
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('+'+points, x + cellWH/2, newY);
  }

  window.requestAnimationFrame(function() {
    matchPointAnim(matchedPieces, points, startTime);
  });
}

function explosionAnimDone(matchedPieces, points){
  score += points * matchedPieces.length;

  explodingPieces -= matchedPieces.length;
  if (!inAnimation()){
    drawPlayArea();
    applyGravity();
  }
}

function updateChain(elapsedTime){
  if (chain > 1){
    const chainHIncrease = Math.sin(Math.PI/(msExplosion + msMatchPoints) * elapsedTime) * maxChainHIncScale * cellWH;

    context.font = (chainH+chainHIncrease) + 'px Arial';
    context.fillStyle = darkBlue;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('CHAIN x'+chain, gridWH/2, dropY + cellWH/2);
  }
}
