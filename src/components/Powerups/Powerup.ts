import { BaseScene } from "@/scenes/BaseScene";

//
export class PowerUp extends Phaser.GameObjects.Container
{
    public key: string;
    public value: number = 1; //default unless we want multiples levels of the same powerup
    public scene:BaseScene;
    public disp: Phaser.GameObjects.Container;
    public bkg: Phaser.GameObjects.Image;
    public highlight: Phaser.GameObjects.Image;
    constructor (scene: BaseScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.disp = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.disp);
        this.highlight = new Phaser.GameObjects.Image(this.scene,0,0,"spellhighlight");
        this.highlight.setVisible(false);
        this.disp.add(this.highlight);
        this.bkg = new Phaser.GameObjects.Image(this.scene,0,0,"spellbkg");
        this.disp.add(this.bkg);

        this.bkg.setInteractive();
        this.bkg.on("pointerdown",this.select,this);
    }

    toggle(){

    }

    select(){
        //scale up + highlight
        this.disp.setScale(1.25);
        this.highlight.setVisible(true);
    }

    unselect(){
        this.disp.setScale(1);
        this.highlight.setVisible(false);
    }


}