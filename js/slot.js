// size canvas
var WIDTH = 800;
var HEIGHT = 500;
// sequence, winnings
var WINNING_SEQUENCES = [
  // six
  [[0, 0, 0, 0, 0], 32],
  [[0, 0, 0, 0], 16],
  [[0, 0, 0], 8],
  [[0, 0], 4],
  // seven
  [[1, 1, 1, 1, 1], 48],
  [[1, 1, 1, 1], 24],
  [[1, 1, 1], 12],
  [[1, 1], 6],
  // eight
  [[2, 2, 2, 2, 2], 64],
  [[2, 2, 2, 2], 32],
  [[2, 2, 2], 16],
  [[2, 2], 8],
  // nine
  [[3, 3, 3, 3, 3], 80],
  [[3, 3, 3, 3], 40],
  [[3, 3, 3], 20],
  [[3, 3], 10],
  // ten
  [[4, 4, 4, 4, 4], 96],
  [[4, 4, 4, 4], 48],
  [[4, 4, 4], 24],
  [[4, 4], 12],
  // J
  [[5, 5, 5, 5, 5], 112],
  [[5, 5, 5, 5], 56],
  [[5, 5, 5], 28],
  [[5, 5], 14],
  // Q
  [[6, 6, 6, 6, 6], 128],
  [[6, 6, 6, 6], 64],
  [[6, 6, 6], 32],
  [[6, 6], 16],
  // K
  [[7, 7, 7, 7, 7], 144],
  [[7, 7, 7, 7], 72],
  [[7, 7, 7], 36],
  [[7, 7], 18],
  // A
  [[8, 8, 8, 8, 8], 160],
  [[8, 8, 8, 8], 80],
  [[8, 8, 8], 40],
  [[8, 8], 20]
];

