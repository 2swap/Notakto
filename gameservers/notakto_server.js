var numberOfBoards = 6;

onClientClick = function(boardList, data){
	// don't permit data with absent coordinates
	if(typeof data === "undefined")
		return false;

	// don't permit data with absent coordinates
	if(!("x" in data) || !("y" in data) || !("i" in data))
		return false;

	var x = data.x;
	var y = data.y;
	var i = data.i;

	// don't permit data with non-integer coordinates
	if(!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(i))
		return false;

	// don't permit out-of-bounds coordinates
	if(x >= 3 || x < 0 || y >= 3 || y < 0 || i < 0 || i >= numberOfBoards)
		return false;

	// don't permit play on non-empty square
	if(boardList[i].grid[y][x] != '')
		return false;

	// don't permit play on dead board
	if(boardList[i].isDead)
		return false;

	console.log("Player clicked on board " + i + " at (" + y + ", " + x + ")")
	boardList[i].grid[y][x] = 'x';

	if(checkDead(boardList, i))
		boardList[i].isDead = true;

	return true;
};

checkDead = function(boardList, i){
	for(var y = 0; y < 3; y++){
		allFilled = true;
		for(var x = 0; x < 3; x++){
			if(boardList[i].grid[y][x] == ''){
				allFilled = false;
			}
		}
		if(allFilled)
			return true;
	}

	for(var x = 0; x < 3; x++){
		allFilled = true;
		for(var y = 0; y < 3; y++){
			if(boardList[i].grid[y][x] == ''){
				allFilled = false;
			}
		}
		if(allFilled)
			return true;
	}

	if(boardList[i].grid[0][0]!='' && boardList[i].grid[1][1]!='' && boardList[i].grid[2][2]!='')
		return true;
	if(boardList[i].grid[2][0]!='' && boardList[i].grid[1][1]!='' && boardList[i].grid[0][2]!='')
		return true;

	return false;
};

makeBoard = function(){
	var boardList = []
	for(var i = 0; i < numberOfBoards; i++){
		boardList[i] = {isDead:false, grid: [ ['', '', ''], ['', '', ''], ['', '', ''] ]};
	}
	return boardList;
};

module.exports = {
	makeBoard:makeBoard,
	onClientClick:onClientClick,
}