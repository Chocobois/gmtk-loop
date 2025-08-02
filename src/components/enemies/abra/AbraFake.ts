import { GameScene } from "@/scenes/GameScene";
import { AbraBase, AbraState } from "./AbraBase";
import { AbraBoss } from "./AbraBoss";

// Fake abra that explodes upon being looped
export class AbraFake extends AbraBase {
	private master: AbraBoss;

	constructor(scene: GameScene, x: number, y: number, master: AbraBoss) {
		super(scene, x, y);
		this.master = master;
		this.magicArmor = 1;

		this.sprite.setTexture("abra_active");

		this.setAbraState(AbraState.IDLE);

		this.filter.amplitude = 0.006;
	}

	setAbraState(state: AbraState) {
		super.setAbraState(state);

		switch (state) {
			case AbraState.IDLE:
				break;

			case AbraState.VANISHING:
				this.animateVanish();
				break;

			case AbraState.APPEARING:
				this.animateAppear();
				break;

			case AbraState.DEAD:
				// this.emit("remove");
				break;
		}
	}

	onLoop() {
		super.onLoop();

		this.magicArmor -= 1;
		if (this.magicArmor <= 0) {
			this.master.removeFakeAbra(this);
		}
	}

	goUpInSmoke() {
		// Change to smoke
		this.sparkEffect.play(this.x, this.y);
	}
}
