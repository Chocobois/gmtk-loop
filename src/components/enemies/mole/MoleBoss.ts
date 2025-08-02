import { GameScene } from "@/scenes/GameScene";
import { MoleBase, MoleState } from "./MoleBase";
import { MoleFake } from "./MoleFake";
import { SparkEffect } from "@/components/particles/SparkEffect";
import { loopState } from "@/state/LoopState";

// Leader mole that commands the fake moles
export class MoleBoss extends MoleBase {
	private fakeMoles: MoleFake[];

	private digCount: number;
	private health: number;

	protected sparkEffect: SparkEffect;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);

		this.fakeMoles = [];
		this.digCount = 0;
		this.health = 1000;

		this.sprite.setTexture("mole_boss_1");

		this.sparkEffect = new SparkEffect(scene);

		this.setMoleState(MoleState.IDLE);
	}

	setMoleState(state: MoleState) {
		this.moleState = state;
		this.fakeMoles.forEach((fakeMole) => fakeMole.setMoleState(state));

		if (this.stateTimer) this.stateTimer.destroy();

		switch (state) {
			case MoleState.IDLE:
				// Perform a swap every 3 digs
				if (this.digCount % 3 == 0) {
					this.swapPlacesWithFake();
				}

				this.animateAppear();
				this.stateTimer = this.scene.addEvent(3000, () =>
					this.setMoleState(MoleState.DIGGING)
				);
				break;

			case MoleState.DIGGING:
				// Command all moles to move together
				this.digCount++;
				this.moveAllMoles(false);

				this.animateDisappear();
				this.stateTimer = this.scene.addEvent(3000, () =>
					this.setMoleState(MoleState.IDLE)
				);
				break;

			case MoleState.DEAD:
				this.sprite.play("mole_boss_dead");
				this.animateDisappear(3000);
				break;
		}
	}

	addFakeMoles(count: number) {
		for (let i = 0; i < count; i++) {
			const fakeMole = new MoleFake(this.scene, this.x, this.y);
			this.emit("addEntity", fakeMole);
			this.fakeMoles.push(fakeMole);
		}
	}

	swapPlacesWithFake() {
		const other = Phaser.Math.RND.pick(this.fakeMoles);
		if (other) {
			const tempX = this.x;
			const tempY = this.y;
			this.x = other.x;
			this.y = other.y;
			other.x = tempX;
			other.y = tempY;
		}
	}

	moveAllMoles(instantly: boolean) {
		const points = this.getRandomPositions(1 + this.fakeMoles.length);

		this.move(points[0].x, points[0].y, instantly);
		this.fakeMoles.forEach((fakeMole, i) => {
			fakeMole.move(points[i + 1].x, points[i + 1].y, instantly);
		});
	}

	onLoop() {
		super.onLoop();

		this.sprite.play("mole_boss_damage");
		this.sparkEffect.play(this.x, this.y);

		// TODO: Move to parent class
		this.health -= loopState.attackPower;
		if (this.health <= 0) {
			this.setMoleState(MoleState.DEAD);
			this.emit("victory");
		}
	}
}
