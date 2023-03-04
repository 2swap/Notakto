
interface MouseInterface {
	X: number,	// X-coordinate
	Y: number,	// Y-coordinate
	B: number,	// Button
};

export class CanvasElement {
	protected canvasElt: HTMLCanvasElement;
	protected ctx: CanvasRenderingContext2D;
	protected mouse: MouseInterface;
	protected showMenu: boolean = true;

	// Canvas state.
	protected windowWidth;
	protected windowHeight;
	protected canvasWidth;
	protected canvasHeight;

	/**
	 * Creates a Canvas element with the body of the main HTML page.
	 */
	constructor() {
		// Create a new context element.
		this.canvasElt = document.createElement('canvas');

		// Initialize state.
		this.mouse = {
			X: 0,
			Y: 0,
			B: 0,
		}
		this.windowHeight = window.innerHeight;
		this.windowWidth = window.innerWidth;
		this.canvasWidth = this.canvasElt.width;
		this.canvasHeight = this.canvasElt.height;

		// Obtain the body element to inject the context into.
		const bodyElt = document.getElementsByTagName('body');
		if (!bodyElt.length) {
			throw Error('failed to find body element');
		}
		bodyElt[0].appendChild(this.canvasElt);

		const ctx = this.canvasElt.getContext('2d');
		if (!ctx) {
			throw Error('failed to create a 2D Canvas Context');
		}
		this.ctx = ctx;

		// Initalize listeners.
		this.setupListeners();
	}

	private drawLoop() {
		// Update canvas state.
		this.windowHeight = window.innerHeight;
		this.windowWidth = window.innerWidth;
		this.canvasElt.width = this.windowWidth;
		this.canvasElt.height = this.windowHeight;

		// Render background
		this.ctx.fillStyle = "black";
		this.clearCanvas();

		this.ctx.save();
		if (this.showMenu) this.renderMenu();
		else {
			this.renderTimerBar();
			this.renderChat();
			this.renderGame();
		}

		this.ctx.restore();

		// Request Second Frame (Loop)
		window.requestAnimationFrame(() => this.drawLoop());
	}

	public startDrawLoop() {
		window.requestAnimationFrame(() => this.drawLoop());
	}


	/// Inherited Game functions.

	/**
	 * Render default game onto canvas.
	 */
	protected renderGame() { }

	/**
	 * Mouse click callback.
	 */
	protected gameOnClick() { }

	/**
	 * Mouse move callback.
	 */
	protected gameOnMouseMove() { }


	/// Listeners

	/**
	 * Sets up listeners with callbacks.
	 */
	private setupListeners() {
		document.addEventListener("mousemove", e => {
			this.mouse = {
				B: e.button,
				X: e.x,
				Y: e.y,
			};
			this.gameOnMouseMove();
		});
		document.addEventListener("mouseup", () => this.gameOnClick());
	}


	/// Rendering

	protected renderTimerBar() {
		//todo
	}
	protected renderChat() {
		//todo
	}

	/**
	 * Render default canvas menu.
	 */
	protected renderMenu() {
		this.ctx.fillStyle = "black";
		this.write("Make Friend Game", 10, 10);
		this.write("Join Friend Game", 10, 40);
		this.write("Play With Random", 10, 70);
	}


	/// Utilities

	/**
	 * Clears the canvas.
	 */
	public clearCanvas() {
		this.ctx.fillRect(0, 0, this.windowWidth, this.windowHeight);
	}

	/**
	 * Sets the context font style to Trebuchet MS with a given font px size.
	 * @param fontSize Font pixel size.
	 */
	public telegrama(fontSize: number) {
		this.ctx.font = fontSize + "px Trebuchet MS";
	}

	/**
	 * Writes a given string to x & y coordinates.
	 * @param str String to write.
	 * @param x x coordinate on canvas.
	 * @param y y coordinate on canvas.
	 */
	public write(str: string, x: number, y: number) {
		this.ctx.fillText(str, x, y);
	}

	/**
	 * Draws a circle onto the canvas given coorinates and radius.
	 * @param x x coordinate on canvas.
	 * @param y y coordinate on canvas.
	 * @param r circle's radius.
	 */
	public circle(x: number, y: number, r: number) {
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.beginPath();
		this.ctx.arc(0, 0, r, 0, 2 * Math.PI);
		this.ctx.stroke();
		this.ctx.restore();
	}

	/**
	 * Draws a round rectangle onto the canvas given coorinates and radius.
	 * @param x x coordinate on canvas.
	 * @param y y coordinate on canvas.
	 * @param w width.
	 * @param h height.
	 * @param r circle's radius.
	 */
	public roundRect(x: number, y: number, w: number, h: number, r: number) {
		this.ctx.beginPath();
		this.ctx.moveTo(x + r, y);
		this.ctx.arcTo(x + w, y, x + w, y + h, r);
		this.ctx.arcTo(x + w, y + h, x, y + h, r);
		this.ctx.arcTo(x, y + h, x, y, r);
		this.ctx.arcTo(x, y, x + w, y, r);
		this.ctx.closePath();
		this.ctx.fill();
	}
}



