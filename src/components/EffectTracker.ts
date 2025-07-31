import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";

export class EffectTracker extends Phaser.GameObjects.Container{
    private effectList: Effect[];
    public scene: BaseScene;

    constructor(scene: BaseScene, x: number, y: number){
        super(scene, x, y);
        this.scene = scene;
        this.effectList = [];
    }

    pushEffect(e: Effect){
        this.add(e);
        this.effectList.push(e);
    }

    update(t: number, d: number){
        for(let h = (this.effectList.length-1); h >= 0; h--){
			this.effectList[h].update(t, d);
			if(this.effectList[h].deleteFlag) {
				this.effectList[h].destroy();
				this.effectList.splice(h,1);
			}
		}
    }


}