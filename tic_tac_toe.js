/*jslint node: true*/
"use strict";
//set up the context
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

//grid variable
var game = {
  grid: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  cleanGrid: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  p1score: 0,
  p2score: 0,
  
  turn: 0 //turn is based on even/odd
};

//use this variable to check for victory
var winConditions = {
  rows: [
    [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2]
    ]
  ],
  columns: [
    [
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2]
    ]
  ],
  corners: [
    [
      [2, 0],
      [1, 1],
      [0, 2]
    ], //top right, bottom left
    [
      [0, 0],
      [1, 1],
      [2, 2]
    ] //top left, bottom right
  ]
};

function checkWinConditions(symbol) {
  //check columns
  var i, j, ctr = 0;
  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      if (game.grid[i][j] === symbol) {
        ctr += 1;
      }//if
      if (ctr === 3) {
        if (symbol === 1) {
          game.p1score += 1;
          MCST.reward(1);
        }
        else {
          game.p2score += 1;
          MCST.reward(2);
        }
        game.grid = [
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]
                    ];
        game.turn = 0;
        ctr = 0;
        MCST.moveList = [];
        return true;
      }//if
    }//for
    ctr = 0;
  }//for
  //check rows
  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      if (game.grid[j][i] === symbol) {
        ctr += 1;
      }//if
      if (ctr === 3) {
        if (symbol === 1) {
          game.p1score += 1;
          MCST.reward(1);
        }
        else {
          game.p2score += 1;
          MCST.reward(2);
        }
        game.grid = [
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]
                    ];
        game.turn = 0;
        ctr = 0;
        MCST.moveList = [];
        return true;
      }//if
    }//for
    ctr = 0;
  }//for
  
  //check corners
  if ((game.grid[0][0] === symbol && game.grid[1][1] === symbol && game.grid[2][2] === symbol || game.grid[0][2] === symbol && game.grid[1][1] === symbol && game.grid[2][0] === symbol)) {
        if (symbol === 1) {
          game.p1score += 1;
          MCST.reward(1);
        }
        else {
          game.p2score += 1;
          MCST.reward(2);
        }
    game.grid = [
                  [0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]
                ];
    game.turn = 0;
    MCST.moveList = [];
    return true;
  }
  
  //check for cat's game
  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      if (game.grid[i][j] === 0) {
        return false;
      }//if
      else if (i === 2 && j === 2 && game.grid[i][j] !== 0) {
        //reset game
        game.grid = [
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]
                    ];
        game.turn = 0;
        MCST.moveList = [];
      }//elseif
    }//for
  }//for
  return false;
}//checkWinConditions


/*MCTS implementation*/
function Node() {
  this.parent = null;
  this.player = 0;
  this.data = {
    win: 1,
    loss: 1,
  };
  this.children = [];
  this.pos = {
    x: null,
    y: null
  };
}

function Tree() {
  this._root = new Node();
  this._root.pos.x = null;
  this._root.pos.y = null;
  this.simulations = 0;
  this.moveList = [];
}

var MCST = new Tree(); //actual tree
MCST.move = function(xPos, yPos) {
  var i, moveCtr = 0;
  if (this._root.children.length === 0) {
    var node = new Node();
    node.parent = this._root;
    node.pos.x = xPos;
    node.pos.y = yPos;
    node.player = game.turn % 2 + 1;
    this.moveList.push(node);
    this._root.children.push(node);
  }//if
  
  //first move in round
  if (this.moveList.length === 0) {
    for (i = 0; i < this._root.children.length; i += 1) {
      if (this._root.children[i].pos.x === xPos && 
          this._root.children[i].pos.y === yPos) {
        this.moveList.push(this._root.children[i]);
        game.grid[this.moveList[this.moveList.length - 1].pos.x][this.moveList[this.moveList.length - 1].pos.y] = game.turn % 2 + 1;
        game.turn += 1;
        return;
      }//if
    }//for
    var node = new Node();
    node.parent = this._root;
    node.pos.x = xPos;
    node.pos.y = yPos;
    node.player = game.turn % 2 + 1;
    this.moveList.push(node);
    this._root.children.push(node);
    game.grid[this.moveList[this.moveList.length - 1].pos.x][this.moveList[this.moveList.length - 1].pos.y] = game.turn % 2 + 1;
    game.turn += 1;
    return;
  }//else if
  
  else {
    moveCtr = 0;
    var walk = this._root;
    while (walk.children.length > 0) {
      if (moveCtr === this.moveList.length) {
        break;
      }//if
      for (i = 0; i < walk.children.length; i += 1) {
        if (this.moveList[moveCtr].pos.x === walk.children[i].pos.x &&
            this.moveList[moveCtr].pos.y === walk.children[i].pos.y) {
          moveCtr += 1;
          walk = walk.children[i];
          break;
        }//if
      }//for
    }//while
    for (i = 0; i < walk.children.length; i += 1) {
      if (walk.children[i].pos.x === xPos &&
          walk.children[i].pos.y === yPos) {
        this.moveList.push(walk.children[i]);
        game.grid[this.moveList[this.moveList.length - 1].pos.x][this.moveList[this.moveList.length - 1].pos.y] = game.turn % 2 + 1;
        game.turn += 1;
        return;
      }//if
    }//for
    var node = new Node();
    node.parent = walk;
    node.pos.x = xPos;
    node.pos.y = yPos;
    this.moveList.push(node);
    walk.children.push(node);
  }//else
  game.grid[this.moveList[this.moveList.length - 1].pos.x][this.moveList[this.moveList.length - 1].pos.y] = game.turn % 2 + 1;
  game.turn += 1;
};

