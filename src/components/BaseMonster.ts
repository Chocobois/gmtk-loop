import { GameScene } from "@/scenes/GameScene";
import { Entity } from "./Entity";

import { SparkEffect } from "@/components/particles/SparkEffect";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";
import { pearlState } from "@/state/PearlState";
import { PearlElement } from "./pearls/PearlElement";
import { BurnEffect } from "./particles/BurnEffect";

export class BaseMonster extends Entity {
	public scene: GameScene;

	protected sparkEffect: SparkEffect;
	protected explosionEffect: ExplosionEffect;
	protected burnEffect: BurnEffect;

	protected burningTimer: number; // Remaining burn status in seconds

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;

		// All colliders attached to this monster deal 10 damage
		this.entityDamage = 10;
		this.burningTimer = 0;

		// Use `this.sparkEffect.play(this.x, this.y);` to play
		this.sparkEffect = new SparkEffect(scene);
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
		this.burnEffect = new BurnEffect(scene);
	}

	update(time: number, delta: number) {
		// If Fire pearl ability is in use, apply burn
		if (this.isBurning) {
			this.burningTimer -= delta / 1000;
			const randomBodyPart = Phaser.Math.RND.pick(this.colliders);
			const randomChance = Math.random() < 0.2;
			if (randomBodyPart && randomChance) {
				const p = randomBodyPart.getRandomPoint();
				this.burnEffect.play(p.x, p.y);
			}
		}
	}

	// When the monster is encircled by the player's loop
	onLoop() {
		super.onLoop();

		// If Fire pearl is in use, apply burn
		if (pearlState.currentPearl.element == PearlElement.Fire) {
			this.burningTimer = 5.0; // 5 seconds of burn
		}
	}

	// Tween this monster toward a target position
	move(x: number, y: number, duration: number = 2000) {
		if (duration == 0) {
			this.x = x;
			this.y = y;
		} else {
			this.scene.tweens.add({
				targets: this,
				x,
				y,
				duration,
				ease: Phaser.Math.Easing.Cubic.InOut,
			});
		}
	}

	// Returns a list of spaced apart vector2 positions
	getRandomPositions(
		count: number,
		separation: number = 400
	): Phaser.Math.Vector2[] {
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

	// Play a shake animation on a sprite, when taking damage for instance
	animateShake(sprite: Phaser.GameObjects.Sprite, duration: number = 500) {
		this.scene.tweens.addCounter({
			duration,
			ease: Phaser.Math.Easing.Sine.Out,
			onUpdate: (tween) => {
				let t = 1 - (tween.getValue() || 0);
				sprite.setOrigin(0.5 + t * 0.1 * Math.sin(20 * t), sprite.originY);
			},
		});
	}

	get isBurning() {
		return this.burningTimer > 0;
	}
}
