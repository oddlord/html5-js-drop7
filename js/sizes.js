const canvasHeightScale = 0.9;        // WRT document body
const gridDropHeightScale = 0.8;      // WRT canvas
const cellPaddingScale = 0.033;       // WRT cell width
const scoreSectionHeightScale = 0.8;  // WRT upper part (drop counter excluded)
const scoreVPaddingScale = 0.25;      // WRT score section
const dropCounterPaddingScale = 0.1;  // WRT drop counter width

function setDimensions(){
  canvasHeight = document.body.clientHeight * canvasHeightScale;
  
  gridDropHeight = canvasHeight * gridDropHeightScale;
  upperSectionHeight = canvasHeight * (1-gridDropHeightScale);

  cellWidth = gridDropHeight / (8 + cellPaddingScale*9);
  cellPadding = cellWidth * cellPaddingScale;

  gridWidth = cellWidth*7 + cellPadding*8;
  dropSectionHeight = cellPadding + cellWidth;

  dropCounterWidth = gridWidth / (30 + dropCounterPaddingScale*31);
  dropCounterPadding = dropCounterWidth * dropCounterPaddingScale;
  scoreSectionHeight = (upperSectionHeight - dropCounterWidth) * scoreSectionHeightScale;
  scoreHeight = scoreSectionHeight * (1-scoreVPaddingScale);
  scoreVPadding = scoreSectionHeight * scoreVPaddingScale;
  levelHeight = (upperSectionHeight - dropCounterWidth) * (1-scoreSectionHeightScale);
}

var canvasHeight;

var gridDropHeight;
var upperSectionHeight;

var cellWidth;
var cellPadding;

var gridWidth;
var dropSectionHeight;

var dropCounterWidth;
var dropCounterPadding;
var scoreSectionHeight;
var scoreHeight;
var scoreVPadding;
var levelHeight;

setDimensions();
