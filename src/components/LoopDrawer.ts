import { GameScene } from "@/scenes/GameScene";
import { score } from "@/state/ScoreState";

export class LoopDrawer extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private points: Phaser.Math.Vector2[] = [];
	private maxLength: number = 200;

	private inputArea: Phaser.GameObjects.Rectangle;
	private graphics: Phaser.GameObjects.Graphics;
	private cursor: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;

		this.inputArea = scene.add
			.rectangle(0, 0, scene.W, scene.H, 0xffffff)
			.setOrigin(0)
			.setAlpha(0.001);
		this.inputArea
			.setInteractive({ useHandCursor: true, draggable: true })
			.on("dragstart", this.touchStart, this)
			.on("drag", this.touchDrag, this)
			.on("dragend", this.touchEnd, this);

		this.graphics = scene.add.graphics();
	}

	update(time: number, delta: number) {}

	touchStart(pointer: Phaser.Input.Pointer) {
		this.graphics.clear();
		this.graphics.lineStyle(2, 0xff0000);
		// Start a new path at the pointer position
		this.points = [new Phaser.Math.Vector2(pointer.x, pointer.y)];
	}

	touchDrag(pointer: Phaser.Input.Pointer) {
		if (this.points.length == 0) return;

		const lastPoint = this.points[this.points.length - 1];
		const dx = pointer.x - lastPoint.x;
		const dy = pointer.y - lastPoint.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		const currentLine = new Phaser.Geom.Line(
			pointer.x,
			pointer.y,
			lastPoint.x,
			lastPoint.y
		);

		for (let i = 1; i < this.points.length - 1; i++) {
			const prev = this.points[i - 1];
			const curr = this.points[i];
			const segment = new Phaser.Geom.Line(prev.x, prev.y, curr.x, curr.y);
			if (Phaser.Geom.Intersects.LineToLine(currentLine, segment)) {
				const points = this.points.slice(i);
				this.onLoop(points);

				this.points = this.points.slice(0, i);
				return;
			}
		}

		if (dist >= 30) {
			this.points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
			// this.curve.lineTo(pointer.x, pointer.y);
		}

		this.graphics.clear();
		this.graphics.lineStyle(8, 0xff0000);
		// this.curve.draw(this.graphics);

		// Draw the line from the last point to the current pointer position
		this.graphics.beginPath();
		this.graphics.moveTo(this.points[0].x, this.points[0].y);
		this.points.forEach((point) => {
			this.graphics.lineTo(point.x, point.y);
		});
		this.graphics.lineTo(pointer.x, pointer.y);
		this.graphics.strokePath();
	}

	touchEnd(pointer: Phaser.Input.Pointer) {
		this.graphics.clear();
		// this.curve = null;

		// Phaser.Geom.Intersects.LineToLine();
	}

	onLoop(points: Phaser.Math.Vector2[]) {
		const polygonStr = this.points.map((p) => `${p.x} ${p.y}`).join(" ");
		const polygon = new Phaser.Geom.Polygon(polygonStr);
		this.emit("loop", polygon);

		const graphics = this.scene.add.graphics();
		graphics.clear();
		graphics.fillStyle(0xff0000, 0.5);
		graphics.beginPath();
		graphics.moveTo(points[0].x, points[0].y);
		points.forEach((point) => {
			graphics.lineTo(point.x, point.y);
		});
		graphics.closePath();
		graphics.fillPath();

		this.scene.tweens.add({
			targets: graphics,
			alpha: 0,
			duration: 1000,
			onComplete: () => {
				graphics.destroy();
			},
		});
	}
}
