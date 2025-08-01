import { BaseScene } from "@/scenes/BaseScene";
import { Monster } from "@/components/Monster";
import { LoopDrawer } from "@/components/LoopDrawer";
import { UI } from "@/components/UI";
import { TextParticle, TextParticleEffects } from "@/components/TextParticle";
import { Effect } from "@/components/Effect";
import { EffectTracker } from "@/components/EffectTracker";
import { LevelDefinition } from "@/components/WorldHub/LevelDefinition";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private entities: Monster[];
	private entityLayer: Phaser.GameObjects.Container;
	private loopDrawer: LoopDrawer;

	// private ui: UI;
	private debugGraphics: Phaser.GameObjects.Graphics;
	private textParticles: TextParticle;

	private hitEffects: EffectTracker;
	private projectiles: EffectTracker;
	private indicators: EffectTracker;

	public winJingle: Phaser.Sound.BaseSound;
	public loseJingle: Phaser.Sound.BaseSound;
	private gameOverText: Phaser.GameObjects.Image;

	private playerHP: number;

	constructor() {
		super({ key: "GameScene" });
	}

	create(levelData: LevelDefinition): void {
		this.fade(false, 200, 0x000000);

		this.cameras.main.setBackgroundColor(0xffffff);
		this.background = this.add.image(0, 0, "background_plains_0");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.entities = [];
		this.entityLayer = new Phaser.GameObjects.Container(this, 0, 0);
		this.add.existing(this.entityLayer);

		this.playerHP = 100;

		this.loadMonster(levelData.enemy);

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.on("loop", this.onLoop, this);

		this.textParticles = new TextParticle(this);

		// this.ui = new UI(this);

		this.debugGraphics = this.add.graphics();

		this.initGraphics();

		// Temporary
		this.addText({
			text: "(Press ESC to return)",
			size: 48,
			color: "white",
		});
		this.input.keyboard?.on("keydown-ESC", () => {
			this.scene.start("WorldScene");
		});
	}

	loadMonster(enemyKey: string) {
		// Spawn various monster types here
		// if (enemyKey === "apple") {}
		this.addMonster(960, 540);
	}

	initGraphics() {
		this.background.setDepth(0);
		this.entityLayer.setDepth(19);
		this.textParticles.setDepth(20);

		this.indicators = new EffectTracker(this, 0, 0);
		this.add.existing(this.indicators);
		this.indicators.setDepth(12);

		this.projectiles = new EffectTracker(this, 0, 0);
		this.add.existing(this.projectiles);
		this.projectiles.setDepth(15);

		this.hitEffects = new EffectTracker(this, 0, 0);
		this.add.existing(this.hitEffects);
		this.hitEffects.setDepth(16);
	}

	update(time: number, delta: number) {
		this.entities.forEach((entity) => entity.update(time, delta));

		this.loopDrawer.update(time, delta);
		this.loopDrawer.checkCollisions(this.colliders);
		this.textParticles.update(time, delta);

		this.drawColliders();
		this.updateEffects(time, delta);
	}

	pushHitEffect(e: Effect) {
		this.hitEffects.pushEffect(e);
	}

	pushProjectile(e: Effect) {
		this.projectiles.pushEffect(e);
	}

	pushIndicator(e: Effect) {
		this.indicators.pushEffect(e);
	}

	updateEffects(t: number, d: number) {
		this.indicators.update(t, d);
		this.hitEffects.update(t, d);
		this.projectiles.update(t, d);
	}

	addToEntityLayer(p: Phaser.GameObjects.Container) {
		this.entityLayer.add(p);
	}

	addMonster(x: number, y: number) {
		const monster = new Monster(this, x, y);
		monster.on("action", () => {
			monster.doABarrelRoll();
		});
		this.entityLayer.add(monster);
		this.entities.push(monster);
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
		this.entities.forEach((entity) => {
			if (Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)) {
				//entity.doABarrelRoll();
				if (entity instanceof Monster) {
					entity.onLoop();
				}
			}
		});
	}

	removeMonster(monster: Monster) {
		this.entities = this.entities.filter((elt) => elt !== monster);
		monster.destroy();
		if (this.entities.length === 0) {
		  this.win();
		}
	  }

	drawColliders() {
		this.debugGraphics.clear();
		this.debugGraphics.fillStyle(0xff0000, 0.5);
		this.colliders.forEach((collider) => {
			this.debugGraphics.fillCircle(collider.x, collider.y, collider.radius);
		});
	}

	textParticle(
		x: number,
		y: number,
		color: string,
		content: string,
		outline: boolean = true,
		size: number = 40,
		duration: number = 1.5,
		effects: TextParticleEffects = {
			wave: { enable: true },
			fadeOut: { enable: true },
		}
	) {
		const text = this.createText(x, y, size, color, content);
		if (outline) text.setStroke("rgba(0,0,0,0.5)", 30);

		// Prevent text from going too far right
		const right = text.getRightCenter().x ?? 0;
		const diff = this.W - right - 80;
		if (diff < 0) text.setX(text.x + diff);

		this.textParticles.push(text, duration, effects);
	}

	get colliders(): Phaser.Geom.Circle[] {
		return this.entities.flatMap((entity) => entity.colliders);
	}

	damageToPlayer(amount: number) {
		this.playerHP = Math.max(0, this.playerHP - amount);
		if (this.playerHP <= 0) {
			this.lose();
		}
	}

	win() {
		this.time.addEvent({
		delay: 5000,
		callback: () => {
			this.scene.start("WorldScene");
		},
		});
		this.gameOverText = this.add.image(this.CX, 1000, "win");
		this.winJingle.play();
	}

	lose() {
		this.time.addEvent({
		delay: 5000,
		callback: () => {
			this.scene.start("WorldScene");
		},
		});
		this.gameOverText = this.add.image(this.CX, 1000, "lose");
		this.loseJingle.play();
	}
}
