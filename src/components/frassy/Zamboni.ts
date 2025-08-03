import { GameScene } from "@/scenes/GameScene";
import { Monster } from "@/components/Monster";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { BasicEffect } from "@/components/BasicEffect";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";
import { TreadEffect } from "./TreadEffect";

export class Zamboni extends Monster {
	protected explosionEffect: ExplosionEffect;
    protected hideValue: number = 1;
    protected hp: number = 300;
    protected spark: SparkEffect;
    protected invuln: boolean = false;
    protected spacing: number = 240;
    protected zdir: number = 0;
    protected vdir: number = 0;
    public treading: boolean = true;
    protected circling: number = 0;
    public exploded: boolean = false;
    protected etimer: number = 2000;


	constructor(scene: GameScene, x: number, y: number, spr: string = "zamboni") {
		super(scene, x, y, spr);

		this.sprite.setTexture(spr);
        this.sprite.setScale(1.5);
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
        this.velocity.x = 250;
        this.velocity.y = 0;
        //this.animateAppear();
        this.spark = new SparkEffect(scene);
        this.shapes[0].setTo(this.x, this.y, 150);
        stateHP: [9999,9999,9999];
        this.behavior = new MonsterScriptHandler(this,"inanimate");
        this.captureDisp.disable();
        //this.treading = false;
        if(this.y >= 540) {
            this.vdir = -1;
        } else {this.vdir = 1;}

        if(this.x <= 960) {
            this.zdir = 1
        } else {
            this.zdir = -1;
        }
        this.sprite.setScale(this.zdir,1);
        this.scene.pushHitEffect(new TreadEffect(this.scene,this.x,this.y,this,this.zdir));

	}

    boundCheck(){
		// Border collision
        if (Phaser.Math.Distance.Between(this.x,this.y,this.scene.ui.healthPosition.x,this.scene.ui.healthPosition.y) < 100) {
            this.scene.damagePlayer(20);
            this.die();
        }
		if (this.x < (this.border.left-320)) {
			if(this.treading && !this.exploded) {
                this.treading = false;
                this.y += this.spacing*this.vdir;
                this.zdir *= -1;
                this.sprite.setScale(this.zdir,1);
                this.circling = 3000;
            }
		} else if (this.x < (this.border.right+320)){
            if(!this.treading) {
                this.scene.pushHitEffect(new TreadEffect(this.scene,this.x,this.y,this,this.zdir));
                this.treading = true;
            }
        }
		if (this.x > (this.border.right+320)) {
            if(this.treading && !this.exploded) {
                this.treading = false;
                this.y += this.spacing*this.vdir;
                this.zdir *= -1;
                this.sprite.setScale(this.zdir,1);
                this.circling = 3000;
            }
		} else if (this.x > (this.border.left-320)){
            if(!this.treading) {
                this.scene.pushHitEffect(new TreadEffect(this.scene,this.x,this.y,this,this.zdir));
                this.treading = true;
            }
        }
		if (this.y < (this.border.top-260)) {
            if(this.treading) {
                this.die();
            }
		}
		if (this.y > (this.border.bottom+260)) {
            if(this.treading) {
                this.die();
            }
		}
	}

	update(time: number, delta: number) {
        if(this.exploded){
            if(this.etimer > 0){
                this.etimer -= delta;
                this.setAlpha(this.etimer/2000);
                if(this.etimer <= 0){
                    this.setVisible(false);
                    this.deleteFlag = true;
                }
            }
            return;
        }
        this.sprite.setOrigin(0.5+0.05*(Math.sin(time)/250),0.5+0.05*(Math.cos(time+325)/250));
        if(this.circling > 0){
            this.circling -= delta;
            return;
        }
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

	}

    updatePosition(t: number, d: number){
		this.x += this.zdir*(this.velocity.x * d) / 1000;
	}

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        const size = this.sprite.height;
		//this.sprite.y = this.hideValue * 0.7 * size;
		//this.sprite.setCrop(0, 0, size, size * (0.9 - 0.8 * this.hideValue));
    }

	onLoop() {
        if(this.exploded){
            return;
        }
		super.onLoop();
		this.animateShake(this.sprite, 500);
        this.spark.play(this.x,this.y);
	}


    die(){
        this.captureDisp.destroy();
        this.scene.pushHitEffect(new BasicEffect(this.scene,"boom2",this.x,this.y,6,75,false,0,0));
        this.sprite.setFrame(1);
        this.exploded = true;
        this.treading = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    damage(amount: number) {
		//console.log("Particle");
		this.hp -= amount;
        if(this.hp <= 0){
            this.die();
            this.treading = false;
        }
	}
    protected shapes: Phaser.Geom.Circle[] = [
		new Phaser.Geom.Circle(),
		new Phaser.Geom.Circle(),
	];
    get colliders(): Phaser.Geom.Circle[] {
		return [
			this.shapes[0].setTo(this.x+60, this.y, 80),
			this.shapes[1].setTo(this.x-60, this.y, 80),
		];
	}
}
