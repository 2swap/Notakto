var minmx = -10;

var hexagonRadius = 20;

function getTilePositionOld(x){
	return {x:w/4*(Math.cos((x+1)/boardList.length*Math.PI*2)+2), y:w/4*(-Math.sin((x+1)/boardList.length*Math.PI*2)+2)};
}

function getTilePosition(x){
	var m = boardList.length/2-1;
	if((x+1) % (m+1) == 0)
		return {x:w/2+(x-.5-m*1.5)*hexagonRadius*2, y:h/2};
	if(x < m) // south
		return {x:w/2-(x+.5-m/2)*hexagonRadius*2, y:h/2 - hexagonRadius};
	if(x > m) // north
		return {x:w/2+(x-.5-m*3/2)*hexagonRadius*2, y:h/2 + hexagonRadius};
	else
		return "oops";
}

function renderGame(){
	for(var x = 0; x < boardList.length; x++){
		drawTile(x);
	}
}

function drawTile(boardPosition) {
	var position = getTilePosition(boardPosition);
	ctx.beginPath();
	ctx.arc(position.x, position.y, hexagonRadius, 0, 2*Math.PI);
	color = "grey";
	if(minmx == boardPosition)
		color = "red"
	ctx.fillStyle = color;
	ctx.fill();
	ctx.fillStyle = "black";
	telegrama(20);
	ctx.textAlign = "center";
	ctx.fillText(boardList[boardPosition], position.x, position.y);
}

function gameOnClick(){
	socket.emit('click', {x:minmx});
}

function gameOnMouseMove(){
	minmx = minmy = -1;
	var min = square(hexagonRadius);
	for(var x = 0; x < boardList.length; x++){
		var position = getTilePosition(x)
		d = square(mx-position.x) + square(my-position.y);
		if(d < min){
			min = d;
			minmx = x;
		}
	}
}


