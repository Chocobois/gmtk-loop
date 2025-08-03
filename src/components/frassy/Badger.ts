import { Monster } from "../Monster";
import { GameScene } from "@/scenes/GameScene";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";
import { BasicEffect } from "@/components/BasicEffect";
import { Zamboni } from "./Zamboni";
import { Snowball } from "./Snowball";
import { Icicle } from "./Icicle";

export class Badger extends Monster{
    protected zs: Zamboni[] = [];
    protected hp: number = 5000;
    protected fade: number = 1;
    protected fading: boolean = false;
    protected frassying: boolean = false;
    constructor(scene: GameScene, x: number, y: number, spr: string = "badger_idle_1") {
		super(scene, x, y, spr);
        this.stateHP = [10,20,10];
        this.behavior = new MonsterScriptHandler(this,"wolfidle");
        this.stunOverflow = -1000;

        this.sprite.setScale(500 / this.sprite.width);
	}

    spawnZamboni(){
        let xt = 0;
        if(Math.random() < 0.5) {
            xt = 10;
        } else {
            xt = 1910;
        }
        this.zs.push(new Zamboni(this.scene,xt,200+Math.random()*680));
        this.scene.addEntity(this.zs[this.zs.length-1]);
    }

    clearZambonis(){
        for(let h = (this.zs.length-1); h >= 0; h--){
			if(this.zs[h].deleteFlag) {
				this.zs.splice(h,1);
			}
		}
        this.zs.forEach((zss) => zss.die());
        this.zs = [];
    }

    update(time: number, delta: number) {
		this.boundCheck();
		this.updateGFX(time,delta);
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
        for(let h = (this.zs.length-1); h >= 0; h--){
			if(this.zs[h].deleteFlag) {
				this.zs.splice(h,1);
			}
		}
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
        if(this.zs.length < 2){
            if(this.frassying) {
                this.spawnZamboni();
            }
        }
		this.updatePosition(time, delta);
		if(this.traveling){
			this.travelCheck();
		}
		// Animation (Change to this.sprite.setScale if needed)
		this.behavior.update(time,delta);
	}

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        this.sprite.setAlpha(this.fade);
        this.captureDisp.setAlpha(this.fade);
        if(this.fade <= 0){
            if(!this.rip){
                this.setVisible(false);
                this.emit("victory");
                this.rip = true;
            }

        }
    }

	advanceState(){
		this.resetVelocity();
		this.exhaust = 0;
		switch(this.curState){
			case this.IDLE: { this.curState = this.RAGE; this.behavior.swapScriptList("badgerrage"); this.sprite.setFrame(1); break;} 
			case this.RAGE: { this.curState = this.WEAK; this.behavior.swapScriptList("badgersit"); this.sprite.setFrame(2); break;}
			case this.WEAK: { this.curState = this.IDLE; this.behavior.swapScriptList("wolfidle");this.sprite.setFrame(0);  break;}
			default: { this.curState = this.IDLE; break;}
		}
	}

    callSpecial(key: string): void {
        switch(key){
            case "frassy": {this.frassying = true; break;};
            case "unfrassy": {this.frassying = false; break;}
            case "icicleup": {this.icicleUp();break;}
            case "icicleside": {this.frassying = false; break;}
            case "snowball": {this.shootSnowball(); break;}
            case "clear": {this.clearZambonis(); break;}
            default: {break;}
        }
    }

    icicleUp(){
        this.scene.addEntity(new Icicle(this.scene,0,0,1,-1));
    }


    spawnSnowball(){
        this.scene.addEntity(new Snowball(this.scene,960,540,300+Math.random()*300));

    }
    shootSnowball(){
        let r = 0;
        if(Math.random() < (1080/(1920+1080))){
            r = 1;
        }
        switch(r){
            case 0: {
                this.scene.addEntity(new Snowball(this.scene,200+(Math.random()*1520),-100,100+Math.random()*300));
                break;
            } case 1: {
                this.scene.addEntity(new Snowball(this.scene,2020,200+(Math.random()*680),100+Math.random()*300));
                break;
            } default: {
                break;
            }
        }
    }

    onLoop(): void {
        if(this.fading) {
            return;
        }
        super.onLoop();
    }

    damage(amount: number) {
        if(this.fading){
            return;
        }
        this.stun(50);
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		//console.log("Particle");
		//this.captureDisp.takeDamage(amount);
        this.hp -= amount;
		if(this.hp <= 0) {
            this.stunImmune = false;
            this.stun(99999);
            this.resetVelocity();
            this.fading = true;
            this.clearZambonis();
            this.scene.pushHitEffect(new BasicEffect(this.scene,"boom",this.x,this.y,6,75,false,0,0,[1.5,1.5]));
            this.scene.tweens.add({
                targets: this,
                duration: 2000,
                fade: 0,
                ease: Phaser.Math.Easing.Back.Out,
            });
        }
        this.exhaust++;
		if(this.exhaust >= this.stateHP[this.curState]) {
			this.advanceState();
		}
		//this.doABarrelRoll();
	}

    protected shapes: Phaser.Geom.Circle[] = [
		new Phaser.Geom.Circle(),
		new Phaser.Geom.Circle(),
		new Phaser.Geom.Circle(),
	];
	get colliders(): Phaser.Geom.Circle[] {
		return [
			this.shapes[0].setTo(this.x, this.y-100, 50),
			this.shapes[1].setTo(this.x, this.y, 50),
			this.shapes[2].setTo(this.x, this.y+100, 50),
		];
	}
}