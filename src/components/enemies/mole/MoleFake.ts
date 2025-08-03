import { GameScene } from "@/scenes/GameScene";
import { MoleBase, MoleState } from "./MoleBase";

// Fake mole that explodes upon being looped
export class MoleFake extends MoleBase {
	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);

		this.sprite.setTexture("mole_fake_1");

		this.setMoleState(MoleState.IDLE);
	}

	setMoleState(state: MoleState) {
		super.setMoleState(state);

		switch (state) {
			case MoleState.IDLE:
				this.animateAppear();
				break;

			case MoleState.DIGGING:
				this.animateDisappear();
				break;

			case MoleState.DEAD:
				this.animateDisappear();
				break;
		}
	}

	onLoop() {
		super.onLoop();

		this.sprite.play("mole_fake_damage");
		this.explosionEffect.play(this.x, this.y);
		this.scene.sound.play("e_boom", {volume: 0.5});
		this.emit("damage", 40);
	}
}
