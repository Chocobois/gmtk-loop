import { GameScene } from "@/scenes/GameScene";
import { Monster } from "@/components/Monster";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { IcePiece } from "./IcePiece";
import { BasicEffect } from "@/components/BasicEffect";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";

export class IceChunk extends Monster {
	protected explosionEffect: ExplosionEffect;
    protected hideValue: number = 1;
    protected hp: number = 100;
    protected spark: SparkEffect;
    protected invuln: boolean = false;

	constructor(scene: GameScene, x: number, y: number, spr: string = "iceberg") {
		super(scene, x, y, spr);

		this.sprite.setTexture(spr);
        this.sprite.setScale(0.75);
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
        this.animateAppear();
        this.spark = new SparkEffect(scene);
        this.shapes[0].setTo(this.x, this.y, 150);
        stateHP: [9999,9999,9999];
        this.behavior = new MonsterScriptHandler(this,"inanimate");
        this.captureDisp.disable();
	}

    animateAppear(duration: number = 1000) {
		this.setEnabled(true);

		this.scene.tweens.add({
			targets: this,
			duration,
			hideValue: 0,
			ease: Phaser.Math.Easing.Back.Out,
		});
	}

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        const size = this.sprite.height;
		this.sprite.y = this.hideValue * 0.7 * size;
		this.sprite.setCrop(0, 0, size, size * (0.9 - 0.8 * this.hideValue));
    }

	onLoop() {
		super.onLoop();
		this.animateShake(500);
        this.spark.play(this.x,this.y);
	}

    spawnChunks(){
        this.scene.addEntity(new IcePiece(this.scene,this.x,this.y,"c1"));
        this.scene.addEntity(new IcePiece(this.scene,this.x,this.y,"c2"));
        this.scene.addEntity(new IcePiece(this.scene,this.x,this.y,"c3"));
        this.scene.addEntity(new IcePiece(this.scene,this.x,this.y,"c3"));
    }

    die(){
        this.captureDisp.destroy();
        this.spawnChunks();
        this.scene.pushHitEffect(new BasicEffect(this.scene,"boom",this.x,this.y,6,75,false,0,0));
        this.deleteFlag = true;
    }

    damage(amount: number) {
        if(this.invuln){
            return;
        }
		//console.log("Particle");
		this.hp -= amount;
        if(this.hp <= 0){
            this.invuln;
            this.behavior.swapScriptList("shatter");
        }
	}
}
