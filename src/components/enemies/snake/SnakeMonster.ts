import { GameScene } from "@/scenes/GameScene";
import { BaseMonster } from "../../BaseMonster";
import { loopState } from "@/state/LoopState";

enum SnakeState {
	SLITHERING,
	CURLING,
	DEAD,
}

const SNAKE_LENGTH = 1000;
const SNAKE_SEGMENTS = 50;
const SEGMENT_LENGTH = SNAKE_LENGTH / SNAKE_SEGMENTS;

export class SnakeMonster extends BaseMonster {
	private snakeState: SnakeState;

	private health: number;
	private speed: number;
	private target: Phaser.Math.Vector2; // Target position for the snake to slither towards
	private curlTarget: Phaser.Math.Vector2; // Target position for the snake to curl around
	private velocity: Phaser.Math.Vector2; // Current velocity of the target point
	private border: { [key: string]: number };

	private rope: Phaser.GameObjects.Rope;
	private tailPoints: Phaser.Math.Vector2[];
	private previousPoints: Phaser.Types.Math.Vector2Like[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.previousPoints = [];
		this.health = 1500;

		this.tailPoints = [];
		for (let i = 0; i < SNAKE_SEGMENTS; i++)
			this.tailPoints.push(new Phaser.Math.Vector2());

		this.rope = scene.add.rope(0, 0, "snake", 0, this.tailPoints);
		this.add(this.rope);

		this.target = new Phaser.Math.Vector2(x, y);
		this.curlTarget = new Phaser.Math.Vector2(x, y);
		this.velocity = new Phaser.Math.Vector2(500, 400);
		this.border = {
			left: 200,
			right: scene.W - 200,
			top: 200,
			bottom: scene.H - 200,
		};

		this.setSnakeState(SnakeState.SLITHERING);
	}

	setSnakeState(state: SnakeState) {
		this.snakeState = state;

		switch (state) {
			case SnakeState.DEAD:
				break;

			case SnakeState.SLITHERING:
				const duration = 4000 + 4000 * Math.random();
				this.scene.addEvent(duration, () =>
					this.setSnakeState(SnakeState.CURLING)
				);
				break;

			case SnakeState.CURLING:
				const ps = this.getRandomPositions(1);
				this.curlTarget.set(ps[0].x, ps[0].y);

				const duration2 = 4000 + 4000 * Math.random();
				this.scene.addEvent(duration2, () =>
					this.setSnakeState(SnakeState.SLITHERING)
				);
				break;
		}
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		if (this.snakeState == SnakeState.DEAD) {
			this.velocity.scale(0.9);
		}

		if (this.x < this.border.left && this.velocity.x < 0) {
			this.velocity.x *= -1;
		}
		if (this.x > this.border.right && this.velocity.x > 0) {
			this.velocity.x *= -1;
		}
		if (this.y < this.border.top && this.velocity.y < 0) {
			this.velocity.y *= -1;
		}
		if (this.y > this.border.bottom && this.velocity.y > 0) {
			this.velocity.y *= -1;
		}

		if (this.snakeState === SnakeState.SLITHERING) {
			// Something
		}

		if (this.snakeState === SnakeState.CURLING) {
			// this.velocity.setAngle(this.velocity.angle() + 0.1);
			this.target.set(
				this.curlTarget.x + 150 * Math.cos(time / 100),
				this.curlTarget.y + 150 * Math.sin(time / 100)
			);
		}

		// Movement
		this.target.x += this.velocity.x * (delta / 1000);
		this.target.y += this.velocity.y * (delta / 1000);

		const speed = 600 * (delta / 1000);
		this.x += Phaser.Math.Clamp((this.target.x - this.x) * 0.05, -speed, speed);
		this.y += Phaser.Math.Clamp((this.target.y - this.y) * 0.05, -speed, speed);

		this.previousPoints.push({ x: this.x, y: this.y });

		// Update tail points to follow like a chain
		const L = this.previousPoints.length;

		for (let i = 0; i < this.tailPoints.length; i++) {
			let k = L - 1 - i * 2;
			k = Math.max(k, 0);

			this.tailPoints[i].set(
				this.previousPoints[k].x,
				this.previousPoints[k].y
			);
		}

		this.rope.setPoints(
			this.tailPoints.map(
				(p) => new Phaser.Math.Vector2(p.x - this.x, p.y - this.y)
			)
		);
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		super.onLoop();

		this.health -= loopState.attackPower;
		if (this.health <= 0) {
			this.setSnakeState(SnakeState.DEAD);
			this.emit("victory");
		}
	}

	protected shapes: Phaser.Geom.Circle[] = [];
	get colliders(): Phaser.Geom.Circle[] {
		if (this.shapes.length === 0) {
			this.shapes = [];
			for (let i = 0; i < SNAKE_SEGMENTS - 2; i++) {
				const radius = 40 - 30 * (i / SNAKE_SEGMENTS);
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
