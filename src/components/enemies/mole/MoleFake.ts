import { GameScene } from "@/scenes/GameScene";
import { MoleBase, MoleState } from "./MoleBase";
import { ExplosionEffect } from "@/components/particles/ExplosionEffect";

// Fake mole that explodes upon being looped
export class MoleFake extends MoleBase {
	protected explosionEffect: ExplosionEffect;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);

		this.sprite.setTexture("mole_fake_1");

		this.explosionEffect = new ExplosionEffect(scene, 2.0);

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
		this.scene.damageToPlayer(10);
	}
}
