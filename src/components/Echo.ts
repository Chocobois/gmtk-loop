import { Effect } from "./Effect";
import { BaseScene } from "@/scenes/BaseScene";
import { Monster } from "./Monster";

export class Echo extends Effect{
    private owner: Monster;
    private iPos: number[] = [0,0];
    private ePos: number[] = [0,0];
    private gfx: Phaser.GameObjects.Graphics;
    private frame: Phaser.GameObjects.Container;
    private amt: number = 0;
    private size: number = 20;
    private rad: number = 200;
    private curRad: number = 1;
    private timer: number = 1000;
    private maxTimer: number = 1000;
    private span: number = 0;
    private wait: number = 0;
    constructor(scene: BaseScene, x: number, y: number, m: Monster, angle: number, span: number, wait: number, rad: number = 1200, time: number = 1000, amount: number = 3) {
        super(scene,x,y);
        this.owner = m;
        this.frame = new Phaser.GameObjects.Container(this.scene,0,0);
        this.wait = wait;
        this.add(this.frame);
        this.gfx = this.scene.add.graphics();
        this.frame.add(this.gfx);
        this.amt = amount;
        this.rad = rad;
        this.timer = time;
        this.span = Phaser.Math.DegToRad(span);
        this.scene.add.existing(this);
        this.setAngle(angle);
    }

    update(t: number, d: number){
        super.update(t,d);
        if(this.wait > 0){
            this.wait -= d;
            return;
        }
        if(this.timer > 0) {
            this.timer -=d;
            this.curRad += this.rad*d/1000;
            if(this.timer > 0){
                this.redraw();
                this.frame.setAlpha(this.timer/1000);
            } else {
                this.setVisible(false);
                this.deleteFlag = true;
            }
        }
    }

    redraw(){
        this.gfx.clear();
        this.gfx.lineStyle(this.size,0xFFFFFF,0.8);
        this.gfx.beginPath();
        //this.gfx.lineBetween(0,0,1920,1080);
        this.gfx.arc(0,0,this.curRad,-1*this.span/2,this.span/2,false,0.001);
        this.gfx.closePath();
        this.gfx.strokePath();

        for(let i = 1; i < this.amt; i++){
            this.gfx.lineStyle(this.size,0xFFFFFF,0.4);
            this.gfx.beginPath();
            //this.gfx.lineBetween(0,0,1920,1080);
            this.gfx.arc(0,0,((this.amt-i)/this.amt)*this.curRad,-1*this.span/2,this.span/2,false,0.001);
            this.gfx.closePath();
            this.gfx.strokePath();
        }

    }
}