// [reelNumber, row]
var LINE_MAP = [
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
  [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
  [[0, 0], [1, 0], [2, 1], [3, 0], [4, 0]],
  [[0, 2], [1, 2], [2, 1], [3, 2], [4, 2]]
];

//array bet
var arrBet = [0.2, 0.5, 1, 2.5, 5]

// create the canvas
var canvas = $('<canvas width ="' + WIDTH + '" height="' + HEIGHT + '"></canvas>');
var ctx = canvas.get(0).getContext("2d");
$(canvas).appendTo('#stage');

// load images
var bgImg = new Image("img/bgr-slot.png");
bgImg.src = "img/bgr-slot.png";

var tile1Img = new Image();
tile1Img.src = "img/6.png";

var tile2Img = new Image();
tile2Img.src = "img/7.png";

var tile3Img = new Image();
tile3Img.src = "img/8.png";

var tile4Img = new Image();
tile4Img.src = "img/9.png";

var tile5Img = new Image();
tile5Img.src = "img/10.png";

var tile6Img = new Image();
tile6Img.src = "img/J.png";

var tile7Img = new Image();
tile7Img.src = "img/Q.png";

var tile8Img = new Image();
tile8Img.src = "img/K.png";

var luckyImg = new Image();
luckyImg.src = "img/A.png";

var ball1Img = new Image();
ball1Img.src = "img/ball1.png";

var ball2Img = new Image();
ball2Img.src = "img/ball2.png";

var ball3Img = new Image();
ball3Img.src = "img/ball3.png";

var ball4Img = new Image();
ball4Img.src = "img/ball4.png";

var ball5Img = new Image();
ball5Img.src = "img/ball5.png";

var line1Img = new Image();
line1Img.src = "img/line1.png";

var line2Img = new Image();
line2Img.src = "img/line2.png";

var line3Img = new Image();
line3Img.src = "img/line3.png";

var line4Img = new Image();
line4Img.src = "img/line4.png";

var line5Img = new Image();
line5Img.src = "img/line5.png";


// load audio
var spinSound = new Audio("sound/spin.mp3");
var betSound = new Audio("sound/bet.mp3");
var coinSound = new Audio("sound/coin.wav");

// compare line and winning sequence
// return false if no match and true if match
function resultsSequenceMatch(results, winningSequence) {
  for (var i = 0; i < winningSequence.length; i++) {
    if (winningSequence[i] != results[i]) {
      return false;
    }
  };
  return true;
}

// get results from reel based on line_map argument
// return the results of one line
function getResultsLineFromReel(lineMap) {
  var results = [];
  for (var i = 0; i < lineMap.length; i++) {
    var reelNumber = lineMap[i][0];
    var row = lineMap[i][1];
    results.push(reelsTop[reelNumber].tiles[row]);
  };
  return results;
}

// return array of all results
function getAllResults(linesToGet) {
  allResults = [];
  for (var i = 0; i < linesToGet; i++) {
    allResults.push(getResultsLineFromReel(LINE_MAP[i]));
  };
  return allResults;
}

// calculate winnings from results
function calculateWinnings(allResults) {
  gameState.highlightTiles = [];
  for (var i = 0; i < allResults.length; i++) {
    for (var j = 0; j < WINNING_SEQUENCES.length; j++) {
      if (resultsSequenceMatch(allResults[i], WINNING_SEQUENCES[j][0])) {
        gameState.win += WINNING_SEQUENCES[j][1] * gameState.betTotal
        gameState.highlightTiles.push(i);
        gameState.currentLineWinningsMap.push([i, gameState.win]);
        break;
      }
    };
  };
}

function rotateHighlightTiles() {
  gameState.showHighlightTiles = true;
  gameState.currentHighlightTilesCounter++;
  var currentIndex = gameState.currentHighlightTilesCounter % gameState.highlightTiles.length;
  gameState.currentHighlightTiles = gameState.highlightTiles[currentIndex];
}

function GameState(win, paid, credits, bet, betNumber, arrBet, line, tiles, highlightTiles, showHighlightTiles) {
  this.win = win;
  this.paid = paid;
  this.credits = credits;
  this.bet = bet;
  this.betNumber = betNumber;
  this.arrBet = arrBet;
  this.line = line;
  this.betTotal = this.bet * this.line;
  this.tiles = tiles;
  this.highlightTiles = highlightTiles;
  this.showHighlightTiles = showHighlightTiles;
  this.currentHighlightTiles = 0;
  this.currentHighlightTilesCounter = 0;
  this.rotateHighlightLoop = null;
  this.spinClickShield = false;
  this.showLines = true;
  this.currentLineWinningsMap = [];
  this.transferWinToCredits = function() {
    var i = this.win;
    var counter = 0;
    while (i > 0) {
      i -= 1;
      counter += 10;
      setTimeout(function(){
        coinSound.currentTime = 0;
        coinSound.play();
        gameState.paid += 1;
        gameState.credits += 1;
        if (Math.ceil(gameState.win) == gameState.paid) {
          gameState.spinClickShield = false;
        }
      }, counter);
    }
  }
}

var gameState = new GameState(0, 0, 500, arrBet[0], 0, arrBet, 1, [], [], true);

gameState.tiles.push(new Tile('six', tile1Img));
gameState.tiles.push(new Tile('seven', tile2Img));
gameState.tiles.push(new Tile('eight', tile3Img));
gameState.tiles.push(new Tile('nine', tile4Img));
gameState.tiles.push(new Tile('ten', tile5Img));
gameState.tiles.push(new Tile('J', tile6Img));
gameState.tiles.push(new Tile('Q', tile7Img));
gameState.tiles.push(new Tile('K', tile8Img));
gameState.tiles.push(new Tile('A', luckyImg));

function Tile(name, img, value) {
  this.name = name;
  this.img = img;
  this.value = value;
}

function Reel(x, y, x_vel, y_vel, y_acc, tiles) {
  this.x = x;
  this.y = y;
  this.x_vel = x_vel;
  this.y_vel = y_vel;
  this.y_acc = y_acc;
  this.tiles = tiles;
  this.draw = function() {
    for (var i = 0; i < this.tiles.length; i++) {
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      y_offset = this.y + 100 * i + 19;
      ctx.drawImage(gameState.tiles[this.tiles[i]].img, 0, 0, 100, 100, this.x, y_offset, 100, 100);
    };
  };
  this.update = function() {
    // update position
    this.y += this.y_vel;
  };
}

function ButtonObject(x, y, width, height, handler) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  // mouse parameter holds the mouse coordinates
  this.handleClick = function(mouse) {

      // perform hit test between bounding box
      // and mouse coordinates

      if (this.x < mouse.x &&
        this.x + this.width > mouse.x &&
        this.y < mouse.y &&
        this.y + this.height > mouse.y) {

          // hit test succeeded, handle the click event!

      handler();
      return true;
    }

      // hit test did not succeed
      return false;
  }

  // draw function
  this.draw = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// subclass of ButtonObject
function BetButton(x, y, width, height, handler, betAmount) {
  ButtonObject.apply(this, arguments);
  this.betAmount = gameState.arrBet[gameState.bet];
  this.handleClick = function(mouse) {

    if (this.x < mouse.x &&
      this.x + this.width > mouse.x &&
      this.y < mouse.y &&
      this.y + this.height > mouse.y) {

      handler();
      gameState.showLines = true;
      gameState.showHighlightTiles = false;
      betSound.currentTime = 0;
      betSound.play();
        return true;
    }
  }
}

var changeBetTotal = function() {
  gameState.betTotal = (gameState.line * gameState.bet).toFixed(1);
}

var increaseBet = function() {
  gameState.betNumber += 1;
  if (gameState.betNumber >= gameState.arrBet.length) {
    gameState.betNumber = 0;
  }
  gameState.bet = gameState.arrBet[gameState.betNumber];
  changeBetTotal()
}

var reduceBet = function() {
  gameState.betNumber -= 1;
  if (gameState.betNumber < 0) {
    gameState.betNumber = gameState.arrBet.length - 1;
  }
  gameState.bet = gameState.arrBet[gameState.betNumber];
  changeBetTotal()
}

var increaseLineNumber = function(betAmount) {
  gameState.line += 1;
  if (gameState.line > LINE_MAP.length) {
    gameState.line = 1;
  }
  changeBetTotal()
}

var reduceLineNumber = function(betAmount) {
  gameState.line -= 1;
  if (gameState.line < 1) {
    gameState.line = LINE_MAP.length;
  }
  changeBetTotal()
}

var reelsTop = [];

var spinHandler = function(){
  if (gameState.spinClickShield) {
    return;
  }
  spinSound.currentTime = 0;
  spinSound.play();
  setTimeout(function(){
    spinSound.pause();
  }, 1600);
  gameState.spinClickShield = true;
  clearInterval(gameState.rotateHighlightLoop);
  gameState.currentHighlightTilesCounter = 0;
  gameState.rotateHighlightLoop = 0;
  gameState.paid = 0;
  gameState.win = 0;
  gameState.credits -= gameState.betTotal;
  gameState.showHighlightTiles = false;
  gameState.showLines = false;
  gameState.currentLineWinningsMap = [];
  reelsTop = generateReels(-1000);
  for (var i = 0; i < reelsBottom.length; i++) {
    animateReels(i);
  };
  setTimeout(function(){
    calculateWinnings(getAllResults(gameState.line));
    gameState.transferWinToCredits();
    gameState.rotateHighlightLoop = setInterval(rotateHighlightTiles, 1500);
    if (gameState.win == gameState.paid) {
      gameState.spinClickShield = false;
    }
  }, 2000);
}

var animateReels = function(index){
  setTimeout(function(){
    reelsTop[index].y_vel = 15;
    reelsBottom[index].y_vel = 15;
  }, 100 * index);
}

var buttonObjectArray = [
  // x, y, width, height, click handler
  new ButtonObject(581, 368, 139, 44, spinHandler),
  new BetButton(566, 454, 44, 32, increaseBet, 4),
  new BetButton(448, 454, 44, 32, reduceBet, 3),
  new BetButton(285, 454, 44, 32, increaseLineNumber, 2),
  new BetButton(178, 454, 44, 32, reduceLineNumber, 1),
  ];

function generateRandomTileList (num) {
    var arrTile = [0,0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,8];
    var randomTileList = [];
    for (var i = 0; i < num; i++) {
        var randomNum = Math.floor(Math.random() * arrTile.length);
        randomTileList.push(arrTile[randomNum]);
    };
    return randomTileList;
}

var generateReels = function(starting_y){
  var reels = [];
  reels.push(new Reel(150, starting_y, 0, 0, 0, generateRandomTileList(10)));
  reels.push(new Reel(250, starting_y, 0, 0, 0, generateRandomTileList(10)));
  reels.push(new Reel(350, starting_y, 0, 0, 0, generateRandomTileList(10)));
  reels.push(new Reel(450, starting_y, 0, 0, 0, generateRandomTileList(10)));
  reels.push(new Reel(550, starting_y, 0, 0, 0, generateRandomTileList(10)));
  return reels;
}

var reelsBottom = generateReels(0);

// handle clicks
// calculate position of the canvas DOM element on the page
var canvasPosition = {
  x: canvas.offset().left,
  y: canvas.offset().top
};

canvas.on('click', function(e) {

  // use pageX and pageY to get the mouse position
  // relative to the browser window
  var mouse = {
    x: e.pageX - canvasPosition.x,
    y: e.pageY - canvasPosition.y
  }

  // iterate through all button objects
  // and call the onclick handler of each
  for (var i = 0; i < buttonObjectArray.length; i++) {
    buttonObjectArray[i].handleClick(mouse);
  };
});

// update game objects
var update = function () {
  for (var i = 0; i < reelsBottom.length; i++) {
    reelsBottom[i].update();
  };
  for (var i = 0; i < reelsTop.length; i++) {
    if (reelsTop[i].y >= 0) {
      reelsTop[i].y_vel = 0;
      reelsBottom = reelsTop;
      reelsBottom[i].y = 0;
    }
    reelsTop[i].update();
  };
};

// draw everything
var render = function () {
  // draw white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // draw reels
  for (var i = 0; i < reelsBottom.length; i++) {
    reelsBottom[i].draw();
  };

  for (var i = 0; i < reelsTop.length; i++) {
    reelsTop[i].draw();
  };

  for (var i = 0; i < buttonObjectArray.length; i++) {
    buttonObjectArray[i].draw();
  };

  // draw bg img
  ctx.drawImage(bgImg, 0, 0, 800, 600, 0, 0, 800, 600);

  // draw game states
  ctx.fillStyle = "#7F9500"
  ctx.font = "16px 'Press Start 2P'";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(gameState.win.toFixed(1), 250, 395);
  ctx.fillText(gameState.credits.toFixed(2), 400, 395);
  ctx.fillText(gameState.line, 260, 464);
  ctx.fillText(gameState.bet.toFixed(2), 562, 464);
  ctx.fillText(gameState.betTotal, 520, 395);

  // draw game state highlight tiles
  if (gameState.showHighlightTiles && gameState.highlightTiles.length && !gameState.showLines) {
    var winnings_x_coord = 170;
    var winnings_y_coord = 0;
    switch(gameState.currentHighlightTiles) {
      case 0:
        ctx.fillStyle = "rgba(111, 96, 205, 0.72)";
        winnings_y_coord = 25;
        break;
      case 1:
        ctx.fillStyle = "rgba(214, 223, 35, 0.5)";
        winnings_y_coord = 125;
        break;
      case 2:
        ctx.fillStyle = "rgba(42, 56, 143, 0.5)";
        winnings_y_coord = 225;
        break;
      case 3:
        ctx.fillStyle = "rgba(235, 227, 66, 0.59)";
        winnings_y_coord = 25;
        break;
      case 4:
        ctx.fillStyle = "rgba(0, 147, 68, 0.5)";
        winnings_y_coord = 225;
        break;
    }
    for (var j = 0; j < 5; j++) {
      //drawing the highlight of the winning lines (one at a time for each tile)
      var x_coord = LINE_MAP[gameState.currentHighlightTiles][j][0] * 100 + 150;
      var y_coord = LINE_MAP[gameState.currentHighlightTiles][j][1] * 100 + 20;
      ctx.fillRect(x_coord, y_coord, 100, 100);
    };
    //drawing text on a highlighted line
    for (var i = 0; i < gameState.currentLineWinningsMap.length; i++) {
      if (gameState.currentLineWinningsMap[i][0] == gameState.currentHighlightTiles) {
        ctx.textAlign = "left";
        ctx.fillStyle = "red";
        ctx.fillText(gameState.currentLineWinningsMap[i][1].toFixed(1), winnings_x_coord, winnings_y_coord);
      }
    };
  }

  // draw number balls
  if (gameState.line >= 1) {
    ctx.drawImage(ball1Img, 0, 0, 561, 301, 117, 20, 561, 301);
    if (gameState.showLines) {
      ctx.drawImage(line1Img, 0, 0, 561, 301, 117, 20, 561, 301);
    }
  }
  if (gameState.line >= 2) {
    ctx.drawImage(ball2Img, 0, 0, 561, 301, 117, 20, 561, 301);
    if (gameState.showLines) {
      ctx.drawImage(line2Img, 0, 0, 561, 301, 117, 20, 561, 301);
    }
  }
  if (gameState.line >= 3) {
    ctx.drawImage(ball3Img, 0, 0, 561, 301, 117, 20, 561, 301);
    if (gameState.showLines) {
      ctx.drawImage(line3Img, 0, 0, 561, 301, 117, 20, 561, 301);
    }
  }
  if (gameState.line >= 4) {
    ctx.drawImage(ball4Img, 0, 0, 561, 301, 117, 20, 561, 301);
    if (gameState.showLines) {
      ctx.drawImage(line4Img, 0, 0, 561, 301, 117, 20, 561, 301);
    }
  }
  if (gameState.line >= 5) {
    ctx.drawImage(ball5Img, 0, 0, 561, 301, 117, 20, 561, 301);
    if (gameState.showLines) {
      ctx.drawImage(line5Img, 0, 0, 561, 301, 117, 20, 561, 301);
    }
  }
};

// the main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;
};

// let's play this game!
var then = Date.now();
var mainLoop = setInterval(main, 16); // run script every 16 milliseconds
