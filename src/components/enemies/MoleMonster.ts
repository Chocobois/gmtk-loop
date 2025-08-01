import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";

enum MoleState {
	IDLE,
	DIGGING,
}

export class MoleMonster extends Entity {
	public scene: BaseScene;

	protected moleState: MoleState;
	protected fakeMoles: MoleFake[];

	protected sprite: Phaser.GameObjects.Sprite;
	protected dirt: Phaser.GameObjects.Image;

	private digCount: number;
	private hideValue: number;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.digCount = 0;
		this.hideValue = 0;

		this.sprite = scene.add.sprite(0, 0, "mole_idle");
		this.sprite.setCrop(0, 0, 256, 128);
		this.add(this.sprite);

		this.dirt = scene.add.image(0, 0, "mole_dirt");
		this.dirt.setOrigin(0.5, 0.85);
		this.dirt.y += (0.85 - 0.5) * this.dirt.height;
		this.add(this.dirt);

		this.fakeMoles = [];

		this.setMoleState(MoleState.IDLE);
	}

	addFakeMoles(count: number) {
		for (let i = 0; i < count; i++) {
			const fakeMole = new MoleFake(this.scene, this.x, this.y);
			this.emit("addEntity", fakeMole);
			this.fakeMoles.push(fakeMole);
		}
	}

	setMoleState(state: MoleState) {
		this.moleState = state;
		this.fakeMoles.forEach((fakeMole) => fakeMole.setMoleState(state));

		switch (state) {
			case MoleState.IDLE:
				this.animateAppear();
				this.scene.addEvent(3000, () => this.setMoleState(MoleState.DIGGING));
				break;

			case MoleState.DIGGING:
				this.digCount++;
				this.animateDisappear();
				this.moveAllMoles();
				this.scene.addEvent(3000, () => this.setMoleState(MoleState.IDLE));
				break;
		}
	}

	// Returns a list of spaced apart positions
	getRandomPositions(count: number): Phaser.Math.Vector2[] {
		let separation = 400;
		const positions: Phaser.Math.Vector2[] = [];

		while (positions.length < count && separation-- > 0) {
			const x = Phaser.Math.Between(300, this.scene.W - 300);
			const y = Phaser.Math.Between(300, this.scene.H - 300);
			const p = new Phaser.Math.Vector2(x, y);

			if (
				positions.every(
					(o) => Phaser.Math.Distance.Between(o.x, o.y, p.x, p.y) >= separation
				)
			) {
				positions.push(p);
			}
		}
		return positions;
	}

	moveAllMoles() {
		const points = this.getRandomPositions(1 + this.fakeMoles.length);

		this.move(points[0].x, points[0].y);
		this.fakeMoles.forEach((fakeMole, i) => {
			fakeMole.move(points[i + 1].x, points[i + 1].y);
		});
	}

	move(x: number, y: number) {
		this.scene.tweens.add({
			targets: this,
			x,
			y,
			duration: 2000,
			ease: Phaser.Math.Easing.Quadratic.InOut,
		});
	}

	animateAppear() {
		this.scene.tweens.add({
			targets: this,
			duration: 500,
			hideValue: 0,
			ease: Phaser.Math.Easing.Back.Out,
		});

		// Perform a swap every 3 digs
		if (this.isLeader && this.digCount % 3 == 0) {
			this.swapPlacesWithFake();
		}
	}

	animateDisappear() {
		this.scene.tweens.add({
			targets: this,
			duration: 500,
			hideValue: 1,
			ease: Phaser.Math.Easing.Back.In,
		});
	}

	animateDamage() {
		this.scene.tweens.addCounter({
			duration: 500,
			ease: Phaser.Math.Easing.Sine.Out,
			onUpdate: (tween) => {
				let t = 1 - (tween.getValue() || 0);
				this.sprite.setOrigin(0.5 + t * 0.1 * Math.sin(20 * t), 0.5);
			},
		});
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

	update(time: number, delta: number) {
		const wobble = 0.04;
		const squish = 1.0 + wobble * Math.sin((8 * time) / 1000);
		this.sprite.setScale(2 - squish, squish);

		const dirtSpeed = this.moleState == MoleState.DIGGING ? 20 : 4;
		const dirtWobble = this.moleState == MoleState.DIGGING ? 0.08 : 0.02;
		const dirtSquish = 1.0 + dirtWobble * Math.sin((dirtSpeed * time) / 1000);
		this.dirt.setScale(dirtSquish, 2 - dirtSquish);

		const size = this.sprite.height;
		this.sprite.y = this.hideValue * 0.7 * size;
		this.sprite.setCrop(0, 0, size, size * (0.9 - 0.8 * this.hideValue));
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		this.animateDamage();
	}

	protected shapes: Phaser.Geom.Circle[] = [];
	get colliders(): Phaser.Geom.Circle[] {
		if (this.shapes.length === 0) {
			this.shapes = [new Phaser.Geom.Circle(0, 0, 70)];
		}

		return this.shapes.map((shape) =>
			shape.setTo(this.x, this.y + 30, shape.radius)
		);
	}

	get isLeader(): boolean {
		return true;
	}
}

class MoleFake extends MoleMonster {
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		this.sprite.setTexture("mole_bomb");
	}

	setMoleState(state: MoleState) {
		this.moleState = state;

		switch (state) {
			case MoleState.IDLE:
				this.animateAppear();
				break;

			case MoleState.DIGGING:
				this.animateDisappear();
				break;
		}
	}

	// When the entity is encircled by the player's loop
	onLoop() {
		this.animateDamage();
		console.log("BOOM");
	}

	get isLeader(): boolean {
		return false;
	}
}
