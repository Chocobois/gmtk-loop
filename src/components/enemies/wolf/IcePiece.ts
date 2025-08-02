import { GameScene } from "@/scenes/GameScene";
import { Monster } from "@/components/Monster";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { MonsterScriptHandler } from "@/components/MonsterScriptHandler";

// Fake mole that explodes upon being looped
export class IcePiece extends Monster {
	protected explosionEffect: ExplosionEffect;
    protected hideValue: number = 1;
    protected hp: number = 1;
    protected spark: SparkEffect;
    protected spin: number = 0;

	constructor(scene: GameScene, x: number, y: number, spr: string = "c1") {
		super(scene, x, y, spr);

		this.sprite.setTexture(spr);
		this.explosionEffect = new ExplosionEffect(scene, 2.0);
        this.shapes[0].setTo(this.x, this.y, 60);
        this.spin = Phaser.Math.Between(-720,720);
        this.velocity.x = Phaser.Math.Between(-600,600);
        this.velocity.y = Phaser.Math.Between(-600,0);
        this.accel.x = 0;
        this.accel.y = 1600;
        stateHP: [9999,9999,9999];
        this.behavior = new MonsterScriptHandler(this,"inanimate");
        this.captureDisp.disable();
	}

    boundCheck(): void {
        if(this.y > 1480) {
            this.captureDisp.destroy();
            this.destroy();
        }
    }

    updateGFX(t: number, d: number): void {
        super.updateGFX(t,d);
        this.sprite.angle += this.spin*d/1000;
    }

	onLoop() {
	}

}
