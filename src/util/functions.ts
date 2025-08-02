// Check if variable is Object
export function isPlainObject(obj: any) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}

// Add slight randomness to avoid zero values
export function jiggle() {
	return (Math.random() - 0.5) * 1e-2;
}

// General random-ish uuid
export function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// Return interpolated color between two color1 and color2 at value (0-1)
export function interpolateColor(
	color1: number,
	color2: number,
	value: number
): number {
	if (value <= 0) {
		return color1;
	}
	if (value >= 1) {
		return color2;
	}
	return Phaser.Display.Color.ObjectToColor(
		Phaser.Display.Color.Interpolate.ColorWithColor(
			Phaser.Display.Color.ValueToColor(color1),
			Phaser.Display.Color.ValueToColor(color2),
			255,
			value * 255
		)
	).color;
}

// Convert hsv values to color (hex)
export function HSVToRGB(h: number, s: number, v: number): number {
	let union = Phaser.Display.Color.HSVToRGB(h, s, v);
	return (<Phaser.Display.Color>union).color;
}

// Convert hex number color to hex string color
export function colorToString(color: number): string {
	let c = Phaser.Display.Color.ValueToColor(color);
	return Phaser.Display.Color.RGBToString(c.red, c.green, c.blue);
}

// Convert hex string color to hex number color
export function colorToNumber(color: string): number {
	return Phaser.Display.Color.HexStringToColor(color).color;
}

import { BaseScene } from "@/scenes/BaseScene";
export function activateDragDebug(
	scene: BaseScene,
	obj: any,
	xOffset = 0,
	yOffset = 0,
	textXOffset = 0,
	textYOffset = 0
) {
	const coordText = scene
		.addText({ text: "Hello!", size: 20, color: "red" })
		.setOrigin(0.5);
	coordText.setStroke("white", 6);
	obj
		.setInteractive({ draggable: true })
		.on("drag", function (pointer: any, dragX: any, dragY: any) {
			obj.setPosition(Math.round(dragX), Math.round(dragY));
			coordText.setText(`x: ${obj.x + textXOffset}\ny: ${obj.y + textYOffset}`);
			coordText.setPosition(obj.x + xOffset, obj.y + yOffset);
		});
}

import * as Neutralino from "@neutralinojs/lib";
type Neutralino = typeof Neutralino;

export function loadData(key: string, callback: (data: object) => void): void {
	if (window.NL_TOKEN) {
		let dataString = Neutralino.storage.getData(key).then((dataString) => {
			callback(JSON.parse(dataString));
		});
	} else {
		const dataString = localStorage.getItem(key);
		if (dataString) {
			callback(JSON.parse(dataString));
		}
	}
}

export function saveData(key: string, data: object): void {
	if (window.NL_TOKEN) {
		let dataString = JSON.stringify(data);
		Neutralino.storage.setData(key, dataString);
	} else {
		const dataString = JSON.stringify(data);
		localStorage.setItem(key, dataString);
	}
}
