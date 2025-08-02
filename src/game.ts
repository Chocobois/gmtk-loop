import Phaser from "phaser";
import { PreloadScene } from "@/scenes/PreloadScene";
import { TitleScene } from "@/scenes/TitleScene";
import { WorldScene } from "@/scenes/WorldScene";
import { GameScene } from "@/scenes/GameScene";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";
import { configure } from "mobx";
import { ShopScene } from "./scenes/ShopScene";
import { config } from "./game-config";


export async function Game() {
	configure({
		enforceActions: "never",
	});

	const fullConfig: Phaser.Types.Core.GameConfig = {
		...config,

		scene: [PreloadScene, TitleScene, WorldScene, GameScene, ShopScene],
		plugins: {
			global: [
				{
					key: "rexOutlinePipeline",
					plugin: OutlinePipelinePlugin,
					start: true,
				},
			],
		},
	};
	const game = new Phaser.Game(fullConfig);
}
