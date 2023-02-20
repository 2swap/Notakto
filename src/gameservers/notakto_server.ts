import { IMouseCoordinates } from "../interfaces/socket_events";

const numberOfBoards = 6;

type IBoardType = Array<{
	isDead: boolean,
	grid: Array<Array<string>>,
}>;

export function onClientClick (boardList: IBoardType, mouseCoordinates: IMouseCoordinates): boolean {
	// don't permit data with absent coordinates
	if(typeof mouseCoordinates === "undefined")
		return false;

	// don't permit data with absent coordinates
	if(!("x" in mouseCoordinates) || !("y" in mouseCoordinates) || !("i" in mouseCoordinates))
		return false;

	const x = mouseCoordinates.x;
	const y = mouseCoordinates.y;
	const i = mouseCoordinates.i;

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

function checkDead(boardList: IBoardType, i: number): boolean{
	for(let y = 0; y < 3; y++){
		let allFilled = true;
		for(let x = 0; x < 3; x++){
			if(boardList[i].grid[y][x] == ''){
				allFilled = false;
			}
		}
		if(allFilled)
			return true;
	}

	for(let x = 0; x < 3; x++){
		let allFilled = true;
		for(let y = 0; y < 3; y++){
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

export function makeBoard(): IBoardType {
	const boardList: IBoardType = []
	for(let i = 0; i < numberOfBoards; i++){
		boardList[i] = {
			isDead: false,
			grid: [
				['', '', ''],
				['', '', ''],
				['', '', '']
			]
		};
	}
	return boardList;
};