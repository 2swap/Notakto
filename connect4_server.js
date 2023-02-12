height = 6;                     // number of rows
width = 7;                      // number of columns
currentPlayer = 1;              // Whose turn is it - first player is 1 and second is 2. 0 signifies empty square

onClientClick = function(boardList, data){
	// don't permit data with absent coordinates
	if(typeof data === "undefined")
		return false;

	// don't permit data with absent coordinates
	if(!("x" in data))
		return false;

	var x = data.x;

	// don't permit data with non-integer coordinates
	if(!Number.isInteger(x))
		return false;

	// don't permit out-of-bounds coordinates
	if(x >= width || x < 0)
		return false;

	for(var y = 0; y < height; y++){
        if(boardList[x][y] == 0){
            boardList[x][y] = currentPlayer;
            break;
        }
        if(y == height-1)
            return false;
	}

    currentPlayer = currentPlayer == 1?2:1;

	console.log("Player clicked at (" + x + ")");

	return true;
};

makeBoard = function(){
	b = new Array(width);
	for(var i = 0; i < width; i++){
        b[i] = new Array(height).fill(0);
	}
	return b;
};

module.exports = {
	makeBoard:makeBoard,
	onClientClick:onClientClick,
}
