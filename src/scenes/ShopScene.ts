import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { Pearl, PearlType, PearlTypes } from "@/components/pearls/Pearl";
import { Entity } from "@/components/Entity";
import { pearlState } from "@/state/PearlState";

export class ShopScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private entityLayer: Phaser.GameObjects.Container;
    private entities: Entity[];
	public loopDrawer: LoopDrawer;

	constructor() {
		super({ key: "ShopScene" });
	}

	create(): void {
		this.entities = [];
		this.initGraphics();

		// Temporary
		this.addText({
			text: "(Press ESC to return)",
			size: 48,
			color: "white",
		});
		this.input.keyboard?.on("keydown-ESC", () => {
			this.loopDrawer.setEnabled(false);
			this.scene.start("WorldScene");
		});
	}

	initGraphics() {
		this.background = this.add.image(0, 0, "background_shelves");
		this.background.setDepth(0);
		this.background.setOrigin(0);
		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.setDepth(1000);
		this.loopDrawer.on("loop", this.onLoop, this);

        for(const [_, pearlDescriptor] of Object.entries(PearlTypes)) {
            const pearl = new Pearl(this, pearlDescriptor);
            this.entities.push(pearl);
            pearl.on("selected", (pearl: PearlType) => {
				pearlState.pearlLineColor = pearl.lineColor
			});
        }
	}

	update(time: number, delta: number) {

		this.loopDrawer.update(time, delta);

		// Camera shake
		if (this.cameraShakeValue > 0)
			this.cameras.main.x = this.cameraShakeValue * Math.sin(100 * time);
		else this.cameras.main.x = 0;
	}


	addToEntityLayer(p: Phaser.GameObjects.Container) {
		this.entityLayer.add(p);
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
        const selectedEntities = this.entities.filter((entity) =>
			Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)
		);
		if (selectedEntities.length === 1) {
			selectedEntities[0].onLoop();
		}
	}
}
