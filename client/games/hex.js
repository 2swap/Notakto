var minmx = -10; minmy = -10;

var hexagonRadius = 20;

function getTilePosition(x, y){
	return {x:w/2 + (x-boardList.length/2)*hexagonRadius*2 + (y-boardList.length/2+1)*hexagonRadius, y:h/2 + (y-boardList.length/2)*hexagonRadius*2*Math.sqrt(3)/2};
}

function renderGame(){
	for(var y = 0; y < boardList.length; y++){
		for(var x = 0; x < boardList.length; x++){
			var position = getTilePosition(x, y);
			var color = boardList[y][x];
			if(minmx == x && minmy == y)
				color = "red"
			drawTile(position.x, position.y, color);
		}
	}
}

function drawTile(x, y, fillColor) {
	ctx.beginPath();
	ctx.arc(x, y, hexagonRadius, 0, 2*Math.PI);
	ctx.fillStyle = fillColor;
	ctx.strokeStyle = "black"
	//ctx.stroke();
	ctx.fill();
}

function gameOnClick(){
	socket.emit('click', {x:minmx, y:minmy});
}

function gameOnMouseMove(){
	minmx = minmy = -1;
	var min = square(hexagonRadius);
	for(var y = 0; y < boardList.length; y++){
		for(var x = 0; x < boardList.length; x++){
			var position = getTilePosition(x,y)
			d = square(mx-position.x) + square(my-position.y);
			if(d < min){
				min = d;
				minmx = x;
				minmy = y;
			}
		}
	}
}


