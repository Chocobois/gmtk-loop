import { BaseScene } from "@/scenes/BaseScene";
import { Entity } from "../Entity";
import { PearlType } from "./PearlTypes";
import { pearlState } from "@/state/PearlState";
import { Color } from "@/util/colors";
import { interpolateColor } from "@/util/functions";
import { PearlElement } from "./PearlElement";

export class Pearl extends Entity {
	public scene: BaseScene;
	public pearlType: PearlType;

	private container: Phaser.GameObjects.Container; // Just for animation
	private pearlShellBack: Phaser.GameObjects.Image;
	private pearlIcon: Phaser.GameObjects.Image;
	private pearlShellFront: Phaser.GameObjects.Image;

	constructor(scene: BaseScene, x: number, y: number, pearlType: PearlType) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.container = scene.add.container();
		this.add(this.container);

		this.pearlShellBack = scene.add.image(0, 0, "pearl_shell_inner");
		this.pearlShellBack.setScale(0.85);
		this.container.add(this.pearlShellBack);

		this.pearlIcon = scene.add.image(0, 0, "pearl_none");
		this.container.add(this.pearlIcon);

		this.pearlShellFront = scene.add.image(0, 0, "pearl_shell_outer");
		this.pearlShellFront.setScale(0.85);
		this.container.add(this.pearlShellFront);

		this.setPearlType(pearlType);
	}

	setPearlType(pearlType: PearlType) {
		this.pearlType = pearlType;

		this.pearlIcon.setTexture(pearlType.image);
		this.pearlShellBack.setTint(pearlType.pearlColor);
		this.pearlShellFront.setTint(Color.Amber500);
	}

	setHighlight(value: boolean) {
		if (value) {
			this.setPearlType(this.pearlType);
			this.pearlIcon.setTint(Color.White);
		} else {
			this.pearlIcon.setTint(Color.Slate200);
			this.pearlShellFront.setTint(
				interpolateColor(this.pearlType.pearlColor, Color.Black, 0.3)
			);
		}
	}

	onLoop() {
		// Funny bounce animation
		this.scene.tweens.addCounter({
			onUpdate: (tween) => {
				const x = tween.getValue() || 0;
				const y = Math.sin(10 * x) * Math.pow(1 - x, 2);
				this.container.setScale(1.0 + 0.5 * y);
			},
		});

		this.emit("selected", this.pearlType);

		// Sound effects

		if (this.pearlType.sfxKey) {
			if (pearlState.currentPearl.element == this.pearlType.element) {
				// Equip sound
				this.scene.sound.play("p_equip", {volume: 0.3});
				this.scene.sound.play(this.pearlType.sfxKey, {delay: 0.1, volume: 0.7});
			} else {
				// Unequip sound
				this.scene.sound.play("p_unequip");
				this.scene.sound.play("p_unequip", {delay: 0.07, rate: 0.96, volume: 0.5});
			}
		} else {
			// This branch triggers when entering the shop (I dunno why)
			this.scene.sound.play("p_shop_enter", {pan: 0.6});
		}
	}

	update(time: number, delta: number) {
		this.container.y = 8 * Math.sin(0.002 * time);
	}

	shake() {
		this.scene.tweens.addCounter({
			duration: 500,
			ease: Phaser.Math.Easing.Sine.Out,
			onUpdate: (tween) => {
				let t = 1 - (tween.getValue() || 0);
				let ox = 0.5 + t * 0.1 * Math.sin(20 * t);
				this.pearlShellBack.setOrigin(ox, 0.5);
				this.pearlIcon.setOrigin(ox, 0.5);
				this.pearlShellFront.setOrigin(ox, 0.5);
			},
		});
	}

	setEnabled(value: boolean) {
		super.setEnabled(value);
		this.setAlpha(0.25);
	}

	protected shapes: Phaser.Geom.Circle[] = [new Phaser.Geom.Circle()];
	get colliders(): Phaser.Geom.Circle[] {
		if (!this.enabled) return [];
		return [this.shapes[0].setTo(this.x, this.y, 20)];
	}

	get element() {
		return this.pearlType.element;
	}

	get isNone() {
		return this.element == PearlElement.None;
	}
}
