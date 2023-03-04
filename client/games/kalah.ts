import { BaseGame } from './base';

interface Coordindate {
	x: number,
	y: number,
}

// TODO: Move into common module.
export type IBoardType = Array<number>;

interface BoardListSocketEvent {
	boardList: IBoardType,
}

export class KalahCanvas extends BaseGame {
	// Game state.
	private minmx: number; // Minimum mouse coordinate x.
	private hexagonRadius: number;
	private boardList: IBoardType;

	constructor() {
		super();

		// Set initial game state.
		this.minmx = -10;
		this.hexagonRadius = 20;


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
	 * Constructs the coordinates of tile position given mouse coordinates.
	 * @param x mouse coordinate x
	 * @returns Coordinate object.
	 */
	private getTilePosition(x: number): Coordindate {
		const m = this.boardList.length / 2 - 1;
		const w = this.canvasWidth;
		const h = this.canvasHeight;

		if ((x + 1) % (m + 1) == 0)
			return {
				x: w / 2 + (x - .5 - m * 1.5) * this.hexagonRadius * 2,
				y: h / 2,
			};
		if (x < m) // south
			return {
				x: w / 2 - (x + .5 - m / 2) * this.hexagonRadius * 2,
				y: h / 2 - this.hexagonRadius,
			};
		if (x > m) // north
			return {
				x: w / 2 + (x - .5 - m * 3 / 2) * this.hexagonRadius * 2,
				y: h / 2 + this.hexagonRadius,
			};
		else
			throw Error('Failed to get tile position');
	}

	/**
	 * Draws tile onto the board.
	 * @param boardPosition Game board position.
	 */
	private drawTile(boardPosition: number) {
		const position = this.getTilePosition(boardPosition);
		this.ctx.beginPath();
		this.ctx.arc(position.x, position.y, this.hexagonRadius, 0, 2 * Math.PI);
		let color = "grey";
		if (this.minmx == boardPosition)
			color = "red"
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.ctx.fillStyle = "black";
		this.telegrama(20);
		this.ctx.textAlign = "center";
		this.ctx.fillText(
			this.boardList[boardPosition].toString(),
			position.x,
			position.y,
		);
	}

	/// Overrides.

	/**
	 * Game render override.
	 */
	override renderGame() {
		for (let x = 0; x < this.boardList.length; x++) {
			this.drawTile(x);
		}
	}

	/**
	 * On mouse click callback overrdide.
	 */
	override gameOnClick() {
		this.socket.emit('click', { x: this.minmx });
	}

	/**
	 * On mouse move callback override.
	 */
	override gameOnMouseMove() {
		this.minmx = -1;
		let min = this.square(this.hexagonRadius);
		for (let x = 0; x < this.boardList.length; x++) {
			let position = this.getTilePosition(x)
			const d = this.square(this.mouse.X - position.x) + this.square(this.mouse.Y - position.y);
			if (d < min) {
				min = d;
				this.minmx = x;
			}
		}
	}
}

