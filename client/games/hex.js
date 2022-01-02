var numberOfBoards = 0;
var mouseHoverColumn;
var mouseHoverRow;
var mouseHoverBoard;

var board = 0;

var squareWidth = w/15;
var boardMarg = squareWidth/2;
var boardWidth = squareWidth*3;


function renderGame(){
	ctx.fillStyle = "#bbffff";
	ctx.fillRect(0,0,canvasW,canvasH);

	ctx.save();
	ctx.translate(margin,margin);

	var min = 10000000;
	for (var s in grid) {
		var gx = strtox(s), gy = strtoy(s);
		var tx = gx*tileW; ty = gy*tileH;
		d = square(mx-(tx+tileW/2)) + square(my-(ty+tileH/2+(tileW-tileH)/2));
		if(d < min){
			min = d;
			minmx = gx;
			minmy = gy;
		}
		drawTile(tx, ty, board[s]);
	}

	//draw mouse
	drawTile(tileW*minmx,tileH*minmy,"#80808080");

	ctx.restore();
}

function drawTile(x, y, fillColor) {
	ctx.arc(x, y, 6, 100);
	ctx.closePath();
	ctx.fillStyle = fillColor;
	ctx.strokeStyle = "black"
	ctx.stroke();
	ctx.fill();
}

function gameOnClick(){
	var closest = -1;
	var closestDist = 100000;
	for(var i = 0; i < numberOfBoards; i++){
		var dist = Math.abs(square(mx - xCenterOfIthBoard(i)) + square(my - yCenterOfIthBoard(i)));
		if(dist < closestDist){
			closest = i;
			closestDist = dist;
		}
	}

	mouseHoverBoard = closest;
	mouseHoverColumn = Math.floor((mx-xCenterOfIthBoard(mouseHoverBoard)+boardWidth/2)/squareWidth);
	mouseHoverRow =    Math.floor((my-yCenterOfIthBoard(mouseHoverBoard)+boardWidth/2)/squareWidth);

}


