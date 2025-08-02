import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "./Entity";

import { SparkEffect } from "@/components/particles/SparkEffect";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";

export class BaseMonster extends Entity {
	protected sparkEffect: SparkEffect;
	protected explosionEffect: ExplosionEffect;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		// All colliders attached to this monster deal 5 damage
		this.entityDamage = 5;

		// Use `this.sparkEffect.play(this.x, this.y);` to play
		this.sparkEffect = new SparkEffect(scene);
		// Use `this.explosionEffect.play(this.x, this.y);` to play
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
	}

	// When the monster is encircled by the player's loop
	onLoop() {
		// Override this method in subclasses to handle encirclement logic
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
}
