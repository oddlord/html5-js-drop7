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
