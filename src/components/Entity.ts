import { BaseScene } from "@/scenes/BaseScene";

export class Entity extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public enabled: boolean = true;
	public deleteFlag: boolean = false;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		// Override this method in subclasses to handle encirclement logic
	}

	setEnabled(value: boolean) {
		this.enabled = value;
	}

	protected shapes: Phaser.Geom.Circle[] = [new Phaser.Geom.Circle()];
	get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		return [this.shapes[0].setTo(this.x, this.y, 100)];
	}
}
