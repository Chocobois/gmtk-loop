import { GameScene } from "@/scenes/GameScene";
import { score } from "@/state/ScoreState";
import { CaptureBar } from "./CaptureBar";
import { WedgeIndicator } from "./Indicators/WedgeIndicator";
import { MonsterScriptHandler } from "./MonsterScriptHandler";

const ACCELERATION = 150;
const MAX_SPEED = 400;
const FRICTION = 0.7;
const TAPPING_TIMER = 200; // ms
console.assert(
	ACCELERATION / (1 - FRICTION) >= MAX_SPEED,
	"Max speed unreachable"
);

export interface DifficultyStats {
	speed: number;
	attackrate: number;
	
}

export class Monster extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;
	private tween: Phaser.Tweens.Tween;

	// Collider
	private collider: Phaser.Geom.Circle = new Phaser.Geom.Circle();

	// Controls
	public velocity: Phaser.Math.Vector2;
	private border: { [key: string]: number };

	private captureDisp: CaptureBar;
	private behavior: MonsterScriptHandler;

	private t: number = 2000;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "enemy_1");
		this.sprite.setOrigin(0.5, 0.5);
		//this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		/* Controls */
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};

		this.captureDisp = new CaptureBar(this.scene,this.x,this.y,this);
		this.behavior = new MonsterScriptHandler(this,"sans");
	}

	update(time: number, delta: number) {
		this.x += (this.velocity.x * delta) / 1000;
		this.y += (this.velocity.y * delta) / 1000;

		// Border collision
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);

		this.captureDisp.update(time, delta);
		this.behavior.update(time,delta);

	}
	damage(amount: number) {
		console.log("Monster damaged by", amount);
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		console.log("Particle");
		this.captureDisp.takeDamage(amount);
		this.doABarrelRoll();
	}

	doABarrelRoll() {
		score.spammedClicks += 1;
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});

			score.clicks += 1;
		}
	}

	get colliders(): Phaser.Geom.Circle[] {
		return [this.collider.setTo(this.x, this.y, 75)];
	}
}
