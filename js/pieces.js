class Piece {
  static getRandomPiece(){
    const numberOrSolid = randomIntFromInterval(1, 8);

    let piece;
    if (numberOrSolid === 8){
      piece = SolidPiece.getRandomSolidPiece();
    } else {
      piece = new NumberedPiece(numberOrSolid);
    }

    return piece;
  }

  get imgName(){
    return this._imgName;
  }

  set imgName(imgName){
    this._imgName = imgName;
  }

  isNumbered(){
    return (this instanceof NumberedPiece);
  }

  isCrackable(){
    return (this instanceof HiddenPiece);
  }

  isPlaceholder(){
    return (this instanceof PlaceholderPiece);
  }
}

class NumberedPiece extends Piece {
  static getRandomNumberedPiece(){
    const number = randomIntFromInterval(1, 7);
    const piece = new NumberedPiece(number);
    return piece;
  }

  constructor(number){
    super();
    this.number = number;
    this.imgName = numberedPiecesImgNames[number - 1];
  }

  get number(){
    return this._number;
  }

  set number(number){
    this._number = number;
  }

  getBGColor(){
    return bgNumberedColors[this.number - 1];
  }

  getPointsColor(){
    return pointsNumberedColors[this.number - 1];
  }
}

class HiddenPiece extends Piece {
  get numberedPiece(){
    return this._numberedPiece;
  }

  set numberedPiece(numberedPiece){
    this._numberedPiece = numberedPiece;
  }
}

class SolidPiece extends HiddenPiece {
  static getRandomSolidPiece(){
    const numberedPiece = NumberedPiece.getRandomNumberedPiece();
    const piece = new SolidPiece(numberedPiece);
    return piece;
  }

  constructor(numberedPiece){
    super();
    this.numberedPiece = numberedPiece;
    this.imgName = solidImgName;
  }

  getBGColor(){
    return bgSolidColor;
  }

  crack(){
    return new CrackedPiece(this.numberedPiece);
  }
}

class CrackedPiece extends HiddenPiece {
  constructor(numberedPiece){
    super();
    this.numberedPiece = numberedPiece;
    this.imgName = crackedImgName;
  }

  crack(){
    return this.numberedPiece;
  }
}

class PlaceholderPiece extends Piece {
  constructor(){
    super();
    this.imgName = gameoverImgName;
  }
}
