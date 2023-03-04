import { BaseGame } from './base';

interface Coordindate {
	x: number,
	y: number,
}

// TODO: Move into common module.
type IBoardType = Array<Array<string>>;

interface BoardListSocketEvent {
	boardList: IBoardType,
}

export class HexCanvas extends BaseGame {
	// Game state.
	private minmx: number;
	private minmy: number;
	private hexagonRadius: number;
	private boardList: IBoardType;

	constructor() {
		super();

		// Set initial state.
		this.minmx = -10;
		this.minmy = -10;
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
	 * Draw game tile given coordinates & color.
	 * @param x x coordinate on canvas.
	 * @param y y coordinate on canvas.
	 * @param fillColor Fill color.
	 */
	private drawTile(x: number, y: number, fillColor: string) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.hexagonRadius, 0, 2 * Math.PI);
		this.ctx.fillStyle = fillColor;
		this.ctx.strokeStyle = "black"
		//ctx.stroke();
		this.ctx.fill();
	}

	/**
	 * Constructs the coordinates of tile position given mouse coordinates.
	 * @param x mouse coordinate x
	 * @param y mouse coordinate y
	 * @returns Coordinate object.
	 */
	private getTilePosition(x, y): Coordindate {
		return {
			x: this.canvasWidth / 2 + (x - this.boardList.length / 2) * this.hexagonRadius * 2 + (y - this.boardList.length / 2 + 1) * this.hexagonRadius,
			y: this.canvasHeight / 2 + (y - this.boardList.length / 2) * this.hexagonRadius * 2 * Math.sqrt(3) / 2
		};
	}

	/// Overrides.

	/**
	 * Game render override.
	 */
	override renderGame() {
		for (let y = 0; y < this.boardList.length; y++) {
			for (let x = 0; x < this.boardList.length; x++) {
				let position = this.getTilePosition(x, y);
				let color = this.boardList[y][x];
				if (this.minmx == x && this.minmy == y)
					color = "red"
				this.drawTile(position.x, position.y, color);
			}
		}
	}

	/**
	 * On mouse click callback overrdide.
	 */
	override gameOnClick() {
		// TODO: strong type payload.
		this.socket.emit('click', { x: this.minmx, y: this.minmy });
	}

	/**
	 * On mouse move callback override.
	 */
	override gameOnMouseMove() {
		this.minmx = this.minmy = -1;
		let min = this.square(this.hexagonRadius);
		for (let y = 0; y < this.boardList.length; y++) {
			for (let x = 0; x < this.boardList.length; x++) {
				let position = this.getTilePosition(x, y)
				const d = this.square(this.mouse.X - position.x) + this.square(this.mouse.Y - position.y);
				if (d < min) {
					min = d;
					this.minmx = x;
					this.minmy = y;
				}
			}
		}
	}


}



