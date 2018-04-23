"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Piece = function () {
  function Piece() {
    _classCallCheck(this, Piece);
  }

  _createClass(Piece, [{
    key: "isNumbered",
    value: function isNumbered() {
      return this instanceof NumberedPiece;
    }
  }, {
    key: "isCrackable",
    value: function isCrackable() {
      return this instanceof HiddenPiece;
    }
  }, {
    key: "isPlaceholder",
    value: function isPlaceholder() {
      return this instanceof PlaceholderPiece;
    }
  }, {
    key: "imgName",
    get: function get() {
      return this._imgName;
    },
    set: function set(imgName) {
      this._imgName = imgName;
    }
  }], [{
    key: "getRandomPiece",
    value: function getRandomPiece() {
      var numberOrSolid = randomIntFromInterval(1, 8);

      var piece = void 0;
      if (numberOrSolid === 8) {
        piece = SolidPiece.getRandomSolidPiece();
      } else {
        piece = new NumberedPiece(numberOrSolid);
      }

      return piece;
    }
  }]);

  return Piece;
}();

var NumberedPiece = function (_Piece) {
  _inherits(NumberedPiece, _Piece);

  _createClass(NumberedPiece, null, [{
    key: "getRandomNumberedPiece",
    value: function getRandomNumberedPiece() {
      var number = randomIntFromInterval(1, 7);
      var piece = new NumberedPiece(number);
      return piece;
    }
  }]);

  function NumberedPiece(number) {
    _classCallCheck(this, NumberedPiece);

    var _this = _possibleConstructorReturn(this, (NumberedPiece.__proto__ || Object.getPrototypeOf(NumberedPiece)).call(this));

    _this.number = number;
    _this.imgName = numberedPiecesImgNames[number - 1];
    return _this;
  }

  _createClass(NumberedPiece, [{
    key: "getBGColor",
    value: function getBGColor() {
      return bgNumberedColors[this.number - 1];
    }
  }, {
    key: "getPointsColor",
    value: function getPointsColor() {
      return pointsNumberedColors[this.number - 1];
    }
  }, {
    key: "number",
    get: function get() {
      return this._number;
    },
    set: function set(number) {
      this._number = number;
    }
  }]);

  return NumberedPiece;
}(Piece);

var HiddenPiece = function (_Piece2) {
  _inherits(HiddenPiece, _Piece2);

  function HiddenPiece() {
    _classCallCheck(this, HiddenPiece);

    return _possibleConstructorReturn(this, (HiddenPiece.__proto__ || Object.getPrototypeOf(HiddenPiece)).apply(this, arguments));
  }

  _createClass(HiddenPiece, [{
    key: "numberedPiece",
    get: function get() {
      return this._numberedPiece;
    },
    set: function set(numberedPiece) {
      this._numberedPiece = numberedPiece;
    }
  }]);

  return HiddenPiece;
}(Piece);

var SolidPiece = function (_HiddenPiece) {
  _inherits(SolidPiece, _HiddenPiece);

  _createClass(SolidPiece, null, [{
    key: "getRandomSolidPiece",
    value: function getRandomSolidPiece() {
      var numberedPiece = NumberedPiece.getRandomNumberedPiece();
      var piece = new SolidPiece(numberedPiece);
      return piece;
    }
  }]);

  function SolidPiece(numberedPiece) {
    _classCallCheck(this, SolidPiece);

    var _this3 = _possibleConstructorReturn(this, (SolidPiece.__proto__ || Object.getPrototypeOf(SolidPiece)).call(this));

    _this3.numberedPiece = numberedPiece;
    _this3.imgName = solidImgName;
    return _this3;
  }

  _createClass(SolidPiece, [{
    key: "getBGColor",
    value: function getBGColor() {
      return bgSolidColor;
    }
  }, {
    key: "crack",
    value: function crack() {
      return new CrackedPiece(this.numberedPiece);
    }
  }]);

  return SolidPiece;
}(HiddenPiece);

var CrackedPiece = function (_HiddenPiece2) {
  _inherits(CrackedPiece, _HiddenPiece2);

  function CrackedPiece(numberedPiece) {
    _classCallCheck(this, CrackedPiece);

    var _this4 = _possibleConstructorReturn(this, (CrackedPiece.__proto__ || Object.getPrototypeOf(CrackedPiece)).call(this));

    _this4.numberedPiece = numberedPiece;
    _this4.imgName = crackedImgName;
    return _this4;
  }

  _createClass(CrackedPiece, [{
    key: "crack",
    value: function crack() {
      return this.numberedPiece;
    }
  }]);

  return CrackedPiece;
}(HiddenPiece);

var PlaceholderPiece = function (_Piece3) {
  _inherits(PlaceholderPiece, _Piece3);

  function PlaceholderPiece() {
    _classCallCheck(this, PlaceholderPiece);

    var _this5 = _possibleConstructorReturn(this, (PlaceholderPiece.__proto__ || Object.getPrototypeOf(PlaceholderPiece)).call(this));

    _this5.imgName = gameoverImgName;
    return _this5;
  }

  return PlaceholderPiece;
}(Piece);