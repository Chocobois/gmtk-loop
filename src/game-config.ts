import Phaser from "phaser";

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    mipmapFilter: "LINEAR_MIPMAP_LINEAR",
    roundPixels: false,
    scale: {
        mode: Phaser.Scale.FIT,
    },
}