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
			y: 150,
			text: levelData.title,
			size: 32,
			color: "black",
		});
		this.label.setOrigin(0.5);
		this.add(this.label);
	}

	onLoop() {
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
}
