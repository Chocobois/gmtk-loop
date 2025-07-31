//class for continuous-collision projectiles
//these are basically zero-width line segments that extend from prior-> current position and collide with stuff
//PLS call the collision before calling draw or else it will look wonkers

import { GameScene } from "@/scenes/GameScene";
import { Effect } from "./Effect";
export class Bullet extends Effect{
    public dir: number = 0;

    private dmg: number = 10;
    //prior x/y for hit calculation
    private pX: number;
    private pY: number;

    //rendering x/y for sprite stretching
    private rX: number;
    private rY: number;

    public spr: Phaser.GameObjects.Sprite;


    private r: number;
    private vtheta: number;
    private vx: number;
    private vy: number;

    private maxLen: number = 800;


    public trace: boolean = false;
    public tAmt: number = 3;

    public sprAngle: number;
    public hit: boolean = false;
    public hX: number = 0;
    public hY: number = 0;

    public vec: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    public vecT: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    public closest: number = 0;

    public deleteFlag: boolean = false;

    private a: number = 0;
    private radA: number = 0;
    public pID: number = 0;

    public sprSc: number[] = [64,64];

    public scene: GameScene;
    constructor(scene:GameScene, x:number, y:number, v:number, a: number, spr: string = "pbullet"){
        super(scene,x,y);
        this.scene=scene;

        this.a = a;
        this.radA = Phaser.Math.DegToRad(a);

        this.pX = x-(0.1*Math.cos(this.radA));
        this.rX = this.pX;
        this.pY = y-(0.1*Math.sin(this.radA));
        this.rY = this.pY;

        this.vx = v*Math.cos(this.radA);
        this.vy = v*Math.sin(this.radA);

        this.vec.set(this.x-this.pX,this.y-this.pY);

        this.spr = this.scene.add.sprite(0,0,spr);
        this.spr.setOrigin(0.99,0.5);
        this.sprAngle = a;
        this.spr.setScale(0,0.4);
        this.spr.setAngle(this.sprAngle);
        this.add(this.spr);

        //add to display done in game for layer reasons

    }

    update(t: number, d: number){
        if(this.hit && (!this.deleteFlag)){
            this.hX = this.x;
            this.hY = this.y;
            this.updateLength();
        }
        this.pX = this.x;
        this.pY = this.y;
        this.x += this.vx*d/1000;
        this.y += this.vy*d/1000;
        this.spr.setAngle(this.sprAngle);
        this.vec.set((this.x-this.pX, this.y-this.pY));
        this.updateLength();
        this.boundCheck();

    }

    updatePos(t: number, d: number){
        this.pX = this.x;
        this.pY = this.y;
        this.x += this.vx*d/1000;
        this.y += this.vy*d/1000;
        this.spr.setAngle(this.sprAngle);
        //this.vec.set(this.x-this.pX, this.y-this.pY);
       // console.log("Vector Set: " +this.vec.x + ", " + this.vec.y);
        this.vec.x = this.x-this.pX;
        this.vec.y = this.y-this.pY;

        this.updateLength();
        this.boundCheck();
        //console.log("Vector Fixed: " +this.vec.x + ", " + this.vec.y);
    }


    updateLength(){
        let aa = Math.atan2(this.y-this.pY,this.x-this.pX);
        let bb = 0;
        bb = Math.sqrt(Math.pow(this.x-this.rX,2) + Math.pow(this.y-this.rY,2));
        if(bb > this.maxLen){
            this.rX = this.x-(this.maxLen*Math.cos(aa));
            this.rY = this.y-(this.maxLen*Math.sin(aa));
            bb = Math.sqrt(Math.pow(this.x-this.rX,2) + Math.pow(this.y-this.rY,2));
        }
        this.spr.setScale((bb/this.sprSc[0]),0.4);
        let r = [];

    }

    boundCheck(){
        if((this.pX > (3840+this.maxLen)) || (this.pY > (2160+this.maxLen))){
            this.deleteFlag = true;
        } else if ((this.pX < (-3840-this.maxLen)) || (this.pY < (-2160-this.maxLen))){
            this.deleteFlag = true;
        }
    }

    getDist(v: Phaser.Math.Vector2){
        return Math.sqrt(Math.pow(v.x-this.pX,2)+Math.pow(v.y-this.pY,2));
    }

}