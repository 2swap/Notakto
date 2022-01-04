var boardSize = 11;

onClientClick = function(boardList, data){
	// don't permit data with absent coordinates
	if(typeof data === "undefined")
		return false;

	// don't permit data with absent coordinates
	if(!("x" in data) || !("y" in data))
		return false;

	var x = data.x;
	var y = data.y;

	// don't permit data with non-integer coordinates
	if(!Number.isInteger(x) || !Number.isInteger(y))
		return false;

	// don't permit out-of-bounds coordinates
	if(x >= boardSize || x < 0 || y >= boardSize || y < 0)
		return false;

	// don't permit play on non-empty square
	if(boardList[y][x] != 'grey')
		return false;

	console.log("Player clicked at (" + y + ", " + x + ")")
	boardList[y][x] = 'blue';

	return true;
};

makeBoard = function(){
	boardList = [];
	for(var y = 0; y < boardSize; y++){
		boardList[y] = [];
		for(var x = 0; x < boardSize; x++){
			boardList[y][x] = "grey";
		}
	}
	return boardList;
};

module.exports = {
	makeBoard:makeBoard,
	onClientClick:onClientClick,
}