var m=6;						// holes per side
var n=4;						// seeds per hole
var h=(m+1)*2;					// total number of pits in board
var northsKalahah = m*2+1;		// Array index of North's large pit
var southsKalahah = m;			// Array index of South's large pit
var totalStones = n*m*2;		// Amount of stones on board in total

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
	if(x >= h || x < 0)
		return false;

	// can't play a kalahah
	if(x == northsKalahah || x == southsKalahah)
		return false;

	// don't permit play of an empty pit
	if(boardList[x] == 0)
		return false;

	var i = x;
	var clickedOnSouthSide = x < southsKalahah;
	while(boardList[x] > 0){
		boardList[x]--;
		i++;
		i%=h;
		if(clickedOnSouthSide && i==northsKalahah || !clickedOnSouthSide && i==southsKalahah){
			i++;
		}
		i%=h;
		boardList[i]++;
	}

	console.log("Player clicked at (" + x + ")");

	return true;
};

makeBoard = function(){
	b = new Array(h);
	for(var i = 0; i < h; i++){
		if(i == northsKalahah || i == southsKalahah)
			b[i] = 0;
		else
			b[i] = n;
	}
	return b;
};

module.exports = {
	makeBoard:makeBoard,
	onClientClick:onClientClick,
}
