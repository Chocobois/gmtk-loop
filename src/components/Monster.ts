import { GameScene } from "@/scenes/GameScene";
import { loopState } from "@/state/LoopState";
import { CaptureBar } from "./CaptureBar";
import { WedgeIndicator } from "./Indicators/WedgeIndicator";
import { MonsterScriptHandler } from "./MonsterScriptHandler";
import { BaseMonster } from "./BaseMonster";


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

export class Monster extends BaseMonster {

	protected IDLE = 0;
	protected RAGE = 1;
	protected WEAK = 2;
	public scene: GameScene;

	// Sprites
	protected spriteSize: number;
	protected sprite: Phaser.GameObjects.Sprite;
	protected tween: Phaser.Tweens.Tween;
	protected activetw: Phaser.Tweens.Tween;

	// Collider
	private collider: Phaser.Geom.Circle = new Phaser.Geom.Circle();

	// Controls
	public velocity: Phaser.Math.Vector2;
	protected border: { [key: string]: number };

	protected captureDisp: CaptureBar;
	protected behavior: MonsterScriptHandler;

	protected t: number = 2000;

	//behavioral variables
	protected waitMultiplier: number[] = [1,0.75,2];
	protected initPos: number[];
	protected towardsPos: number[];
	protected accel: Phaser.Math.Vector2;
	protected maxV: number = 2000;
	public traveling: boolean = false;
	public tDist: number = 0;
	public cDist: number = 0;
	protected elapsedDist: number = 0;
	protected exhaust: number = 0;
	protected stateHP: number[] = [5,10,15];
	protected multipliers: number[] = [1,0.5,3];
	protected curState: number = 0;
	protected fTimer: number[] = [0,0,0];
	protected stunTime: number = -250;
	protected stunOverflow: number = -250;
	public stunImmune: boolean = false;
	protected rip: boolean = false;

	// Sounds and visuals
	protected genericHitSound: boolean = true;

	constructor(scene: GameScene, x: number, y: number, spr: string = "sansplane") {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, spr);
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
		this.behavior = new MonsterScriptHandler(this,"dashblitz");
		this.initPos = [this.x,this.y];
		this.towardsPos = [0,0];
		this.accel = new Phaser.Math.Vector2(0,0);
	}



	update(time: number, delta: number) {
		super.update(time, delta);

		this.boundCheck();
		this.updateGFX(time,delta);
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
		if(this.stunTime > this.stunOverflow){
			this.stunTime -= delta;
			if(this.stunTime <= this.stunOverflow){
				this.stunTime = this.stunOverflow;
			}
			if(this.stunTime > 0){
				return;
			}
			//console.log("stunned for " + this.stunTime);
		}
		this.updatePosition(time, delta);
		if(this.traveling){
			this.travelCheck();
		}
		// Animation (Change to this.sprite.setScale if needed)
		this.behavior.update(time,delta);
	}

	updatePosition(t: number, d: number){
		if(this.accel.x != 0 || this.accel.y != 0){
			this.velocity.x += this.accel.x*d/1000;
			this.velocity.y += this.accel.y*d/1000;
			this.velocityCheck();
		}
		this.x += (this.velocity.x * d) / 1000;
		this.y += (this.velocity.y * d) / 1000;
	}

	boundCheck(){
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
	}

	updateGFX(t: number, d: number){
		this.captureDisp.update(t, d);
		if(this.fTimer[2] > 0){
			if(this.fTimer[0] > (-1*this.fTimer[1])) {
				this.fTimer[0] -= d;
			} else {
				this.fTimer[0] = this.fTimer[1];
			}
			if(this.fTimer[0] >= 0) {
				this.sprite.setTint(0x00FF00);
			} else {
				this.sprite.clearTint();
			}
			this.fTimer[2] -= d;
			if(this.fTimer[2] <= 0) {
				this.unflash();
			}
		}
	}

	stun(n: number){
		if(!this.stunImmune){
			this.stunTime = n;
		}
		this.animateShake(this.sprite, n);
		this.sparkEffect.play(this.x, this.y);
	}

	onLoop() {
		super.onLoop();

		this.damage(loopState.attackPower);
		if (this.genericHitSound) {
			this.scene.hitSound("e_hit_generic", this.x, 0.4);
		}
	}

	damage(amount: number) {
		console.log("Monster damaged by", amount);
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		//console.log("Particle");
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
			case this.IDLE: { this.curState = this.RAGE; this.behavior.swapScriptList("sans"); this.sprite.setFrame(1); break;} 
			case this.RAGE: { this.curState = this.WEAK; this.behavior.swapScriptList("weak"); this.sprite.setFrame(2); break;}
			case this.WEAK: { this.curState = this.IDLE; this.behavior.swapScriptList("idle"); this.sprite.setFrame(0); break;}
			default: { this.curState = this.IDLE; break;}
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
		if(this.activetw){
			this.activetw.destroy();
		}
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.initPos = [this.x,this.y];
		this.towardsPos = [0,0];
		this.traveling = false;
		this.tDist = 0;
	}

	travelCheck(){
		this.cDist = Math.hypot(this.y-this.initPos[1],this.x-this.initPos[0]);
		//update your elapsed distance 
		if(this.cDist >= this.tDist){
			this.x=this.towardsPos[0];
			this.y=this.towardsPos[1];
			this.resetVelocity();
		}
	}

	die(){

	}

	travel(v: number, pos: number[], dash: boolean = false){ //go towards a position with a stated average velocity
		this.traveling = true;
		this.towardsPos = pos;
		this.initPos[0] = this.x;
		this.initPos[1] = this.y;
		this.tDist = Math.hypot(pos[1]-this.y, pos[0]-this.x);
		this.cDist = 0; //this variable and the one above exist to track progress along the travel path, so you can call other scripts
		this.velocity.x = 0;//zero your velocity first
		this.velocity.y = 0;
		let t = 1000*this.tDist/(this.maxV*v);
		let xx = pos[0];
		let yy = pos[1];

		if(!dash){
			if(this.activetw){
				this.activetw.destroy();
			}
			this.activetw = this.scene.tweens.add({
				targets: this, x: xx, y: yy,
				duration: t,
				ease: Phaser.Math.Easing.Quadratic.InOut,
			});
		} else { //instantly go to max speed if it's a dash
			let theta = Math.atan2(pos[1]-this.y, pos[0]-this.x);
			this.velocity.x = this.maxV*v*Math.cos(theta);
			this.velocity.y = this.maxV*v*Math.sin(theta);
		}
	}

	ramp(n: number, theta: number){
		this.accel.x = n*Math.cos(Phaser.Math.DegToRad(theta));
		this.accel.y = n*Math.sin(Phaser.Math.DegToRad(theta));
	}

	unramp(n: number){
        if(this.activetw){
            this.activetw.destroy();
        }
		this.resetVelocity();
    }

	flash(n: number, t: number){
		this.fTimer = [0,n,t];
	}

	unflash(){
		this.fTimer = [0,0,0];
		this.sprite.clearTint();
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

	callSpecial(key: string){

	}


	getWaitMultiplier(): number{
		switch(this.curState){
			case this.IDLE: {return this.waitMultiplier[0]}
			case this.RAGE: {return this.waitMultiplier[1]}
			case this.WEAK: {return this.waitMultiplier[2]}
			default: {return 1;}
		}
	}



}
