import { BaseGame } from './base';

// TODO: Move into common module.
type IBoardType = Array<Array<number>>;

interface BoardListSocketEvent {
  boardList: IBoardType,
}

export class Connect4Canvas extends BaseGame {
	// Board dimensions.
	private boardWidth: number;
	private boardHeight: number;

	// Board Tiles.
	private width: number;
	private height: number;

	// Board attributes.
	private squareWidth: number;
	private boardMarg: number;
	private mouseHoverColumn: number;
  private boardList: IBoardType;

	constructor() {
		super();

		// Configure the board.
		this.width = 7;
		this.height = 6;
		this.mouseHoverColumn = 0;
		this.boardMarg = 0;
		this.squareWidth = 0;
		this.boardWidth = 0;
		this.boardHeight = 0;
		this.boardList = [[]];


		// Game state handling.
    this.socket.on('boardList', (data: BoardListSocketEvent) => {
      this.boardList = data.boardList;
      console.log("Got boardList update.");
			this.showMenu = false;
    });
	}


	/// Overrides.

	/**
	 * On mouse click callback overrdide.
	 */
	override gameOnClick() {
		// TODO: strong type the payload.
		this.socket.emit('click', {
			x: this.mouseHoverColumn
		});
	}

	/**
	 * On mouse move callback override.
	 */
	override gameOnMouseMove() {
		this.mouseHoverColumn = Math.floor(
			(this.mouse.X - this.canvasElt.width / 2 + this.boardWidth / 2) / this.squareWidth
		);
	}


	/**
	 * Game render override.
	 */
	override renderGame() {
		// Calculate board dimentions.
		this.squareWidth = this.canvasElt.width / 15;
		this.boardMarg = this.squareWidth / 2;
		this.boardWidth = this.squareWidth * this.width;
		this.boardHeight = this.squareWidth * this.height;

		// Obtain the canvas dimensions.
		const canvasWidth = this.canvasElt.width;
		const canvasHeight = this.canvasElt.height;

		//render board outline
		this.ctx.fillStyle = "#333399";

		this.roundRect(
			canvasWidth / 2 - (this.boardWidth + this.boardMarg) / 2,
			canvasHeight / 2 - (this.boardHeight + this.boardMarg) / 2,
			this.boardWidth + this.boardMarg,
			this.boardHeight + this.boardMarg, this.boardMarg
		);

		//render highlighted column
		this.ctx.fillStyle = "#222288";
		if (this.mouseHoverColumn >= 0 && this.mouseHoverColumn < this.width) {
			this.roundRect(
				canvasWidth / 2 - this.boardWidth / 2 + this.mouseHoverColumn * this.squareWidth,
				canvasHeight / 2 - this.boardHeight / 2,
				this.squareWidth, this.boardHeight,
				this.boardMarg
			);
		}

		for (let y = 0; y < this.height; y++)
			for (let x = 0; x < this.width; x++) {
				const colors = ["#222288", "#ee3333", "#eeee33"];
				// console.log(this.boardList, x, y, this.boardList[x][y]);
				this.ctx.fillStyle = colors[this.boardList[x][y]];
				this.ctx.beginPath();
				this.ctx.arc(
					canvasWidth / 2 + (x - (this.width - 1) / 2) * this.squareWidth,
					canvasHeight / 2 + (-y + (this.height - 1) / 2) * this.squareWidth,
					this.squareWidth / 2.5, 0, 2 * Math.PI
				);
				this.ctx.fill();
			}
	}
}

