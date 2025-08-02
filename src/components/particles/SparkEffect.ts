import { BaseScene } from "@/scenes/BaseScene";
import { ParticleEffect } from "./ParticleEffect";

interface SparkConfig {
	quantity?: number;
	random?: boolean;
}

export class SparkEffect extends ParticleEffect {
	private sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	private quantity: number;

	constructor(
		scene: BaseScene,
		{ quantity = 30, random = true }: SparkConfig = {}
	) {
		super(scene);
		this.quantity = quantity;

		this.sparkEmitter = scene.add.particles(0, 0, "circle", {
			emitting: false,
			lifespan: { min: 50, max: 600 },
			quantity: 30,
			speed: { min: 200, max: 1000 },
			angle: {
				onEmit: (particle: any) =>
					Phaser.Math.RadToDeg(
						Phaser.Math.Angle.Between(0, 0, particle.x, particle.y)
					) + Phaser.Math.Between(-10, 10),
			},
			scaleX: {
				start: 190 / 64,
				end: 0.15,
				ease: "expo.out",
			},
			scaleY: 0.15,
			alpha: { start: 1, end: 0, ease: "expo.in" },
			blendMode: "ADD",
			particleClass: SparkParticle,
			emitZone: {
				type: "random",
				source: new Phaser.Geom.Circle(0, 0, 100),
				quantity: 30,
			},
		});

		this.sparkEmitter.setDepth(20);
	}

	play(x: number, y: number) {
		this.sparkEmitter.updateConfig({
			angle: {
				onEmit: (particle: any) =>
					Phaser.Math.RadToDeg(
						Phaser.Math.Angle.Between(x, y, particle.x, particle.y)
					),
			},
		});
		this.sparkEmitter.explode(this.quantity, x, y);
	}
}

// A stretched line particle that darts outwards and quickly returns to a circle
export class SparkParticle extends Phaser.GameObjects.Particles.Particle {
	private speed: number;

	// Fetch initial speed and align sprite rotation
	fire(x?: number, y?: number): boolean {
		const alive = super.fire(x, y);
		this.speed = Math.hypot(this.velocityX, this.velocityY);
		this.rotation = Math.atan2(this.velocityY, this.velocityX);
		this.angle = Phaser.Math.RadToDeg(this.rotation);
		return alive;
	}

	// Since the particle is so stretched, match the velocity to the stretched sprite.
	// This makes the line turn back into a circle that slowly moves away.
	computeVelocity(e: any, d: any, s: any, p: any, t: any): void {
		super.computeVelocity(e, d, s, p, t);

		this.velocityX = Math.cos(this.rotation) * this.speed * this.scaleX;
		this.velocityY = Math.sin(this.rotation) * this.speed * this.scaleX;
	}
}
