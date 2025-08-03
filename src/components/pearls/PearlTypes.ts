import { Color } from "@/util/colors";
import { PearlElement } from "./PearlElement";

export type PearlType = {
	element: PearlElement;
	name: string;
	description: string;
	image: string;
	sfxKey?: string;
	pearlColor: number;
	lineColor: number;
	loopColor: number;
	shopX: number;
	shopY: number;
};

export const PearlTypes = {
	[PearlElement.None]: {
		element: PearlElement.None,
		name: "No pearl",
		description: "No special abilities are in effect.",
		image: "pearl_none",
		pearlColor: Color.Slate300,
		lineColor: Color.White,
		loopColor: Color.White,
		shopX: 0,
		shopY: 0,
	},
	[PearlElement.Coil]: {
		element: PearlElement.Coil,
		name: "Coil pearl",
		description: "Extends the length of your loop.",
		image: "pearl_coil",
		sfxKey: "p_coil",
		pearlColor: Color.Pink400,
		lineColor: Color.Pink200,
		loopColor: Color.Pink200,
		shopX: 700,
		shopY: 200,
	},
	[PearlElement.Fire]: {
		element: PearlElement.Fire,
		name: "Fire pearl",
		description: "Leaves a lingering burn on enemies.",
		image: "pearl_fire",
		sfxKey: "p_fire",
		pearlColor: Color.Red600,
		lineColor: Color.Red600,
		loopColor: Color.Red600,
		shopX: 1000,
		shopY: 200,
	},
	[PearlElement.Ice]: {
		element: PearlElement.Ice,
		name: "Ice pearl",
		description: "Slows down enemies you hit.\n(Not in demo)",
		image: "pearl_ice",
		sfxKey: "p_water",
		pearlColor: Color.Cyan500,
		lineColor: Color.Cyan500,
		loopColor: Color.Cyan500,
		shopX: 1300,
		shopY: 200,
	},
	[PearlElement.Psychic]: {
		element: PearlElement.Psychic,
		name: "Psychic pearl",
		description: "Reveals hidden secrets nearby.\n(Not in demo)",
		image: "pearl_psychic",
		sfxKey: "p_psychic",
		pearlColor: Color.Violet700,
		lineColor: Color.Violet300,
		loopColor: Color.Violet300,
		shopX: 700,
		shopY: 500,
	},
	[PearlElement.Rock]: {
		element: PearlElement.Rock,
		name: "Rock pearl",
		description: "Allows you to sustain more damage.",
		image: "pearl_rock",
		sfxKey: "p_rock",
		pearlColor: Color.Amber800,
		lineColor: Color.Amber200,
		loopColor: Color.Amber200,
		shopX: 1000,
		shopY: 500,
	},
	[PearlElement.Water]: {
		element: PearlElement.Water,
		name: "Water pearl",
		description: "Grants a bubble to trap enemies.\n(Not in demo)",
		image: "pearl_water",
		sfxKey: "p_water",
		pearlColor: Color.Blue500,
		lineColor: Color.Blue200,
		loopColor: Color.Blue200,
		shopX: 1300,
		shopY: 500,
	},
} as const satisfies Record<PearlElement, PearlType>;
