import { Monster } from "@/components/Monster";
import { GameScene } from "@/scenes/GameScene";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";
import { BasicEffect } from "@/components/BasicEffect";

export class Snail extends Monster{
    protected hp: number = 2010; // 30 hits for now
    protected fade: number = 1;
    protected fading: boolean = false;
    protected hyperArmor: boolean = false;
    constructor(scene: GameScene, x: number, y: number, spr: string = "snail") {
		super(scene, x, y, spr);
        this.stateHP = [10,10,99999];
        this.behavior = new MonsterScriptHandler(this,"idle");
        this.stunOverflow = -1000;
        this.maxV = 300;
        this.captureDisp.disable();
	}

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        this.sprite.setAlpha(this.fade);
        this.captureDisp.setAlpha(this.fade);
        if(this.fade <= 0){
            if (this.visible) {
                this.emit("victory");
            }
            this.setVisible(false);
        }
    }

	advanceState(){
		this.resetVelocity();
		this.exhaust = 0;
		switch(this.curState){
			case this.IDLE: { this.curState = this.RAGE; this.behavior.swapScriptList("snailrage"); this.sprite.setFrame(1); break;} 
			case this.RAGE: { this.curState = this.WEAK; this.behavior.swapScriptList("inanimate"); this.sprite.setFrame(2); this.hyperArmor = true; break;}
			case this.WEAK: { this.curState = this.IDLE; this.behavior.swapScriptList("idle");this.sprite.setFrame(0);  break;}
			default: { this.curState = this.IDLE; break;}
		}

        // Music fade when shelled
        this.scene.tweens.add({
            targets: this.scene.music,
            volume: this.curState === this.WEAK ? 0 : 0.2,
            duration: this.curState === this.WEAK ? 15_000 : 2_000,
        })
	}

    callSpecial(key: string): void {
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
		//console.log("Particle");
		//this.captureDisp.takeDamage(amount);

        if(!this.hyperArmor){
            this.hp -= amount;
            this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
        } else{
            this.hp--;
            this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+1);
        }

		if(this.hp <= 0) {
            this.stunImmune = false;
            this.stun(99999);
            this.resetVelocity();
            this.fading = true;
            //this.scene.pushHitEffect(new BasicEffect(this.scene,"boom",this.x,this.y,6,75,false,0,0,[1.5,1.5]));
            this.scene.tweens.add({
                targets: this,
                duration: 1000,
                fade: 0,
                ease: Phaser.Math.Easing.Back.Out,
            });
        }

        if (this.curState == this.WEAK) {
            this.scene.hitSound("e_snail_shell", this.x);
        }

        this.exhaust++;
		if(this.exhaust >= this.stateHP[this.curState]) {
			this.advanceState();
		}
		//this.doABarrelRoll();
	}
}