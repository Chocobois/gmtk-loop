import { BaseScene } from "@/scenes/BaseScene";
import { loopState } from "@/state/LoopState";

const SFX_FADE_OUT_DURATION = 100 //ms
const SFX_SMOOTHING_WINDOW_SIZE = 500 //ms
const SFX_TIMEOUT = 60 //ms
const SFX_PAN_INTENSITY = 0.3 // 30%

export class LoopDrawer extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private points: Phaser.Math.Vector2[] = [];
	private pointTimes: number[] = [];

	private inputArea: Phaser.GameObjects.Rectangle;
	private graphics: Phaser.GameObjects.Graphics;
	private cursor: Phaser.GameObjects.Image;

	public muted: boolean = false;
	private sfxLoop: Phaser.Sound.WebAudioSound;
	private sfxTween: Phaser.Tweens.Tween;

	constructor(scene: BaseScene) {
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
		this.add(this.graphics);

		this.cursor = scene.add.image(-999, -999, "cursor");
		this.add(this.cursor);

		// Use the `d_sine` key for sound debugging
		this.sfxLoop = scene.sound.add("d_brush", {
			loop: true,
		}) as Phaser.Sound.WebAudioSound;

		this.sfxTween = this.scene.tweens.add({
			targets: this.sfxLoop,
			volume: { from: 1, to: 0 },
			duration: SFX_FADE_OUT_DURATION,
			persist: true,
			paused: true,
			onComplete: () => {
				this.sfxLoop.stop();
				this.sfxLoop.setVolume(1);
			},
			onStop: () => {
				this.sfxLoop.setVolume(1);
			},
		});
	}

	update(time: number, delta: number) {
		this.sfxLoop.mute = this.muted;

		if (this.pointTimes.length > 0) {
			const sinceLastMove = time - (this.pointTimes.at(-1) ?? time - 1);

			// SFX timeout
			if (sinceLastMove > SFX_TIMEOUT) this.sfxFadeOut(SFX_FADE_OUT_DURATION);
		}
	}

	setEnabled(enabled: boolean) {
		this.inputArea.input!.enabled = enabled;
		this.onLineBreak();
	}

	touchStart(pointer: Phaser.Input.Pointer) {
		this.cursor.setVisible(true).setPosition(pointer.x, pointer.y);
		this.points = [new Phaser.Math.Vector2(pointer.x, pointer.y)];
		this.pointTimes = [pointer.time];

		if (!this.muted) this.scene.sound.play("d_tap", {
			pan: SFX_PAN_INTENSITY * this.scene.getPan(pointer.x),
		});
	}

	touchDrag(pointer: Phaser.Input.Pointer) {
		if (this.points.length == 0) return;

		this.cursor.setPosition(pointer.x, pointer.y);

		const lastPoint = this.points[this.points.length - 1];
		/* const dx = pointer.x - lastPoint.x;
		const dy = pointer.y - lastPoint.y;
		const dist = Math.sqrt(dx * dx + dy * dy); */
		const dist = lastPoint.distance(pointer);

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
				this.pointTimes = [pointer.time];
				return;
			}
		}

		// Check if total line distance exceeds maxLength
		const distance = Phaser.Geom.Line.Length(currentLine);
		if (distance > loopState.maxLength) {
			const direction = new Phaser.Math.Vector2(
				currentLine.x1 - currentLine.x2,
				currentLine.y1 - currentLine.y2
			).normalize();
			const startPoint = new Phaser.Math.Vector2(
				currentLine.x1 - direction.x * loopState.maxLength,
				currentLine.y1 - direction.y * loopState.maxLength
			);
			this.points = [
				startPoint,
				new Phaser.Math.Vector2(currentLine.x1, currentLine.y1),
			];
			this.pointTimes = [pointer.time];
		} else {
			let totalDist = Phaser.Geom.Line.Length(currentLine);
			for (let i = this.points.length - 1; i > 0; i--) {
				const p1 = this.points[i];
				const p0 = this.points[i - 1];
				const segDist = Phaser.Math.Distance.Between(p0.x, p0.y, p1.x, p1.y);
				totalDist += segDist;
				if (totalDist > loopState.maxLength) {
					this.points.splice(0, i);
					break;
				}
			}
		}

		if (dist >= 20) {
			this.points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
			this.pointTimes.push(pointer.time);
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

		// Sound stuff

		this.sfxTween.stop(); // Cancel SFX fade-out
		if (!this.sfxLoop.isPlaying) this.sfxLoop.play();

		this.sfxLoop.setPan(
			SFX_PAN_INTENSITY * this.scene.getPan(pointer.x, true)
		);

		// Dynamic sound playing rate (pitch)
		const minRate = 0.2;
		const maxRate = 10;

		if (this.pointTimes.length < 2) {
			this.sfxLoop.setRate(minRate);
		} else {
			// Todo: somehow calculate the rate from drawn cycles per second instead

			// Get average speed from last 500ms worth of points
			let recentWindowSize = this.pointTimes.length;
			for (let i = this.pointTimes.length - 1; i > 0; i--) {
				const span =
					this.pointTimes[this.pointTimes.length - 1] - this.pointTimes[i];
				if (span > SFX_SMOOTHING_WINDOW_SIZE) {
					recentWindowSize = this.pointTimes.length - i;
					break;
				}
			}

			const recentPoints = this.points.slice(-recentWindowSize);
			const recentPointTimes = this.pointTimes.slice(-recentWindowSize);

			let recentDist = 0;
			for (let i = 1; i < recentPoints.length; i++) {
				const p0 = recentPoints[i - 1];
				const p1 = recentPoints[i];
				recentDist += Phaser.Math.Distance.Between(p0.x, p0.y, p1.x, p1.y);
			}

			const recentSpan =
				Math.max(...recentPointTimes) - Math.min(...recentPointTimes);
			const recentSpeed = 1000 * Phaser.Math.GetSpeed(recentDist, recentSpan);

			/* console.debug({
				len: this.pointTimes.length,
				window: recentWindowSize,
				dist: Math.round(recentDist),
				span: Math.round(recentTimeSpan),
				speed: Number(recentSpeed.toFixed(4)),
				times: recentPointTimes
			}) */

			// The sound clip has 4 loops per 4.745 seconds -> about 0.843 loops/sec
			this.sfxLoop.setRate(
				Phaser.Math.Clamp(0.843 * recentSpeed, minRate, maxRate)
			);
		}
	}

	touchEnd(pointer: Phaser.Input.Pointer) {
		if (!this.muted) this.scene.sound.play("d_raise", {
			pan: SFX_PAN_INTENSITY * this.scene.getPan(pointer.x),
		});

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
		const polygonStr = points.map((p) => `${p.x} ${p.y}`).join(" ");
		const polygon = new Phaser.Geom.Polygon(polygonStr);
		this.emit("loop", polygon);

		this.addLoopGraphic(points);
	}

	onLineBreak() {
		this.emit("break");
		this.cursor.setVisible(false);
		this.points = [];
		this.pointTimes = [];
		this.graphics.clear();
		this.sfxStop();
	}

	addLoopGraphic(points: Phaser.Math.Vector2[]) {
		const graphics = this.scene.add.graphics();
		graphics.setDepth(10000);
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

	/** Fade out the drawing loop sound @param [duration] in milliseconds */
	sfxFadeOut(duration = SFX_FADE_OUT_DURATION) {
		this.sfxTween.duration = duration;

		if (this.sfxTween.isPlaying()) return;
		this.sfxTween.restart();
		this.sfxTween.play();
	}

	/** Abruptly stop the drawing loop sound */
	sfxStop() {
		this.sfxTween.stop();
		this.sfxLoop.stop();
	}

	// For Golen :3
	mute() {
		this.muted = true;
		this.sfxStop();
		return this;
	}

	unmute() {
		this.muted = false;
		return this;
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
