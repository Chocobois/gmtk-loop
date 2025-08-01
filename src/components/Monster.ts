import { GameScene } from "@/scenes/GameScene";
import { loopState } from "@/state/LoopState";
import { CaptureBar } from "./CaptureBar";
import { WedgeIndicator } from "./Indicators/WedgeIndicator";
import { MonsterScriptHandler } from "./MonsterScriptHandler";
import { Entity } from "./Entity";

const IDLE = 0;
const RAGE = 1;
const WEAK = 2;
const ACCELERATION = 150;
const MAX_SPEED = 400;
const FRICTION = 0.7;
const TAPPING_TIMER = 200; // ms
console.assert(
	ACCELERATION / (1 - FRICTION) >= MAX_SPEED,
	"Max speed unreachable"
);

export interface DifficultyStats {
	speed: number;
	attackrate: number;	
}

export class Monster extends Entity {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;
	private tween: Phaser.Tweens.Tween;

	// Collider
	private collider: Phaser.Geom.Circle = new Phaser.Geom.Circle();

	// Controls
	public velocity: Phaser.Math.Vector2;
	private border: { [key: string]: number };

	private captureDisp: CaptureBar;
	private behavior: MonsterScriptHandler;

	private t: number = 2000;

	//behavioral variables
	private initPos: number[];
	private towardsPos: number[];
	private accel: Phaser.Math.Vector2;
	private maxV: number = 2000;
	public traveling: boolean = false;
	private tDist: number = 0;

	private exhaust: number = 0;
	private stateHP: number[] = [5,10,15];
	private multipliers: number[] = [1,0.5,3];
	private curState: number = 0;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "sansplane");
		this.sprite.setOrigin(0.5, 0.5);
		//this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		/* Controls */
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};

		this.captureDisp = new CaptureBar(this.scene,this.x,this.y,this);
		this.behavior = new MonsterScriptHandler(this,"idle");
		this.initPos = [this.x,this.y];
		this.towardsPos = [0,0];
		this.accel = new Phaser.Math.Vector2(0,0);
	}

	update(time: number, delta: number) {
		if(this.accel.x != 0 || this.accel.y != 0){
			this.velocity.x += this.accel.x*delta/1000;
			this.velocity.y += this.accel.y*delta/1000;
			//this.velocityCheck;
		}
		this.x += (this.velocity.x * delta) / 1000;
		this.y += (this.velocity.y * delta) / 1000;
		if(this.traveling){
			this.travelCheck();
		}
		// Border collision
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);

		this.captureDisp.update(time, delta);
		this.behavior.update(time,delta);

	}

	onLoop() { 
		this.damage(loopState.attackPower);
	}

	damage(amount: number) {
		console.log("Monster damaged by", amount);
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		console.log("Particle");
		this.captureDisp.takeDamage(amount);
		this.exhaust++;
		if(this.exhaust >= this.stateHP[this.curState]) {
			this.advanceState();
		}
		this.doABarrelRoll();
	}

	advanceState(){
		this.resetVelocity();
		this.exhaust = 0;
		switch(this.curState){
			case IDLE: { this.curState = RAGE; this.behavior.swapScriptList("sans"); this.sprite.setFrame(1); break;} 
			case RAGE: { this.curState = WEAK; this.behavior.swapScriptList("weak"); this.sprite.setFrame(2); break;}
			case WEAK: { this.curState = IDLE; this.behavior.swapScriptList("idle"); this.sprite.setFrame(0); break;}
			default: { this.curState = IDLE; break;}
		}
	}

	doABarrelRoll() {
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});
		}
	}

	velocityCheck(){
		if(Math.hypot(this.velocity.y, this.velocity.x) > this.maxV){
			let r = Math.atan2(this.velocity.y,this.velocity.x);
			this.velocity.x = this.maxV*Math.cos(r);
			this.velocity.y = this.maxV*Math.sin(r);
			this.accel.x = 0;
			this.accel.y = 0;
		}
	}

	resetVelocity(){
		this.accel.x = 0;
		this.accel.y = 0;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.initPos = [this.x,this.y];
		this.towardsPos = [0,0];
		this.traveling = false;
		this.tDist = 0;
}

	travelCheck(){
		if(Math.hypot(this.y-this.initPos[1],this.x-this.initPos[0]) >= this.tDist){
			this.x=this.towardsPos[0];
			this.y=this.towardsPos[1];
			this.resetVelocity();
		}
	}

	travel(a: number, pos: number[]){ //go towards a position
		this.traveling = true;
		this.velocity.x = 0;
		this.velocity.y = 0;
		//console.log("begin: " + this.x + ", " + this.y + " ; " + "end: " + pos[0] + ", " + pos[1]);
		let theta = Math.atan2(pos[1]-this.y, pos[0]-this.x);
		this.accel.x = a*Math.cos(theta);
		this.accel.y = a*Math.sin(theta);
		this.towardsPos = pos;
		this.tDist = Math.hypot(pos[1]-this.y, pos[0]-this.x);
		this.initPos[0] = this.x;
		this.initPos[1] = this.y;
	}

	protected shapes: Phaser.Geom.Circle[] = [
		new Phaser.Geom.Circle(),
	];
	get colliders(): Phaser.Geom.Circle[] {
		return [
			this.shapes[0].setTo(this.x, this.y, 75),
		];
	}

	handleCapture() {
		this.scene.removeMonster(this);
	}

}
