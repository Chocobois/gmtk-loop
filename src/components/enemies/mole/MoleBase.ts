import { GameScene } from "@/scenes/GameScene";
import { Entity } from "../../Entity";

export enum MoleState {
	IDLE,
	DIGGING,
	DEAD,
}

// Shared Mole functionality between MoleBoss and MoleFake
export class MoleBase extends Entity {
	public scene: GameScene;

	protected moleState: MoleState;
	protected stateTimer: Phaser.Time.TimerEvent;

	protected sprite: Phaser.GameObjects.Sprite;
	protected dirt: Phaser.GameObjects.Image;

	private hideValue: number;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.hideValue = 1;

		this.sprite = scene.add.sprite(0, 0, "mole_boss_1");
		this.sprite.setCrop(0, 0, 256, 128);
		this.add(this.sprite);

		this.dirt = scene.add.image(0, 0, "mole_dirt");
		this.dirt.setOrigin(0.5, 0.85);
		this.dirt.y += (0.85 - 0.5) * this.dirt.height;
		this.add(this.dirt);

		this.setupAnimations();
	}

	setupAnimations() {
		if (this.scene.anims.exists("mole_boss_damage")) return;

		// These are defined globally
		this.scene.anims.create({
			key: "mole_boss_damage",
			frames: [
				{ key: "mole_boss_2", duration: 500 },
				{ key: "mole_boss_1", duration: -1 },
			],
		});
		this.scene.anims.create({
			key: "mole_boss_dead",
			frames: [{ key: "mole_boss_2", duration: -1 }],
		});
		this.scene.anims.create({
			key: "mole_fake_damage",
			frames: [
				{ key: "mole_fake_2", duration: 1000 },
				{ key: "mole_fake_1", duration: -1 },
			],
		});
	}

	setMoleState(state: MoleState) {
		this.moleState = state;
	}

	// Returns a list of spaced apart positions
	getRandomPositions(count: number): Phaser.Math.Vector2[] {
		let separation = 400;
		const positions: Phaser.Math.Vector2[] = [];

		while (positions.length < count && separation-- > 0) {
			const x = Phaser.Math.Between(300, this.scene.W - 300);
			const y = Phaser.Math.Between(300, this.scene.H - 300);
			const p = new Phaser.Math.Vector2(x, y);

			if (
				positions.every(
					(o) => Phaser.Math.Distance.Between(o.x, o.y, p.x, p.y) >= separation
				)
			) {
				positions.push(p);
			}
		}
		return positions;
	}

	move(x: number, y: number, instantly: boolean) {
		if (instantly) {
			this.x = x;
			this.y = y;
		} else {
			this.scene.tweens.add({
				targets: this,
				x,
				y,
				duration: 2000,
				ease: Phaser.Math.Easing.Quadratic.InOut,
			});
		}
	}

	animateAppear(duration: number = 500) {
		this.setEnabled(true);

		this.scene.tweens.add({
			targets: this,
			duration,
			hideValue: 0,
			ease: Phaser.Math.Easing.Back.Out,
		});
	}

	animateDisappear(duration: number = 500) {
		this.setEnabled(false);

		this.scene.tweens.add({
			targets: this,
			duration,
			hideValue: 1,
			ease: Phaser.Math.Easing.Back.In,
		});
	}

	animateShake() {
		this.scene.tweens.addCounter({
			duration: 500,
			ease: Phaser.Math.Easing.Sine.Out,
			onUpdate: (tween) => {
				let t = 1 - (tween.getValue() || 0);
				this.sprite.setOrigin(0.5 + t * 0.1 * Math.sin(20 * t), 0.5);
			},
		});
	}

	update(time: number, delta: number) {
		const wobble = this.moleState == MoleState.DEAD ? 0 : 0.04;
		const squish = 1.0 + wobble * Math.sin((8 * time) / 1000);
		this.sprite.setScale(2 - squish, squish);

		const dirtSpeed = this.moleState == MoleState.DIGGING ? 20 : 4;
		const dirtWobble = this.moleState == MoleState.DIGGING ? 0.08 : 0.02;
		const dirtSquish = 1.0 + dirtWobble * Math.sin((dirtSpeed * time) / 1000);
		this.dirt.setScale(dirtSquish, 2 - dirtSquish);

		const size = this.sprite.height;
		this.sprite.y = this.hideValue * 0.7 * size;
		this.sprite.setCrop(0, 0, size, size * (0.9 - 0.8 * this.hideValue));
	}

	onLoop() {
		this.animateShake();
	}

	protected shapes: Phaser.Geom.Circle[] = [];
	get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		if (this.shapes.length === 0) {
			this.shapes = [new Phaser.Geom.Circle(0, 0, 70)];
		}

		return this.shapes.map((shape) =>
			shape.setTo(this.x, this.y + 30, shape.radius)
		);
	}
}
