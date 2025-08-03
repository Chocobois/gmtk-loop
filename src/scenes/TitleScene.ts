import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

import { title, version } from "@/version.json";

const creditsLeft = `Please
Someone
Write
This`;

const creditsRight = `I
Didn't
Keep
Track`;

const pos = {
	loop: new Phaser.Geom.Point(1450, 500),
	title: new Phaser.Geom.Point(570, 270),
	dragon: new Phaser.Geom.Point(1150, 750),
}

export class TitleScene extends BaseScene {
	public sky: Phaser.GameObjects.Image;
	public loop: Phaser.GameObjects.Image;
	public title: Phaser.GameObjects.Image;
	public dragon: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;

	constructor() {
		super({ key: "TitleScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		const dragonX = 1200;

		this.sky    = this.add.image(this.CX, this.CY, "title_sky");
		this.loop   = this.add.image(pos.loop.x, pos.loop.y, "title_loop");
		this.dragon = this.add.image(pos.dragon.x, pos.dragon.y, "title_dragon");
		this.title  = this.add.image(pos.title.x, pos.title.y, "title_logo");

		this.containToScreen(this.sky);
		this.title.setScale(0.75);

		this.loop.setVisible(false);
		this.loop.setAlpha(0);
		this.loop.x += 1400;
		this.title.y -= 1000;
		this.dragon.x += 1700;

		this.subtitle = this.addText({
			x: 0.25 * this.W,
			y: 0.87 * this.H,
			size: 120,
			color: "#d9fff8",
			text: "Tap to start",
		});
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#307196", 15);
		this.subtitle.setPadding(2);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#2a0720",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 15);
		this.tap.setPadding(2);

		this.version = this.addText({
			x: this.W,
			y: this.H,
			size: 40,
			color: "#307096",
			text: version,
		});

		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.70 * this.W,
			y: 0.02 * this.H,
			size: 35,
			color: "#fff398",
			text: creditsLeft,
		});

		credits1.setStroke("#2a0720", 10);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 0.86 * this.W,
			y: 0.02 * this.H,
			size: 35,
			color: "#a8f7ff",
			text: creditsRight,
		});
		credits2.setStroke("#2a0720", 10);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_title", { volume: 0.3 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);
		}
		this.musicTitle.play();

		// Input

		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.loop.visible) {
			this.loop.x += 0.009 * (pos.loop.x - this.loop.x);
			this.title.y += 0.018 * (pos.title.y - this.title.y);
			this.dragon.x += 0.016 * (pos.dragon.x - this.dragon.x);

			this.loop.alpha += 0.03 * (1 - this.loop.alpha);
			this.dragon.angle =
				(2 * Math.sin((3 * time) * 0.00123)) +
				(7 * Math.sin((3 * time) * 0.00061)) +
				(14 * Math.sin((3 * time) * 0.00014));

			this.loop.angle = 1 * Math.sin((3 * time) * 0.0003);
			this.loop.alpha = 0.75 + 0.25 * Math.sin((3 * time) * 0.0002);

			this.title.alpha +=
				0.01 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha +=
				0.01 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			this.version.alpha +=
				0.01 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.loop.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	progress() {
		if (!this.loop.visible) {
			this.onBar(1);
		} else if (!this.subtitle.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play("u_game_start", { volume: 0.9 });
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.tweens.add({
				targets: this.musicTitle,
				volume: 0,
				duration: 2500,
				onComplete: () => this.musicTitle.stop(),
			})

			this.addEvent(1000, () => {
				this.fade(true, 1500, 0x000000);
				this.addEvent(1550, () => {
					this.scene.start("WorldScene");
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar < 1) {
			this.flash(5000, 0xc5f7f8, 0.7);
		}
		if (bar >= 4) {
			this.title.setVisible(true);
		}
		if (bar == 9) {
			this.addEvent(400, () => {
				this.flash(5000, 0xc5f7f8, 0.05);
			})
		}
		if (bar >= 9) {
			this.addEvent(400, () => {
				this.subtitle.setVisible(true);
				this.credits.setVisible(true);
			});
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}
