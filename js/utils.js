function createMatrix(w, h){
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
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
