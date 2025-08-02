import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";

import { config } from "@/game-config";

export type PearlType = {
    image: string, 
    x: number,
    y: number,
    lineColor: number,
}
export const PearlTypes = {
    fire: {
        image: "pearl_fire",
        x: 700,
        y: 500,
        lineColor: 0xff4444,
    },
    water: {
        image: "pearl_water",
        x: Number(config.width) - 700,
        y: 500,
        lineColor: 0x4444ff,
    },
    grass: {
        image: "pearl_grass",
        x: 700,
        y: Number(config.height) - 250,
        lineColor: 0x44ff44,
    },
    electric: {
        image: "pearl_electric",
        x: Number(config.width) - 700,
        y: Number(config.height) - 250,
        lineColor: 0xffff44,
    },
} as const satisfies Record<string, PearlType>;

export class Pearl extends Entity {
	public scene: BaseScene;
    private image: Phaser.GameObjects.Image;
    private pearl: PearlType

    constructor(scene: BaseScene, pearl: PearlType) {
        super(scene, pearl.x, pearl.y);
		scene.add.existing(this);
		this.image = scene.add.image(0, 0, pearl.image);
        this.image.setScale(0.75);
		this.add(this.image);
		this.scene = scene;
        this.pearl = pearl;
    }

    onLoop() {
        // Funny bounce animation
        this.scene.tweens.addCounter({
            onUpdate: (tween) => {
                const x = tween.getValue() || 0;
                const y = Math.sin(10 * x) * Math.pow(1 - x, 2);
                this.setScale(1.0 + 0.5 * y);
            },
        });

		this.emit("selected", this.pearl);
    }

    setEnabled(value: boolean) {
        super.setEnabled(value);
        this.setAlpha(0.25);
    }
}
