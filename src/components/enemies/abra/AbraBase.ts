import { GameScene } from "@/scenes/GameScene";
import { BaseMonster } from "@/components/BaseMonster";
import BendWaves from "@/pipelines/BendWavesPostFX";

export enum AbraState {
	IDLE,
	VANISHING,
	APPEARING,
	STUNNED,
	DEAD,
}

// Shared Abra functionality between AbraBoss and AbraFake
export class AbraBase extends BaseMonster {
	// Number of hits an Abra can take before its magic form is broken
	// When out or armor, a Fake disappears, a Boss gets stunned
	protected magicArmor: number;

	protected abraState: AbraState;
	protected stateTimer: Phaser.Time.TimerEvent;

	protected sprite: Phaser.GameObjects.Sprite;

	protected hideValue: number;

	protected filter: BendWaves;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.hideValue = 1;
		this.magicArmor = 0;

		this.sprite = scene.add.sprite(0, 0, "abra_idle");
		this.add(this.sprite);

		this.sprite.setPostPipeline(BendWaves);
		this.filter = this.sprite.getPostPipeline(BendWaves) as BendWaves;
		this.filter.amplitude = 0;
		this.filter.frequency = 25;

		this.animateAppear();
	}

	setAbraState(state: AbraState) {
		this.abraState = state;
	}

	animateVanish(duration: number = 500) {
		this.setEnabled(false);

		this.scene.tweens.add({
			targets: this,
			duration,
			hideValue: 1,
			ease: Phaser.Math.Easing.Sine.Out,
		});
	}

	animateAppear(duration: number = 500) {
		this.setEnabled(true);

		this.scene.tweens.add({
			targets: this,
			duration,
			hideValue: 0,
			ease: Phaser.Math.Easing.Sine.Out,
		});
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		const wobble = this.abraState == AbraState.DEAD ? 0 : 0.02;
		const squish = 1.0 + wobble * Math.sin((4 / 1000) * time);
		this.sprite.setScale(2 - squish, squish);
		this.sprite.setOrigin(
			this.sprite.originX,
			0.5 + 0.03 * Math.sin((2 / 1000) * time)
		);

		this.setAlpha(1 - 1 * this.hideValue);
	}

	onLoop() {
		super.onLoop();

		this.animateShake(this.sprite);
		this.sparkEffect.play(this.x, this.y);
	}

	protected shapes: Phaser.Geom.Circle[] = [];
	get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		if (this.shapes.length === 0) {
			this.shapes = [new Phaser.Geom.Circle(0, 0, 60)];
		}

		return this.shapes.map((shape) =>
			shape.setTo(this.x, this.y + 30, shape.radius)
		);
	}
}
