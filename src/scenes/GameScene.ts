import { BaseScene } from "@/scenes/BaseScene";
import { Monster } from "@/components/Monster";
import { LoopDrawer } from "@/components/LoopDrawer";
import { UI } from "@/components/UI";
import { TextParticle, TextParticleEffects } from "@/components/TextParticle";

export class GameScene extends BaseScene {
	// private background: Phaser.GameObjects.Image;
	private entities: Monster[];
	private loopDrawer: LoopDrawer;
	// private ui: UI;
	private debugGraphics: Phaser.GameObjects.Graphics;
	private textParticles: TextParticle;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.cameras.main.setBackgroundColor(0xffffff);
		// this.background = this.add.image(0, 0, "background");
		// this.background.setOrigin(0);
		// this.fitToScreen(this.background);

		this.entities = [];
		this.addMonster(300, 300);
		this.addMonster(960, 540);
		this.addMonster(1620, 780);

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.on("loop", this.onLoop, this);


		this.textParticles = new TextParticle(this);

		// this.ui = new UI(this);

		this.debugGraphics = this.add.graphics();
	}

	update(time: number, delta: number) {
		this.entities.forEach((entity) => entity.update(time, delta));

		this.loopDrawer.update(time, delta);
		this.loopDrawer.checkCollisions(this.colliders);
		this.textParticles.update(time, delta);

		this.drawColliders();
	}

	addMonster(x: number, y: number) {
		const monster = new Monster(this, x, y);
		monster.on("action", () => {
			monster.doABarrelRoll();
		});
		this.entities.push(monster);
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
		this.entities.forEach((entity) => {
			if (Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)) {
				entity.doABarrelRoll();
				this.textParticle(entity.x, entity.y, "OrangeRed", "123");
				console.log("Particle");
			}
		});
	}

	drawColliders() {
		this.debugGraphics.clear();
		this.debugGraphics.fillStyle(0xff0000, 0.5);
		this.colliders.forEach((collider) => {
			this.debugGraphics.fillCircle(collider.x, collider.y, collider.radius);
		});
	}

	textParticle(x: number, y: number, color: string, content: string, outline: boolean=true, size: number=40,
		duration: number=1.5, effects: TextParticleEffects={ wave: {enable: true}, fadeOut: {enable: true} }) {

		const text = this.createText(x, y, size, color, content);
		if(outline) text.setStroke("rgba(0,0,0,0.5)", 30);

		// Prevent text from going too far right
		const right = text.getRightCenter().x ?? 0;
		const diff = this.W - right - 80;
		if(diff < 0) text.setX(text.x+diff);

		this.textParticles.push(text, duration, effects);
	}

	get colliders(): Phaser.Geom.Circle[] {
		return this.entities.flatMap((entity) => entity.colliders);
	}
}
