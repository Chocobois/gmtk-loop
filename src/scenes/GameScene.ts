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
import { Wolf } from "@/components/enemies/wolf/Wolf";
import { Snail } from "@/components/enemies/snail/Snail";

import { Pearl } from "@/components/pearls/Pearl";
import { pearlState } from "@/state/PearlState";
import { PearlElement } from "@/components/pearls/PearlElement";
import { PearlTypes } from "@/components/pearls/PearlTypes";

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

	private pearl: Pearl;
	private levelDataList: LevelDefinition[]; // All currently loaded levels
	private activeBossCount: number; // If multiple bosses are loaded, keep count
	public winJingle: Phaser.Sound.BaseSound;
	public loseJingle: Phaser.Sound.BaseSound;

	private music: Music;

	constructor() {
		super({ key: "GameScene" });
	}

	// Allow for multiple levels to be loaded at the same time
	create(levelDataList: LevelDefinition[]): void {
		this.fade(false, 200, 0x000000);
		this.levelDataList = levelDataList;

		// Restore health
		loopState.health = loopState.maxHealth;

		this.cameras.main.setBackgroundColor(0xffffff);
		this.background = this.add.image(0, 0, levelDataList[0].background);
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.entities = [];
		this.entityLayer = new Phaser.GameObjects.Container(this, 0, 0);
		this.add.existing(this.entityLayer);

		const enemiesToSpawn = levelDataList.map((level) => level.enemy);
		this.loadMonsters(enemiesToSpawn);

		this.loopDrawer = new LoopDrawer(this);
		this.loopDrawer.on("loop", this.onLoop, this);
		this.loopDrawer.on("break", this.onLoopBreak, this);

		this.textParticles = new TextParticle(this);

		this.debugGraphics = this.add.graphics();
		this.debugGraphics.setVisible(false);

		/* UI */

		this.ui = new UI(this);

		this.setupPearlUI();

		this.initGraphics();

		// Music
		if (this.music) this.music.destroy();
		this.music = new Music(this, levelDataList[0].music, { volume: 0.2 });
		this.music.play();

		/*  Temporary */

		let returnButton = this.addText({
			x: 20,
			y: 20,
			text: "Return to map",
			size: 48,
			color: "white",
		});
		returnButton.setInteractive().on("pointerdown", () => {
			this.goToWorldHub(0);
		});

		let debugButton = this.addText({
			x: this.W - 20,
			y: 20,
			text: "Show colliders",
			size: 48,
			color: "white",
		});
		debugButton.setOrigin(1, 0);
		debugButton.setInteractive().on("pointerdown", () => {
			this.debugGraphics.setVisible(!this.debugGraphics.visible);
			debugButton.setText(
				this.debugGraphics.visible ? "Hide colliders" : "Show colliders"
			);
		});
	}

	// Allow multiple monster keys to be spawned
	loadMonsters(monsterList: string[]) {
		this.activeBossCount = monsterList.length;

		if (monsterList.includes("snail")) {
			const monster = new Snail(this, 960, 540);
			this.addEntity(monster);
		}

		if (monsterList.includes("wolf")) {
			const monster = new Wolf(this, 960, 540);
			this.addEntity(monster);
		}

		if (monsterList.includes("snake")) {
			const snake = new SnakeMonster(this, 960, 540);
			this.addEntity(snake);
		}

		if (monsterList.includes("mole")) {
			const mole = new MoleBoss(this, 960, 540);
			this.addEntity(mole);
			mole.addFakeMoles(3);
			mole.moveAllMoles(0);
		}

		if (monsterList.includes("jester")) {
			const jester = new Jester(this, 960, 540);
			this.addEntity(jester);
		}

		if (monsterList.includes("abra")) {
			const abra = new AbraBoss(this, 960, 540);
			this.addEntity(abra);
		}

		if (this.entities.length === 0) {
			console.warn("No monsters were loaded for the given monsterList.");
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
		this.debugGraphics.setDepth(100);
		this.ui.setDepth(200);
		this.textParticles.setDepth(300);
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

	// Purely visual Pearl entity to show what pearl is in use
	setupPearlUI() {
		this.pearl = new Pearl(
			this,
			this.W - 100,
			this.H - 100,
			pearlState.currentPearl
		);
		this.pearl.setScale(0.8);
		this.pearl.setDepth(200);

		if (this.pearl.isNone) {
			this.pearl.setVisible(false);
		}
	}

	update(time: number, delta: number) {
		this.updateEntities(time, delta);

		this.loopDrawer.update(time, delta);
		this.loopDrawer.checkCollisions(this.entities, delta);
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

	updateEntities(t: number, d: number) {
		for (let h = this.entities.length - 1; h >= 0; h--) {
			this.entities[h].update(t, d);
			if (this.entities[h].deleteFlag) {
				this.entities[h].destroy();
				this.entities.splice(h, 1);
			}
		}
	}

	onLoop(polygon: Phaser.Geom.Polygon) {
		let emptyLoop = true;

		this.entities.forEach((entity) => {
			if (Phaser.Geom.Polygon.Contains(polygon, entity.x, entity.y)) {
				if (entity instanceof Entity && entity.enabled) {
					entity.onLoop();
					emptyLoop = false;
				}
			}
		});

		if (emptyLoop) return;

		// We circled something
		this.loopDrawer.incrementCombo(true);
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
		this.debugGraphics.fillStyle(0xff0000, 0.75);
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
		// Continue to battle if multiple bosses are loaded
		this.activeBossCount -= 1;
		if (this.activeBossCount > 0) return;

		this.loopDrawer.setEnabled(false);
		this.music.stop();
		this.sound.play("u_level_enter", { volume: 0.4 });

		// Check level for pearl rewards (allow only one reward)
		let pearlReward: PearlElement = PearlElement.None;
		for (const levelData of this.levelDataList) {
			if (levelData.pearl != PearlElement.None) {
				const hasPearl = pearlState.acquiredPearls[levelData.pearl];

				if (!hasPearl) {
					pearlReward = levelData.pearl;
					break;
				}
			}
		}

		// Pearl reward ending
		if (pearlReward != PearlElement.None) {
			this.addEvent(1500, () => {
				// Save pearl in state
				pearlState.acquiredPearls[pearlReward] = true;
				pearlState.currentPearl = PearlTypes[pearlReward];
				this.pearl.setPearlType(PearlTypes[pearlReward]);

				this.animatePearlReward();

				this.goToWorldHub(4000);
			});
		}
		// Normal ending
		else {
			this.goToWorldHub(2500);
		}
	}

	lose() {
		this.loopDrawer.setEnabled(false);
		this.music.stop();
		this.sound.play("u_level_enter", { volume: 0.4 });

		this.goToWorldHub(2500);
	}

	goToWorldHub(delay: number) {
		this.loopDrawer.setEnabled(false);
		this.music.stop();

		this.addEvent(delay, () => {
			this.fade(true, 100, 0x000000);
			this.addEvent(100, () => {
				this.scene.start("WorldScene");
			});
		});
	}

	animatePearlReward() {
		// Animate black fade
		let black = this.add.rectangle(0, 0, this.W, this.H, 0).setOrigin(0);
		black.setDepth(150);
		this.tweens.add({
			targets: black,
			alpha: { from: 0, to: 0.5 },
			duration: 500,
		});

		// Animate light
		let light = this.add.image(this.CX, this.CY, "light");
		light.setScale(0);
		this.tweens.add({
			targets: light,
			scaleX: 1,
			scaleY: 1,
			ease: "Back.Out",
			duration: 500,
			delay: 300,
		});

		// Animate pearl
		this.pearl.setVisible(true);
		this.pearl.setPosition(this.CX, this.CY);
		light.setDepth(150);
		this.pearl.setScale(0);
		this.tweens.add({
			targets: this.pearl,
			scaleX: 1.5,
			scaleY: 1.5,
			ease: "Back.Out",
			duration: 500,
			delay: 600,
		});

		// Animate text
		let text = this.addText({
			x: this.CX,
			y: this.CY + 250,
			text: `${this.pearl.pearlType.name} acquired!`,
			size: 64,
			color: "white",
		});
		text.setOrigin(0.5);
		text.setStroke("black", 16);
		text.setDepth(150);
		text.setScale(0);
		this.tweens.add({
			targets: text,
			scaleX: 1,
			scaleY: 1,
			ease: "Back.Out",
			duration: 500,
			delay: 900,
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
