import { Effect } from "./Effect";
import { BaseScene } from "@/scenes/BaseScene";
import { Monster } from "./Monster";

export class DashLine extends Effect{
    private owner: Monster;
    private iPos: number[] = [0,0];
    private ePos: number[] = [0,0];
    private gfx: Phaser.GameObjects.Graphics;
    private frame: Phaser.GameObjects.Container;
    private amt: number = 0;
    private size: number = 20;
    private timer: number = 1000;
    private finalDraw: boolean = false;
    private a: number = 0;
    private ofs: number[] = [0,0];
    constructor(scene: BaseScene, x: number, y: number, m: Monster, a: number, amount: number = 3) {
        super(scene,x,y);
        this.owner = m;
        this.frame = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.frame);
        this.ofs = [x,y];
        this.gfx = this.scene.add.graphics();
        this.frame.add(this.gfx);
        this.a = a;
        this.iPos = [5*Math.cos(-1*a),5*Math.sin(-1*a)];
        this.ePos = [0,0];
        this.amt = amount;
        this.scene.add.existing(this);
    }

    update(t: number, d: number){
        super.update(t,d);
        if(this.owner.traveling){
            this.ePos = [this.owner.x-this.ofs[0],this.owner.y-this.ofs[1]];
            this.a = Math.atan2(this.ePos[1]-this.iPos[1], this.ePos[0]-this.iPos[0]);
            this.redraw();
        } else {
            if(!this.finalDraw) {
                this.redraw();
            }
            if(this.timer > 0) {
                this.timer -=d;
                if(this.timer > 0){
                    this.frame.setAlpha(this.timer/1000);
                } else {
                    this.setVisible(false);
                    this.deleteFlag = true;
                }
            }
        }


    }

    redraw(){
        this.gfx.clear();
        this.gfx.lineStyle(this.size,0xFFFFFF,0.8);
        this.gfx.beginPath();
        //this.gfx.lineBetween(0,0,1920,1080);
        this.gfx.lineBetween(this.iPos[0],this.iPos[1],this.ePos[0],this.ePos[1]);
        this.gfx.closePath();
        this.gfx.strokePath();

        let nx = 0;
        let ny = 1;

        for(let i = 1; i < this.amt; i+=2){
            this.gfx.lineStyle(this.size/(2+(i-1)),0xFFFFFF,0.4);
            this.gfx.beginPath();
            //this.gfx.lineBetween(0,0,1920,1080);
            nx = Math.cos(this.a+(Math.PI/2))*(30+10*(i-1));
            ny = Math.sin(this.a+(Math.PI/2))*(30+10*(i-1));
            this.gfx.lineBetween(this.iPos[0]+nx,this.iPos[1]+ny,this.ePos[0]+nx,this.ePos[1]+ny);
            this.gfx.closePath();
            this.gfx.strokePath();

            this.gfx.beginPath();
            //this.gfx.lineBetween(0,0,1920,1080);
            nx *= -1;
            ny *= -1;
            this.gfx.lineBetween(this.iPos[0]+nx,this.iPos[1]+ny,this.ePos[0]+nx,this.ePos[1]+ny);
            this.gfx.closePath();
            this.gfx.strokePath();
        }

    }
}