import { IMouseCoordinates } from "../interfaces/socket_events";

// Game configuration.
const height = 6;                     // number of rows
const width = 7;                      // number of columns
let currentPlayer = 1;              // Whose turn is it - first player is 1 and second is 2. 0 signifies empty square

let pushupType = 1; //0=normal 1=pushup 2=falloutoftop

type IBoardType = Array<Array<number>>;

export function onClientClick(boardList: IBoardType, mouseCoordinates: IMouseCoordinates): boolean {
	// don't permit data with absent coordinates
	if(typeof mouseCoordinates === "undefined")
		return false;

	// don't permit data with absent coordinates
	if(!("x" in mouseCoordinates))
		return false;

	const x = mouseCoordinates.x;

	// don't permit data with non-integer coordinates
	if(!Number.isInteger(x))
		return false;

	// don't permit out-of-bounds coordinates
	if(x >= width || x < 0)
		return false;

    if(pushupType === 0)
    	for(let y = 0; y < height; y++){
				if(boardList[x][y] == 0){
					boardList[x][y] = currentPlayer;
					break;
				}
				if(y == height-1)
					return false;
	    }
    else if (pushupType==1){
			let y;
    	for(y = height-1; y > 0; y--){
				boardList[x][y] = boardList[x][y-1];
	    }
			boardList[x][y] = currentPlayer;
    }
    else if(pushupType == 2){
			if(boardList[x][height-1] != 0)
					return false;
			let y;
    	for(y = height-1; y > 0; y--){
				boardList[x][y] = boardList[x][y-1];
	    }
			boardList[x][y] = currentPlayer;
    }


    currentPlayer = currentPlayer == 1?2:1;

	console.log("Player clicked at (" + x + ")");

	return true;
};

/**
 * Creates a board structure.
 * @returns 2D array of the board structure.
 */
export function makeBoard(): Array<Array<number>> {
	const b = new Array(width);
	for(let i = 0; i < width; i++){
        b[i] = new Array(height).fill(0);
	}
	return b;
};