MCST.reward = function(player) {
  var walk = this._root;
  var i, moveCtr = 0;
  //traverse to end of moveList and ajust reward
   while (walk.children.length > 0) {
      for (i = 0; i < walk.children.length; i += 1) {
        if (this.moveList[moveCtr] === walk.children[i]) {
          moveCtr += 1;
          if (player === 1) {
            walk.data.loss += 1;
          }//if
          else if (player === 2) {
            walk.data.win += 1;
          }//elseif
          walk = walk.children[i];
          break;
        }//if
      }//for
    }//while
};
function simulate() {
   
}//simulate

//draw TTT grid
function drawGrid() {
  //draw background & HUD
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height - 50);
  ctx.fillStyle = "#f6f1d0";
  ctx.fill();
  ctx.closePath();
  //TTT grid
  var grid_r, grid_c;
  for (grid_c = 0; grid_c < 3; grid_c += 1) {
    for (grid_r = 0; grid_r < 3; grid_r += 1) {
      ctx.beginPath();
      ctx.rect(100 * grid_c + 100, 100 * grid_r + 100, 75, 75);
      if (game.grid[grid_c][grid_r] === 1) {
        ctx.fillStyle = '#16174f';
        ctx.fill();
        ctx.closePath();
      } else if (game.grid[grid_c][grid_r] === 2) {
        ctx.fillStyle = '#963019';
        ctx.fill();
        ctx.closePath();

      } else {
        ctx.fillStyle = '#667467'; 
        ctx.fill();
        ctx.closePath();
      }
    } //for
  } //for

  //HUD break
  ctx.beginPath();
  ctx.rect(25, 50, canvas.width - 50, 1);

  //color
  ctx.fillStyle = '#667467';
  ctx.fill();
  ctx.closePath();

  //draw title
  ctx.font = "30px Tahoma";
  ctx.fillText("Tic Tac Toe", 171.5, 40);

  //draw player and CPU score
  ctx.fillStyle = "#16174f";
  ctx.fillText(game.p1score, 50, 40);
  ctx.fillStyle = "#963019";
  ctx.fillText(game.p2score, canvas.width - 75, 40);
  
  //draw score reset button
  ctx.beginPath();
  ctx.rect(canvas.width / 2 - 62.5, canvas.height - 110, 100, 50);
  ctx.fillStyle = "#667467";
  ctx.fill();
  ctx.fillStyle = "#f6f1ed";
  ctx.fillText("Reset", canvas.width / 2 - 50, canvas.height - 75);
  ctx.closePath();
  
} //drawGrid

$("#screen").click(function(e) {
  var r = canvas.getBoundingClientRect();
  var i, j;
  var x = e.clientX - r.left;
  var y = e.clientY - r.top;

  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      if (x >= 100 + 100 * i &&
        x <= 175 + 100 * i &&
        y >= 100 + 100 * j &&
        y <= 175 + 100 * j) {
        MCST.move(i, j);
      } //if
    } //for
  } //for
  
  //reset button
  if (x > canvas.width/2 - 62.5 && x < canvas.width/2 + 37.5 && y > canvas.height - 110 && y < canvas.height - 60) {
    game.p1score = 0;
    game.p2score = 0;
    game.grid = [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ];
    MCST.moveList = [];
  }//if
});
//draw function
function main() {
  //refresh screen based on interval
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  checkWinConditions(1);
  checkWinConditions(2);
}
setInterval(main, 10);

//COLOR SCHEME
//#16174f - blue
//#963019 - red
//#f6f1ed - background offwhite
//#667467 - offgrey