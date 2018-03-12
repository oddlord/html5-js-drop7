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

function explosionAnimStart(piece, i, j){
  explodingPieces++;

  if (playerAction){
    window.requestAnimationFrame(function() {
      explosionAnim(piece, i, j, now());
    });
  } else {
    explosionAnimDone(i, j);
  }
}

function explosionAnim(piece, i, j, startTime){
  const [x, y] = getCellOrigin(i, j);

  const elapsedTime = deltaTime(startTime);

  if (elapsedTime >= msExplosion){
    explosionAnimDone(i, j, true);
    return;
  }

  const widthIncrease = Math.sin(Math.PI/(2*msExplosion) * elapsedTime) * maxWIncScale * cellWH;
  const newX = x - widthIncrease/2;
  const newY = y - widthIncrease/2;

  drawPieceImgXYScaled(piece, newX, newY, cellWH+widthIncrease, cellWH+widthIncrease);

  window.requestAnimationFrame(function() {
    explosionAnim(piece, i, j, startTime);
  });
}

function explosionAnimDone(i, j){
  grid[i][j] = null;

  breakNeighbours(i, j);
  drawGrid();

  explodingPieces--;
  if (!inAnimation()){
    applyGravity();
  }
}
