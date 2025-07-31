import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "../Effect";
import { Monster } from "../Monster";

export class WedgeIndicator extends Effect {
    public scene: BaseScene;
    public pie: Phaser.GameObjects.Graphics;
    public pietin: Phaser.GameObjects.Container;
    //private isLooped: boolean;
    private wait: number = 0;
    private maxTimer: number = 0;
    private timer: number = 0;

    public deleteFlag: boolean = false;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public v: number = 0;
    public spAngle: number;

    private span: number;
    private rad: number;
    private maxAlpha: number;

    private follow: boolean;

    private owner: Monster;

    private relPos: number[];

	// private hover: boolean;
	constructor(scene: BaseScene, x: number, y: number, duration: number, wait: number, span: number, angle: number, radius: number, owner: Monster, follow: boolean = false,
        color: number = 0xFFB838, alpha: number = 0.5, grow: boolean = false, vel: number = 0, vtheta: number = 0) {
        super(scene,x,y);
        this.scene = scene;
        //scene.add.existing(this);
        this.timer = duration;
        this.wait = wait;
        this.maxTimer = duration;
        this.span = Phaser.Math.DegToRad(span);
        this.rad = radius;
        this.maxAlpha = alpha;
        this.owner = owner;
        this.follow = follow;
        this.relPos = [this.x-this.owner.x,this.y-this.owner.y];
        this.v = vel;
        this.velocityX = vel*Math.cos(Phaser.Math.DegToRad(vtheta));
        this.velocityY = vel*Math.sin(Phaser.Math.DegToRad(vtheta));

        this.setAngle(angle);

        this.pietin = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.pietin);
    
        this.pie = this.scene.add.graphics();
        //this.pie.lineStyle(16,color,alpha);
        this.pie.fillStyle(color,alpha);
        this.pietin.add(this.pie);

        this.pie.beginPath();
        this.pie.slice(0,0,this.rad,-1*(this.span/2),this.span/2,false,0);
        this.pie.closePath();
        this.pie.fillPath();
        this.scene.add.existing(this);
        //this.setDepth(2);
       // scene.add.existing(this.sp);
	}

    setVelocityX(v: number){
        this.velocityX = v;
    }

    setVelocityY(v: number) {
        this.velocityY = v;
    }

    stopMovement(){
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if(this.follow){
            this.x = this.owner.x+this.relPos[0];
            this.y = this.owner.y+this.relPos[1];
            if(this.v > 0){
                this.relPos[0] += this.velocityX*d*0.001;
                this.relPos[1] += this.velocityY*d*0.001;
            }
        } else {
            if(this.v > 0) {
                this.x += this.velocityX*d*0.001;
                this.y += this.velocityY*d*0.001;
            }
        }

        if(this.wait > 0) {
            this.wait -= d;
            if(this.wait <= 0){
                this.wait = 0;
            }
        }
        if ((this.timer > 0) && (this.wait <= 0)) {
            this.timer -= d;
            if(this.timer <= 0) {
                this.setVisible(false);
                this.deleteFlag = true;
            } else {
                this.pietin.setAlpha(this.timer/this.maxTimer);
            }

        }
    }
}
