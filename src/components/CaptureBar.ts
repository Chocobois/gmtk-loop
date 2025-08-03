import { BaseScene } from "@/scenes/BaseScene";
import { Monster } from "./Monster";

export class CaptureBar extends Phaser.GameObjects.Container{
    public scene: BaseScene;
    private owner: Monster;

    private cycle: number = 0;
    private maxCycles: number = 10;
    private rad: number = 220;
    private sc: number = 0.4;

    private hp: number = 250;
    private maxHP: number = 250;
    public captured: boolean = false;
    private runes: Phaser.GameObjects.Image[];
    public disp: Phaser.GameObjects.Container;
    public ring: Phaser.GameObjects.Container;
    private cc: Phaser.GameObjects.Graphics;
    constructor (scene: BaseScene, x: number, y: number, owner: Monster){
        super(scene,x,y);
        this.scene = scene;
        this.owner = owner;
        this.scene.add.existing(this);
        this.disp = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.disp);

        this.runes = [];
        for(let i = 0; i < this.maxCycles; i++){
            this.runes.push(new Phaser.GameObjects.Image(this.scene, this.rad*Math.cos((-Math.PI/2)+i*(2*Math.PI/this.maxCycles)), 
                this.rad*Math.sin((-Math.PI/2)+i*(2*Math.PI/this.maxCycles)),"r"+i));
            this.runes[i].setAngle(i*(360/this.maxCycles));
            this.runes[i].setScale(this.sc);
            this.runes[i].setAlpha(0.25);
            this.disp.add(this.runes[i]);
        }

        this.ring = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.ring);

        this.cc = this.scene.add.graphics();
        this.ring.add(this.cc);

        this.cc.lineStyle(16,0x9EFFD7,1);
        this.cc.fillStyle(0xFFFFFF,1);
        this.cc.beginPath();
        this.cc.arc(0,0,265,0,360,false,0.01);
        this.cc.closePath();
        this.cc.strokePath();

        this.cc.lineStyle(8,0xFFFFFF,1);
        this.cc.beginPath();
        this.cc.arc(0,0,265,0,360,false,0.01);
        this.cc.closePath();
        this.cc.strokePath();

        this.cc.lineStyle(16,0x9EFFD7,1);
        this.cc.beginPath();
        this.cc.arc(0,0,165,0,360,false,0.01);
        this.cc.closePath();
        this.cc.strokePath();

        this.cc.lineStyle(8,0xFFFFFF,1);
        this.cc.beginPath();
        this.cc.arc(0,0,165,0,360,false,0.01);
        this.cc.closePath();
        this.cc.strokePath();

        this.ring.setAlpha(0.35);


        /*
        this.cc.beginPath();
        this.cc.slice(0,0,400,Phaser.Math.DegToRad(-1*(90/2)),Phaser.Math.DegToRad((90/2)),false,0);
        this.cc.closePath();
        this.cc.fillPath();
        */

    }

    takeDamage(n: number) {
        console.log("Cycle: " + this.cycle);
        if(n <= this.hp) {
            this.hp -= n;
            this.runes[this.cycle].setAlpha(0.25+(0.5*(1-(this.hp/this.maxHP))));
            if(this.hp <= 0){
                this.runes[this.cycle].setAlpha(1);
                this.hp = this.maxHP;
                this.cycle++;
                if(this.cycle >= this.maxCycles) {
                    this.owner.handleCapture();
                    return;
                }
            }
            n = 0; 
        } else {
            //don't run the loop unless you need to handle overflow damage
            while(n > 0){
                if(n >= this.hp){
                    n -= this.hp;
                    this.hp = this.maxHP;
                    this.runes[this.cycle].setAlpha(1);
                    this.cycle++;
                    if(this.cycle >= this.maxCycles) {
                        this.reset();
                        return;
                    }
                } else {
                    this.hp -= n;
                    this.runes[this.cycle].setAlpha(0.25+(0.5*(1-(this.hp/this.maxHP))));
                    n = 0;
                }
            }
        }
    }

    reset(){
        this.hp = this.maxHP;
        this.cycle = 0;
        for(let i = 0; i < this.runes.length; i++){
            this.runes[i].setAlpha(0.25);
        }
    }

    update(t: number, d: number){
        //do NOT match rotation!
        this.ring.setAlpha(0.35+(0.65*(this.cycle/(this.maxCycles-1))));
        this.setScale(0.99+(0.02*Math.sin(t/500)));
        this.x = this.owner.x;
        this.y = this.owner.y;
    }

    disable(){
        this.setVisible(false);
    }
}