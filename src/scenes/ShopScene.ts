import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { Entity } from "@/components/Entity";
import { PearlType, PearlTypes } from "@/components/pearls/PearlTypes";
import { pearlState } from "@/state/PearlState";
import { Pearl } from "@/components/pearls/Pearl";
import { PearlElement } from "@/components/pearls/PearlElement";
import { HubLevel } from "@/components/WorldHub/HubLevel";
import { ColorStr } from "@/util/colors";

export class ShopScene extends BaseScene {
	public loopDrawer: LoopDrawer;

	private background: Phaser.GameObjects.Image;
	private entityLayer: Phaser.GameObjects.Container;
	private entities: Entity[];
	private pearls: Pearl[];
	private backButton: HubLevel;

	private description: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "ShopScene" });
	}

	create(): void {
		this.entities = [];
		this.pearls = [];
		this.initGraphics();

		// Back button (ugly hack)
		this.backButton = new HubLevel(this, {
			x: 200,
			y: this.H - 200,
			title: "Back",
			key: "",
			require: [],
			enemy: "",
			background: "",
			music: "m_fight",
			pearl: PearlElement.None,
		});
		this.backButton.setImageScale(1.2);
		this.entities.push(this.backButton);
		this.backButton.on("selected", this.loadWorldHub, this);

		this.description = this.addText({
			x: this.W - 100,
			y: this.H - 100,
			text: PearlTypes[PearlElement.None].description,
			size: 64,
			color: "white",
		});
		this.description.setOrigin(1);
		this.description.setWordWrapWidth(700);
		this.description.setStroke("black", 15);

		this.description.setText(
			`${pearlState.currentPearl.name}: ${pearlState.currentPearl.description}`
		);
	}

	initGraphics() {
		this.background = this.add.image(0, 0, "background_shelves");
		this.background.setDepth(0);
		this.background.setOrigin(0);
		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.setDepth(1000);
		this.loopDrawer.on("loop", this.onLoop, this);

		for (const [_, pearlType] of Object.entries(PearlTypes)) {
			if (pearlType.element == PearlElement.None) continue;
			if (!pearlState.acquiredPearls[pearlType.element]) continue;

			const x = pearlType.shopX;
			const y = pearlType.shopY;
			const pearl = new Pearl(this, x, y, pearlType);
			this.entities.push(pearl);
			this.pearls.push(pearl);
			pearl.on("selected", (pearlType: PearlType) => {
				// Select pearl if not in use
				if (pearlState.currentPearl.element != pearlType.element) {
					pearlState.currentPearl = pearlType;
				}
				// Unequip pearl if already in use
				else {
					pearlState.currentPearl = PearlTypes[PearlElement.None];
				}
				this.description.setText(
					`${pearlState.currentPearl.name}: ${pearlState.currentPearl.description}`
				);
				this.refreshPearls();
			});
		}

		this.refreshPearls();
	}

	update(time: number, delta: number) {
		this.loopDrawer.update(time, delta);

		this.pearls.forEach((pearl) => pearl.update(time, delta));

		// Camera shake
		if (this.cameraShakeValue > 0)
			this.cameras.main.x = this.cameraShakeValue * Math.sin(100 * time);
		else this.cameras.main.x = 0;
	}

	addToEntityLayer(p: Phaser.GameObjects.Container) {
		this.entityLayer.add(p);
	}

	refreshPearls() {
		this.pearls.forEach((pearl) => {
			pearl.setHighlight(pearl.element == pearlState.currentPearl.element);
		});
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
		const selectedEntities = this.entities.filter((entity) =>
			Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)
		);

		// Select pearl
		if (selectedEntities.length === 1) {
			selectedEntities[0].onLoop();
		}
		// Prevent multiple pearls from being selected
		else if (selectedEntities.length > 1) {
			selectedEntities.forEach((entity) => {
				if (entity instanceof Pearl) {
					(entity as Pearl).shake();
				}
			});
		}
	}

	loadWorldHub() {
		this.loopDrawer.setEnabled(false);
		this.fade(true, 100, 0x000000);
		this.addEvent(100, () => {
			this.scene.start("WorldScene");
		});
	}
}
