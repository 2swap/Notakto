var mouseHoverColumn;

var width = 7;
var height = 6;

var squareWidth = w/15;
var boardMarg = squareWidth/2;
var boardWidth = squareWidth*width;
var boardHeight = squareWidth * height;




function renderGame(){
	//render board outline
	ctx.fillStyle = "#777777";
	roundRect(w/2-(boardWidth+boardMarg)/2,h/2-(boardHeight+boardMarg)/2,boardWidth+boardMarg,boardHeight+boardMarg, boardMarg);

	//render highlighted column
	ctx.fillStyle = "#999999";
	if(mouseHoverColumn >= 0 && mouseHoverColumn < width){
		roundRect(w/2-boardWidth/2+mouseHoverColumn*squareWidth,h/2-boardHeight/2,squareWidth,boardHeight, boardMarg);
	}

	for(var y = 0; y < height; y++)
		for(var x = 0; x < width; x++){
			var colors = ["#bbbbbb", "#dd4444", "#dddd44"];
			console.log(boardList, x, y, boardList[x][y]);
			ctx.fillStyle = colors[boardList[x][y]];
			ctx.beginPath();
			ctx.arc(w/2+(x-(width-1)/2)*squareWidth,h/2+(-y+(height-1)/2)*squareWidth,squareWidth/2.5, 0, 2*Math.PI);
			ctx.fill();
		}
}

function gameOnClick(){
	socket.emit('click', {x:mouseHoverColumn});
}

function gameOnMouseMove(){
	mouseHoverColumn = Math.floor((mx-w/2+boardWidth/2)/squareWidth);
}
