var height = 6;                     // number of rows
var width = 7;                      // number of columns
var currentPlayer = 1;              // Whose turn is it - first player is 1 and second is 2. 0 signifies empty square

var pushupType = 1; //0=normal 1=pushup 2=falloutoftop

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

    if(pushup == 0)
    	for(var y = 0; y < height; y++){
            if(boardList[x][y] == 0){
                boardList[x][y] = currentPlayer;
                break;
            }
            if(y == height-1)
                return false;
	    }
    else if (pushup==1){
    	for(var y = height-1; y > 0; y--){
            boardList[x][y] = boardList[x][y-1];
	    }
        boardList[x][y] = currentPlayer;
    }
    else if(pushup == 2){
        if(boardList[x][height-1] != 0)
            return false;
    	for(var y = height-1; y > 0; y--){
            boardList[x][y] = boardList[x][y-1];
	    }
        boardList[x][y] = currentPlayer;
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
