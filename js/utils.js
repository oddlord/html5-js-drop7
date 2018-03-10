function createMatrix(w, h){
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function copyMatrix(original, copy){
  if ((original.length !== copy.length) || (original[0].length != copy[0].length)){
    throw new Error('Matrix copy error: matrices dimensions mismatch');
  }

  for (let i = 0; i < original.length; i++){
    for (let j = 0; j < original[i].length; j++){
      copy[i][j] = original[i][j];
    }
  }
}

function clamp(value, min, max){
  return Math.max(min, Math.min(value, max));
}

function sleep(milliseconds){
  var currentTime = new Date().getTime();
  while (currentTime + milliseconds >= new Date().getTime()){}
}

function randomIntFromInterval(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function getAllDropCombinations(){
  const combinations = [];

  for (let piece = 1; piece <= 8; piece++){
    for (let col = 1; col <= 7; col++){
      combinations.push({
        col: col,
        piece: piece === 8 ? solidValue : piece
      });
    }
  }

  return combinations;
}

function getRandomPiece(onlyNumbers){
  let max = 8;
  if (onlyNumbers){
    max = 7;
  }

  let piece = randomIntFromInterval(1, max);
  piece = piece === 8 ? solidValue : piece;

  return piece;
}

function getPieceImg(piece){
  let imgName;

  if (piece >= 1 && piece <= 7){
    imgName = piece + 'piece.png';
  } else if (piece === solidValue){
    imgName = 'solid.png';
  } else if (piece === crackedValue){
    imgName = 'cracked.png';
  } else {
    throw new Error('Invalid piece ' + piece);
  }

  return images[imgName];
}

function getMaxDrops(){
  if (mode === 'classic' || mode === 'sequence'){
    return classicSequenceDrops;
  } else if (mode === 'blitz'){
    return blitzDrops;
  } else {
    throw new Error('Invalid game mode ' + mode);
  }
}

function getFormattedScore(unformattedScore){
  let formattedScore = '';
  let scoreStr = '' + unformattedScore;
  let sinceLastComma = 0;

  for (let i = scoreStr.length-1; i >= 0; i--){
    if (sinceLastComma === 3){
      formattedScore = ',' + formattedScore;
      sinceLastComma = 0;
    }
    formattedScore = scoreStr.charAt(i) + formattedScore;
    sinceLastComma++;
  }

  return formattedScore;
}
