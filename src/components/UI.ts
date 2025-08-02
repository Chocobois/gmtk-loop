import { GameScene } from "@/scenes/GameScene";
import { loopState } from "@/state/LoopState";
import { autorun } from "mobx";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private healthContainer: Phaser.GameObjects.Container;
	private healthGraphics: Phaser.GameObjects.Graphics;
	private healthLabel: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const radius = 100;
		const healthX = 1.2 * radius;
		const healthY = 1080 - 1.2 * radius;

		this.healthContainer = scene.add.container(healthX, healthY);
		this.healthContainer.setData("radius", radius);
		this.add(this.healthContainer);

		this.healthGraphics = scene.add.graphics();
		this.healthContainer.add(this.healthGraphics);

		this.healthLabel = this.scene.addText({
			size: 64,
			color: "#007700",
			text: "100",
		});
		this.healthLabel.setStroke("white", 16);
		this.healthLabel.setOrigin(0.5);
		this.healthContainer.add(this.healthLabel);

		this.redrawHealth();

		autorun(() => {
			if (!this.scene) {
				console.warn("An old UI remains with an `autorun` listener");
				return;
			}
			this.healthLabel.setText(loopState.health.toString());
			this.redrawHealth();
		});
	}

	update(time: number, delta: number) {}

	redrawHealth() {
		const ratio = loopState.health / loopState.maxHealth;
		const radius = this.healthContainer.getData("radius");

		// Draw big white circle
		this.healthGraphics.fillStyle(0xffffff, 0.9);
		this.healthGraphics.fillCircle(0, 0, radius);

		// Draw green arc using ratio %
		this.healthGraphics.lineStyle(0.4 * radius, 0x00dd00, 1);
		this.healthGraphics.beginPath();
		this.healthGraphics.arc(
			0,
			0,
			0.625 * radius,
			Phaser.Math.DegToRad(-90),
			Phaser.Math.DegToRad(ratio * 360 - 90),
			false
		);
		this.healthGraphics.strokePath();
		this.healthGraphics.closePath();
	}

	get healthPosition(): Phaser.Types.Math.Vector2Like {
		return { x: this.healthContainer.x, y: this.healthContainer.y };
	}
}
