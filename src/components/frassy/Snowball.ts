import { GameScene } from "@/scenes/GameScene";
import { Monster } from "@/components/Monster";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { BasicEffect } from "@/components/BasicEffect";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";

export class Snowball extends Monster {
	protected explosionEffect: ExplosionEffect;
    protected hideValue: number = 1;
    protected hp: number = 100;
    protected spark: SparkEffect;
    protected invuln: boolean = false;

    protected stimer: number = 250;
    protected curFrame: number = 0;

	constructor(scene: GameScene, x: number, y: number, v: number,  spr: string = "snowball") {
		super(scene, x, y, spr);

		this.sprite.setTexture(spr);
        this.sprite.setScale(1.5);
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
        this.spark = new SparkEffect(scene);
        this.shapes[0].setTo(this.x, this.y, 150);
        stateHP: [9999,9999,9999];
        this.behavior = new MonsterScriptHandler(this,"inanimate");
        this.captureDisp.disable();
        let theta = Math.atan2(this.scene.ui.healthPosition.y-this.y, this.scene.ui.healthPosition.x-this.x);
        theta += Phaser.Math.DegToRad(Phaser.Math.Between(-30,30));
        this.velocity.x = v*Math.cos(theta);
        this.velocity.y = v*Math.sin(theta);
        if(Math.random() < 0.5){
            this.curFrame = 1;
            this.sprite.setFrame(1);
        }
	}
    boundCheck(){
		// Border collision
        if (Phaser.Math.Distance.Between(this.x,this.y,this.scene.ui.healthPosition.x,this.scene.ui.healthPosition.y) < 100) {
            this.scene.damagePlayer(20);
            this.die();
        }
		if (this.x < (this.border.left-256)) {
			this.die();
		}
		if (this.x > (this.border.right+256)) {
            this.die();
		}
		if (this.y < (this.border.top-256)) {
            this.die();
		}
		if (this.y > (this.border.bottom+256)) {
            this.die();
		}
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
        if(this.stimer > 0){
            this.stimer -= d;
            if(this.stimer <= 0) {
                this.advanceFrame();
                this.stimer = 250;
            }
        }
        const size = this.sprite.height;
    }

    advanceFrame(){
        if(this.curFrame == 0){
            this.sprite.setFrame(1);
        } else {
            this.sprite.setFrame(0);
        }
    }

	onLoop() {
		super.onLoop();
		this.animateShake(this.sprite, 500);
        this.spark.play(this.x,this.y);
	}

    die(){
        this.captureDisp.destroy();
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
            this.deleteFlag = true;
        }
	}

    get colliders(): Phaser.Geom.Circle[] {
		return [
			this.shapes[0].setTo(this.x, this.y, 50),
		];
	}
}
