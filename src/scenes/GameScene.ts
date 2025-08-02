import { BaseScene } from "@/scenes/BaseScene";
import { LoopDrawer } from "@/components/LoopDrawer";
import { UI } from "@/components/UI";
import { TextParticle, TextParticleEffects } from "@/components/TextParticle";
import { Effect } from "@/components/Effect";
import { EffectTracker } from "@/components/EffectTracker";
import { LevelDefinition } from "@/components/WorldHub/LevelDefinition";
import { loopState } from "@/state/LoopState";
import { Music } from "@/components/Music";

import { Entity } from "@/components/Entity";
import { Monster } from "@/components/Monster";
import { SnakeMonster } from "@/components/enemies/snake/SnakeMonster";
import { MoleBoss } from "@/components/enemies/mole/MoleBoss";
import { Jester } from "@/components/enemies/jester/Jester";
import { AbraBoss } from "@/components/enemies/abra/AbraBoss";

import BendWaves from "@/pipelines/BendWavesPostFX";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private entities: Entity[];
	private entityLayer: Phaser.GameObjects.Container;
	public loopDrawer: LoopDrawer;

	private ui: UI;
	private debugGraphics: Phaser.GameObjects.Graphics;
	private textParticles: TextParticle;

	private hitEffects: EffectTracker;
	private projectiles: EffectTracker;
	private indicators: EffectTracker;

	public winJingle: Phaser.Sound.BaseSound;
	public loseJingle: Phaser.Sound.BaseSound;
	private gameOverText: Phaser.GameObjects.Image;

	private music: Music;

	constructor() {
		super({ key: "GameScene" });
	}

	create(levelData: LevelDefinition): void {
		this.fade(false, 200, 0x000000);

		// Restore health
		loopState.health = loopState.maxHealth;

		this.cameras.main.setBackgroundColor(0xffffff);
		this.background = this.add.image(0, 0, levelData.background);
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.entities = [];
		this.entityLayer = new Phaser.GameObjects.Container(this, 0, 0);
		this.add.existing(this.entityLayer);

		this.loadMonster(levelData.enemy);

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.on("loop", this.onLoop, this);
		this.loopDrawer.on("break", this.onLoopBreak, this);

		this.textParticles = new TextParticle(this);

		this.ui = new UI(this);

		this.debugGraphics = this.add.graphics();

		this.initGraphics();

		// Music
		if (!this.music) {
			// TODO: Add music track in LevelDefinition
			this.music = new Music(this, "m_fight", { volume: 0.2 });
			// this.music = new Music(this, "m_lightfast", { volume: 0.2 });
		}
		this.music.play();

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

	loadMonster(enemyKey: string) {
		switch (enemyKey) {
			case "sans":
				const monster = new Monster(this, 960, 540);
				this.addEntity(monster);
				break;

			case "snake":
				const snake = new SnakeMonster(this, 960, 540);
				this.addEntity(snake);
				break;

			case "mole":
				const mole = new MoleBoss(this, 960, 540);
				this.addEntity(mole);
				mole.addFakeMoles(3);
				mole.moveAllMoles(true);
				break;

			case "jester":
				const jester = new Jester(this, 960, 540);
				this.addEntity(jester);
				break;

			case "abra":
				const abra = new AbraBoss(this, 960, 540);
				this.addEntity(abra);
				break;

			default:
				console.warn(`Unknown enemy type: ${enemyKey}`);
				break;
		}
	}

	addEntity(entity: Entity) {
		this.entityLayer.add(entity);
		this.entities.push(entity);

		// Call `this.emit("addEntity", object)` inside of a Monster class to add it
		entity.on("addEntity", this.addEntity, this);
		entity.on("removeEntity", this.removeEntity, this);
		entity.on("damage", this.damagePlayer, this);
		entity.on("victory", this.win, this);
	}

	removeEntity(entity: Entity) {
		this.entities = this.entities.filter((elt) => elt !== entity);
		entity.destroy();
	}

	removeMonster(monster: Monster) {
		this.removeEntity(monster);
		if (this.entities.length === 0) {
			this.win();
		}
	}

	initGraphics() {
		this.background.setDepth(0);
		this.entityLayer.setDepth(19);
		this.textParticles.setDepth(30);
		this.debugGraphics.setDepth(100);
		this.loopDrawer.setDepth(1000);

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
		this.loopDrawer.checkCollisions(this.entities);
		this.textParticles.update(time, delta);

		this.drawColliders();
		this.updateEffects(time, delta);

		// Camera shake
		if (this.cameraShakeValue > 0)
			this.cameras.main.x = this.cameraShakeValue * Math.sin(100 * time);
		else this.cameras.main.x = 0;
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

	onLoop(polygon: Phaser.Geom.Polygon) {
		this.entities.forEach((entity) => {
			if (Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)) {
				if (entity instanceof Entity && entity.enabled) {
					entity.onLoop();
				}
			}
		});
	}

	onLoopBreak(entity: Entity) {
		this.damagePlayer(entity.entityDamage);
	}

	damagePlayer(damage: number) {
		this.flash(200, 0xff7777, 0.2);
		this.shake(500, 10, 0);

		this.loopDrawer.onLineBreak();

		const { x, y } = this.ui.healthPosition;
		this.textParticle(x, y, "red", `${-damage}`, false, 96, 3);

		// Reduce player health
		loopState.health = Math.max(0, loopState.health - damage);
		if (loopState.health <= 0) {
			this.lose();
		}
	}

	drawColliders() {
		this.debugGraphics.clear();
		this.debugGraphics.fillStyle(0xff0000, 0.25);
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
		const text = this.addText({ x, y, size, color, text: content });
		if (outline) text.setStroke("rgba(0,0,0,0.5)", 30);

		// Center text
		text.setOrigin(0.5);

		// Prevent text from going too far right
		const right = text.getRightCenter().x ?? 0;
		const diff = this.W - right - 80;
		if (diff < 0) text.setX(text.x + diff);

		this.textParticles.push(text, duration, effects);
	}

	get colliders(): Phaser.Geom.Circle[] {
		return this.entities.flatMap((entity) => entity.colliders);
	}

	win() {
		this.loopDrawer.setEnabled(false);
		this.music.stop();
		this.sound.play("u_level_enter", { volume: 0.4 });

		this.gameOverText = this.add.image(this.CX, 1000, "win");

		this.addEvent(3000, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.scene.start("WorldScene");
			});
		});
	}

	lose() {
		this.loopDrawer.setEnabled(false);
		this.music.stop();
		this.sound.play("u_level_enter", { volume: 0.4 });

		this.gameOverText = this.add.image(this.CX, 1000, "lose");

		this.addEvent(3000, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.scene.start("WorldScene");
			});
		});
	}

	// Used by Jester to affect the player input
	onInputFlipModeAttack() {
		this.loopDrawer.setRandomInputFlipMode();
		this.animateWaveFilter();
	}

	// Used by Jester to disable player input manipulation
	resetInputFlipMode() {
		this.loopDrawer.resetInputFlipMode();
		this.animateWaveFilter();
	}

	// Play a short BendWaves PostFX filter animation
	animateWaveFilter() {
		// Abort if filter is already in use
		if (this.cameras.main.hasPostPipeline) return;
		this.cameras.main.setPostPipeline(BendWaves);

		// Animate wave amplitude, then disable the filter
		this.tweens.chain({
			targets: this.cameras.main.getPostPipeline(BendWaves) as BendWaves,
			tweens: [
				{
					amplitude: { from: 0, to: 0.02 },
					ease: "Sine.InOut",
					duration: 400,
				},
				{
					amplitude: { from: 0.02, to: 0 },
					ease: "Sine.Out",
					duration: 1400,
				},
			],
			onComplete: () => {
				this.cameras.main.resetPostPipeline();
			},
		});
	}
}
