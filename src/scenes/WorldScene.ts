import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { HubLevel } from "@/components/WorldHub/HubLevel";
import { levels } from "@/components/WorldHub/Levels";
import { Entity } from "@/components/Entity";
import { LevelDefinition } from "@/components/WorldHub/LevelDefinition";
import { Music } from "@/components/Music";

export class WorldScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private loopDrawer: LoopDrawer;

	private entities: Entity[];
	private hubs: HubLevel[];
	private pearlButton: HubLevel;

	private music: Music;

	// Special case in case two levels are selected
	private levelIsStarting: boolean;
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

		let sampleText = this.addText({
			text: "(Draw a loop to select a level)",
			size: 48,
		});

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

		this.pearlButton = new HubLevel(this, {
			x: 200,
			y: this.H - 200,
			title: "Pearls",
			key: "",
			background: "",
			enemy: "",
			require: [],
		});
		this.pearlButton.setDepth(100);
		this.entities.push(this.pearlButton);
		this.pearlButton.on("selected", this.loadShop, this);

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.setDepth(1000);
		this.loopDrawer.on("loop", this.onLoop, this);

		// Music
		if (!this.music) {
			this.music = new Music(this, "m_map");
		}
		this.music.play();
		this.music.setVolume(0.2);

		this.levelIsStarting = false;
		this.queuedLevels = [];
	}

	update(time: number, delta: number) {
		this.loopDrawer.update(time, delta);
		this.loopDrawer.checkCollisions(this.entities);

		const barTime = this.music.getBarTime();
		this.hubs.forEach((hub) => hub.update(barTime));
		this.pearlButton.update(barTime);
	}

	loadShop() {
		this.loopDrawer.setEnabled(false);
		this.flash(1000, 0xffffff, 0.3);
		this.addEvent(1000, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.scene.start("ShopScene");
			});
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
		this.sound.play("h_map_select", { volume: 0.2 });

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
		graphics.lineStyle(8, 0xffffff, 0.5);

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

	onLoop(polygon: Phaser.Geom.Polygon) {
		const selectedEntities = this.entities.filter((entity) =>
			Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)
		);

		// If all selected entities are level hubs, then start the levels simultaneously
		if (
			selectedEntities.length > 0 &&
			selectedEntities.every((e) => e instanceof HubLevel && e.levelData.enemy)
		) {
			if (selectedEntities.length > 1) {
				// Add some other sound here, Mato
			}

			selectedEntities.forEach((e) => e.onLoop());
			return;
		}
		// Easter eggs when selecting multiple non-levels at once
		else {
			selectedEntities.forEach((e, i) => {
				if (i == 0) return;
				this.sound.play("u_question", {
					volume: 0.2,
					delay: 0.2 + 0.5 * (i - 1),
					rate: 1 + 0.25 * (i - 1),
				});
			});

			const midpoint = new Phaser.Math.Vector2(
				Phaser.Math.Average(selectedEntities.map((e) => e.x)),
				Phaser.Math.Average(selectedEntities.map((e) => e.y))
			);

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
