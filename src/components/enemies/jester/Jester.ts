import { GameScene } from "@/scenes/GameScene";
import { Entity } from "@/components/Entity";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { loopState } from "@/state/LoopState";

enum JesterState {
	IDLE,
	CHARGING,
	ATTACKING,
	DEAD,
}

export class Jester extends Entity {
	public scene: GameScene;

	private health: number;

	private hasActiveMagic: boolean; // If a LoopDrawer input mode effect is in use
	private hitsUntilAggro: number; // Number of attacks before Jester uses magic

	private jesterState: JesterState;
	private stateTimer: Phaser.Time.TimerEvent;

	private sprite: Phaser.GameObjects.Sprite;

	private target: Phaser.Math.Vector2;
	private velocity: Phaser.Math.Vector2;

	private sparkEffect: SparkEffect;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.health = 1500;
		this.hasActiveMagic = false;
		this.hitsUntilAggro = 1;

		this.sprite = scene.add.sprite(0, 0, "jester");
		this.add(this.sprite);

		this.target = new Phaser.Math.Vector2(x, y);
		this.velocity = new Phaser.Math.Vector2(1, 1);

		this.sparkEffect = new SparkEffect(scene);

		this.setJesterState(JesterState.IDLE);
	}

	setJesterState(state: JesterState) {
		this.jesterState = state;

		if (this.stateTimer) this.stateTimer.destroy();

		switch (state) {
			case JesterState.IDLE:
				this.sprite.setTexture("jester_idle");

				// If magic is applied, accept more hits. Otherwise use magic.
				this.hitsUntilAggro = this.hasActiveMagic ? 3 : 1;

				// Determine speed
				this.velocity.setLength(this.hasActiveMagic ? 1 : 5);

				// If Jester is not attacked for this long, remove the magic effect
				// Otherwise, getting attacked should trigger an attack response
				this.stateTimer = this.scene.addEvent(12000, () =>
					this.setJesterState(JesterState.CHARGING)
				);
				break;

			case JesterState.CHARGING:
				this.sprite.setTexture("jester_charge");

				this.stateTimer = this.scene.addEvent(800, () =>
					this.setJesterState(JesterState.ATTACKING)
				);
				break;

			case JesterState.ATTACKING:
				// If magic is active and Jester has not been attacked for a long time, disable magic
				if (this.hasActiveMagic && this.hitsUntilAggro > 0) {
					this.hasActiveMagic = false;
					this.scene.resetInputFlipMode();
				} else {
					this.hasActiveMagic = true;
					this.scene.onInputFlipModeAttack();
				}

				this.sprite.setTexture("jester_attack");
				this.animateShake(1500);

				this.stateTimer = this.scene.addEvent(1500, () =>
					this.setJesterState(JesterState.IDLE)
				);
				break;

			case JesterState.DEAD:
				this.sprite.setTexture("jester_dead");
				break;
		}
	}

	update(time: number, delta: number) {
		const wobble = this.jesterState == JesterState.DEAD ? 0 : 0.04;
		const squish = 1.0 + wobble * Math.sin((8 * time) / 1000);
		this.sprite.setScale(2 - squish, squish);

		this.moveTargetLocation();
	}

	moveTargetLocation() {
		// Bounce target location on walls
		if (this.x < 300 && this.velocity.x < 0) {
			this.velocity.x *= -1;
		}
		if (this.x > this.scene.W - 300 && this.velocity.x > 0) {
			this.velocity.x *= -1;
		}
		if (this.y < 300 && this.velocity.y < 0) {
			this.velocity.y *= -1;
		}
		if (this.y > this.scene.H - 300 && this.velocity.y > 0) {
			this.velocity.y *= -1;
		}

		// Slowly move Jester toward target location
		if (this.jesterState == JesterState.IDLE) {
			this.target.x += this.velocity.x;
			this.target.y += this.velocity.y;
		}
		this.x += (this.target.x - this.x) * 0.05;
		this.y += (this.target.y - this.y) * 0.05;
	}

	animateShake(duration: number = 500) {
		this.scene.tweens.addCounter({
			duration,
			ease: Phaser.Math.Easing.Sine.Out,
			onUpdate: (tween) => {
				let t = 1 - (tween.getValue() || 0);
				this.sprite.setOrigin(0.5 + t * 0.1 * Math.sin(20 * t), 0.5);
			},
		});
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		this.animateShake();
		this.sparkEffect.play(this.x, this.y);

		// If attacked when no magic is applied, attack immediately
		this.hitsUntilAggro--;
		if (this.hitsUntilAggro <= 0 && this.jesterState == JesterState.IDLE) {
			this.setJesterState(JesterState.CHARGING);
		}

		this.health -= loopState.attackPower;
		if (this.health <= 0) {
			this.setJesterState(JesterState.DEAD);
			this.emit("victory");
		}
	}

	protected shapes: Phaser.Geom.Circle[] = [
		new Phaser.Geom.Circle(),
		new Phaser.Geom.Circle(),
	];
	get colliders(): Phaser.Geom.Circle[] {
		return [
			this.shapes[0].setTo(this.x, this.y - 20, 40),
			this.shapes[1].setTo(this.x, this.y + 30, 40),
		];
	}
}
