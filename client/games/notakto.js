var mouseHoverColumn;
var mouseHoverRow;
var mouseHoverBoard;

var squareWidth = w/15;
var boardMarg = squareWidth/2;
var boardWidth = squareWidth*3;






function renderGame(){
	for(var i = 0; i < boardList.length; i++){
		renderBoard(i, xCenterOfIthBoard(i), yCenterOfIthBoard(i));
	}
}
function xCenterOfIthBoard(i){
	var numberOfBoardsInThisRow = Math.min(boardList.length-(i-i%3), 3);
	return w/2 + (i%3-(numberOfBoardsInThisRow-1)*.5)*(boardWidth+2*boardMarg);
}
function yCenterOfIthBoard(i){
	var numberOfRows = Math.ceil(boardList.length/3);
	var whichRow = Math.ceil((i+1)/3)-1;
	return h/2 + (whichRow-(numberOfRows-1)*.5)*(boardWidth+2*boardMarg);
}
function renderBoard(i, rx, ry){
	//render board outline
	ctx.fillStyle = boardList[i].isDead?"#333333":"#666666";
	roundRect(rx-(boardWidth+boardMarg)/2,ry-(boardWidth+boardMarg)/2,boardWidth+boardMarg,boardWidth+boardMarg, boardMarg);

	if(!boardList[i].isDead && i == mouseHoverBoard){
		//render highlighted column
		ctx.fillStyle = "#999999";
		if(mouseHoverColumn >= 0 && mouseHoverColumn < 3 && mouseHoverRow >= 0 && mouseHoverRow < 3){
			ctx.beginPath();
			ctx.arc(xCenterOfIthBoard(i)-boardWidth/2+(mouseHoverColumn+.5)*squareWidth,
					yCenterOfIthBoard(i)-boardWidth/2+(mouseHoverRow+.5)*squareWidth,
					squareWidth*.4, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	

	telegrama(40);
	for(var y = 0; y < 3; y++)
		for(var x = 0; x < 3; x++){
			//render stone
			var letter = boardList[i].grid[y][x];

			//render number
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			ctx.fillText(letter, xCenterOfIthBoard(i)-boardWidth/2+(x+.5)*squareWidth, yCenterOfIthBoard(i)-boardWidth/2+(y+.65)*squareWidth);
			
		}
}

function gameOnClick(){
	socket.emit('click', {x:mouseHoverColumn, y:mouseHoverRow, i:mouseHoverBoard});
}

function gameOnMouseMove(){
	var closest = -1;
	var closestDist = 100000;
	for(var i = 0; i < boardList.length; i++){
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