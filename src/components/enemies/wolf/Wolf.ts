import { Monster } from "@/components/Monster";
import { GameScene } from "@/scenes/GameScene";
import { IceChunk } from "./IceChunk";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";

export class Wolf extends Monster{
    protected ices: IceChunk[] = [];
    protected hp: number = 37000;
    protected fade: number = 1;
    protected fading: boolean = false;
    constructor(scene: GameScene, x: number, y: number, spr: string = "wolf") {
		super(scene, x, y, spr);
        stateHP: [5,10,5];
        this.behavior = new MonsterScriptHandler(this,"wolfidle");
	}

    spawnIce(){
        this.ices.push(new IceChunk(this.scene,Phaser.Math.Between(200,1720), Phaser.Math.Between(200,880)));
        this.scene.addEntity(this.ices[this.ices.length-1]);
    }

    clearIce(){
        for(let h = (this.ices.length-1); h >= 0; h--){
			if(this.ices[h].deleteFlag) {
				this.ices.splice(h,1);
			}
		}
        this.ices.forEach((ice) => ice.die());
        this.ices = [];
    }

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        this.sprite.setAlpha(this.fade);
        if(this.fade <= 0){
            this.setVisible(false);
            this.emit("victory");
        }
    }

	advanceState(){
		this.resetVelocity();
		this.exhaust = 0;
		switch(this.curState){
			case this.IDLE: { this.curState = this.RAGE; this.behavior.swapScriptList("dashblitz"); this.sprite.setFrame(1); break;} 
			case this.RAGE: { this.curState = this.WEAK; this.behavior.swapScriptList("sit"); this.sprite.setFrame(2); break;}
			case this.WEAK: { this.curState = this.IDLE; this.behavior.swapScriptList("wolfidle");this.sprite.setFrame(0);  break;}
			default: { this.curState = this.IDLE; break;}
		}
	}

    callSpecial(key: string): void {
        switch(key){
            case "spawnice": {this.spawnIce(); break;}
            case "clearice": {this.clearIce(); break;}
            default: {break;}
        }
    }

    onLoop(): void {
        if(this.fading) {
            return;
        }
        super.onLoop();
        this.stun(250);
    }

    damage(amount: number) {
		this.scene.textParticle(this.x + Math.random()*50, this.y+Math.random()*50, "OrangeRed", ""+amount);
		//console.log("Particle");
		//this.captureDisp.takeDamage(amount);
		if(this.hp <= 0) {
            this.stunImmune = false;
            this.stun(99999);
            this.fading = true;
            this.scene.tweens.add({
                targets: this,
                duration: 1000,
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