import { BaseScene } from "@/scenes/BaseScene";
import { ParticleEffect } from "./ParticleEffect";

export class BurnEffect extends ParticleEffect {
	private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor(scene: BaseScene) {
		super(scene);

		this.fireEmitter = scene.add.particles(0, 0, "flame", {
			emitting: false,
			frame: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			lifespan: { min: 500, max: 1500 },
			quantity: 1,
			scale: { start: 2, end: 0, ease: "sine.in", random: true },
			alpha: { start: 1, end: 0 },
			gravityY: -200,
		});

		this.fireEmitter.setDepth(50);
	}

	play(x: number, y: number) {
		this.fireEmitter.explode(1, x, y);
	}

	setEmitting(value: boolean) {
		this.fireEmitter.emitting = value;
	}

	setPosition(x: number, y: number) {
		this.fireEmitter.setPosition(x, y);
	}
}
