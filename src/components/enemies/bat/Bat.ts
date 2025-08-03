import { Monster } from "@/components/Monster";
import { GameScene } from "@/scenes/GameScene";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";
import { BasicEffect } from "@/components/BasicEffect";
import { SmokeEffect } from "@/components/particles/SmokeEffect";

export class Bat extends Monster{
    protected hp: number = 3700;
    protected fade: number = 1;
    protected fading: boolean = false;
    protected flatAccel: number = 0;
    protected flatV: number = 0;
    protected theta: number = 0;
    protected expl: SmokeEffect;
    constructor(scene: GameScene, x: number, y: number, spr: string = "bat_fly_1") {
		super(scene, x, y, spr);
        this.stateHP = [5,10,10];
        this.behavior = new MonsterScriptHandler(this,"batIdle");
        this.stunOverflow = -1000;
        this.expl = new SmokeEffect(scene, 1);
	}

    boundCheck(){
		// Border collision
		if (this.x < this.border.left) {
			this.teleport(this.border.right, this.y, true);
		}
		if (this.x > this.border.right) {
			this.teleport(this.border.left, this.y, true);
		}
		if (this.y < this.border.top) {
			this.teleport(this.x, this.border.bottom, true);
		}
		if (this.y > this.border.bottom) {
			this.teleport(this.y, this.border.top, true);
		}
	}

    teleport(x: number, y: number, shift: boolean){
        this.expl.play(this.x, this.y);
        this.x = x;
        this.y = y;
        this.expl.play(this.x, this.y);
        this.scene.sound.play("tele", {volume: 0.5});

        //console.log("Angle: " + this.theta);
        if(shift) {
            this.theta -= Phaser.Math.DegToRad(Phaser.Math.Between(-30,30));
            //console.log("New Angle: " + this.theta);
        }
    }

	updatePosition(t: number, d: number){
		if(this.flatAccel != 0){
			this.flatV += this.flatAccel*d/1000;
            this.accel.x = this.flatAccel*Math.cos(this.theta);
            this.accel.y = this.flatAccel*Math.sin(this.theta);
			this.velocityCheck();
		}
        if(this.flatV > 0) {
            this.velocity.x = this.flatV*Math.cos(this.theta);
            this.velocity.y = this.flatV*Math.sin(this.theta);
        }
		this.x += (this.velocity.x * d) / 1000;
		this.y += (this.velocity.y * d) / 1000;
	}

    velocityCheck(){
		if(this.flatV > this.maxV){
			this.flatV = this.maxV;
            this.flatAccel = 0;
		}
	}

    ramp(n: number, theta: number){
		this.flatAccel = n;
        this.theta = Phaser.Math.DegToRad(theta);

	}

    unramp(n: number){
        if(this.activetw){
            this.activetw.destroy();
        }
        this.activetw = this.scene.tweens.add({
            targets: this, flatV: 0,
            duration: n,
            ease: Phaser.Math.Easing.Back.Out,
        });
    }

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        this.sprite.setAlpha(this.fade);
        this.captureDisp.setAlpha(this.fade);
        if(this.fade <= 0){
            if(!this.rip)
            {
                this.setVisible(false);
                this.emit("victory");
                this.rip = true;
            }

        }
    }

    resetVelocity(){
		if(this.activetw){
			this.activetw.destroy();
		}
        this.flatV = 0;
        this.flatAccel = 0;
        this.theta = 0;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.initPos = [this.x,this.y];
		this.towardsPos = [0,0];
		this.traveling = false;
		this.tDist = 0;
	}

	advanceState(){
		this.resetVelocity();
		this.exhaust = 0;
		switch(this.curState){
			case this.IDLE: { this.curState = this.RAGE; this.behavior.swapScriptList("batPizza"); this.sprite.setFrame(1); break;} 
			case this.RAGE: { this.curState = this.WEAK; this.behavior.swapScriptList("sit"); this.sprite.setFrame(2); break;}
			case this.WEAK: { this.curState = this.IDLE; this.behavior.swapScriptList("batIdle");this.sprite.setFrame(0);  break;}
			default: { this.curState = this.IDLE; break;}
		}
	}

    callSpecial(key: string): void {
        switch(key){
            case "teleport": {this.teleport(Phaser.Math.Between(200,1720),Phaser.Math.Between(200,880), true); break;}
            case "tocenter": {this.teleport(960,540, true); this.resetVelocity(); break;}
            default: {break;}
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
        this.stun(500);
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		//console.log("Particle");
		//this.captureDisp.takeDamage(amount);
        this.hp -= amount;
		if(this.hp <= 0) {
            this.stunImmune = false;
            this.stun(99999);
            this.resetVelocity();
            this.fading = true;
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
}