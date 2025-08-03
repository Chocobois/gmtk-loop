import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "../Effect";
import { Zamboni } from "./Zamboni";

export class TreadEffect extends Effect{
    private fade: number = 0;
    private begin: number[] = [0,0];
    private end: number[] = [0,0];
    public spr: Phaser.GameObjects.Sprite;
    public dir: number = 1;
    private owner: Zamboni;
    constructor(scene:BaseScene,x:number,y:number,owner:Zamboni,direction: number){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,"tread");
        this.dir = direction;
        this.owner = owner;
        this.begin = [x,y];
        this.end = [x,y];
        this.spr.setOrigin(1,0.5);
        this.add(this.spr);

    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if(this.fade > 0){
            this.fade -= d;
            this.setAlpha(this.fade/2000);
            if(this.fade <= 0){
                this.setVisible(false);
                this.deleteFlag = true;
            }
            return;
        }
        if(this.owner != null){
            if(this.fade <= 0){
                if(this.owner.treading){
                    this.end = [this.owner.x, this.owner.y];
                    this.spr.setScale(this.dir*(this.end[0]-this.begin[0])/320,1);
                } else {
                    this.spr.setScale(this.dir*(this.end[0]-this.begin[0])/320,1);
                    this.fade = 2000;
                }
            }
        } else if (this.fade <= 0){
            this.spr.setScale(this.dir*(this.end[0]-this.begin[0])/320,1);
            this.fade = 2000;
        }
    }
}