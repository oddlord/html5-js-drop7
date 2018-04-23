'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function fallAnimStart(piece, i, startJ, endJ) {
  fallingPieces++;

  grid[i][startJ] = null;
  grid[i][endJ] = new PlaceholderPiece();

  if (playerAction) {
    window.requestAnimationFrame(function () {
      fallAnim(piece, i, startJ, endJ, now());
    });
  } else {
    fallAnimDone(piece, i, endJ);
  }
}

function fallAnim(piece, i, startJ, endJ, startTime) {
  var _getCellOrigin = getCellOrigin(i, startJ),
      _getCellOrigin2 = _slicedToArray(_getCellOrigin, 2),
      startX = _getCellOrigin2[0],
      startY = _getCellOrigin2[1];

  var _getCellOrigin3 = getCellOrigin(i, endJ),
      _getCellOrigin4 = _slicedToArray(_getCellOrigin3, 2),
      endX = _getCellOrigin4[0],
      endY = _getCellOrigin4[1];

  var hPerMsFall = cellWH / msPerCellFall;

  var elapsedTime = deltaTime(startTime);
  var currentY = startY + elapsedTime * hPerMsFall;

  if (currentY >= endY) {
    fallAnimDone(piece, i, endJ);
    return;
  }

  drawColumn(i);
  drawPieceImgXY(piece, endX, currentY);

  window.requestAnimationFrame(function () {
    fallAnim(piece, i, startJ, endJ, startTime);
  });
}

function fallAnimDone(piece, i, j) {
  grid[i][j] = piece;

  fallingPieces--;
  if (!inAnimation()) {
    drawGrid();
    checkMatches();
  }
}

function explosionAnimStart(matchedPieces, points) {
  explodingPieces += matchedPieces.length;

  if (playerAction) {
    window.requestAnimationFrame(function () {
      explosionAnim(matchedPieces, points, now());
    });
  } else {
    matchPointsAnimStart(matchedPieces, points, now());
  }
}

function explosionAnim(matchedPieces, points, startTime) {
  var elapsedTime = deltaTime(startTime);

  if (elapsedTime >= msExplosion) {
    matchPointsAnimStart(matchedPieces, points, startTime);
    return;
  }

  drawPlayArea();

  updateChain(elapsedTime);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = matchedPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var matchedPiece = _step.value;

      var piece = matchedPiece.piece;
      var i = matchedPiece.i;
      var j = matchedPiece.j;

      var _getCellOrigin5 = getCellOrigin(i, j),
          _getCellOrigin6 = _slicedToArray(_getCellOrigin5, 2),
          x = _getCellOrigin6[0],
          y = _getCellOrigin6[1];

      var widthIncrease = Math.sin(Math.PI / (2 * msExplosion) * elapsedTime) * maxExplosionWIncScale * cellWH;
      var newX = x - widthIncrease / 2;
      var newY = y - widthIncrease / 2;

      drawPieceImgXYScaled(piece, newX, newY, cellWH + widthIncrease, cellWH + widthIncrease);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  window.requestAnimationFrame(function () {
    explosionAnim(matchedPieces, points, startTime);
  });
}

function matchPointsAnimStart(matchedPieces, points, startTime) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = matchedPieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var matchedPiece = _step2.value;

      if (playerAction && soundEnabled) {
        playAudio(explosionAudioName, false);
      }

      var i = matchedPiece.i;
      var j = matchedPiece.j;

      grid[i][j] = null;

      breakNeighbours(i, j);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  drawGrid();

  if (playerAction) {
    window.requestAnimationFrame(function () {
      matchPointAnim(matchedPieces, points, startTime);
    });
  } else {
    explosionAnimDone(matchedPieces, points);
  }
}

function matchPointAnim(matchedPieces, points, startTime) {
  var elapsedTime = deltaTime(startTime + msExplosion);

  if (elapsedTime >= msMatchPoints) {
    explosionAnimDone(matchedPieces, points);
    return;
  }

  drawPlayArea();

  updateChain(elapsedTime + msExplosion);

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = matchedPieces[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var matchedPiece = _step3.value;

      var piece = matchedPiece.piece;
      var i = matchedPiece.i;
      var j = matchedPiece.j;

      var _getCellOrigin7 = getCellOrigin(i, j),
          _getCellOrigin8 = _slicedToArray(_getCellOrigin7, 2),
          x = _getCellOrigin8[0],
          y = _getCellOrigin8[1];

      var heightIncrease = Math.sin(Math.PI / msMatchPoints * elapsedTime) * maxMatchPointsHIncScale * cellWH;
      var newY = y - heightIncrease / 2;

      context.font = 'bold ' + (matchPointsH + heightIncrease) + 'px Arial';
      context.fillStyle = piece.getPointsColor();
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText('+' + points, x + cellWH / 2, newY);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  window.requestAnimationFrame(function () {
    matchPointAnim(matchedPieces, points, startTime);
  });
}

function explosionAnimDone(matchedPieces, points) {
  score += points * matchedPieces.length;

  explodingPieces -= matchedPieces.length;
  if (!inAnimation()) {
    drawPlayArea();
    applyGravity();
  }
}

function updateChain(elapsedTime) {
  if (chain > 1) {
    var chainHIncrease = Math.sin(Math.PI / (msExplosion + msMatchPoints) * elapsedTime) * maxChainHIncScale * cellWH;

    context.font = 'bold ' + (chainH + chainHIncrease) + 'px Arial';
    context.fillStyle = darkBlue;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('CHAIN x' + chain, gridWH / 2, dropY + cellWH / 2);
  }
}

function nextLevelAnimStart(points) {
  animatingNextLevel = true;

  if (soundEnabled) {
    playAudio(explosionAudioName, false);
  }

  window.requestAnimationFrame(function () {
    nextLevelAnim(points, now());
  });
}

function nextLevelAnim(points, startTime) {
  var elapsedTime = deltaTime(startTime);

  if (elapsedTime >= msNextLevel) {
    nextLevelAnimDone(points);
    return;
  }

  var textHIncrease = Math.sin(Math.PI / msNextLevel * elapsedTime) * maxNextLevelHIncScale * cellWH;

  drawPlayArea();

  context.font = 'bold ' + (chainH + textHIncrease) + 'px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('LEVEL BONUS +' + getFormattedScore(points), gridWH / 2, gridY + cellWH / 2);

  window.requestAnimationFrame(function () {
    nextLevelAnim(points, startTime);
  });
}

function nextLevelAnimDone(points) {
  animatingNextLevel = false;
  nextLevelPost(points);
}

function boardClearAnimStart() {
  animatingBoardClear = true;

  if (soundEnabled) {
    playAudio(explosionAudioName, false);
  }

  window.requestAnimationFrame(function () {
    boardClearAnim(now());
  });
}

function boardClearAnim(startTime) {
  var elapsedTime = deltaTime(startTime);

  if (elapsedTime >= msNextLevel) {
    boardClearAnimDone();
    return;
  }

  var textHIncrease = Math.sin(Math.PI / msNextLevel * elapsedTime) * maxNextLevelHIncScale * cellWH;

  drawGrid();

  context.font = 'bold ' + (chainH + textHIncrease) + 'px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('BOARD CLEAR +' + getFormattedScore(70000), gridWH / 2, gridY + gridWH - cellWH / 2);

  window.requestAnimationFrame(function () {
    boardClearAnim(startTime);
  });
}

function boardClearAnimDone() {
  animatingBoardClear = false;
  checkBoardClearPost();
}