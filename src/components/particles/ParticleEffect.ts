import { BaseScene } from "@/scenes/BaseScene";
import { interpolateColor } from "@/util/functions";

export class ParticleEffect {
	public scene: BaseScene;

	constructor(scene: BaseScene) {
		this.scene = scene;
	}

	play(x: number, y: number) {}

	getColorLerp(points: [number, number][]) {
		let colors = [];
		for (let i = 0; i < 30; i++) {
			const t = i / 29;
			for (let j = 0; j < points.length - 1; j++) {
				const [color1, t1] = points[j];
				const [color2, t2] = points[j + 1];
				if (t >= t1 && t <= t2) {
					const lerpT = (t - t1) / (t2 - t1);
					colors.push(interpolateColor(color1, color2, lerpT));
					break;
				}
			}
		}
		return colors;
	}
}
