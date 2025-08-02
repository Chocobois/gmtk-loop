import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";

import { config } from "@/game-config";

export const PearlTypes = {
    fire: {
        image: "pearl_fire",
        x: 700,
        y: 500,
    },
    water: {
        image: "pearl_water",
        x: Number(config.width) - 700,
        y: 500,
    },
    grass: {
        image: "pearl_grass",
        x: 700,
        y: Number(config.height) - 250,
    },
    electric: {
        image: "pearl_electric",
        x: Number(config.width) - 700,
        y: Number(config.height) - 250,
    },
} as const;

type PearlType = typeof PearlTypes;

export class Pearl extends Entity {
    private image: Phaser.GameObjects.Image;

    constructor(scene: BaseScene, pearl: PearlType[keyof PearlType]) {
        super(scene, pearl.x, pearl.y);
		this.image = scene.add.image(0, 0, pearl.image);
        this.image.setScale(0.75);
		this.add(this.image);
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
    }

    setEnabled(value: boolean) {
        super.setEnabled(value);
        this.setAlpha(0.25);
    }
}
