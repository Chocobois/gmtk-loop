import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "./Entity";

export class HitCircle extends Entity{
    protected hitradius: number = 100;
    protected border: { [key: string]: number };
    protected vel: Phaser.Math.Vector2;
    protected vpolar: number[] = [0,0];
    protected pause: number = 0;
    constructor(scene:BaseScene,x:number,y:number,dmg:number,rad:number,v:number,theta:number,pause: number = 0){
        super(scene,x,y);
        this.vel = new Phaser.Math.Vector2(0,0);
        this.border = {
			left: 0,
			right: scene.W,
			top: 0,
			bottom: scene.H,
		};
        this.hitradius = rad;
        this.entityDamage = dmg;
        this.vpolar = [v,theta];
        this.vel.x = v*Math.cos(Phaser.Math.DegToRad(theta));
        this.vel.y = v*Math.sin(Phaser.Math.DegToRad(theta));
        this.pause = pause;
    }

    update(t: number, d: number){
        if(this.pause > 0){
            this.pause -= d;
            return;
        }
        this.x += this.vel.x*d/1000;
        this.y += this.vel.y*d/1000;
        this.boundCheck();
    }

    boundCheck(){

            // Border collision
        if (this.x < (this.border.left - 2*this.hitradius)) {
            this.deleteFlag = true;
        }
        if (this.x > (this.border.right + 2*this.hitradius)) {
            this.deleteFlag = true;
        }
        if (this.y < (this.border.top - 2*this.hitradius)) {
            this.deleteFlag = true;
        }
        if (this.y > (this.border.bottom + 2*this.hitradius)) {
            this.deleteFlag = true;
        }
    }

    get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		return [this.shapes[0].setTo(this.x, this.y, this.hitradius)];
	}
}