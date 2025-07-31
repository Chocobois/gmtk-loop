import { BaseScene } from "@/scenes/BaseScene";

export class Entity extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		// Override this method in subclasses to handle encirclement logic
	}

	protected _shapes: Phaser.Geom.Circle[] = [
		new Phaser.Geom.Circle(),
	];
	get colliders(): Phaser.Geom.Circle[] {
		return [
			this.colliders[0].setTo(this.x, this.y, 100),
		];
	}
}
