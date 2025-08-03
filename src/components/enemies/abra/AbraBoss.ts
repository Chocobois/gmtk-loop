import { GameScene } from "@/scenes/GameScene";
import { AbraBase, AbraState } from "./AbraBase";
import { AbraFake } from "./AbraFake";
import { loopState } from "@/state/LoopState";

// Leader abra that commands the fake abras
export class AbraBoss extends AbraBase {
	private fakeAbras: AbraFake[];
	private maxFakeAbras: number; // Could be modified whenever

	private health: number;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);

		this.fakeAbras = [];
		this.maxFakeAbras = 3;
		this.health = 1500;

		this.sprite.setTexture("abra_idle");

		this.setAbraState(AbraState.IDLE);
	}

	setAbraState(state: AbraState) {
		this.abraState = state;
		this.fakeAbras.forEach((fakeAbra) => fakeAbra.setAbraState(state));

		if (this.stateTimer) this.stateTimer.destroy();

		switch (state) {
			case AbraState.IDLE:
				this.stateTimer = this.scene.addEvent(3000, () =>
					this.setAbraState(AbraState.VANISHING)
				);
				break;

			case AbraState.VANISHING:
				this.filter.amplitude = 0.009;
				this.sprite.setTexture("abra_active");
				this.animateVanish();

				this.stateTimer = this.scene.addEvent(1500, () =>
					this.setAbraState(AbraState.APPEARING)
				);
				break;

			case AbraState.APPEARING:
				this.magicArmor = 2;
				this.addFakeAbras(this.maxFakeAbras - this.fakeAbras.length);
				this.teleportAllAbras();

				this.animateAppear();
				this.stateTimer = this.scene.addEvent(3000, () =>
					this.setAbraState(AbraState.IDLE)
				);
				break;

			case AbraState.STUNNED:
				this.filter.amplitude = 0;
				this.sprite.setTexture("abra_hurt");

				this.stateTimer = this.scene.addEvent(2000, () =>
					this.setAbraState(AbraState.IDLE)
				);
				break;

			case AbraState.DEAD:
				this.sprite.setTexture("abra_hurt");
				break;
		}
	}

	addFakeAbras(count: number) {
		for (let i = 0; i < count; i++) {
			const fakeAbra = new AbraFake(this.scene, this.x, this.y, this);
			this.emit("addEntity", fakeAbra);
			this.fakeAbras.push(fakeAbra);
		}
	}

	removeFakeAbra(fake: AbraFake) {
		fake.goUpInSmoke();
		this.fakeAbras = this.fakeAbras.filter((obj) => obj != fake);
		this.emit("removeEntity", fake);
	}

	swapPlacesWithFake() {
		const other = Phaser.Math.RND.pick(this.fakeAbras);
		if (other) {
			const tempX = this.x;
			const tempY = this.y;
			this.x = other.x;
			this.y = other.y;
			other.x = tempX;
			other.y = tempY;
		}
	}

	teleportAllAbras() {
		const points = this.getRandomPositions(1 + this.fakeAbras.length);

		this.move(points[0].x, points[0].y, 0);
		this.fakeAbras.forEach((fakeAbra, i) => {
			fakeAbra.move(points[i + 1].x, points[i + 1].y, 0);
		});
	}

	onLoop() {
		super.onLoop();

		// Fakes are still present, thus magic armor is used up
		if (this.fakeAbras.length > 0) {
			this.magicArmor -= 1;
			if (this.magicArmor <= 0) {
				// Destroy all fakes
				this.fakeAbras.forEach((fake) => this.removeFakeAbra(fake));

				this.setAbraState(AbraState.STUNNED);
			}
		}
		// No more fakes, deal damage
		else {
			if (this.abraState == AbraState.IDLE) {
				this.setAbraState(AbraState.VANISHING);
			} else {
				this.sprite.setTexture("abra_hurt");
			}

			// TODO: Move to parent class
			this.health -= loopState.attackPower;
			if (this.health <= 0) {
				this.setAbraState(AbraState.DEAD);
				this.emit("victory");
			}
		}
	}
}
