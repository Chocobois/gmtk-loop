import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { HubLevel } from "@/components/WorldHub/HubLevel";
import { levels } from "@/components/WorldHub/Levels";
import { Entity } from "@/components/Entity";
import { LevelDefinition } from "@/components/WorldHub/LevelDefinition";
import { Music } from "@/components/Music";
import { Pearl } from "@/components/pearls/Pearl";
import { PearlTypes } from "@/components/pearls/PearlTypes";
import { pearlState } from "@/state/PearlState";
import { PearlElement } from "@/components/pearls/PearlElement";
import { ColorStr } from "@/util/colors";

export class WorldScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
	private loopDrawer: LoopDrawer;

	private entities: Entity[];
	private hubs: HubLevel[];
	private pearlButton: Pearl;

	private music: Music;

	// Special case in case two levels are selected
	private levelIsStarting: boolean = false;
	private queuedLevels: LevelDefinition[];

	constructor() {
		super({ key: "WorldScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.entities = [];

		this.cameras.main.setBackgroundColor(0xffffff);
		this.background = this.add.image(0, 0, "background_plains_2");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.foreground = this.add.image(this.W/2, this.H/2, "hub_foreground");
		this.foreground.setOrigin(0.5, 0.5);
		this.fitToScreen(this.foreground);

		let sampleText = this.addText({
			x: this.CX,
			y: this.H - 80,
			text: "Draw a loop to select a level",
			size: 48,
			color: ColorStr.Amber600,
		});
		sampleText.setOrigin(0.5);
		sampleText.setStroke("white", 15);

		// Create the hub icons for each level
		this.hubs = [];
		levels.forEach((levelData) => {
			const hub = new HubLevel(this, levelData);
			hub.setDepth(100);
			this.entities.push(hub);
			this.hubs.push(hub);

			if (!levelData.enemy) {
				hub.setEnabled(false);
			}

			// Load level upon selecting a hub
			hub.on("selected", this.loadLevel, this);
		});

		this.addHubLines();

		this.addPearlButton();

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.setDepth(1000);
		this.loopDrawer.on("loop", this.onLoop, this);

		// Music
		if (!this.music || !this.music.isPlaying) {
			if (!this.music) {
				this.music = new Music(this, "m_map");
			}
			this.music.play();
			this.music.setVolume(0.2);

			this.levelIsStarting = false;
			this.queuedLevels = [];
		}
	}

	update(time: number, delta: number) {
		this.loopDrawer.update(time, delta);
		this.loopDrawer.checkCollisions(this.entities, delta);

		const barTime = this.music.getBarTime();
		this.hubs.forEach((hub) => hub.setBarTime(barTime));

		if (this.pearlButton) {
			this.pearlButton.update(time, delta);
		}

		// Idle scale animation
		const sin = 0.5 + (Math.sin((3 * time) * 0.0001) * 0.5);
		this.foreground.setScale(1 + (0.05 * sin));
	}

	loadShop() {
		this.loopDrawer.setEnabled(false);
		this.fade(true, 100, 0x000000);
		this.addEvent(100, () => {
			this.scene.start("ShopScene");
		});
	}

	loadLevel(levelData: LevelDefinition): void {
		// Allow multiple levels to be started at once :eyes:
		this.queuedLevels.push(levelData);
		if (this.levelIsStarting) return;
		this.levelIsStarting = true;

		// Disable loop drawing
		this.loopDrawer.setEnabled(false);

		// Set volume to 0 so that animations may continue
		this.music.setVolume(0);
		this.addEvent(5, () => {
			const key =
				"h_map_select" + (this.queuedLevels.length < 2 ? "" : "_multiple");
			this.sound.play(key, { volume: 0.2 });
		});

		// Flash the screen and start the level
		this.flash(1000, 0xffffff, 0.3);
		this.addEvent(1000, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.music.stop();
				this.scene.start("GameScene", this.queuedLevels);
			});
		});
	}

	addHubLines(): void {
		const graphics = this.add.graphics();
		graphics.lineStyle(10, 0xffffff, 0.3);

		this.hubs.forEach((hub) => {
			hub.levelData.require.forEach((key) => {
				const targetHub = this.hubs.find((h) => h.levelData.key === key);
				if (targetHub) {
					graphics.beginPath();
					graphics.moveTo(hub.x, hub.y);
					graphics.lineTo(targetHub.x, targetHub.y);
					graphics.strokePath();
				}
			});
		});
	}

	addPearlButton() {
		if (!pearlState.anyPearlsUnlocked) {
			return;
		}

		this.pearlButton = new Pearl(
			this,
			this.W - 200,
			this.H - 200,
			PearlTypes[PearlElement.None]
		);
		this.pearlButton.setDepth(100);
		this.entities.push(this.pearlButton);
		this.pearlButton.on("selected", this.loadShop, this);

		// Update pearl type
		this.pearlButton.setPearlType(pearlState.currentPearl);
		if (pearlState.currentPearl.element == PearlElement.None) {
			this.pearlButton.setHighlight(false);
		}

		const label = this.addText({
			x: this.pearlButton.x,
			y: this.pearlButton.y + 150,
			text: "Pearls",
			size: 48,
			color: "white",
		});
		label.setStroke("black", 16);
		label.setOrigin(0.5);
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
		const selectedEntities = this.entities.filter((entity) =>
			Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)
		);

		// Only one selected
		if (selectedEntities.length == 1) {
			selectedEntities[0].onLoop();
			return;
		}

		const midpoint = new Phaser.Math.Vector2(
			Phaser.Math.Average(selectedEntities.map((e) => e.x)),
			Phaser.Math.Average(selectedEntities.map((e) => e.y))
		);

		// If all selected entities are level hubs, then start the levels simultaneously
		if (
			selectedEntities.length > 0 &&
			selectedEntities.every((e) => e instanceof HubLevel && e.levelData.enemy)
		) {
			selectedEntities.forEach((e) => {
				e.onLoop();
				this.tweens.add({
					targets: e,
					x: midpoint.x,
					y: midpoint.y,
					duration: 1100,
					ease: "Quad.In",
				});
			});
			return;
		}

		// Easter eggs when selecting multiple non-levels at once
		else if (selectedEntities.length > 1) {
			selectedEntities.forEach((e, i) => {
				if (i == 0) return;
				this.sound.play("u_question", {
					volume: 0.2,
					delay: 0.2 + 0.5 * (i - 1),
					rate: 1 + 0.25 * (i - 1),
				});
			});

			const questionMark = this.add.sprite(midpoint.x, midpoint.y, "question");
			questionMark.setScale(0.35);
			questionMark.setDepth(10005); // Above the loop fill

			this.tweens.add({
				targets: questionMark,
				alpha: 0,
				onUpdate: () =>
					questionMark.setAngle(Math.sin(this.time.now * 0.001 * 8) * 20),
				onComplete: () => questionMark.destroy(),
			});
		}
	}
}
