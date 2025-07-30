import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { LoopDrawer } from "@/components/LoopDrawer";
import { UI } from "@/components/UI";

export class GameScene extends BaseScene {
	// private background: Phaser.GameObjects.Image;
	private player: Player;
	private loopDrawer: LoopDrawer;
	// private ui: UI;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.cameras.main.setBackgroundColor(0xffffff);
		// this.background = this.add.image(0, 0, "background");
		// this.background.setOrigin(0);
		// this.fitToScreen(this.background);

		this.player = new Player(this, this.CX, this.CY);
		this.player.on("action", () => {
			this.player.doABarrelRoll();
		});

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.on("loop", (polygon: Phaser.Geom.Polygon) => {
			// Check polygon collisions with all monsters
			if (Phaser.Geom.Polygon.Contains(polygon, this.player.x, this.player.y)) {
				this.player.doABarrelRoll();
			}
		});

		// this.ui = new UI(this);
	}

	update(time: number, delta: number) {
		this.player.update(time, delta);
		this.loopDrawer.update(time, delta);
	}
}
