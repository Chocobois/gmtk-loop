import { GameScene } from "@/scenes/GameScene";
import { score } from "@/state/ScoreState";

export class LoopDrawer extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private points: Phaser.Math.Vector2[] = [];
	private maxLength: number = 1600;

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

		this.cursor = scene.add.image(0, 0, "cursor");
	}

	update(time: number, delta: number) {}

	touchStart(pointer: Phaser.Input.Pointer) {
		this.cursor.setVisible(true).setPosition(pointer.x, pointer.y);
		this.points = [new Phaser.Math.Vector2(pointer.x, pointer.y)];
	}

	touchDrag(pointer: Phaser.Input.Pointer) {
		if (this.points.length == 0) return;

		this.cursor.setPosition(pointer.x, pointer.y);

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

		// Check if the current line intersects with any existing line segments, creating a loop
		const lineSegments = this.lineSegments;
		for (let i = 0; i < lineSegments.length - 1; i++) {
			const line = lineSegments[i];
			const segment = new Phaser.Geom.Line(line.x1, line.y1, line.x2, line.y2);
			if (Phaser.Geom.Intersects.LineToLine(currentLine, segment)) {
				this.onLoop(this.points.slice(i));
				this.points = this.points.slice(0, Math.max(i, 1));
				return;
			}
		}

		// Check if total line distance exceeds maxLength
		const distance = Phaser.Geom.Line.Length(currentLine);
		if (distance > this.maxLength) {
			const direction = new Phaser.Math.Vector2(
				currentLine.x1 - currentLine.x2,
				currentLine.y1 - currentLine.y2
			).normalize();
			const startPoint = new Phaser.Math.Vector2(
				currentLine.x1 - direction.x * this.maxLength,
				currentLine.y1 - direction.y * this.maxLength
			);
			this.points = [
				startPoint,
				new Phaser.Math.Vector2(currentLine.x1, currentLine.y1),
			];
		} else {
			let totalDist = Phaser.Geom.Line.Length(currentLine);
			for (let i = this.points.length - 1; i > 0; i--) {
				const p1 = this.points[i];
				const p0 = this.points[i - 1];
				const segDist = Phaser.Math.Distance.Between(p0.x, p0.y, p1.x, p1.y);
				totalDist += segDist;
				if (totalDist > this.maxLength) {
					this.points.splice(0, i);
					break;
				}
			}
		}

		if (dist >= 20) {
			this.points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
			// this.curve.lineTo(pointer.x, pointer.y);
		}

		this.graphics.clear();
		this.graphics.lineStyle(8, 0x0000ff);
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
		this.onLineBreak();
	}

	checkCollisions(colliders: Phaser.Geom.Circle[]) {
		if (this.points.length == 0) return;

		// Break line if it intersects with any collider
		for (const collider of colliders) {
			for (const line of this.lineSegments) {
				if (Phaser.Geom.Intersects.LineToCircle(line, collider)) {
					return this.onLineBreak();
				}
			}
		}
	}

	onLoop(points: Phaser.Math.Vector2[]) {
		const polygonStr = this.points.map((p) => `${p.x} ${p.y}`).join(" ");
		const polygon = new Phaser.Geom.Polygon(polygonStr);
		this.emit("loop", polygon);

		this.addLoopGraphic(points);
	}

	onLineBreak() {
		this.emit("break");
		this.cursor.setVisible(false);
		this.points = [];
		this.graphics.clear();
	}

	addLoopGraphic(points: Phaser.Math.Vector2[]) {
		const graphics = this.scene.add.graphics();
		graphics.clear();
		graphics.fillStyle(0x0000ff, 0.5);
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

	get lineSegments(): Phaser.Geom.Line[] {
		// Create lines from points
		const lines: Phaser.Geom.Line[] = [];
		for (let i = 1; i < this.points.length; i++) {
			const prev = this.points[i - 1];
			const curr = this.points[i];
			lines.push(new Phaser.Geom.Line(prev.x, prev.y, curr.x, curr.y));
		}
		return lines;
	}
}
