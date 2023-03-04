import { BaseGame } from './base';

interface Coordindate {
	x: number,
	y: number,
}

// TODO: Move into common module.
export type IBoardType = Array<{
	isDead: boolean,
	grid: Array<Array<string>>,
}>;

interface BoardListSocketEvent {
	boardList: IBoardType,
}


export class NotaktoCanvas extends BaseGame {
	// Game state.
	private boardList: IBoardType;
	private squareWidth: number;
	private boardMarg: number;
	private boardWidth: number;
	private mouseHoverColumn: number;
	private mouseHoverRow: number;
	private mouseHoverBoard: number;


	constructor() {
		super();

		// Set inital game state.
		this.squareWidth = this.canvasWidth / 15;
		this.boardMarg = this.squareWidth / 2;
		this.boardWidth = this.squareWidth * 3;

		// Game state handling.
		this.socket.on('boardList', (data: BoardListSocketEvent) => {
			this.boardList = data.boardList;
			console.log("Got boardList update.");
			this.showMenu = false;
		});
	}


	/// Utilities.

	/**
	 * Squares given number.
	 * @param x Number to square.
	 * @returns x*x
	 */
	private square(x: number) {
		return x * x;
	}

	/**
	 * Returns x-center of ith board.
	 * @param i board index.
	 * @returns x-coordindate for the center of the given board.
	 */
	private xCenterOfIthBoard(i: number) {
		const numberOfBoardsInThisRow = Math.min(this.boardList.length - (i - i % 3), 3);
		const w = this.canvasWidth;

		return w / 2 + (i % 3 - (numberOfBoardsInThisRow - 1) * .5) * (this.boardWidth + 2 * this.boardMarg);
	}

	/**
	 * Returns y-center of ith board.
	 * @param i board index.
	 * @returns y-coordindate for the center of the given board.
	 */
	private yCenterOfIthBoard(i: number) {
		const numberOfRows = Math.ceil(this.boardList.length / 3);
		const whichRow = Math.ceil((i + 1) / 3) - 1;
		const h = this.canvasHeight;
		return h / 2 + (whichRow - (numberOfRows - 1) * .5) * (this.boardWidth + 2 * this.boardMarg);
	}

	/**
	 * Renders the board
	 * @param i Index of the board.
	 * @param rx X-center of the board.
	 * @param ry Y-center of the board.
	 */
	private renderBoard(i: number, rx: number, ry: number) {
		// Render board outline.
		this.ctx.fillStyle = this.boardList[i].isDead ? "#333333" : "#666666";
		this.roundRect(
			rx - (this.boardWidth + this.boardMarg) / 2,
			ry - (this.boardWidth + this.boardMarg) / 2,
			this.boardWidth + this.boardMarg,
			this.boardWidth + this.boardMarg,
			this.boardMarg
		);

		if (!this.boardList[i].isDead && i == this.mouseHoverBoard) {
			//render highlighted column
			this.ctx.fillStyle = "#999999";
			if (this.mouseHoverColumn >= 0 && this.mouseHoverColumn < 3 && this.mouseHoverRow >= 0 && this.mouseHoverRow < 3) {
				this.ctx.beginPath();
				this.ctx.arc(this.xCenterOfIthBoard(i) - this.boardWidth / 2 + (this.mouseHoverColumn + .5) * this.squareWidth,
					this.yCenterOfIthBoard(i) - this.boardWidth / 2 + (this.mouseHoverRow + .5) * this.squareWidth,
					this.squareWidth * .4, 0, 2 * Math.PI);
				this.ctx.fill();
			}
		}

		this.telegrama(40);
		for (let y = 0; y < 3; y++)
			for (let x = 0; x < 3; x++) {
				// Render stone
				const letter = this.boardList[i].grid[y][x];

				//render number
				this.ctx.textAlign = "center";
				this.ctx.fillStyle = "#000000";
				this.ctx.fillText(letter, this.xCenterOfIthBoard(i) - this.boardWidth / 2 + (x + .5) * this.squareWidth, this.yCenterOfIthBoard(i) - this.boardWidth / 2 + (y + .65) * this.squareWidth);
			}
	}



	/// Overrides.

	/**
	 * Game render override.
	 */
	override renderGame() {
		for (let i = 0; i < this.boardList.length; i++) {
			this.renderBoard(i, this.xCenterOfIthBoard(i), this.yCenterOfIthBoard(i));
		}
	}

	/**
	 * On mouse click callback overrdide.
	 */
	override gameOnClick() {
		// TODO: strong type this.
		this.socket.emit('click', {
			x: this.mouseHoverColumn,
			y: this.mouseHoverRow,
			i: this.mouseHoverBoard,
		});
	}

	/**
	 * On mouse move callback override.
	 */
	override gameOnMouseMove() {
		let closest = -1;
		let closestDist = 100000;
		for (let i = 0; i < this.boardList.length; i++) {
			let dist = Math.abs(this.square(this.mouse.X - this.xCenterOfIthBoard(i)) + this.square(this.mouse.Y - this.yCenterOfIthBoard(i)));
			if (dist < closestDist) {
				closest = i;
				closestDist = dist;
			}
		}

		this.mouseHoverBoard = closest;
		this.mouseHoverColumn = Math.floor((this.mouse.X - this.xCenterOfIthBoard(this.mouseHoverBoard) + this.boardWidth / 2) / this.squareWidth);
		this.mouseHoverRow = Math.floor((this.mouse.Y - this.yCenterOfIthBoard(this.mouseHoverBoard) + this.boardWidth / 2) / this.squareWidth);

	}
}
