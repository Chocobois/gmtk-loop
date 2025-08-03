import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";
import { debug } from "@neutralinojs/lib";
import { LevelDefinition } from "./LevelDefinition";

export class HubLevel extends Entity {
	public scene: BaseScene;
	public levelData: LevelDefinition;

	private image: Phaser.GameObjects.Image;
	private label: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, levelData: LevelDefinition) {
		super(scene, levelData.x, levelData.y);
		scene.add.existing(this);
		this.scene = scene;
		this.levelData = levelData;

		// Level icon
		this.image = scene.add.image(0, 0, "hub_level");
		this.add(this.image);

		this.label = scene.addText({
			x: 0,
			y: 130,
			text: levelData.title,
			size: 48,
			color: "black",
		});
		this.label.setStroke("white", 16);
		this.label.setOrigin(0.5);
		this.add(this.label);
	}

	onLoop() {
		if (!this.enabled) {
			const prevTint = this.image.tint;
			this.scene.sound.play("u_disabled");
			this.scene.tweens.add({
				targets: this.image,
				// Please keep this in mind if you tint the image elsewhere
				tint: { from: 0xff0000, to: 0xffffff },
				duration: 400,
			});
			return;
		}

		// Funny bounce animation
		this.scene.tweens.addCounter({
			onUpdate: (tween) => {
				const x = tween.getValue() || 0;
				const y = Math.sin(10 * x) * Math.pow(1 - x, 2);
				this.setScale(1.0 + 0.5 * y);
			},
		});

		this.emit("selected", this.levelData);
	}

	// update(time: number, delta: number) {
	setBarTime(time: number) {
		const a = Math.sin(time * Math.PI);
		// const b = Phaser.Math.Easing.Sine.InOut(a);
		const squish = 1.0 + 0.04 * a;
		this.image.setScale(2 - squish, squish);
	}

	setImageScale(value: number) {
		this.image.setScale(value);
	}

	squish() {
		this.image.scaleY = 0.95;
	}

	setEnabled(value: boolean) {
		super.setEnabled(value);
		this.setAlpha(0.25);
	}

	protected shapes: Phaser.Geom.Circle[] = [new Phaser.Geom.Circle()];
	get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		return [this.shapes[0].setTo(this.x, this.y, 20)];
	}
}
