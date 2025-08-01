import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { HubLevel } from "@/components/WorldHub/HubLevel";
import { levels } from "@/components/WorldHub/Levels";
import { Entity } from "@/components/Entity";
import { LevelDefinition } from "@/components/WorldHub/LevelDefinition";

export class WorldScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private loopDrawer: LoopDrawer;

	private entities: Entity[];
	private hubs: HubLevel[];

	constructor() {
		super({ key: "WorldScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.entities = [];

		this.cameras.main.setBackgroundColor(0xffffff);
		this.background = this.add.image(0, 0, "background_plains_0");
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

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.setDepth(1000);
		this.loopDrawer.on("loop", this.onLoop, this);
	}

	update(time: number, delta: number) {
		this.loopDrawer.update(time, delta);
		// this.loopDrawer.checkCollisions(this.colliders);
	}

	loadLevel(levelData: LevelDefinition): void {
		// Disable loop drawing
		this.loopDrawer.setEnabled(false);

		// Flash the screen and start the level
		this.flash(1000, 0xffffff, 0.3);
		this.addEvent(1000, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.scene.start("GameScene", levelData);
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
		this.entities.forEach((entity) => {
			if (Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)) {
				entity.onLoop();
			}
		});
	}
}
