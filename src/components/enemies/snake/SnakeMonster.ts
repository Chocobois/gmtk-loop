import { BaseScene } from "@/scenes/BaseScene";
import { BaseMonster } from "../../BaseMonster";

enum SnakeState {
	SLITHERING,
	CURLING,
	STUNNED,
}

const SNAKE_LENGTH = 1000;
const SNAKE_SEGMENTS = 20;
const SEGMENT_LENGTH = SNAKE_LENGTH / SNAKE_SEGMENTS;

export class SnakeMonster extends BaseMonster {
	public scene: BaseScene;

	private snakeState: SnakeState;

	// private target: Phaser.Math.Vector2; // Target position for the snake to slither towards
	private velocity: Phaser.Math.Vector2; // Current velocity of the target point
	private border: { [key: string]: number };

	private rope: Phaser.GameObjects.Rope;
	private tailPoints: Phaser.Math.Vector2[] = [];

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.tailPoints = [];
		for (let i = 0; i < SNAKE_SEGMENTS; i++)
			this.tailPoints.push(new Phaser.Math.Vector2());

		this.rope = scene.add.rope(0, 0, "snake", 0, this.tailPoints);
		this.add(this.rope);

		// this.target = new Phaser.Math.Vector2(x, y);
		this.velocity = new Phaser.Math.Vector2(600, 600);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};

		this.setSnakeState(SnakeState.CURLING);
	}

	setSnakeState(state: SnakeState) {
		this.snakeState = state;

		switch (state) {
			case SnakeState.STUNNED:
				this.velocity.set(0, 0);
				break;

			case SnakeState.SLITHERING:
				// this.velocity.set(10, 10);
				this.scene.addEvent(5000, () => this.setSnakeState(SnakeState.CURLING));
				break;

			case SnakeState.CURLING:
				// this.target.set(960, 540);
				// this.velocity.set(5, 5);
				this.scene.addEvent(5000, () =>
					this.setSnakeState(SnakeState.SLITHERING)
				);
				break;
		}
	}

	update(time: number, delta: number) {
		if (this.x < this.border.left)
			this.velocity.setAngle(this.velocity.angle() + 0.1);
		if (this.x > this.border.right)
			this.velocity.setAngle(this.velocity.angle() + 0.1);
		if (this.y < this.border.top)
			this.velocity.setAngle(this.velocity.angle() + 0.1);
		if (this.y > this.border.bottom)
			this.velocity.setAngle(this.velocity.angle() + 0.1);

		if (this.snakeState === SnakeState.SLITHERING) {
			// Something
		}

		if (this.snakeState === SnakeState.CURLING) {
			this.velocity.setAngle(this.velocity.angle() + 0.1);
		}

		// Movement
		this.x += this.velocity.x * (delta / 1000);
		this.y += this.velocity.y * (delta / 1000);

		// Update tail points to follow like a chain
		let prev = new Phaser.Math.Vector2(this.x, this.y);
		for (let i = 0; i < this.tailPoints.length; i++) {
			const point = this.tailPoints[i];
			const toPrev = prev.clone().subtract(point);
			const dist = toPrev.length();
			if (dist > SEGMENT_LENGTH) {
				toPrev.normalize().scale(dist - SEGMENT_LENGTH);
				point.add(toPrev);
			}
			prev = point;
		}
		this.rope.setPoints(
			this.tailPoints.map(
				(p) => new Phaser.Math.Vector2(p.x - this.x, p.y - this.y)
			)
		);
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		console.log("SnakeMonster looped");
	}

	protected shapes: Phaser.Geom.Circle[] = [];
	get colliders(): Phaser.Geom.Circle[] {
		if (this.shapes.length === 0) {
			this.shapes = [];
			for (let i = 0; i < SNAKE_SEGMENTS - 2; i++) {
				const radius = 50 - 30 * (i / SNAKE_SEGMENTS);
				this.shapes.push(new Phaser.Geom.Circle(0, 0, radius));
			}
		}

		return this.shapes.map((shape, index) =>
			shape.setTo(
				this.tailPoints[index + 1].x,
				this.tailPoints[index + 1].y,
				shape.radius
			)
		);
	}
}
