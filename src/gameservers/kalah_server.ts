import { IMouseCoordinates } from "../interfaces/socket_events";

const m=6;						// holes per side
const n=4;						// seeds per hole
const h=(m+1)*2;					// total number of pits in board
const northsKalahah = m*2+1;		// Array index of North's large pit
const southsKalahah = m;			// Array index of South's large pit
const totalStones = n*m*2;		// Amount of stones on board in total


type IBoardType = Array<number>;

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
	if(x >= h || x < 0)
		return false;

	// can't play a kalahah
	if(x == northsKalahah || x == southsKalahah)
		return false;

	// don't permit play of an empty pit
	if(boardList[x] as any === 0)
		return false;

	let i = x;
	const clickedOnSouthSide = x < southsKalahah;
	while(boardList[x] > 0) {
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

export function makeBoard(): IBoardType {
	const b: IBoardType = new Array(h);
	for(let i = 0; i < h; i++){
		if(i === northsKalahah || i === southsKalahah)
			b[i] = 0;
		else
			b[i] = n;
	}
	return b;
};

