import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";

export class Icicle extends Entity{
    protected hitradius: number = 100;
    protected border: { [key: string]: number };
    protected vel: Phaser.Math.Vector2;
    protected vpolar: number[] = [0,0];
    protected pause: number = 0;
    protected stage: number = 0;
    protected atimer: number = 500;
    protected valence: number = 1;
    protected dir: number;
    protected amt: number = 0;
    protected spr: Phaser.GameObjects.Sprite;
    constructor(scene:BaseScene,x:number,y:number, dir: number, val: number, pause: number = 0){
        super(scene,x,y);
        this.vel = new Phaser.Math.Vector2(0,0);
        this.border = {
			left: 0,
			right: scene.W,
			top: 0,
			bottom: scene.H,
		};
        this.entityDamage = 25;
        this.dir = dir;
        this.spr = this.scene.add.sprite(0,0,"icicle");
        this.spr.setOrigin(1,0.5);
        this.add(this.spr);
        if(this.dir == 0){
            this.amt = 1920/3;
            if(this.valence == -1){
                this.setScale(-1,1);
            }
        } else {
            this.amt = 1080/3;
            this.setAngle(-90);
            if(this.valence == -1){
                this.setScale(-1,1);
            }
        }

        this.pause = pause;
    }

    update(t: number, d: number){
        switch(this.stage){
            case 0: {
                if(this.atimer > 0) {
                    this.atimer -= d;
                    if(this.atimer <= 0) {
                        this.advanceIcicle();
                        this.atimer = 500;
                        this.stage++;
                    }
                } break;
            } case 1: {
                if(this.atimer > 0) {
                    this.atimer -= d;
                    if(this.atimer <= 0) {
                        this.advanceIcicle();
                        this.atimer = 10000;
                        this.stage++;
                    }
                } break;
            } case 2: {
                if(this.atimer > 0) {
                    this.atimer -= d;
                    if(this.atimer <= 0) {
                        this.advanceIcicle();
                        this.fade();
                        this.stage++;
                    }
                } break;
            } case 3: {
                if(this.atimer > 0) {
                    this.atimer -= d;
                    this.setAlpha(this.atimer/2000);
                    if(this.atimer <= 0) {
                        this.deleteFlag = true;
                        this.stage++;
                    }
                } break;
            } default: {
                break;
            }
        }
        if(this.pause > 0){
            this.pause -= d;
            return;
        }
        this.boundCheck();
    }

    fade() {
        this.atimer = 2000;
        this.enabled = false;
    }

    advanceIcicle(){
        if(this.dir == 0){
            this.x += this.amt*this.valence;
        } else {
            this.y += this.amt*this.valence;
        }
    }

    boundCheck(){

    }

    get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		return [this.shapes[0].setTo(this.x, this.y, 20),
        this.shapes[1].setTo(this.x-150, this.y, 40),
        this.shapes[2].setTo(this.x-300, this.y, 60),
        this.shapes[3].setTo(this.x-450, this.y, 80),
        this.shapes[4].setTo(this.x-600, this.y, 100),
        this.shapes[5].setTo(this.x-750, this.y, 120),
        this.shapes[6].setTo(this.x-900, this.y, 140),
        this.shapes[7].setTo(this.x-1050, this.y, 160),
        this.shapes[8].setTo(this.x-1200, this.y, 160),
        this.shapes[9].setTo(this.x-1350, this.y, 160),
        this.shapes[10].setTo(this.x-1500, this.y, 160),
        this.shapes[11].setTo(this.x-1650, this.y, 160),
        this.shapes[12].setTo(this.x-1800, this.y, 160),
        this.shapes[13].setTo(this.x-1950, this.y, 160),
    ];
        
	}
}