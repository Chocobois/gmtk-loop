import { BaseScene } from "./BaseScene";
import { images, spritesheets, audios } from "@/assets/assets";
import { GrayScalePostFilter } from "@/pipelines/GrayScalePostFilter";
import { BlurPostFilter } from "@/pipelines/BlurPostFilter";
import BendWaves from "@/pipelines/BendWavesPostFX";
import { title, version } from "@/version.json";
import { levels } from "@/components/WorldHub/Levels";

export class PreloadScene extends BaseScene {
	constructor() {
		super({ key: "PreloadScene" });
	}

	init() {
		// Load pipelines
		let renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
		if (renderer.pipelines) {
			renderer.pipelines.addPostPipeline(
				"GrayScalePostFilter",
				GrayScalePostFilter
			);
			renderer.pipelines.addPostPipeline("BlurPostFilter", BlurPostFilter);
			renderer.pipelines.addPostPipeline("BendWaves", BendWaves);
		}
	}

	preload() {
		this.cameras.main.setBackgroundColor(0x000000);

		// Loading bar
		let width = 0.5 * this.W;
		let x = this.CX - width / 2;
		let y = this.CY;
		let bg = this.add.rectangle(x, y, width, 4, 0x666666).setOrigin(0, 0.5);
		let bar = this.add.rectangle(x, y, 1, 8, 0xdddddd).setOrigin(0, 0.5);

		// Stylus :)
		const stylus = this.add.graphics();

		stylus.lineStyle(12, 0x8cf6ff);
		stylus.moveTo(0, 0);
		stylus.lineTo(0, -50);
		stylus.strokePath();

		stylus.fillStyle(0x8cf6ff);
		stylus.fillTriangle(-6,0, 6,0, 0,10);

		const starRaw = [
			[140,15],[179,47],[194,93],[234,95],[279,117],[262,156],[225,187],[237,233],[229,276],[185,264],
			[147,238],[116,267],[69,284],[58,238],[70,197],[34,171],[12,122],[49,102],[95,100],[109,50]
		];

		const starBack = starRaw.map(([x,y]) => new Phaser.Geom.Point((x - 142) * 0.2, (y - 465) * 0.2));
		const starFront = starRaw.map(([x,y]) => new Phaser.Geom.Point((x - 142) * 0.14, (y - 600) * 0.14));

		stylus.fillStyle(0x16284f);
		stylus.fillPoints(starBack);
		stylus.fillStyle(0xffdf53);
		stylus.fillPoints(starFront);

		stylus.setAngle(45);
		stylus.setAlpha(0);

		// Loading text
		this.addText({
			x,
			y,
			size: 30,
			color: "#DDDDDD",
			text: "Loading...",
		}).setOrigin(0, 1.5);
		this.addText({
			x: this.W,
			y: this.H,
			size: 30,
			color: "#DDDDDD",
			text: `${title} ${version}`,
		}).setOrigin(1, 1);

		// Listener
		this.load.on("progress", (progress: number) => {
			bar.width = progress * width;
			stylus.setPosition(progress * width + x + 10, y - 10);
			stylus.setAlpha(Math.min(1, 10 * progress));
		});

		// Load assets
		for (let image of images) {
			this.load.image(image.key, image.path);
		}

		for (let image of spritesheets) {
			this.load.spritesheet(image.key, image.path, {
				frameWidth: image.width,
				frameHeight: image.height,
			});
		}

		for (let audio of audios) {
			this.load.audio(audio.key, audio.path);
		}
	}

	create() {
		this.fade(true, 100, 0x000000);
		this.addEvent(100, () => {
			this.scene.start("TitleScene");
			// this.scene.start("WorldScene");
			// this.scene.start("GameScene", levels[1]);
		});
	}
}
