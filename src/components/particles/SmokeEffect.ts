import { BaseScene } from "@/scenes/BaseScene";
import { ParticleEffect } from "./ParticleEffect";
import { SparkParticle } from "./SparkEffect";

export class SmokeEffect extends ParticleEffect {
	private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	private sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	private lightEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	private colors: number[];

	constructor(scene: BaseScene, scale: number = 1.0) {
		super(scene);

		this.colors = this.getColorLerp([
			[0x4C4D4D, 0.0],
			[0x7C828A, 0.2],
			[0xA6A7BD, 0.3],
			[0xC8C3D8, 0.4],
			[0xE2D8ED, 0.7],
			[0xECE6F5, 0.9],
			[0xF4F0F5, 1.0],
		]);

		this.smokeEmitter = scene.add.particles(0, 0, "smoke", {
			emitting: false,
			frame: [0, 1, 2, 3],
			lifespan: { min: 100, max: 600 },
			quantity: 5,
			rotate: { min: 0, max: 360 },
			speed: { min: 100 * scale, max: 1200 * scale },
			angle: 0,
			scale: { start: 1, end: 0, ease: "expo.in" },
			gravityY: -200,
			color: this.colors,
			particleClass: SmokeParticle,
			sortProperty: "lifeCurrent",
			emitZone: {
				type: "edge",
				source: new Phaser.Geom.Circle(0, 0, 25 * scale),
				quantity: 40,
			},
		});

		this.sparkEmitter = scene.add.particles(0, 0, "circle", {
			emitting: false,
			lifespan: { min: 50, max: 600 },
			quantity: 30,
			speed: { min: 200 * scale, max: 1000 * scale },
			angle: {
				onEmit: (particle: any) =>
					Phaser.Math.RadToDeg(
						Phaser.Math.Angle.Between(0, 0, particle.x, particle.y)
					) + Phaser.Math.Between(-10, 10),
			},
			scaleX: {
				start: (190 / 64) * scale,
				end: 0.15,
				ease: "expo.out",
			},
			scaleY: 0.15 * scale,
			alpha: { start: 1, end: 0, ease: "expo.in" },
			blendMode: "ADD",
			particleClass: SparkParticle,
			emitZone: {
				type: "random",
				source: new Phaser.Geom.Circle(0, 0, 100 * scale),
				quantity: 30,
			},
		});

		this.lightEmitter = scene.add.particles(0, 0, "light", {
			emitting: false,
			lifespan: 1500,
			quantity: 1,
			scale: { start: 0.5 * scale, end: 0, ease: "circ.out" },
			alpha: { start: 1, end: 0, ease: "circ.out" },
			blendMode: "ADD",
		});

		this.smokeEmitter.setDepth(20);
		this.sparkEmitter.setDepth(20);
		this.lightEmitter.setDepth(20);
	}

	play(x: number, y: number) {
		this.smokeEmitter.updateConfig({
			angle: {
				onEmit: (particle: any) =>
					Phaser.Math.RadToDeg(
						Phaser.Math.Angle.Between(x, y, particle.x, particle.y)
					),
			},
		});

		this.sparkEmitter.updateConfig({
			angle: {
				onEmit: (particle: any) =>
					Phaser.Math.RadToDeg(
						Phaser.Math.Angle.Between(x, y, particle.x, particle.y)
					),
			},
		});

		this.smokeEmitter.explode(40, x, y);
		this.sparkEmitter.explode(20, x, y);
		this.lightEmitter.emitParticleAt(x, y, 1);
	}
}

class SmokeParticle extends Phaser.GameObjects.Particles.Particle {
	private angularVelocity: number;

	fire(x?: number, y?: number): boolean {
		const alive = super.fire(x, y);
		this.angularVelocity =
			-Phaser.Math.Between(2, 3) * Math.sign(this.velocityX);
		return alive;
	}

	update(delta: number, step: number, processors: any): boolean {
		this.velocityX *= 0.9;
		this.velocityY *= 0.9;
		this.angularVelocity *= 0.97;
		return super.update(delta, step, processors);
	}
}
