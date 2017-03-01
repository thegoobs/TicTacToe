/*jslint node: true*/
"use strict";

//set up the context
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");


//draw TTT grid
function drawGrid() {
	//draw background & HUD
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height - 50);
	ctx.fillStyle = "#f6f1ed";
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	//TTT grid
	ctx.rect(177.5, 100, 10, canvas.height - 175);
	ctx.rect(177.5 + 125, 100, 10, canvas.height - 175);
	ctx.rect(75, 200, canvas.width - 150, 10);
	ctx.rect(75, 300, canvas.width - 150, 10);
	
	//HUD break
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
	ctx.fillText("0", 50, 40);
	ctx.fillStyle = "#963019";
	ctx.fillText("0", canvas.width - 75, 40);
}//drawGrid

//draw function
function draw() {
	//refresh screen based on interval
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
}
setInterval(draw, 10);

//COLOR SCHEME
//#16174f - blue
//#963019 - red
//#f6f1ed - background offwhite
//#667467 - offgrey