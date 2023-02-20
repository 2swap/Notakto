import { IMouseCoordinates } from "../interfaces/socket_events";

const boardSize = 11;

type IBoardType = Array<Array<string>>;

export function onClientClick(boardList: IBoardType, mouseCoordinates: IMouseCoordinates): boolean {
	// don't permit data with absent coordinates
	if(typeof mouseCoordinates === "undefined")
		return false;

	// don't permit mouseCoordinates with absent coordinates
	if(!("x" in mouseCoordinates) || !("y" in mouseCoordinates))
		return false;

	var x = mouseCoordinates.x;
	var y = mouseCoordinates.y;

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

export function makeBoard(): IBoardType {
	const boardList: IBoardType = [];
	for(let y = 0; y < boardSize; y++){
		boardList[y] = [];
		for(let x = 0; x < boardSize; x++){
			boardList[y][x] = "grey";
		}
	}
	return boardList;
};
