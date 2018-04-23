'use strict';

function createMatrix(w, h, defaultValue) {
  var matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(defaultValue));
  }
  return matrix;
}

function copyMatrix(original, copy) {
  if (original.length !== copy.length || original[0].length != copy[0].length) {
    throw new Error('Matrix copy error: matrices dimensions mismatch.');
  }

  for (var i = 0; i < original.length; i++) {
    for (var j = 0; j < original[i].length; j++) {
      copy[i][j] = original[i][j];
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function now() {
  return new Date().getTime();
}

function deltaTime(startTime) {
  return now() - startTime;
}

function sleep(milliseconds) {
  var currentTime = now();
  while (currentTime + milliseconds >= now()) {}
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAllDropCombinations(onlyNumbers) {
  var combinations = [];

  for (var col = 1; col <= 7; col++) {
    for (var number = 1; number <= 7; number++) {
      combinations.push({
        col: col,
        piece: new NumberedPiece(number)
      });
    }

    if (!onlyNumbers) {
      combinations.push({
        col: col,
        piece: SolidPiece.getRandomSolidPiece()
      });
    }
  }

  return combinations;
}

function getMaxDrops() {
  if (mode === 'classic' || mode === 'sequence') {
    return classicSequenceDrops;
  } else if (mode === 'blitz') {
    return blitzDrops;
  } else {
    throw new Error('Invalid game mode ' + mode);
  }
}

function getFormattedScore(unformattedScore) {
  var formattedScore = '';
  var scoreStr = '' + unformattedScore;
  var sinceLastComma = 0;

  for (var i = scoreStr.length - 1; i >= 0; i--) {
    if (sinceLastComma === 3) {
      formattedScore = ',' + formattedScore;
      sinceLastComma = 0;
    }
    formattedScore = scoreStr.charAt(i) + formattedScore;
    sinceLastComma++;
  }

  return formattedScore;
}

function getAvgScores() {
  var prevAvgScore = 0;
  var prevScoresSum = 0;
  for (var i = 0; i < scores[mode].length - 1; i++) {
    prevScoresSum += scores[mode][i];
  }
  if (scores[mode].length - 1 > 0) {
    prevAvgScore = Math.floor(prevScoresSum / (scores[mode].length - 1));
  }

  var newAvgScore = Math.floor((prevScoresSum + score) / scores[mode].length);

  return [prevAvgScore, newAvgScore];
}

function isNewHighscore() {
  var isHighscore = true;
  for (var i = 0; i < scores[mode].length - 1; i++) {
    if (scores[mode][i] >= score) {
      isHighscore = false;
      break;
    }
  }

  return isHighscore;
}

function np(number) {
  return new NumberedPiece(number);
}

function sp(number) {
  return new SolidPiece(new NumberedPiece(number));
}

function inAnimation() {
  var inAnimation = false;

  inAnimation |= fallingPieces > 0;
  inAnimation |= explodingPieces > 0;
  inAnimation |= animatingNextLevel;
  inAnimation |= animatingBoardClear;

  return inAnimation;
}

function playAudio(audioName, loop) {
  var audio = new Audio('audio/' + audioName);
  if (loop) {
    audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  audio.play();

  return audio;
}