export interface TextStyle {
	fontFamily?: string;
	x?: number;
	y?: number;
	size?: number;
	weight?: number;
	color?: string;
	alpha?: number;
	text?: string;
}

//directions start from top/top_left and go clockwise

export enum Bounds {
	 TOP_LEFT = 0,
	 TOP_RIGHT = 1,
	 BOTTOM_RIGHT = 2,
	 BOTTOM_LEFT = 3,

	 TOP = 4,
	 RIGHT = 5,
	 BOTTOM = 6,
	 LEFT = 7,
}

export class BaseScene extends Phaser.Scene {
	protected flashRect: Phaser.GameObjects.Rectangle | null;
	protected cameraShakeValue: number;

	constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
		this.cameraShakeValue = 0;
		this.flashRect = null;
	}

	// Start a camera fade effect to a specific color
	fade(fadeOut: boolean, time: number, hexColor: number) {
		let c = Phaser.Display.Color.ColorToRGBA(hexColor);
		this.cameras.main.fadeEffect.start(fadeOut, time, c.r, c.g, c.b);
	}

	// Start a white camera flash effect
	flash(time: number, hexColor: number = 0xffffff, alpha: number = 1.0) {
		if (!this.flashRect) {
			this.flashRect = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0);
			this.flashRect.setDepth(9999999999);
		}

		this.flashRect.setAlpha(alpha);
		this.flashRect.fillColor = hexColor;

		this.tweens.add({
			targets: this.flashRect,
			alpha: { from: alpha, to: 0 },
			ease: "Cubic.Out",
			duration: time,
		});
	}

	// Start a camera shake effect
	shake(time: number, startShake: number = 1.0, endShake: number = 0.0) {
		this.cameraShakeValue = startShake;
		this.tweens.add({
			targets: this,
			cameraShakeValue: { from: startShake, to: endShake },
			ease: endShake < startShake ? "Sine.Out" : "Linear",
			duration: time,
			onComplete: () => {
				this.cameraShakeValue = 0;
			},
		});
	}

	// Creates a timer event
	addEvent(
		delay: number,
		callback: () => void,
		callbackScope: any = this
	): Phaser.Time.TimerEvent {
		return this.time.addEvent({ delay, callback, callbackScope });
	}

	// Creates Phaser text object
	addText({
		fontFamily = "Game Font",
		x = 0,
		y = 0,
		size = 32,
		weight = 500,
		color = "#FFFFFF",
		alpha = 1.0,
		text = "",
	}: TextStyle): Phaser.GameObjects.Text {
		return this.add
			.text(x, y, text, {
				fontFamily,
				fontSize: Math.max(size, 1) + "px",
				fontStyle: weight.toString(),
				color: color,
			})
			.setAlpha(alpha)
			.setPadding(2);
	}

	// The image keeps its aspect ratio, but is resized to fit within the given dimension
	fitToScreen(image: Phaser.GameObjects.Image): void {
		image.setScale(Math.max(this.W / image.width, this.H / image.height));
	}

	// The image keeps its aspect ratio and fills the given dimension. The image will be clipped to fit
	containToScreen(image: Phaser.GameObjects.Image): void {
		image.setScale(Math.min(this.W / image.width, this.H / image.height));
	}

	// Map X position to sound panning
	getPan(x: number, clamp=true): number {
		const lerp = Phaser.Math.Linear(-1, 1, x / this.W);
		return clamp ? Phaser.Math.Clamp(lerp, -1, 1) : lerp;
	}

	// Returns width of screen
	get W(): number {
		return this.cameras.main.displayWidth;
	}

	// Returns height of screen
	get H(): number {
		return this.cameras.main.displayHeight;
	}

	// Returns horizontal center of screen
	get CX(): number {
		return this.cameras.main.centerX;
	}

	// Returns vertical center of screen
	get CY(): number {
		return this.cameras.main.centerY;
	}

	findRandom(x1: number, x2: number, y1: number, y2: number): number[]{
		return [
			x1+(Math.random()*x2-x1), y1+(Math.random()*y2-y1)
		]
	}

	closestCorner(x: number, y: number): number{
		let r = Bounds.TOP_LEFT;
		let d = Phaser.Math.Distance.Between(x,y,0,0);
		let e = Phaser.Math.Distance.Between(x,y,1920,0);
		if(e < d) { r = Bounds.TOP_RIGHT;}
		e = Phaser.Math.Distance.Between(x,y,1920,1080);
		if (e < d) { r = Bounds.BOTTOM_RIGHT;}
		e = Phaser.Math.Distance.Between(x,y,0,1080);
		if (e < d) { r = Bounds.BOTTOM_LEFT;}
		return r;

	}

	closestChebyshevEdge(x: number, y: number): number{
		let r = Bounds.TOP;
		let d = y;
		let e = 1920-x;
		if(e < d) { r = Bounds.RIGHT;}
		e = 1080-y;
		if (e < d) { r = Bounds.BOTTOM;}
		e = x;
		if (e < d) { r = Bounds.LEFT;}
		return r;
	}

	oppositeEdge(i: number): number{
		switch(i){
			case Bounds.TOP: {return Bounds.BOTTOM;}
			case Bounds.RIGHT: {return Bounds.LEFT;}
			case Bounds.BOTTOM: {return Bounds.TOP;}
			case Bounds.LEFT: {return Bounds.RIGHT;}
			default: {return Bounds.TOP;}
		}
	}

	oppositeCorner(i: number): number{
		switch(i){
			case Bounds.TOP_LEFT: {return Bounds.BOTTOM_RIGHT;}
			case Bounds.TOP_RIGHT: {return Bounds.BOTTOM_LEFT;}
			case Bounds.BOTTOM_RIGHT: {return Bounds.TOP_LEFT;}
			case Bounds.BOTTOM_LEFT: {return Bounds.TOP_RIGHT;}
			default: {return Bounds.TOP_LEFT;}
		}
	}


}
